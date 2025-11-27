import { useState, useEffect, useCallback, useRef } from 'react';
import { HoldSlotService } from '@/services/holdSlot.service';
import { HoldSlotTargetType } from '@/types/holdSlot.types';
import { AppointmentTime } from '@/enums/appointment.enums';
import { toast } from 'react-toastify';

interface HoldSlotState {
    isHeld: boolean;
    remainingSeconds: number;
    isLoading: boolean;
    error: string | null;
}

interface UseHoldSlotProps {
    targetId?: string; // Can be doctorId or serviceMedicalId
    targetType?: HoldSlotTargetType;
    date?: string;
    onSlotExpired?: () => void;
}

interface UseHoldSlotReturn {
    isHeld: boolean;
    remainingSeconds: number;
    isLoading: boolean;
    error: string | null;
    currentHeldSlot: {
        targetId: string;
        targetType: HoldSlotTargetType;
        date: string;
        appointmentTimeId: AppointmentTime;
    } | null;
    holdSlot: (
        targetId: string,
        targetType: HoldSlotTargetType,
        targetDate: string,
        appointmentTimeId: AppointmentTime
    ) => Promise<boolean>;
    releaseSlot: () => Promise<void>;
    releaseAllSlots: () => Promise<void>;
    restoreHeldSlot: (
        targetId: string,
        targetType: HoldSlotTargetType,
        targetDate: string,
        appointmentTimeId: AppointmentTime,
        remainingSeconds: number
    ) => void;
}

export const useHoldSlot = ({
    targetId: _targetId,
    targetType: _targetType = HoldSlotTargetType.Doctor,
    date: _date,
    onSlotExpired,
}: UseHoldSlotProps = {}): UseHoldSlotReturn => {
    const [holdSlotState, setHoldSlotState] = useState<HoldSlotState>({
        isHeld: false,
        remainingSeconds: 0,
        isLoading: false,
        error: null,
    });

    const [currentHeldSlot, setCurrentHeldSlot] = useState<{
        targetId: string;
        targetType: HoldSlotTargetType;
        date: string;
        appointmentTimeId: AppointmentTime;
    } | null>(null);

    const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const hasNotifiedExpirationRef = useRef(false); // Prevent double expiration notification
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
    const startCountdown = useCallback(
        (initialSeconds: number) => {
            // Reset expiration notification flag for new countdown
            hasNotifiedExpirationRef.current = false;

            setHoldSlotState((prev) => ({
                ...prev,
                remainingSeconds: initialSeconds,
            }));

            // Clear existing interval
            if (countdownIntervalRef.current) {
                clearInterval(countdownIntervalRef.current);
            }

            countdownIntervalRef.current = setInterval(() => {
                setHoldSlotState((prev) => {
                    const newSeconds = prev.remainingSeconds - 1;

                    if (newSeconds <= 0) {
                        // Slot expired
                        if (countdownIntervalRef.current) {
                            clearInterval(countdownIntervalRef.current);
                            countdownIntervalRef.current = null;
                        }

                        setCurrentHeldSlot(null);

                        // Only notify once per expiration - double safety check
                        if (!hasNotifiedExpirationRef.current) {
                            hasNotifiedExpirationRef.current = true;
                            // Use ref to get latest callback
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
        },
        [onSlotExpired]
    );

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

    // Hold a slot
    const holdSlot = useCallback(
        async (
            targetId: string,
            targetType: HoldSlotTargetType,
            targetDate: string,
            appointmentTimeId: AppointmentTime
        ): Promise<boolean> => {
            setHoldSlotState((prev) => ({ ...prev, isLoading: true, error: null }));

            try {
                // Release any existing held slot first
                if (currentHeldSlot) {
                    await releaseSlot();
                }

                const response = await HoldSlotService.holdSlot({
                    targetId,
                    targetType,
                    date: targetDate,
                    appointmentTimeId,
                });

                if (response.success) {
                    setCurrentHeldSlot({
                        targetId,
                        targetType,
                        date: targetDate,
                        appointmentTimeId,
                    });

                    setHoldSlotState((prev) => ({
                        ...prev,
                        isHeld: true,
                        isLoading: false,
                        error: null,
                    }));

                    startCountdown(response.remainingSeconds);
                    toast.success(response.message);
                    return true; // Success
                } else {
                    setHoldSlotState((prev) => ({
                        ...prev,
                        isLoading: false,
                        error: response.message,
                    }));
                    toast.error(response.message);
                    return false; // Failed
                }
            } catch (error: any) {
                const errorMessage = error.message || 'Không thể giữ chỗ';
                setHoldSlotState((prev) => ({
                    ...prev,
                    isLoading: false,
                    error: errorMessage,
                }));
                toast.error(errorMessage);
                return false; // Failed
            }
        },
        [currentHeldSlot, startCountdown]
    );

    // Release current held slot
    const releaseSlot = useCallback(async () => {
        if (!currentHeldSlot) return;

        try {
            await HoldSlotService.releaseSlot({
                targetId: currentHeldSlot.targetId,
                targetType: currentHeldSlot.targetType,
                date: currentHeldSlot.date,
                appointmentTimeId: currentHeldSlot.appointmentTimeId,
            });

            stopCountdown();
            toast.info('Đã hủy giữ chỗ');
        } catch (error: any) {
            console.error('Error releasing slot:', error);
            // Still stop countdown even if API call fails
            stopCountdown();
        }
    }, [currentHeldSlot, stopCountdown]);

    // Release all held slots
    const releaseAllSlots = useCallback(async () => {
        try {
            const releasedCount = await HoldSlotService.releaseAllSlots();
            stopCountdown();

            if (releasedCount > 0) {
                toast.info(`Đã hủy ${releasedCount} slot đang giữ`);
            }
        } catch (error: any) {
            console.error('Error releasing all slots:', error);
            toast.error('Không thể hủy tất cả slot đang giữ');
        }
    }, [stopCountdown]);

    // Check remaining time for current held slot
    const checkRemainingTime = useCallback(async () => {
        if (!currentHeldSlot) return;

        try {
            const remainingSeconds = await HoldSlotService.getRemainingTime(
                currentHeldSlot.targetId,
                currentHeldSlot.targetType,
                currentHeldSlot.date,
                currentHeldSlot.appointmentTimeId
            );

            if (remainingSeconds <= 0) {
                // Slot expired on server - just stop countdown
                // Don't call onSlotExpired here as countdown interval will handle it
                stopCountdown();
            } else {
                // Update remaining time
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
            targetId: string,
            targetType: HoldSlotTargetType,
            targetDate: string,
            appointmentTimeId: AppointmentTime,
            remainingSeconds: number
        ) => {
            setCurrentHeldSlot({
                targetId,
                targetType,
                date: targetDate,
                appointmentTimeId,
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
        // State
        isHeld: holdSlotState.isHeld,
        remainingSeconds: holdSlotState.remainingSeconds,
        isLoading: holdSlotState.isLoading,
        error: holdSlotState.error,
        currentHeldSlot,

        // Actions
        holdSlot,
        releaseSlot,
        releaseAllSlots,
        restoreHeldSlot,
    };
};
