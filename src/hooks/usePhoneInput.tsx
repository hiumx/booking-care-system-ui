import { useState, useCallback } from 'react';

/**
 * Custom hook for Vietnamese phone number input validation and handling
 * Provides consistent phone number input behavior across the application
 */
export const usePhoneInput = (initialValue: string = '') => {
    const [phone, setPhone] = useState(initialValue);

    /**
     * Validates and formats Vietnamese phone number
     * Rules: Must start with 0, maximum 10 digits
     */
    const validateAndFormatPhone = useCallback((value: string): string => {
        // Clean any non-numeric characters
        let cleanedValue = value.replace(/[^0-9]/g, '');

        // Vietnamese phone number validation
        if (cleanedValue.length > 0) {
            // If first digit is not 0, prepend 0
            if (cleanedValue[0] !== '0') {
                cleanedValue = '0' + cleanedValue;
            }

            // Limit to 10 digits maximum
            if (cleanedValue.length > 10) {
                cleanedValue = cleanedValue.slice(0, 10);
            }
        }

        return cleanedValue;
    }, []);

    /**
     * Handle phone number input change
     */
    const handlePhoneChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const formattedValue = validateAndFormatPhone(e.target.value);
            setPhone(formattedValue);
        },
        [validateAndFormatPhone]
    );

    /**
     * Handle paste events for phone input
     */
    const handlePhonePaste = useCallback(
        (e: React.ClipboardEvent<HTMLInputElement>) => {
            e.preventDefault();
            const pastedText = e.clipboardData.getData('text');
            const formattedValue = validateAndFormatPhone(pastedText);
            setPhone(formattedValue);
        },
        [validateAndFormatPhone]
    );

    /**
     * Handle key down events to prevent non-numeric input
     */
    const handlePhoneKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            // Allow: backspace, delete, tab, escape, enter, home, end, left, right, and IME process
            if (
                [
                    'Backspace',
                    'Delete',
                    'Tab',
                    'Escape',
                    'Enter',
                    'Home',
                    'End',
                    'ArrowLeft',
                    'ArrowRight',
                    'Process', // Allow IME (Input Method Editor) for Vietnamese/Asian input
                ].includes(e.key)
            ) {
                return;
            }

            // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+Z
            if (e.ctrlKey && ['a', 'c', 'v', 'x', 'z'].includes(e.key.toLowerCase())) {
                return;
            }

            // Block typing if already at 10 digits limit
            if (phone.length >= 10 && /^[0-9]$/.test(e.key)) {
                e.preventDefault();
                return;
            }

            // Allow only numbers (0-9)
            if (!/^[0-9]$/.test(e.key)) {
                e.preventDefault();
            }
        },
        [phone.length]
    );

    /**
     * Validate if phone number is complete and valid
     */
    const isPhoneValid = useCallback(
        (phoneValue?: string): boolean => {
            const valueToCheck = phoneValue || phone;
            return valueToCheck.length === 10 && valueToCheck.startsWith('0');
        },
        [phone]
    );

    /**
     * Reset phone value
     */
    const resetPhone = useCallback(() => {
        setPhone('');
    }, []);

    /**
     * Set phone value programmatically
     */
    const setPhoneValue = useCallback(
        (value: string) => {
            const formattedValue = validateAndFormatPhone(value);
            setPhone(formattedValue);
        },
        [validateAndFormatPhone]
    );

    return {
        // State
        phone,

        // Validation
        isPhoneValid,

        // Event handlers
        handlePhoneChange,
        handlePhonePaste,
        handlePhoneKeyDown,

        // Utilities
        resetPhone,
        setPhoneValue,
        validateAndFormatPhone,
    };
};

export default usePhoneInput;
