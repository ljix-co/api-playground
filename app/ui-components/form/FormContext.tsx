import { createContext, useContext } from 'react';
import type { FormContextValue } from './types';

export const FormContext = createContext<FormContextValue | null>(null);

export const useFormContext = () => {
    const context = useContext(FormContext);

    if (!context) {
        throw new Error('useFormContext must be used within FormContext.Provider');
    }

    return context;
};
