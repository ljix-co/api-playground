import type { FieldValidator } from "../form/types";

// const assertions
export const FieldStates = {
    DEFAULT: 'default',
    ERROR: 'error',
    SUCCESS: 'success',
    DISABLED: 'disabled',
} as const;

// type aliases
export type FieldState = typeof FieldStates[keyof typeof FieldStates];
export type FieldType = {
    isFormControl?: boolean,
    isCustom?: boolean
}
export type FieldComponent = React.FC<FieldProps> & FieldType;

// interfaces
export interface BaseFieldProps {
    name: string;
    label?: string;
}

export interface FieldProps extends BaseFieldProps {
    value?: string | number;
    onChange?: (value: string | number) => void;
    onBlur?: (value: string | number) => void;
    placeholder?: string;
    type?: string;
    min?: number;
    max?: number;
    state?: FieldState;
    isMandatory?: boolean;
    validator?: FieldValidator;
    options?: string[];
}

export interface FieldWrapperProps extends BaseFieldProps {
    children?: React.ReactNode;
    errors?: string[];
}
