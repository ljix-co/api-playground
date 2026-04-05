import {createContext, useContext} from 'react';
import type { ServiceContextValue } from './types';

export const ServiceContext = createContext<ServiceContextValue | null>(null);

export const useServiceContext = () => {
    const context = useContext(ServiceContext);
    
    if (!context) {
        throw new Error('useServiceContext must be used within ServiceContext.Provider');
    }

    return context;
};
