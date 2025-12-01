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
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    releaseExistingSlot: () => Promise<void>;
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
        setLoading,
        setError,
        releaseExistingSlot,
        executeHoldRequest,
        buildSlot,
    } = params;

    setLoading(true);
    setError(null);

    try {
        if (currentHeldSlot) {
            await releaseExistingSlot();
        }

        const response = await executeHoldRequest();

        if (response.success) {
            setCurrentHeldSlot(buildSlot());

            setHoldSlotState((prev) => ({
                ...prev,
                isHeld: true,
                isLoading: false,
                error: null,
            }));

            startCountdown(response.remainingSeconds);
            toast.success(response.message);
            return true;
        }

        setLoading(false);
        setError(response.message);
        toast.error(response.message);
        return false;
    } catch (error: any) {
        const errorMessage = error?.message || 'Không thể giữ chỗ';
        setLoading(false);
        setError(errorMessage);
        toast.error(errorMessage);
        return false;
    }
};
