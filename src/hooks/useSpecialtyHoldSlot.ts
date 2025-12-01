import { useState, useCallback } from 'react';
import { HoldSlotService } from '@/services/holdSlot.service';
import { AppointmentTime } from '@/enums/appointment.enums';
import { toast } from 'react-toastify';
import { useBaseHoldSlot } from './useBaseHoldSlot';
import { usePeriodicCheck } from './usePeriodicCheck';

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
    const {
        holdSlotState,
        setHoldSlotState,
        startCountdown,
        resetHoldSlotState,
        setLoading,
        setError,
        checkIntervalRef,
    } = useBaseHoldSlot({ onSlotExpired });

    const [currentHeldSlot, setCurrentHeldSlot] = useState<CurrentHeldSpecialtySlot | null>(null);

    // Stop countdown timer
    const stopCountdown = useCallback(() => {
        resetHoldSlotState();
        setCurrentHeldSlot(null);
    }, [resetHoldSlotState]);

    // Hold a specialty slot
    const holdSlot = useCallback(
        async (
            hospitalId: string,
            specialtyId: string,
            date: string,
            appointmentTimeId: AppointmentTime,
            maxCapacity: number
        ): Promise<boolean> => {
            setLoading(true);
            setError(null);

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
                    setLoading(false);
                    setError(response.message);
                    toast.error(response.message);
                    return false;
                }
            } catch (error: any) {
                const errorMessage = error.message || 'Không thể giữ chỗ';
                setLoading(false);
                setError(errorMessage);
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
    usePeriodicCheck({
        isHeld: holdSlotState.isHeld && !!currentHeldSlot,
        checkIntervalRef,
        checkCallback: checkRemainingTime,
    });

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
