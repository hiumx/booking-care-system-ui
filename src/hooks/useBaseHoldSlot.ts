import { useState, useEffect, useCallback, useRef } from 'react';

interface BaseHoldSlotState {
    isHeld: boolean;
    remainingSeconds: number;
    isLoading: boolean;
    error: string | null;
}

interface UseBaseHoldSlotProps {
    onSlotExpired?: () => void;
}

/**
 * Base hook for managing hold slot countdown and intervals
 * Extracted common logic from useHoldSlot and useSpecialtyHoldSlot
 */
export const useBaseHoldSlot = ({ onSlotExpired }: UseBaseHoldSlotProps = {}) => {
    const [holdSlotState, setHoldSlotState] = useState<BaseHoldSlotState>({
        isHeld: false,
        remainingSeconds: 0,
        isLoading: false,
        error: null,
    });

    const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const hasNotifiedExpirationRef = useRef(false);
    const onSlotExpiredRef = useRef(onSlotExpired);

    // Keep onSlotExpired ref updated
    useEffect(() => {
        onSlotExpiredRef.current = onSlotExpired;
    }, [onSlotExpired]);

    // Clear all intervals on unmount
    useEffect(() => {
        return () => {
            if (countdownIntervalRef.current) {
                clearInterval(countdownIntervalRef.current);
            }
            if (checkIntervalRef.current) {
                clearInterval(checkIntervalRef.current);
            }
        };
    }, []);

    // Start countdown timer
    const startCountdown = useCallback((initialSeconds: number) => {
        hasNotifiedExpirationRef.current = false;

        setHoldSlotState((prev) => ({
            ...prev,
            remainingSeconds: initialSeconds,
        }));

        if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
        }

        countdownIntervalRef.current = setInterval(() => {
            setHoldSlotState((prev) => {
                const newRemaining = prev.remainingSeconds - 1;

                if (newRemaining <= 0) {
                    if (countdownIntervalRef.current) {
                        clearInterval(countdownIntervalRef.current);
                    }

                    // Notify expiration only once
                    if (!hasNotifiedExpirationRef.current && onSlotExpiredRef.current) {
                        hasNotifiedExpirationRef.current = true;
                        onSlotExpiredRef.current();
                    }

                    return {
                        ...prev,
                        isHeld: false,
                        remainingSeconds: 0,
                    };
                }

                return {
                    ...prev,
                    remainingSeconds: newRemaining,
                };
            });
        }, 1000);
    }, []);

    // Stop countdown
    const stopCountdown = useCallback(() => {
        if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
            countdownIntervalRef.current = null;
        }
    }, []);

    // Reset hold slot state
    const resetHoldSlotState = useCallback(() => {
        setHoldSlotState({
            isHeld: false,
            remainingSeconds: 0,
            isLoading: false,
            error: null,
        });
        stopCountdown();
    }, [stopCountdown]);

    // Set loading state
    const setLoading = useCallback((isLoading: boolean) => {
        setHoldSlotState((prev) => ({ ...prev, isLoading }));
    }, []);

    // Set error state
    const setError = useCallback((error: string | null) => {
        setHoldSlotState((prev) => ({ ...prev, error }));
    }, []);

    // Set held state
    const setHeld = useCallback((isHeld: boolean) => {
        setHoldSlotState((prev) => ({ ...prev, isHeld }));
    }, []);

    return {
        holdSlotState,
        setHoldSlotState,
        startCountdown,
        stopCountdown,
        resetHoldSlotState,
        setLoading,
        setError,
        setHeld,
        countdownIntervalRef,
        checkIntervalRef,
        hasNotifiedExpirationRef,
    };
};
