import { handleError } from "./handleError";
import { handleResponse } from "./handleResponse";
import { HttpMethods, type FetchApiResponseResult, type HttpMethod, type RequestParams } from "./types";

export const fetchApiResponse = async (requestParams: RequestParams): Promise<FetchApiResponseResult> => {
    const { url, method, body, options } = requestParams;
    try {
        let response: Response;
        const headers: Record<string, string> = {};
        const requestInit: RequestInit = { 
            method, 
            headers, 
            ...(options?.signal && {signal: options.signal})
         };

        const methodsWithoutBody: HttpMethod[] = [HttpMethods.GET, HttpMethods.DELETE];
        if (methodsWithoutBody.includes(method)) {
            response = options?.signal && options?.delayMs
                ? await mockRequest({signal: options.signal, delayMs: options.delayMs })
                : await fetch(url, requestInit);

            return handleResponse(response);
        }

        headers['Content-Type'] = 'application/json';
        requestInit.body = JSON.stringify(body);

        response = await fetch(url, requestInit);

        return handleResponse(response);
    } catch (error) {
        return handleError(error, options?.signal)
    }
};

export const mockRequest = ({ signal, delayMs = 2000 }: { signal: AbortSignal, delayMs?: number }): Promise<Response> => {
    return new Promise((resolve, reject) => {
        if (signal.aborted) {
            return reject(new DOMException('The operation was aborted.', 'AbortError'));
        }

        const timeoutId = setTimeout(() => {
            resolve(
                new Response(
                    JSON.stringify({ message: 'This is a mocked response.' }),
                    {
                        status: 200,
                        headers: { 'Content-Type': 'application/json' },
                    }
                )
            );
        }, delayMs);

        signal.addEventListener('abort', () => {
            clearTimeout(timeoutId);
            reject(new DOMException('The operation was aborted.', 'AbortError'));
        }, { once: true });
    })
}
