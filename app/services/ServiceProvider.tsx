import React, { useState } from "react";
import { MILLISECONDS_IN_SECOND, MOCK_REQUEST_TIMEOUT_BUFFER_MS, PIPELINE_MIN_SENDING_DURATION_MS } from "~/config";
import { ErrorTypes, PipelineStages, type FetchApiResponseError, type FetchApiResponseSuccess, type HttpMethod, type RequestParams } from "./types";
import { fetchApiResponse } from "./apiPlaygroundService";
import { ServiceContext } from "./ServiceContext";

const wait = (ms: number) => new Promise((resolve) => {
    return setTimeout(resolve, ms)
});

const ServiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [response, setResponse] = useState<FetchApiResponseSuccess | null>(null);
    const [pipelineStage, setPipelineStage] = useState<typeof PipelineStages[keyof typeof PipelineStages]>(PipelineStages.IDLE);
    const [error, setError] = useState<FetchApiResponseError | null>(null);
    const [cancellationMessage, setCancellationMessage] = useState<string | null>(null);
    const [timeoutCounter, setTimeoutCounter] = useState<number | null>(null);
    const [responseTime, setResponseTime] = useState<number | null>(null);
    const controllerRef = React.useRef<AbortController | null>(null);
    const timeoutIdRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
    const intervalIdRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

    const cleanup = () => {
        if (controllerRef.current) {
            controllerRef.current = null;
        }
        if (timeoutIdRef.current) {
            clearTimeout(timeoutIdRef.current);
            timeoutIdRef.current = null;
        }
        if (intervalIdRef.current) {
            clearInterval(intervalIdRef.current);
            intervalIdRef.current = null;
        }
    };

    const executeRequest = async (url: string, method: HttpMethod, body?: string, options?: { timeout?: number }) => {
        setPipelineStage(PipelineStages.SENDING);
        setError(null);
        setResponse(null);
        setResponseTime(null);
        setCancellationMessage(null);
        setTimeoutCounter(null);

        let startTime: number | null = null;

        await wait(PIPELINE_MIN_SENDING_DURATION_MS);

        const result = await (() => {
            setPipelineStage(PipelineStages.WAITING);
            startTime = performance.now();
            let requestParams: RequestParams = {
                url,
                method,
                ...(body && { body })
            };

            if (options?.timeout) {
                const controller = new AbortController();
                controllerRef.current = controller;

                setTimeoutCounter(options.timeout);

                const timeoutId = setTimeout(() => {
                    setTimeoutCounter(0);
                    controller.abort('timeout');
                }, options.timeout * MILLISECONDS_IN_SECOND);
                timeoutIdRef.current = timeoutId;

                const intervalId = setInterval(() => {
                    setTimeoutCounter((prev) => {
                        if (!prev) return null;
                        return prev > 0 ? prev - 1 : 0;
                    });
                }, MILLISECONDS_IN_SECOND);
                intervalIdRef.current = intervalId;

                requestParams = {
                    ...requestParams,
                    options: {
                        signal: controller.signal,
                        delayMs: options.timeout * MILLISECONDS_IN_SECOND + MOCK_REQUEST_TIMEOUT_BUFFER_MS
                    }
                };
            }

            return fetchApiResponse(requestParams).finally(() => {
                if (startTime) {
                    const endTime = performance.now();
                    setResponseTime(Math.round(endTime - startTime));
                }
                cleanup();
            });
        })();

        if (!result.success) {
            if (result.errorType === ErrorTypes.CANCEL) {
                setCancellationMessage(result.message);
                setPipelineStage(PipelineStages.IDLE);
                return;
            }
            setError(result)
            setPipelineStage(PipelineStages.ERROR);
            return;
        }

        setResponse(result);
        setPipelineStage(PipelineStages.SUCCESS);
    };

    const cancelRequest = () => {
        if (controllerRef.current) {
            controllerRef.current.abort('cancel');
        }
        cleanup();
    };

    const resetPipelineStage = () => {
        if (pipelineStage !== PipelineStages.SUCCESS
            && pipelineStage !== PipelineStages.ERROR
            && pipelineStage !== PipelineStages.IDLE) return;

        if (cancellationMessage) setCancellationMessage(null);
        if (timeoutCounter !== null) setTimeoutCounter(null);
        if (responseTime !== null) setResponseTime(null);

        if (pipelineStage === PipelineStages.SUCCESS
            || pipelineStage === PipelineStages.ERROR) {
            setPipelineStage(PipelineStages.IDLE);
        }
    }

    return (
        <ServiceContext.Provider
            value={{
                executeRequest,
                cancelRequest,
                response,
                error,
                pipelineStage,
                resetPipelineStage,
                timeoutCounter,
                responseTime,
                cancellationMessage
            }}
        >
            {children}
        </ServiceContext.Provider>
    );
};

export default ServiceProvider;
