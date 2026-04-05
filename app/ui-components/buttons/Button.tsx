import React from 'react';
import './Button.css';
import { ButtonStates, type ButtonProps } from './types';

const Button: React.FC<ButtonProps> = ({
    label,
    onClick,
    type = 'button',
    state = ButtonStates.DEFAULT,
}) => {

    return (
        <button
            type={type}
            className={`button button--${state}`}
            onClick={() => onClick?.()}
            disabled={state === ButtonStates.DISABLED}
        >
            {label}
        </button>
    );
};

export default Button;
