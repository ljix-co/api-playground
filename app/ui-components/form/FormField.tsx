import React, { useEffect } from 'react';
import { useFormContext } from './FormContext';
import FieldWrapper from '../inputs/FieldWrapper';
import type { FormFieldProps } from './types';
import { FieldStates, type FieldProps, type FieldType } from '../inputs/types';

const FormField: React.FC<FormFieldProps> = (props) => {
    const { name, label, validator, children } = props;
    const { registerField, unregisterField, errors, setFieldValue, setFieldTouched, setFieldValidator, isFieldRegistred } = useFormContext();
    const isValidReactElement = React.isValidElement<FieldProps>(children)
    const isCustom = isValidReactElement
        && typeof children.type === 'function'
        && (children.type as FieldType)?.isCustom;
    const fieldErrors = name && errors?.[name]
        ? Array.isArray(errors[name])
            ? errors[name]
            : [errors[name]]
        : [];

    const enhancedChild = isCustom
        ? React.cloneElement(children, {
            onChange: (value: string | number) => {
                children.props?.onChange?.(value);
                setFieldValue(name, String(value));
            },
            onBlur: (value: string | number) => {
                children.props?.onBlur?.(value);
                setFieldTouched(name, true);
            },
            state: fieldErrors.length ? FieldStates.ERROR : FieldStates.DEFAULT
        }) : isValidReactElement
            ? React.cloneElement(children, {
                state: fieldErrors.length ? FieldStates.ERROR : FieldStates.DEFAULT
            })
            : children;

    useEffect(() => {
        if (!name) return;
        registerField(name);

        return () => {
            unregisterField(name);
        };
    }, [registerField, unregisterField, name]);

    useEffect(() => {
        if (!name || !validator || !isFieldRegistred(name)) return;
        setFieldValidator(name, validator)
    }, [name, validator, setFieldValidator, isFieldRegistred])

    return (
        <FieldWrapper name={name} label={label} errors={fieldErrors}>
            {enhancedChild}
        </FieldWrapper>
    )
};

export default FormField;
