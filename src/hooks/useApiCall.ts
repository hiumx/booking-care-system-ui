import { useState, useRef, useEffect, useCallback } from 'react';

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

    // Keep a ref to the latest apiCall so the returned `execute` function can be
    // stable across renders while still calling the latest callback.
    const apiCallRef = useRef(apiCall);
    // update ref when apiCall changes
    useEffect(() => {
        apiCallRef.current = apiCall;
    }, [apiCall]);

    // Stable execute function: callers can safely include `execute` in deps
    // arrays without triggering repeated effect runs. It calls the latest
    // `apiCall` stored in `apiCallRef`.
    const execute = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await apiCallRef.current();
            setData(result);
        } catch (err: any) {
            const errorMessage = err.message || 'API call failed';
            setError(errorMessage);
            onError?.(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [onError]);

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
