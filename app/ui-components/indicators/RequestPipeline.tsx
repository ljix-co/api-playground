import React from "react";
import "./RequestPipeline.css";
import { IndicatorStates, type IndicatorState } from "./types";

const STAGES: IndicatorState[] = [
    IndicatorStates.IDLE,
    IndicatorStates.SENDING,
    IndicatorStates.WAITING,
    IndicatorStates.SUCCESS,
    IndicatorStates.ERROR,
];

const STAGE_LABELS: Record<IndicatorState, string> = {
    [IndicatorStates.IDLE]: "Idle",
    [IndicatorStates.SENDING]: "Sending",
    [IndicatorStates.WAITING]: "Waiting",
    [IndicatorStates.SUCCESS]: "Success",
    [IndicatorStates.ERROR]: "Error",
};

const RequestPipeline: React.FC<{ currentStage: IndicatorState }> = ({ currentStage }) => {
    const currentStageIndex = STAGES.indexOf(currentStage);

    return (
        <div className="request-pipeline" role="status" aria-label="Request pipeline">
            {STAGES.map((stage, index) => {
                const isCurrent = stage === currentStage;
                const isDone = currentStage !== IndicatorStates.ERROR && index < currentStageIndex;
                const isFuture = index > currentStageIndex;
                const isLast = index === STAGES.length - 1;

                const stageClassName = [
                    "request-pipeline__stage",
                    isCurrent ? "request-pipeline__stage--current" : "",
                    isFuture ? "request-pipeline__stage--future" : "",
                    stage === IndicatorStates.IDLE && isCurrent ? "request-pipeline__stage--idle" : "",
                    stage === IndicatorStates.SUCCESS ? "request-pipeline__stage--success" : "",
                    stage === IndicatorStates.ERROR ? "request-pipeline__stage--error" : "",
                    stage === IndicatorStates.SENDING && isCurrent ? "request-pipeline__stage--sending" : "",
                    stage === IndicatorStates.WAITING && isCurrent ? "request-pipeline__stage--waiting" : "",
                ].filter(Boolean).join(" ");

                return (
                    <React.Fragment key={stage}>
                        <div className="request-pipeline__item">
                            <div className={stageClassName} aria-current={isCurrent ? "step" : undefined}>
                                <span className="request-pipeline__dot" aria-hidden="true" />
                                <span className="request-pipeline__label">{STAGE_LABELS[stage]}</span>
                            </div>
                            {!isLast && (
                                <span
                                    className={`request-pipeline__connector ${isDone ? "request-pipeline__connector--active" : ""}`.trim()}
                                    aria-hidden="true"
                                />
                            )}
                        </div>
                    </React.Fragment>
                );
            })}
        </div>
    );
};

export default RequestPipeline;
