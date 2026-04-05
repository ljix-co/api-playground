// const assertions
export const HttpMethods = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE',
} as const;

export const PipelineStages = {
    IDLE: 'IDLE',
    SENDING: 'SENDING',
    SUCCESS: 'SUCCESS',
    ERROR: 'ERROR',
    WAITING: 'WAITING',
} as const;

export const ErrorTypes = {
    HTTP: 'HTTP',
    NETWORK: 'NETWORK',
    CANCEL: 'CANCEL',
    TIMEOUT: 'TIMEOUT',
    UNKNOWN: 'UNKNOWN',
} as const;

// type aliases
export type HttpMethod = typeof HttpMethods[keyof typeof HttpMethods];

export type FetchApiResponseError = {
    success: false;
    message: string;
    status: number | null;
    statusText: string | null;
    errorType: typeof ErrorTypes[keyof typeof ErrorTypes];
}

export type FetchApiResponseSuccess = {
    success: true;
    data: unknown;
    status: number;
    statusText: string;
}

export type FetchApiResponseResult =
    | FetchApiResponseSuccess
    | FetchApiResponseError;

// interfaces
export interface ServiceContextValue {
    executeRequest: (url: string, method: HttpMethod, body?: string, options?: { timeout?: number }) => Promise<void>;
    cancelRequest: () => void;
    response: FetchApiResponseSuccess | null;
    error: FetchApiResponseError | null;
    pipelineStage: typeof PipelineStages[keyof typeof PipelineStages];
    resetPipelineStage: () => void;
    timeoutCounter: number | null;
    responseTime: number | null;
    cancellationMessage: string | null;
}

export interface RequestParams {
    url: string;
    method: HttpMethod;
    body?: string;
    options?: {
        signal?: AbortSignal,
        delayMs?: number
    };
}
