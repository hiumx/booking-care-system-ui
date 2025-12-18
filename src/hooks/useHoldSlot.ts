import { useState, useCallback } from 'react';
import { HoldSlotService } from '@/services/holdSlot.service';
import { HoldSlotTargetType } from '@/types/holdSlot.types';
import { AppointmentTime } from '@/enums/appointment.enums';
import { toast } from 'react-toastify';
import { useBaseHoldSlot } from './useBaseHoldSlot';
import { usePeriodicCheck } from './usePeriodicCheck';
import { executeHoldSlot } from './useHoldSlotShared';

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
    const {
        holdSlotState,
        setHoldSlotState,
        startCountdown,
        resetHoldSlotState,
        setLoading,
        setError,
        checkIntervalRef,
    } = useBaseHoldSlot({ onSlotExpired });

    const [currentHeldSlot, setCurrentHeldSlot] = useState<{
        targetId: string;
        targetType: HoldSlotTargetType;
        date: string;
        appointmentTimeId: AppointmentTime;
    } | null>(null);

    // Stop countdown timer
    const stopCountdown = useCallback(() => {
        resetHoldSlotState();
        setCurrentHeldSlot(null);
    }, [resetHoldSlotState]);

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
        } catch (error: any) {
            console.error('Error releasing slot:', error);
            // Still stop countdown even if API call fails
            stopCountdown();
        }
    }, [currentHeldSlot, stopCountdown]);

    // Hold a slot
    const holdSlot = useCallback(
        async (
            targetId: string,
            targetType: HoldSlotTargetType,
            targetDate: string,
            appointmentTimeId: AppointmentTime
        ): Promise<boolean> => {
            return executeHoldSlot({
                currentHeldSlot,
                setCurrentHeldSlot,
                setHoldSlotState,
                startCountdown,
                setLoading,
                setError,
                releaseExistingSlot: releaseSlot,
                executeHoldRequest: () =>
                    HoldSlotService.holdSlot({
                        targetId,
                        targetType,
                        date: targetDate,
                        appointmentTimeId,
                    }),
                buildSlot: () => ({
                    targetId,
                    targetType,
                    date: targetDate,
                    appointmentTimeId,
                }),
            });
        },
        [
            currentHeldSlot,
            setCurrentHeldSlot,
            setHoldSlotState,
            startCountdown,
            setLoading,
            setError,
            releaseSlot,
        ]
    );

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
    usePeriodicCheck({
        isHeld: holdSlotState.isHeld && !!currentHeldSlot,
        checkIntervalRef,
        checkCallback: checkRemainingTime,
    });

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
