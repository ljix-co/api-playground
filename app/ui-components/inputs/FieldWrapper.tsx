import React from 'react';
import './FieldWrapper.css';
import type { FieldWrapperProps } from './types';

const FieldWrapper: React.FC<FieldWrapperProps> = ({ name, label, children, errors = [] }) => {
    const firstError = errors[0] ?? '';

    return (
        <div className="field-wrapper">
            {label && (
                <label htmlFor={name} className="field-wrapper__label">
                    {label}
                </label>
            )}
            {children}
            <div className="field-wrapper__errors" aria-live="polite">
                <p
                    className={`field-wrapper__error ${firstError ? '' : 'field-wrapper__error--placeholder'}`.trim()}
                    aria-hidden={!firstError}
                >
                    {firstError || 'placeholder'}
                </p>
            </div>
        </div>
    );
};

export default FieldWrapper;
