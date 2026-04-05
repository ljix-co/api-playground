import React, { useEffect, useState } from 'react';
import './SelectInput.css';
import { FieldStates, type FieldComponent } from './types';

const SelectInput: FieldComponent = (props) => {
    const {name, options, onChange, value = '', state = FieldStates.DEFAULT} = props;
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [selectedValue, setSelectedValue] = useState<string>(String(value));

    useEffect(() => {
        setSelectedValue(String(value));
    }, [value]);

    const handleSelect = (value: string) => {
        setSelectedValue(value);
        onChange?.(value);
        setIsOpen(false);
    };

    const selectClassName = `select select--${state}`;

    return (
        <div className={selectClassName}>
            <input type="hidden" name={name} value={selectedValue} />
            <div className="select__container">
                <button
                    type="button"
                    onClick={() => {
                        if (state !== FieldStates.DISABLED) {
                            setIsOpen(!isOpen);
                        }
                    }}
                    className="select__trigger"
                    disabled={state === FieldStates.DISABLED}
                >
                    <span>{selectedValue || 'Select an option'}</span>
                    <span aria-hidden="true">▼</span>
                </button>

                {isOpen && state !== FieldStates.DISABLED && (
                    <div className="select__menu">
                        {options?.map((option) => (
                            <button
                                type="button"
                                key={option}
                                onClick={() => handleSelect(option)}
                                className="select__option"
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

SelectInput.isFormControl = true;
SelectInput.isCustom = true;

export default SelectInput;
