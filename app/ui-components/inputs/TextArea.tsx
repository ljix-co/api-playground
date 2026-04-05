import React from 'react';
import './TextArea.css';
import { FieldStates, type FieldComponent } from './types';

const TextArea: FieldComponent = (props) => {
    const { name, value, onChange, onBlur, placeholder = '', state = FieldStates.DEFAULT } = props;

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange && onChange(e.target.value);
    };

    const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
        onBlur && onBlur(e.target.value);
    };

    const textAreaClassName = `textarea textarea--${state}`;

    return (
        <textarea
            name={name}
            defaultValue={value}
            className={textAreaClassName}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={state === FieldStates.DISABLED}
            placeholder={placeholder}
        />
    );
};

TextArea.isFormControl = true;

export default TextArea;
