import { Dispatch, SetStateAction } from 'react';
import { toast } from 'react-toastify';

type HoldSlotState = {
    isHeld: boolean;
    remainingSeconds: number;
    isLoading: boolean;
    error: string | null;
};

interface HoldResponseLike {
    success: boolean;
    message: string;
    remainingSeconds: number;
}

interface ExecuteHoldSlotParams<TSlot> {
    currentHeldSlot: TSlot | null;
    setCurrentHeldSlot: Dispatch<SetStateAction<TSlot | null>>;
    setHoldSlotState: Dispatch<SetStateAction<HoldSlotState>>;
    startCountdown: (seconds: number) => void;
    stopCountdown: () => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    releaseSlotApi: () => Promise<void>;
    executeHoldRequest: () => Promise<HoldResponseLike>;
    buildSlot: () => TSlot;
}

export const executeHoldSlot = async <TSlot>(
    params: ExecuteHoldSlotParams<TSlot>
): Promise<boolean> => {
    const {
        currentHeldSlot,
        setCurrentHeldSlot,
        setHoldSlotState,
        startCountdown,
        stopCountdown,
        setLoading,
        setError,
        releaseSlotApi,
        executeHoldRequest,
        buildSlot,
    } = params;

    // Track if we're switching slots (to avoid flicker)
    const isSwitchingSlots = !!currentHeldSlot;

    setLoading(true);
    setError(null);

    try {
        if (currentHeldSlot) {
            // Stop countdown but don't reset isHeld state to avoid UI flicker
            stopCountdown();
            // Release existing slot via API only (don't reset UI state)
            await releaseSlotApi();
        }

        const response = await executeHoldRequest();

        if (response.success) {
            setCurrentHeldSlot(buildSlot());

            // Set isHeld and remainingSeconds in one update to avoid flicker
            setHoldSlotState((prev) => ({
                ...prev,
                isHeld: true,
                isLoading: false,
                error: null,
                remainingSeconds: response.remainingSeconds,
            }));

            startCountdown(response.remainingSeconds);

            return true;
        }

        // Only reset isHeld if we weren't switching slots
        setHoldSlotState((prev) => ({
            ...prev,
            isHeld: isSwitchingSlots ? prev.isHeld : false,
            isLoading: false,
            error: response.message,
        }));
        toast.error(response.message);
        return false;
    } catch (error: any) {
        const errorMessage = error?.message || 'Không thể giữ chỗ';
        // Only reset isHeld if we weren't switching slots
        setHoldSlotState((prev) => ({
            ...prev,
            isHeld: isSwitchingSlots ? prev.isHeld : false,
            isLoading: false,
            error: errorMessage,
        }));
        toast.error(errorMessage);
        return false;
    }
};
