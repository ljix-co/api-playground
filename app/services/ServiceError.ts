import type { ErrorTypes } from "./types";

class ServiceError extends Error {
    type: typeof ErrorTypes[keyof typeof ErrorTypes];
    status: number | null;
    statusText: string | null;

    constructor(params: {
        message: string;
        type: typeof ErrorTypes[keyof typeof ErrorTypes];
        status: number | null;
        statusText: string | null;
    }) {
        super(params.message);
        this.name = "ServiceError";
        this.type = params.type;
        this.status = params.status ?? null;
        this.statusText = params.statusText;
    }
}

export default ServiceError;
