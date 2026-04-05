import React, { useState, useCallback } from 'react';
import { FormContext } from './FormContext';
import type { FormProviderProps, FormValues, FormErrors, FieldValidator } from './types';

export const FormProvider: React.FC<FormProviderProps> = ({ children }) => {
    const [values, setValues] = useState<FormValues | null>(null);
    const [errors, setErrors] = useState<FormErrors | null>(null);
    const [touched, setTouched] = useState<Record<string, boolean> | null>(null);
    const fieldsRef = React.useRef<Record<string, FieldValidator | undefined | null>>({});

    const setFieldValue = useCallback((name: string, value: FormDataEntryValue) => {
        setValues((previous) => {
            if (previous && previous[name] === value) {
                return previous;
            }

            return {
                ...previous,
                [name]: value,
            };
        });
    }, []);

    const getFieldValue = useCallback((name: string) => values?.[name], [values]);

    const setFieldErrors = useCallback((name: string, errors: string | string[]) => {
        setErrors((previous) => {
            if (previous && previous[name] === errors) {
                return previous;
            }

            return {
                ...previous,
                [name]: errors,
            };
        });
    }, []);

    const getFieldErrors = useCallback((name: string) => errors?.[name] ?? [], [errors]);

    const setFieldTouched = useCallback((name: string, isTouched: boolean) => {
        setTouched((previous) => ({
            ...previous,
            [name]: isTouched,
        }));
    }, []);

    const isFieldTouched = useCallback((name: string) => touched?.[name] ?? false, [touched]);

    const registerField = useCallback((name: string) => {
        fieldsRef.current[name] = null;
    }, []);

    const unregisterField = useCallback((name: string) => {
        delete fieldsRef.current[name];
        setErrors((prev) => {
            if (!prev || !(name in prev)) return prev;
            const next = { ...prev };
            delete next[name];
            return next;
        });

        setTouched((prev) => {
            if (!prev || !(name in prev)) return prev;
            const next = { ...prev };
            delete next[name];
            return next;
        });

        setValues((prev) => {
            if (!prev || !(name in prev)) return prev;
            const next = { ...prev };
            delete next[name];
            return next;
        });
    }, []);

    const isFieldRegistred = (name: string) => {
        return !!Object.keys(fieldsRef.current).find(key => key == name)
    }

    const setFieldValidator = (name: string, validator: FieldValidator) => {
        if (!Object.keys(fieldsRef.current).find(key => key == name)) return;
        fieldsRef.current[name] = validator;
    }

    const validateField = useCallback((name: string) => {
        const validator = fieldsRef.current[name];
        let hasErrors = false;

        if (!validator) return hasErrors;

        const value = values?.[name];
        const { validatorMethod, errors } = validator;

        if (validatorMethod && typeof validatorMethod === 'function') {
            hasErrors = !validatorMethod(value);
            setFieldErrors(name, !hasErrors ? [] : errors);
        }

        return hasErrors;
    }, [values, setFieldErrors]);

    const validateAllFields = useCallback(() => {
        const fieldNames = Object.keys(fieldsRef.current);
        let hasErrors = false;

        fieldNames.forEach(fieldName => {
            hasErrors = validateField(fieldName) || hasErrors;
        });

        return hasErrors;
    }, [validateField]);

    const resetForm = useCallback(() => {
        setValues(null);
        setErrors(null);
        setTouched(null);
    }, []);

    return (
        <FormContext.Provider
            value={{
                values,
                errors,
                touched,
                setValues,
                setErrors,
                setFieldValue,
                getFieldValue,
                setFieldErrors,
                getFieldErrors,
                setFieldTouched,
                isFieldTouched,
                registerField,
                unregisterField,
                isFieldRegistred,
                setFieldValidator,
                validateField,
                validateAllFields,
                resetForm,
            }}
        >
            {children}
        </FormContext.Provider>
    );
};