import React, { useEffect, useRef } from 'react';
import { FormProvider } from './FormProvider';
import type { FormProps, FormValues } from './types';
import FormField from './FormField';
import { useFormContext } from './FormContext';
import { type FieldProps, type FieldType } from '../inputs/types';

const isFormControlElement = (child: React.ReactNode) => {
    return React.isValidElement(child) && !!(child.type as FieldType)?.isFormControl;
};

const wrapChildrenWithFormField = (children: React.ReactNode, isDisabled: boolean): React.ReactNode => {
    return React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;

        if (child.type === FormField) return child;

        if (isFormControlElement(child) && React.isValidElement<FieldProps>(child)) {
            const { name, label, validator } = child.props;

            if (!name) return child;

            return (
                <FormField name={name} label={label} validator={validator} isDisabled={isDisabled} >
                    {child}
                </FormField>
            );
        }

        if (React.isValidElement<{ children?: React.ReactNode }>(child) && child.props.children) {
            return React.cloneElement(child, {
                ...child.props,
                children: wrapChildrenWithFormField(child.props.children, isDisabled),
            });
        }

        return child;
    });
};

const InnerForm: React.FC<FormProps> = (props) => {
    const { children, className = '', onChange, onSubmit, isDisabled = false, ...restProps } = props;
    const { values, validateField, errors, validateAllFields } = useFormContext();
    const formClassName = ['space-y-4', className].filter(Boolean).join(' ');
    const prevFormValuesRef = useRef<FormValues | null>(null);

    // allow functions with form values to be passed as children
    const resolvedChildren = typeof children === 'function'
        ? children(values || {}, errors || {})
        : children;

    const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!values) return;

        const hasErrors = (errors && Object.values(errors).some(error => {
            return error.length > 0;
        })) || validateAllFields();

        if (hasErrors) return;

        onSubmit?.(values);
    };

    const handleBlur = (event: React.FocusEvent<HTMLFormElement>) => {
        validateField(event.target.name);
    };

    useEffect(() => {
        if (!values || typeof onChange !== 'function' || isDisabled) return;

        const prevValues = prevFormValuesRef.current;
        const isFormChanged = !prevValues
            || Object.keys(values).length !== Object.keys(prevValues).length
            || Object.entries(values).some(([key, value]) => (
                prevValues[key] !== value
            ));
        if (!isFormChanged) return;

        prevFormValuesRef.current = values;
        onChange(values)
    }, [values, onChange, isDisabled])

    return (
        <form
            className={formClassName}
            onSubmit={handleSubmit}
            onBlur={handleBlur}
            {...restProps}
        >
            {wrapChildrenWithFormField(resolvedChildren, isDisabled)}
        </form>
    );
};

const Form: React.FC<FormProps> = (props) => {
    return (
        <FormProvider>
            <InnerForm {...props} />
        </FormProvider>
    );
};

export default Form;
