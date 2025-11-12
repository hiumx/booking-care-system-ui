import { useState, useRef, useCallback, useMemo } from 'react';
import { OTP_REGEX } from '@/constants';

interface UseOtpInputOptions {
    length?: number;
}

/**
 * Custom hook for OTP input handling
 * Provides OTP state management and input handlers
 */
export const useOtpInput = ({ length = 6 }: UseOtpInputOptions = {}) => {
    const [otp, setOtp] = useState<string[]>(Array(length).fill(''));
    const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

    const otpValue = useMemo(() => otp.join(''), [otp]);

    const canVerifyOtp = useMemo(
        () => otpValue.length === length && OTP_REGEX.SIX_DIGITS.test(otpValue),
        [otpValue, length]
    );

    const handleOtpChange = useCallback(
        (index: number, value: string) => {
            if (!OTP_REGEX.SINGLE_DIGIT.test(value)) return;

            setOtp((prev) => {
                const next = [...prev];
                next[index] = value;
                return next;
            });

            // Auto focus next input
            if (value && index < length - 1) {
                otpRefs.current[index + 1]?.focus();
            }
        },
        [length]
    );

    const handleOtpKeyDown = useCallback(
        (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Backspace' && !otp[index] && index > 0) {
                otpRefs.current[index - 1]?.focus();
            }
        },
        [otp]
    );

    const resetOtp = useCallback(() => {
        setOtp(Array(length).fill(''));
    }, [length]);

    return {
        otp,
        otpValue,
        otpRefs,
        canVerifyOtp,
        handleOtpChange,
        handleOtpKeyDown,
        resetOtp,
        setOtp,
    };
};
