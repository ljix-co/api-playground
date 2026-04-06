import ServiceError from "./ServiceError";
import { ErrorTypes, type FetchApiResponseResult } from "./types";

export const handleResponse = async (response: Response): Promise<FetchApiResponseResult> => {
    const contentType = response.headers.get('content-type');
    const type = contentType ? contentType.split(';')[0].trim().toLowerCase() : '';
    let responseData: unknown = null;

    switch (type) {
        case 'application/json': {
            responseData = await response.json();
            break;
        }
        case 'text/html':
        case 'text/plain':
        case 'application/xml':
        case 'application/javascript': {
            responseData = await response.text();
            break;
        }
        case '': {
            responseData = await response.text() || 'No response data.'
            break;
        }
        default: {
            responseData = await response.blob();
        }
    }

    if (!response.ok) {
        const message = responseData != null
            ? (typeof responseData === "string"
                ? responseData
                : JSON.stringify(responseData))
            : `Request failed with status ${response.status}.`;

        throw new ServiceError({
            type: ErrorTypes.HTTP,
            message: message,
            status: response.status,
            statusText: response.statusText,
        });
    }

    return {
        success: true,
        data: responseData,
        status: response.status,
        statusText: response.statusText,
    };
}
