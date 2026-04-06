import React from "react";
import { JSON_PRETTY_PRINT_SPACES, SECONDS_IN_MINUTE, TIME_DISPLAY_PAD_LENGTH } from "~/config";
import { useServiceContext } from "~/services/ServiceContext";
import { CancelRequestAllowedKeys, PipelineStages } from "~/services/types";
import { LoadingIndicator, PulsingIndicator, RequestPipeline, StatusMessage, Button } from "~/ui-components";
import useKeyboardNavigation from "~/utils/useKeyboardNavigation";

const ResponseSection: React.FC = () => {
    const { response, error, pipelineStage, timeoutCounter, cancelRequest, responseTime, cancellationMessage } = useServiceContext();

    useKeyboardNavigation(
        Object.values(CancelRequestAllowedKeys),
        pipelineStage === PipelineStages.SENDING || pipelineStage === PipelineStages.WAITING,
        cancelRequest
    );

    return (
        <div className="p-4 m-4 layout-card">
            <h2 className="mb-4 text-xl font-semibold">Response</h2>
            <RequestPipeline currentStage={pipelineStage} />
            {timeoutCounter !== null && (
                <p className="mt-2 mb-2 text-sm text-red-500">
                    {String(Math.floor(timeoutCounter / SECONDS_IN_MINUTE)).padStart(TIME_DISPLAY_PAD_LENGTH, '0')}
                    :
                    {String(timeoutCounter % SECONDS_IN_MINUTE).padStart(TIME_DISPLAY_PAD_LENGTH, '0')}
                </p>
            )}
            {responseTime !== null && (
                <p className="mt-2 mb-2 text-sm text-gray-500">
                    Completed {responseTime} ms
                </p>
            )}
            <div className="w-full h-full flex flex-col items-center justify-center">
                {pipelineStage === PipelineStages.SENDING && (
                    <div className="p-12">
                        <LoadingIndicator />
                    </div>
                )}
                {pipelineStage === PipelineStages.WAITING && (
                    <div>
                        <div className="p-12">
                            <PulsingIndicator />
                        </div>
                        <Button
                            onClick={cancelRequest}
                            label="Cancel Request"
                        />
                    </div>
                )}
                {pipelineStage === PipelineStages.IDLE && (
                    <div className="layout-stack w-full">
                        <StatusMessage
                            message='Waiting for request to be submitted.'
                            state={pipelineStage}
                        />
                        <div className="w-full">
                            {cancellationMessage && (
                                <div className="layout-card">
                                    {cancellationMessage}
                                </div>
                            )}
                        </div>
                    </div>
                )}
                {pipelineStage === PipelineStages.SUCCESS && response?.success && (
                    <div className="layout-stack w-full">
                        <StatusMessage
                            message={`Response status: ${[response.status, response.statusText].filter(value => (
                                Boolean(value)
                            )).join(', ') || '-'}`}
                            state={pipelineStage}
                        />

                        <div className="w-full">
                            <strong>
                                Response body:
                            </strong>
                            {response.data instanceof Blob
                                ? (
                                    <div className="layout-card">
                                        Binary response is not previewable.
                                        <p>
                                            Type: {response.data.type || 'unknown'}
                                        </p>
                                        <p>
                                            Size: {response.data.size || '-'} bytes
                                        </p>
                                    </div>
                                ) : typeof response.data === 'object'
                                    ? (
                                        <div className="layout-card">
                                            {JSON.stringify(response.data, null, JSON_PRETTY_PRINT_SPACES)}
                                        </div>
                                    )
                                    : (
                                        <div className="layout-card">
                                            {String(response.data ?? 'No response data.')}
                                        </div>
                                    )}
                        </div>

                    </div>
                )}
                {pipelineStage === PipelineStages.ERROR && error && (
                    <div className="layout-stack w-full">
                        <StatusMessage
                            message={`Response status: ${[error.status, error.statusText].filter(value => (
                                Boolean(value)
                            ))?.join(', ') || '-'} | Error type: ${error.errorType}`}
                            state={pipelineStage}
                        />
                        <div className="w-full">
                            <strong>
                                Error:
                            </strong>
                            <div className="layout-card">
                                {error.message || 'An error occurred while processing the request.'}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResponseSection;
