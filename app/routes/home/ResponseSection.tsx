import React, { useCallback, useEffect } from "react";
import { useServiceContext } from "~/services/ServiceContext";
import { PipelineStages } from "~/services/types";
import Button from "~/ui-components/buttons/Button";
import { LoadingIndicator, PulsingIndicator } from "~/ui-components/indicators";
import StatusMessage from "~/ui-components/indicators/StatusMessage";

const ResponseSection: React.FC = () => {
    const { response, error, pipelineStage, timeoutCounter, cancelRequest, responseTime, cancellationMessage } = useServiceContext();

    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (event.key === 'Escape'
            && (pipelineStage === PipelineStages.SENDING
                || pipelineStage === PipelineStages.WAITING
            )) {
            cancelRequest();
        }
    }, [cancelRequest, pipelineStage]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);

    return (
        <div className="p-4 m-4 layout-card">
            <h2 className="mb-4 text-xl font-semibold">Response</h2>
            <p className="text-gray-700">Response details will be displayed here after sending a request.</p>
            {timeoutCounter !== null && (
                <p className="mt-2 text-sm text-red-500">
                    {String(Math.floor(timeoutCounter / 60)).padStart(2, '0')}:{String(timeoutCounter % 60).padStart(2, '0')}
                </p>
            )}
            {responseTime !== null && (
                <p className="mt-2 text-sm text-gray-500">
                    Completed {responseTime} ms
                </p>
            )}
            <div className="w-full h-full flex flex-col items-center justify-center">
                {pipelineStage === PipelineStages.SENDING && (
                    <LoadingIndicator />
                )}
                {(pipelineStage === PipelineStages.SENDING
                    || pipelineStage === PipelineStages.WAITING
                ) && (
                        <>
                            <PulsingIndicator />
                            <Button
                                onClick={cancelRequest}
                                label="Cancel Request"
                            />
                        </>
                    )}
                {pipelineStage !== PipelineStages.SENDING && pipelineStage !== PipelineStages.WAITING && (
                    <div className="layout-stack w-full">
                        <StatusMessage
                            message={pipelineStage === PipelineStages.SUCCESS && response?.success
                                ? `Response status: ${[response.status, response.statusText].filter(value => (
                                    Boolean(value)
                                )).join(', ') || '-'}`
                                : pipelineStage === PipelineStages.ERROR && error
                                    ? `Response status: ${[error.status, error.statusText].filter(value => (
                                        Boolean(value)
                                    ))?.join(', ') || '-'} | Error type: ${error.errorType}`
                                    : 'Waiting for request to be submitted.'}
                            state={pipelineStage}
                        />

                        <div className="w-full">
                            {pipelineStage !== PipelineStages.IDLE && (
                                <strong>
                                    {pipelineStage === PipelineStages.ERROR ? 'Error' : 'Response body'}
                                </strong>
                            )}
                            <div className="layout-card">
                                {pipelineStage === PipelineStages.ERROR && error
                                    ? error.message || 'An error occurred while processing the request.'
                                    : pipelineStage === PipelineStages.SUCCESS && !!response?.data
                                        ? JSON.stringify(response.data, null, 2)
                                        : pipelineStage === PipelineStages.IDLE && cancellationMessage
                                            ? cancellationMessage
                                            : ''}
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
};

export default ResponseSection;
