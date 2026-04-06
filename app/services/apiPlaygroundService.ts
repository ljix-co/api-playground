import { isValidJson } from "~/utils/validations";
import { handleError } from "./handleError";
import { handleResponse } from "./handleResponse";
import { ErrorTypes, HttpMethods, type FetchApiResponseResult, type HttpMethod, type RequestParams } from "./types";
import ServiceError from "./ServiceError";

export const fetchApiResponse = async (requestParams: RequestParams): Promise<FetchApiResponseResult> => {
    const { url, method, body, options } = requestParams;
    try {
        let response: Response;
        const headers: Record<string, string> = {};
        const requestInit: RequestInit = {
            method,
            headers,
            ...(options?.signal && { signal: options.signal })
        };

        const methodsWithBody: HttpMethod[] = [HttpMethods.POST, HttpMethods.PUT];
        if (methodsWithBody.includes(method)) {
            headers['Content-Type'] = 'application/json';
            const isBodyValid = isValidJson(body);

            if (!isBodyValid) {
                throw new ServiceError({
                    type: ErrorTypes.CLIENT_VALIDATION,
                    status: 400,
                    statusText: 'Bad Request',
                    message: 'Body is not in valid JSON format'
                });
            }

            requestInit.body = body;
        }

        response = options?.signal && options?.delayMs
            ? await mockRequest({ signal: options.signal, delayMs: options.delayMs })
            : await fetch(url, requestInit);

        return await handleResponse(response);
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
