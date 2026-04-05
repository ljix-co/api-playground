import React from 'react';
import './Input.css';
import { FieldStates, type FieldComponent } from './types';

const Input: FieldComponent = (props) => {
    const { name, value, onChange, onBlur, placeholder = '', type = 'text', state = FieldStates.DEFAULT } = props;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange && onChange(e.target.value);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        onBlur && onBlur(e.target.value);
    };

    const inputClassName = `input input--${state}`;

    return (
        <input
            name={name}
            className={inputClassName}
            defaultValue={value}
            type={type}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={state === FieldStates.DISABLED}
            placeholder={placeholder}
        />
    );
};

Input.isFormControl = true;

export default Input;
