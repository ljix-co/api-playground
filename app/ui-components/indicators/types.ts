// const assertions
export const IndicatorStates = {
    IDLE: 'IDLE',
    SENDING: 'SENDING',
    SUCCESS: 'SUCCESS',
    ERROR: 'ERROR',
    WAITING: 'WAITING',
} as const;

// type aliases
export type IndicatorState = typeof IndicatorStates[keyof typeof IndicatorStates];
