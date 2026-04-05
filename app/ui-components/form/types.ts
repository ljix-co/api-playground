import type { FieldWrapperProps } from "../inputs/types";

// type alisases
export type FormErrors = Record<string, string | string[]>;
export type FormValues = Record<string, FormDataEntryValue>;

// interfaces
export interface FormProps extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'children' | 'onChange' | 'onSubmit'> {
    children: React.ReactNode | ((values: FormValues, errors?: FormErrors) => React.ReactNode);
    initialValues?: FormValues;
    initialErrors?: FormErrors;
    onChange?: (values: FormValues) => void;
    onSubmit?: (values: FormValues) => void;
}

export interface FormContextValue {
    values: FormValues | null;
    errors: FormErrors | null;
    touched: Record<string, boolean> | null;

    setValues: React.Dispatch<React.SetStateAction<FormValues | null>>;
    setErrors: React.Dispatch<React.SetStateAction<FormErrors | null>>;

    setFieldValue: (name: string, value: FormDataEntryValue) => void;
    getFieldValue: (name: string) => FormDataEntryValue | undefined;

    setFieldErrors: (name: string, errors: string[]) => void;
    getFieldErrors: (name: string) => string | string[];

    setFieldTouched: (name: string, touched: boolean) => void;
    isFieldTouched: (name: string) => boolean;

    registerField: (name: string) => void;
    unregisterField: (name: string) => void;
    isFieldRegistred: (name: string) => boolean;

    setFieldValidator: (name: string, validator: FieldValidator) => void;
    validateField: (name: string) => boolean;
    validateAllFields: () => boolean;

    resetForm: () => void;
}

export interface FormProviderProps {
    children: React.ReactNode;
    initialValues?: FormValues;
    initialErrors?: FormErrors;
}

export interface FieldValidator {
    validatorMethod: (value: FormDataEntryValue | undefined) => boolean;
    errors: string | string[];
}

export interface FormFieldProps extends Omit<FieldWrapperProps, 'errors'> {
    validator?: FieldValidator;
}
