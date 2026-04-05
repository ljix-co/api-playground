import { ErrorTypes, type FetchApiResponseResult } from "./types";

export const handleError = (error: unknown, signal?: AbortSignal): FetchApiResponseResult => {
    if (error instanceof DOMException && error.name === 'AbortError') {
        return {
            success: false,
            message: signal?.reason === ErrorTypes.TIMEOUT.toLowerCase()
            ? 'Request has timed out.'
            : 'Request was cancelled.',
            status: null,
            statusText: null,
            errorType: signal?.reason === ErrorTypes.TIMEOUT.toLowerCase()
                ? ErrorTypes.TIMEOUT
                : ErrorTypes.CANCEL
        };
    }

    if (error instanceof Error) {
        return {
            success: false,
            message: error.message,
            status: null,
            statusText: null,
            errorType: ErrorTypes.NETWORK
        };
    }

    return {
        success: false,
        message: 'Unknown error',
        status: null,
        statusText: null,
        errorType: ErrorTypes.UNKNOWN
    };
}