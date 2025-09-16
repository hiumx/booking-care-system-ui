import { useCallback, useState } from 'react';
import { AsyncThunk, SerializedError } from '@reduxjs/toolkit';
import { useAppDispatch } from '../store/hooks';

// Types for the hook
export interface UseApiOptions<TReturn = unknown> {
    onSuccess?: (data: TReturn) => void;
    onError?: (error: string | SerializedError) => void;
    onFinally?: () => void;
    showLoading?: boolean;
    resetOnNewCall?: boolean;
}

export interface ApiCallState<TReturn = unknown> {
    data: TReturn | null;
    loading: boolean;
    error: string | SerializedError | null;
    success: boolean;
    called: boolean;
}

export interface UseApiResult<TArgs = void, TReturn = unknown> {
    execute: (args: TArgs) => Promise<TReturn>;
    reset: () => void;
    state: ApiCallState<TReturn>;
}

// Main custom hook for API calls
export function useApi<TArgs = void, TReturn = unknown>(
    thunk: AsyncThunk<TReturn, TArgs, object>,
    options: UseApiOptions<TReturn> = {}
): UseApiResult<TArgs, TReturn> {
    const dispatch = useAppDispatch();

    const { onSuccess, onError, onFinally, resetOnNewCall = true } = options;

    // Local state for this specific API call
    const [localState, setLocalState] = useState<ApiCallState<TReturn>>({
        data: null,
        loading: false,
        error: null,
        success: false,
        called: false,
    });

    const execute = useCallback(
        async (args: TArgs): Promise<TReturn> => {
            try {
                // Reset state if needed
                if (resetOnNewCall) {
                    setLocalState({
                        data: null,
                        loading: true,
                        error: null,
                        success: false,
                        called: true,
                    });
                } else {
                    setLocalState((prev) => ({
                        ...prev,
                        loading: true,
                        error: null,
                        called: true,
                    }));
                }

                // Dispatch the thunk - use any to bypass strict typing issues
                const result = await dispatch(thunk(args as any)).unwrap();

                // Update success state
                setLocalState((prev) => ({
                    ...prev,
                    data: result,
                    loading: false,
                    success: true,
                    error: null,
                }));

                // Call success callback
                if (onSuccess) {
                    onSuccess(result);
                }

                return result;
            } catch (error: any) {
                // Update error state
                setLocalState((prev) => ({
                    ...prev,
                    loading: false,
                    error: error,
                    success: false,
                }));

                // Call error callback
                if (onError) {
                    onError(error);
                }

                // Re-throw error for caller handling
                throw error;
            } finally {
                // Call finally callback
                if (onFinally) {
                    onFinally();
                }
            }
        },
        [dispatch, thunk, resetOnNewCall, onSuccess, onError, onFinally]
    );

    const reset = useCallback(() => {
        setLocalState({
            data: null,
            loading: false,
            error: null,
            success: false,
            called: false,
        });
    }, []);

    return {
        execute,
        reset,
        state: {
            ...localState,
        },
    };
}

// Utility hook for simple GET requests
export function useApiGet<TReturn = unknown>(
    thunk: AsyncThunk<TReturn, void, object>,
    options: UseApiOptions<TReturn> = {}
) {
    const apiHook = useApi<void, TReturn>(thunk, options);

    const fetch = useCallback(() => {
        return apiHook.execute();
    }, [apiHook]);

    return {
        ...apiHook,
        fetch,
    };
}

// Utility hook for mutation operations (POST, PUT, DELETE)
export function useApiMutation<TArgs = any, TReturn = unknown>(
    thunk: AsyncThunk<TReturn, TArgs, object>,
    options: UseApiOptions<TReturn> = {}
) {
    const apiHook = useApi<TArgs, TReturn>(thunk, {
        resetOnNewCall: true,
        ...options,
    });

    const mutate = useCallback(
        (args: TArgs) => {
            return apiHook.execute(args);
        },
        [apiHook]
    );

    return {
        ...apiHook,
        mutate,
    };
}

// Hook for handling multiple API calls
export function useApiMultiple<T extends Record<string, AsyncThunk<any, any, object>>>(
    thunks: T,
    options: Partial<Record<keyof T, UseApiOptions>> = {}
) {
    const dispatch = useAppDispatch();

    const [states, setStates] = useState<Record<keyof T, ApiCallState>>(() => {
        const initialStates = {} as Record<keyof T, ApiCallState>;
        Object.keys(thunks).forEach((key) => {
            initialStates[key as keyof T] = {
                data: null,
                loading: false,
                error: null,
                success: false,
                called: false,
            };
        });
        return initialStates;
    });

    const execute = useCallback(
        async <K extends keyof T>(key: K, args: Parameters<T[K]>[0]): Promise<any> => {
            const thunk = thunks[key];
            const option = options[key] || {};

            try {
                setStates((prev) => ({
                    ...prev,
                    [key]: {
                        ...prev[key],
                        loading: true,
                        error: null,
                        called: true,
                    },
                }));

                const result = await dispatch(thunk(args)).unwrap();

                setStates((prev) => ({
                    ...prev,
                    [key]: {
                        ...prev[key],
                        data: result,
                        loading: false,
                        success: true,
                        error: null,
                    },
                }));

                if (option.onSuccess) {
                    option.onSuccess(result);
                }

                return result;
            } catch (error: any) {
                setStates((prev) => ({
                    ...prev,
                    [key]: {
                        ...prev[key],
                        loading: false,
                        error: error,
                        success: false,
                    },
                }));

                if (option.onError) {
                    option.onError(error);
                }

                throw error;
            } finally {
                if (option.onFinally) {
                    option.onFinally();
                }
            }
        },
        [dispatch, thunks, options]
    );

    const reset = useCallback(
        (key?: keyof T) => {
            if (key) {
                setStates((prev) => ({
                    ...prev,
                    [key]: {
                        data: null,
                        loading: false,
                        error: null,
                        success: false,
                        called: false,
                    },
                }));
            } else {
                const resetStates = {} as Record<keyof T, ApiCallState>;
                Object.keys(thunks).forEach((k) => {
                    resetStates[k as keyof T] = {
                        data: null,
                        loading: false,
                        error: null,
                        success: false,
                        called: false,
                    };
                });
                setStates(resetStates);
            }
        },
        [thunks]
    );

    return {
        execute,
        reset,
        states,
    };
}

export default useApi;
