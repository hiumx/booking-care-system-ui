import i18n from '@/i18n';

/**
 * Translate API error code to localized message
 * @param errorCode - Error code(s) from backend (string or array)
 * @param fallbackMessage - Fallback message if translation not found
 * @returns Translated error message
 */
export const translateApiError = (
    errorCode: string | string[] | undefined,
    fallbackMessage?: string
): string => {
    if (!errorCode || (Array.isArray(errorCode) && errorCode.length === 0)) {
        return i18n.t('errors:api.UNKNOWN_ERROR');
    }

    // If array, take the first error code
    const code = Array.isArray(errorCode) ? errorCode[0] : errorCode;

    const translationKey = `errors:api.${code}`;
    const translated = i18n.t(translationKey);

    // If translation key not found, i18next returns the key itself
    if (translated === translationKey) {
        // Use fallback message or default error
        return fallbackMessage || i18n.t('errors:api.UNKNOWN_ERROR');
    }

    return translated;
};

/**
 * Handle API response and show appropriate error message
 * @param response - API response object
 * @param showToast - Function to show toast notification
 */
export const handleApiError = (
    response: {
        success: boolean;
        errorCode?: string;
        message?: string;
    },
    showToast?: (message: string, type: 'error' | 'success') => void
): void => {
    if (response.success) return;

    const errorMessage = translateApiError(response.errorCode, response.message);

    if (showToast) {
        showToast(errorMessage, 'error');
    }
};

/**
 * Get validation error message
 * @param validationCode - Validation error code
 * @returns Translated validation message
 */
export const translateValidationError = (validationCode: string): string => {
    const translationKey = `errors:validation.${validationCode}`;
    const translated = i18n.t(translationKey);

    if (translated === translationKey) {
        return i18n.t('errors:validation.REQUIRED_FIELD');
    }

    return translated;
};

/**
 * Translate all error codes from array to localized messages
 * @param errorCodes - Array of error codes from backend
 * @param fallbackMessage - Fallback message if no translations found
 * @returns Joined translated error messages
 */
export const translateAllApiErrors = (
    errorCodes: string[] | undefined,
    fallbackMessage?: string
): string => {
    if (!errorCodes || errorCodes.length === 0) {
        return fallbackMessage || i18n.t('errors:api.UNKNOWN_ERROR');
    }

    const translatedErrors = errorCodes
        .map((code) => {
            const translationKey = `errors:api.${code}`;
            const translated = i18n.t(translationKey);
            // Return translated or original code if not found
            return translated === translationKey ? code : translated;
        })
        .filter((msg) => msg); // Remove empty strings

    return translatedErrors.join('. ') || fallbackMessage || i18n.t('errors:api.UNKNOWN_ERROR');
};

/**
 * Handle axios/fetch errors
 */
export const handleNetworkError = (error: any): string => {
    if (error.response) {
        // Server responded with error status
        const errorCode = error.response.data?.errorCode || error.response.data?.errors;
        const message = error.response.data?.message;
        return translateApiError(errorCode, message);
    } else if (error.request) {
        // Request made but no response
        return i18n.t('errors:api.NETWORK_ERROR');
    } else {
        // Something else happened
        return i18n.t('errors:api.UNKNOWN_ERROR');
    }
};
