import { useState, useEffect, useCallback, useRef } from 'react';
import { HoldSlotService } from '@/services/holdSlot.service';
import { AppointmentTime } from '@/enums/appointment.enums';
import { toast } from 'react-toastify';

interface SpecialtyHoldSlotState {
    isHeld: boolean;
    remainingSeconds: number;
    isLoading: boolean;
    error: string | null;
}

interface UseSpecialtyHoldSlotProps {
    hospitalId?: string;
    specialtyId?: string;
    date?: string;
    onSlotExpired?: () => void;
}

interface CurrentHeldSpecialtySlot {
    hospitalId: string;
    specialtyId: string;
    date: string;
    appointmentTimeId: AppointmentTime;
    maxCapacity: number;
}

interface UseSpecialtyHoldSlotReturn {
    isHeld: boolean;
    remainingSeconds: number;
    isLoading: boolean;
    error: string | null;
    currentHeldSlot: CurrentHeldSpecialtySlot | null;
    holdSlot: (
        hospitalId: string,
        specialtyId: string,
        date: string,
        appointmentTimeId: AppointmentTime,
        maxCapacity: number
    ) => Promise<boolean>;
    releaseSlot: () => Promise<void>;
    restoreHeldSlot: (
        hospitalId: string,
        specialtyId: string,
        date: string,
        appointmentTimeId: AppointmentTime,
        maxCapacity: number,
        remainingSeconds: number
    ) => void;
}

/**
 * Hook for managing specialty hold slots (for "hospital assigns doctor" mode)
 * Similar to useHoldSlot but handles specialty-specific logic with capacity
 */
export const useSpecialtyHoldSlot = ({
    onSlotExpired,
}: UseSpecialtyHoldSlotProps = {}): UseSpecialtyHoldSlotReturn => {
    const [holdSlotState, setHoldSlotState] = useState<SpecialtyHoldSlotState>({
        isHeld: false,
        remainingSeconds: 0,
        isLoading: false,
        error: null,
    });

    const [currentHeldSlot, setCurrentHeldSlot] = useState<CurrentHeldSpecialtySlot | null>(null);

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
                const newSeconds = prev.remainingSeconds - 1;

                if (newSeconds <= 0) {
                    if (countdownIntervalRef.current) {
                        clearInterval(countdownIntervalRef.current);
                        countdownIntervalRef.current = null;
                    }

                    setCurrentHeldSlot(null);

                    if (!hasNotifiedExpirationRef.current) {
                        hasNotifiedExpirationRef.current = true;
                        onSlotExpiredRef.current?.();
                    }

                    return {
                        ...prev,
                        isHeld: false,
                        remainingSeconds: 0,
                    };
                }

                return {
                    ...prev,
                    remainingSeconds: newSeconds,
                };
            });
        }, 1000);
    }, []);

    // Stop countdown timer
    const stopCountdown = useCallback(() => {
        if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
            countdownIntervalRef.current = null;
        }

        setHoldSlotState((prev) => ({
            ...prev,
            isHeld: false,
            remainingSeconds: 0,
        }));

        setCurrentHeldSlot(null);
    }, []);

    // Hold a specialty slot
    const holdSlot = useCallback(
        async (
            hospitalId: string,
            specialtyId: string,
            date: string,
            appointmentTimeId: AppointmentTime,
            maxCapacity: number
        ): Promise<boolean> => {
            setHoldSlotState((prev) => ({ ...prev, isLoading: true, error: null }));

            try {
                // Release any existing held slot first
                if (currentHeldSlot) {
                    await releaseSlot();
                }

                const response = await HoldSlotService.holdSpecialtySlot({
                    hospitalId,
                    specialtyId,
                    date,
                    appointmentTimeId,
                    maxCapacity,
                });

                if (response.success) {
                    setCurrentHeldSlot({
                        hospitalId,
                        specialtyId,
                        date,
                        appointmentTimeId,
                        maxCapacity,
                    });

                    setHoldSlotState((prev) => ({
                        ...prev,
                        isHeld: true,
                        isLoading: false,
                        error: null,
                    }));

                    startCountdown(response.remainingSeconds);
                    toast.success(response.message);
                    return true;
                } else {
                    setHoldSlotState((prev) => ({
                        ...prev,
                        isLoading: false,
                        error: response.message,
                    }));
                    toast.error(response.message);
                    return false;
                }
            } catch (error: any) {
                const errorMessage = error.message || 'Không thể giữ chỗ';
                setHoldSlotState((prev) => ({
                    ...prev,
                    isLoading: false,
                    error: errorMessage,
                }));
                toast.error(errorMessage);
                return false;
            }
        },
        [currentHeldSlot, startCountdown]
    );

    // Release current held slot
    const releaseSlot = useCallback(async () => {
        if (!currentHeldSlot) return;

        try {
            await HoldSlotService.releaseSpecialtySlot({
                hospitalId: currentHeldSlot.hospitalId,
                specialtyId: currentHeldSlot.specialtyId,
                date: currentHeldSlot.date,
                appointmentTimeId: currentHeldSlot.appointmentTimeId,
            });

            stopCountdown();
            toast.info('Đã hủy giữ chỗ');
        } catch (error: any) {
            console.error('Error releasing specialty slot:', error);
            stopCountdown();
        }
    }, [currentHeldSlot, stopCountdown]);

    // Check remaining time for current held slot
    const checkRemainingTime = useCallback(async () => {
        if (!currentHeldSlot) return;

        try {
            const remainingSeconds = await HoldSlotService.getSpecialtyRemainingTime(
                currentHeldSlot.hospitalId,
                currentHeldSlot.specialtyId,
                currentHeldSlot.date,
                currentHeldSlot.appointmentTimeId
            );

            if (remainingSeconds <= 0) {
                stopCountdown();
            } else {
                setHoldSlotState((prev) => ({
                    ...prev,
                    remainingSeconds,
                }));
            }
        } catch (error) {
            console.error('Error checking remaining time:', error);
        }
    }, [currentHeldSlot, stopCountdown]);

    // Periodically check remaining time with server (every 30 seconds)
    useEffect(() => {
        if (holdSlotState.isHeld && currentHeldSlot) {
            checkIntervalRef.current = setInterval(checkRemainingTime, 30000);
        } else if (checkIntervalRef.current) {
            clearInterval(checkIntervalRef.current);
            checkIntervalRef.current = null;
        }

        return () => {
            if (checkIntervalRef.current) {
                clearInterval(checkIntervalRef.current);
            }
        };
    }, [holdSlotState.isHeld, currentHeldSlot, checkRemainingTime]);

    // Restore held slot state (for when user navigates back)
    const restoreHeldSlot = useCallback(
        (
            hospitalId: string,
            specialtyId: string,
            date: string,
            appointmentTimeId: AppointmentTime,
            maxCapacity: number,
            remainingSeconds: number
        ) => {
            setCurrentHeldSlot({
                hospitalId,
                specialtyId,
                date,
                appointmentTimeId,
                maxCapacity,
            });

            setHoldSlotState((prev) => ({
                ...prev,
                isHeld: true,
                isLoading: false,
                error: null,
            }));

            startCountdown(remainingSeconds);
        },
        [startCountdown]
    );

    return {
        isHeld: holdSlotState.isHeld,
        remainingSeconds: holdSlotState.remainingSeconds,
        isLoading: holdSlotState.isLoading,
        error: holdSlotState.error,
        currentHeldSlot,
        holdSlot,
        releaseSlot,
        restoreHeldSlot,
    };
};
