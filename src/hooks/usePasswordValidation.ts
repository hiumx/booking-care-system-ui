import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { PASSWORD_REGEX, PASSWORD_MIN_LENGTH } from '@/constants';

interface PasswordRequirements {
    hasMinLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumber: boolean;
    hasSpecialChar: boolean;
    allMet: boolean;
}

interface PasswordStrength {
    score: number;
    label: string;
    color: string;
    width: number;
}

interface UsePasswordValidationOptions {
    password: string;
    translationKey?: string;
    translationPrefix?: 'resetPassword' | 'register';
}

/**
 * Custom hook for password validation and strength calculation
 * Provides password requirements validation and strength calculation
 */
export const usePasswordValidation = ({
    password,
    translationKey = 'auth',
    translationPrefix = 'resetPassword',
}: UsePasswordValidationOptions) => {
    const { t } = useTranslation(translationKey);

    // Password requirements validation
    const passwordRequirements = useMemo<PasswordRequirements>(() => {
        const hasMinLength = password.length >= PASSWORD_MIN_LENGTH;
        const hasUppercase = PASSWORD_REGEX.UPPERCASE.test(password);
        const hasLowercase = PASSWORD_REGEX.LOWERCASE.test(password);
        const hasNumber = PASSWORD_REGEX.DIGIT.test(password);
        const hasSpecialChar = PASSWORD_REGEX.SPECIAL_CHAR.test(password);

        return {
            hasMinLength,
            hasUppercase,
            hasLowercase,
            hasNumber,
            hasSpecialChar,
            allMet: hasMinLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar,
        };
    }, [password]);

    // Password strength calculation
    const passwordStrength = useMemo<PasswordStrength>(() => {
        if (!password) return { score: 0, label: '', color: '', width: 0 };

        let score = 0;
        if (passwordRequirements.hasMinLength) score += 20;
        if (passwordRequirements.hasUppercase) score += 20;
        if (passwordRequirements.hasLowercase) score += 20;
        if (passwordRequirements.hasNumber) score += 20;
        if (passwordRequirements.hasSpecialChar) score += 20;

        if (score <= 20)
            return {
                score,
                label: t(`${translationPrefix}.passwordWeak`),
                color: '#ef4444',
                width: 20,
            };
        if (score <= 40)
            return {
                score,
                label: t(`${translationPrefix}.passwordFair`),
                color: '#f59e0b',
                width: 40,
            };
        if (score <= 60)
            return {
                score,
                label: t(`${translationPrefix}.passwordGood`),
                color: '#3b82f6',
                width: 60,
            };
        if (score <= 80)
            return {
                score,
                label: t(`${translationPrefix}.passwordStrong`),
                color: '#10b981',
                width: 80,
            };
        return {
            score,
            label: t(`${translationPrefix}.passwordVeryStrong`),
            color: '#059669',
            width: 100,
        };
    }, [password, passwordRequirements, t, translationPrefix]);

    return {
        passwordRequirements,
        passwordStrength,
    };
};
