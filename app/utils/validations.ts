export const isValidUrl = (url: unknown): boolean => {
    if (!url || typeof url !== 'string') return false;
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

export const isValidJson = (jsonString: unknown): boolean => {
    if (!jsonString || typeof jsonString !== 'string') return false;
    try {
        JSON.parse(jsonString);
        return true;
    } catch {
        return false;
    }
}

export const isValidTimeout = (timeout: unknown, maxValue: number, minValue: number): boolean => {
    if (timeout === undefined || timeout === null) return true;
    const parsed = Number(timeout);
    return (Number.isInteger(parsed) && parsed >= minValue && parsed <= maxValue)
}
