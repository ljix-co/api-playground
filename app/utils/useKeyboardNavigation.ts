import { useCallback, useEffect } from "react";

const useKeyboardNavigation = (allowedKeys: string[], additionalCondition: boolean, callback: () => void) => {
    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        const normalizedAllowedKeys = allowedKeys.map(key => key.toUpperCase());

        if (event.key 
            && normalizedAllowedKeys.includes(event.key.toUpperCase()) 
            && additionalCondition) {
            callback();
        }
    }, [callback, additionalCondition, allowedKeys]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);
}

export default useKeyboardNavigation;
