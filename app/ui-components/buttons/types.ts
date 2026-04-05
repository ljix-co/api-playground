export const ButtonStates = {
    DEFAULT: 'default',
    HIGHLIGHT: 'highlight',
    SUCCESS: 'success',
    WARNING: 'warning',
    DISABLED: 'disabled',
} as const;

export type ButtonState = typeof ButtonStates[keyof typeof ButtonStates];

export interface ButtonProps {
    label: string;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    state?: ButtonState;
}
