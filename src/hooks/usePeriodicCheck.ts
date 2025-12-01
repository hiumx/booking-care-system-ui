import { useEffect } from 'react';

interface UsePeriodicCheckProps {
    isHeld: boolean;
    checkIntervalRef: React.MutableRefObject<NodeJS.Timeout | null>;
    checkCallback: () => Promise<void>;
}

/**
 * Hook to setup periodic checking with server (every 30 seconds)
 * Extracted from useHoldSlot and useSpecialtyHoldSlot to avoid duplication
 */
export const usePeriodicCheck = ({
    isHeld,
    checkIntervalRef,
    checkCallback,
}: UsePeriodicCheckProps) => {
    useEffect(() => {
        if (isHeld) {
            checkIntervalRef.current = setInterval(checkCallback, 30000);
        } else if (checkIntervalRef.current) {
            clearInterval(checkIntervalRef.current);
            checkIntervalRef.current = null;
        }

        return () => {
            if (checkIntervalRef.current) {
                clearInterval(checkIntervalRef.current);
            }
        };
    }, [isHeld, checkCallback, checkIntervalRef]);
};
