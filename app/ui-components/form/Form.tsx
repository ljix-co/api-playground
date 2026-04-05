import React from 'react';
import { FormProvider } from './FormProvider';
import type { FormProps } from './types';
import FormField from './FormField';
import { useFormContext } from './FormContext';
import type { FieldType } from '../inputs/types';

const isFormControlElement = (child: React.ReactNode) => {
    return React.isValidElement(child) && !!(child.type as FieldType)?.isFormControl;
};

const wrapChildrenWithFormField = (children: React.ReactNode): React.ReactNode => {
    return React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;

        if (child.type === FormField) return child;

        if (isFormControlElement(child)) {
            const { name, label, validator } = child.props as { name?: string; label?: string; validator?: any };

            if (!name) return child;

            return (
                <FormField name={name} label={label} validator={validator}>
                    {child}
                </FormField>
            );
        }

        if (React.isValidElement<{ children?: React.ReactNode }>(child) && child.props.children) {
            return React.cloneElement(child, {
                ...child.props,
                children: wrapChildrenWithFormField(child.props.children),
            });
        }

        return child;
    });
};

const InnerForm: React.FC<FormProps> = (props) => {
    const { children, className = '', onChange, onSubmit, ...restProps } = props;
    const { setValues, values, validateField, errors, validateAllFields } = useFormContext();
    const formClassName = ['space-y-4', className].filter(Boolean).join(' ');

    // allow functions with form values to be passed as children
    const resolvedChildren = typeof children === 'function'
        ? children(values || {}, errors || {})
        : children;

    const handleChange = (event: React.ChangeEvent<HTMLFormElement>) => {
        const values = Object.fromEntries(new FormData(event.currentTarget).entries());
        setValues(values);
        onChange?.(values);
    };

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

    return (
        <form
            className={formClassName}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onBlur={handleBlur}
            {...restProps}
        >
            {wrapChildrenWithFormField(resolvedChildren)}
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
