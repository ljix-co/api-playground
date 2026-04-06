import React from 'react';
import './InputNumber.css';
import { FieldStates, type FieldComponent } from './types';

const InputNumber: FieldComponent = (props) => {
    const { name, value, onChange, onBlur, placeholder = '', min, max, state = FieldStates.DEFAULT } = props;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange?.(event.target.value);
    };

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        onBlur?.(event.currentTarget.value);
    };

    const inputNumberClassName = `input-number input-number--${state}`;

    return (
        <input
            name={name}
            type="number"
            defaultValue={value}
            min={min}
            max={max}
            placeholder={placeholder}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={state === FieldStates.DISABLED}
            className={inputNumberClassName}
        />
    );
};

InputNumber.isFormControl = true;

export default InputNumber;
