import React, { useEffect } from 'react';
import { useFormContext } from './FormContext';
import FieldWrapper from '../inputs/FieldWrapper';
import type { FormFieldProps } from './types';
import { FieldStates, type FieldProps } from '../inputs/types';

const FormField: React.FC<FormFieldProps> = (props) => {
    const { name, label, validator, children, isDisabled } = props;
    const {
        registerField,
        unregisterField,
        errors,
        setFieldValue,
        setFieldTouched,
        setFieldValidator,
        isFieldRegistred,
        getFieldValue,
    } = useFormContext();
    const isValidReactElement = React.isValidElement<FieldProps>(children)

    const fieldErrors = name && errors?.[name]
        ? Array.isArray(errors[name])
            ? errors[name]
            : [errors[name]]
        : [];

    const enhancedChild = isValidReactElement
        ? React.cloneElement(children, {
            onChange: (value: string | number) => {
                children.props?.onChange?.(value);
                setFieldValue(name, String(value));
            },
            onBlur: (value: string | number) => {
                children.props?.onBlur?.(value);
                setFieldTouched(name, true);
            },
            state: isDisabled
                ? FieldStates.DISABLED
                : fieldErrors.length
                    ? FieldStates.ERROR
                    : FieldStates.DEFAULT
        }) : children;

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

    useEffect(() => {
        if (!isValidReactElement || !!getFieldValue(name)) return;

        const childPropsValue = children.props?.value;

        if (childPropsValue === undefined || childPropsValue === null) return;

        setFieldValue(name, typeof childPropsValue === 'number'
            ? String(childPropsValue)
            : childPropsValue
        );
    }, [children, name, isValidReactElement, getFieldValue, setFieldValue]);

    return (
        <FieldWrapper name={name} label={label} errors={fieldErrors}>
            {enhancedChild}
        </FieldWrapper>
    )
};

export default FormField;
