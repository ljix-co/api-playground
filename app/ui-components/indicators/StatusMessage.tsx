import React from 'react';
import './StatusMessage.css';
import { IndicatorStates, type IndicatorState } from './types';

const componentClassVariant: Record<IndicatorState, string> = {
    [IndicatorStates.ERROR]: 'status-message--error',
    [IndicatorStates.SENDING]: 'status-message--sending',
    [IndicatorStates.SUCCESS]: 'status-message--success',
    [IndicatorStates.WAITING]: 'status-message--waiting',
    [IndicatorStates.IDLE]: 'status-message--idle',
};

const StatusMessage: React.FC<{ 
    message: string, 
    state: IndicatorState
}> = (props) => {
    const { message , state} = props;
    const componentClass = `status-message ${componentClassVariant[state]}`;

    return (
        <div className={componentClass} role="alert">
            <p>{message}</p>
        </div>
    );
};

export default StatusMessage;
