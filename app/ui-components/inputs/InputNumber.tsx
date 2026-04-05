import React from 'react';
import './InputNumber.css';
import { FieldStates, type FieldComponent } from './types';

const clamp = (value: number, min?: number, max?: number) => {
    let nextValue = value;

    if (typeof min === 'number' && nextValue < min) {
        nextValue = min;
    }

    if (typeof max === 'number' && nextValue > max) {
        nextValue = max;
    }

    return nextValue;
};

const InputNumber: FieldComponent = (props) => {
    const { name, value, onChange, onBlur, placeholder = '', min, max, state = FieldStates.DEFAULT } = props;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = event.target.value;

        if (rawValue === '') {
            onChange?.('');
            return;
        }

        const numericValue = Number(rawValue);
        if (Number.isNaN(numericValue)) {
            return;
        }

        const clampedValue = clamp(numericValue, min, max);
        if (clampedValue !== numericValue) {
            event.currentTarget.value = String(clampedValue);
        }
        onChange?.(clampedValue);
    };

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        const rawValue = event.currentTarget.value;

        if (rawValue === '') {
            onBlur?.('');
            return;
        }

        const numericValue = Number(rawValue);
        if (Number.isNaN(numericValue)) {
            return;
        }

        const clampedValue = clamp(numericValue, min, max);
        if (clampedValue !== numericValue) {
            event.currentTarget.value = String(clampedValue);
        }
        onBlur?.(clampedValue);
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
