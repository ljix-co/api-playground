import { ErrorTypes, type FetchApiResponseResult } from "./types";

export const handleResponse = async (response: Response): Promise<FetchApiResponseResult> => {
    const rawText = await response.text();
    let responseData: unknown = null;
    if (rawText) {
        try {
            responseData = JSON.parse(rawText);
        } catch {
            responseData = rawText;
        }
    }

    if (!response.ok) {
        const message = typeof responseData === 'object'
            && responseData !== null
            && 'message' in responseData
            ? String((responseData as { message: unknown }).message)
            : `Request failed with status ${response.status}.`;

        return {
            success: false,
            message: message,
            status: response.status,
            statusText: response.statusText,
            errorType: ErrorTypes.HTTP
        };
    }

    return {
        success: true,
        data: responseData,
        status: response.status,
        statusText: response.statusText,
    };
}
