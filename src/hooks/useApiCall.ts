import { useState, useRef, useEffect } from 'react';

interface UseApiCallOptions {
    immediate?: boolean;
    onError?: (error: string) => void;
}

interface UseApiCallReturn<T> {
    data: T | null;
    isLoading: boolean;
    error: string | null;
    execute: () => Promise<void>;
    clearError: () => void;
}

export function useApiCall<T>(
    apiCall: () => Promise<T>,
    options: UseApiCallOptions = {}
): UseApiCallReturn<T> {
    const { immediate = false, onError } = options;
    const [data, setData] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const hasFetched = useRef(false);

    const execute = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await apiCall();
            setData(result);
        } catch (err: any) {
            const errorMessage = err.message || 'API call failed';
            setError(errorMessage);
            onError?.(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const clearError = () => {
        setError(null);
    };

    useEffect(() => {
        if (immediate && !hasFetched.current) {
            hasFetched.current = true;
            execute();
        }
    }, [immediate]);

    return {
        data,
        isLoading,
        error,
        execute,
        clearError,
    };
}
