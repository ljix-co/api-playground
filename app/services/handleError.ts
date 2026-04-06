import { HTTP_STATUS_CLIENT_CLOSED_REQUEST, HTTP_STATUS_REQUEST_TIMEOUT } from "~/config";
import ServiceError from "./ServiceError";
import { ErrorTypes, type FetchApiResponseResult } from "./types";

export const handleError = (error: unknown, signal?: AbortSignal): FetchApiResponseResult => {
    if (error instanceof DOMException && error.name === 'AbortError') {
        return {
            success: false,
            message: signal?.reason === ErrorTypes.TIMEOUT.toLowerCase()
            ? 'Request has timed out.'
            : 'Request was cancelled.',
            status: signal?.reason === ErrorTypes.TIMEOUT.toLowerCase()
                ? HTTP_STATUS_REQUEST_TIMEOUT
                : HTTP_STATUS_CLIENT_CLOSED_REQUEST,
            statusText: null,
            errorType: signal?.reason === ErrorTypes.TIMEOUT.toLowerCase()
                ? ErrorTypes.TIMEOUT
                : ErrorTypes.CANCEL
        };
    }

    if (error instanceof ServiceError) {
        return {
            success: false,
            message: error.message,
            status: error.status,
            statusText: error.statusText,
            errorType: error.type
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
