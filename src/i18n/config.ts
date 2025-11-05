import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import commonVi from './locales/vi/common.json';
import commonEn from './locales/en/common.json';
import bookingVi from './locales/vi/booking.json';
import bookingEn from './locales/en/booking.json';
import authVi from './locales/vi/auth.json';
import authEn from './locales/en/auth.json';
import errorsVi from './locales/vi/errors.json';
import errorsEn from './locales/en/errors.json';
import userProfileVi from './locales/vi/userProfile.json';
import userProfileEn from './locales/en/userProfile.json';

// Define resources
const resources = {
    vi: {
        common: commonVi,
        booking: bookingVi,
        auth: authVi,
        errors: errorsVi,
        userProfile: userProfileVi,
    },
    en: {
        common: commonEn,
        booking: bookingEn,
        auth: authEn,
        errors: errorsEn,
        userProfile: userProfileEn,
    },
};

i18n
    // Use language detector
    .use(LanguageDetector)
    // Pass the i18n instance to react-i18next
    .use(initReactI18next)
    // Initialize i18next
    .init({
        resources,
        fallbackLng: 'vi', // Default language is Vietnamese
        defaultNS: 'common',
        ns: ['common', 'booking', 'auth', 'errors', 'userProfile'],

        // Language detection configuration
        detection: {
            order: ['localStorage', 'navigator', 'htmlTag'],
            caches: ['localStorage'],
            lookupLocalStorage: 'i18nextLng',
        },

        interpolation: {
            escapeValue: false, // React already escapes values
        },

        // Debug mode in development
        debug: import.meta.env.DEV,

        react: {
            useSuspense: false,
        },
    });

export default i18n;
