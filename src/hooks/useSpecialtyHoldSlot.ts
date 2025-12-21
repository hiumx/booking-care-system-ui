import { useState, useCallback } from 'react';
import { HoldSlotService } from '@/services/holdSlot.service';
import { AppointmentTime } from '@/enums/appointment.enums';
import { useBaseHoldSlot } from './useBaseHoldSlot';
import { usePeriodicCheck } from './usePeriodicCheck';
import { executeHoldSlot } from './useHoldSlotShared';

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
        stopCountdown: baseStopCountdown,
        resetHoldSlotState,
        setLoading,
        setError,
        checkIntervalRef,
    } = useBaseHoldSlot({ onSlotExpired });

    const [currentHeldSlot, setCurrentHeldSlot] = useState<CurrentHeldSpecialtySlot | null>(null);

    // Full reset (stop countdown + reset state + clear slot)
    const fullReset = useCallback(() => {
        resetHoldSlotState();
        setCurrentHeldSlot(null);
    }, [resetHoldSlotState]);

    // Release current held slot (API call + full reset)
    const releaseSlot = useCallback(async () => {
        if (!currentHeldSlot) return;

        try {
            await HoldSlotService.releaseSpecialtySlot({
                hospitalId: currentHeldSlot.hospitalId,
                specialtyId: currentHeldSlot.specialtyId,
                date: currentHeldSlot.date,
                appointmentTimeId: currentHeldSlot.appointmentTimeId,
            });

            fullReset();
        } catch (error: any) {
            console.error('Error releasing specialty slot:', error);
            fullReset();
        }
    }, [currentHeldSlot, fullReset]);

    // Release slot via API only (no state reset - used when switching slots)
    const releaseSlotApiOnly = useCallback(async () => {
        if (!currentHeldSlot) return;

        try {
            await HoldSlotService.releaseSpecialtySlot({
                hospitalId: currentHeldSlot.hospitalId,
                specialtyId: currentHeldSlot.specialtyId,
                date: currentHeldSlot.date,
                appointmentTimeId: currentHeldSlot.appointmentTimeId,
            });
        } catch (error: any) {
            console.error('Error releasing specialty slot (API only):', error);
        }
    }, [currentHeldSlot]);

    // Hold a specialty slot
    const holdSlot = useCallback(
        async (
            hospitalId: string,
            specialtyId: string,
            date: string,
            appointmentTimeId: AppointmentTime,
            maxCapacity: number
        ): Promise<boolean> => {
            return executeHoldSlot<CurrentHeldSpecialtySlot>({
                currentHeldSlot,
                setCurrentHeldSlot,
                setHoldSlotState,
                startCountdown,
                stopCountdown: baseStopCountdown,
                setLoading,
                setError,
                releaseSlotApi: releaseSlotApiOnly,
                executeHoldRequest: () =>
                    HoldSlotService.holdSpecialtySlot({
                        hospitalId,
                        specialtyId,
                        date,
                        appointmentTimeId,
                        maxCapacity,
                    }),
                buildSlot: () => ({
                    hospitalId,
                    specialtyId,
                    date,
                    appointmentTimeId,
                    maxCapacity,
                }),
            });
        },
        [
            currentHeldSlot,
            setCurrentHeldSlot,
            setHoldSlotState,
            startCountdown,
            baseStopCountdown,
            setLoading,
            setError,
            releaseSlotApiOnly,
        ]
    );

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
                fullReset();
            } else {
                setHoldSlotState((prev) => ({
                    ...prev,
                    remainingSeconds,
                }));
            }
        } catch (error) {
            console.error('Error checking remaining time:', error);
        }
    }, [currentHeldSlot, fullReset, setHoldSlotState]);

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
