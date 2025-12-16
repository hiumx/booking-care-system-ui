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
import homeVi from './locales/vi/home.json';
import homeEn from './locales/en/home.json';
import headerVi from './locales/vi/header.json';
import headerEn from './locales/en/header.json';
import legalNoticeVi from './locales/vi/legalNotice.json';
import legalNoticeEn from './locales/en/legalNotice.json';
import privacyPolicyVi from './locales/vi/privacyPolicy.json';
import privacyPolicyEn from './locales/en/privacyPolicy.json';
import refundPolicyVi from './locales/vi/refundPolicy.json';
import refundPolicyEn from './locales/en/refundPolicy.json';
import chatVi from './locales/vi/chat.json';
import chatEn from './locales/en/chat.json';
import doctorVi from './locales/vi/doctor.json';
import doctorEn from './locales/en/doctor.json';
import hospitalVi from './locales/vi/hospital.json';
import hospitalEn from './locales/en/hospital.json';
import aiSupportVi from './locales/vi/aiSupport.json';
import aiSupportEn from './locales/en/aiSupport.json';

// Define resources
const resources = {
    vi: {
        common: commonVi,
        booking: bookingVi,
        auth: authVi,
        errors: errorsVi,
        userProfile: userProfileVi,
        home: homeVi,
        header: headerVi,
        legalNotice: legalNoticeVi,
        privacyPolicy: privacyPolicyVi,
        refundPolicy: refundPolicyVi,
        chat: chatVi,
        doctor: doctorVi,
        hospital: hospitalVi,
        aiSupport: aiSupportVi,
    },
    en: {
        common: commonEn,
        booking: bookingEn,
        auth: authEn,
        errors: errorsEn,
        userProfile: userProfileEn,
        home: homeEn,
        header: headerEn,
        legalNotice: legalNoticeEn,
        privacyPolicy: privacyPolicyEn,
        refundPolicy: refundPolicyEn,
        chat: chatEn,
        doctor: doctorEn,
        hospital: hospitalEn,
        aiSupport: aiSupportEn,
    },
};

// Initialize and configure i18n
const configuredI18n = i18n
    // Use language detector
    .use(LanguageDetector)
    // Pass the i18n instance to react-i18next
    .use(initReactI18next);

configuredI18n.init({
    resources,
    fallbackLng: 'vi', // Default language is Vietnamese
    defaultNS: 'common',
    ns: [
        'common',
        'booking',
        'auth',
        'errors',
        'userProfile',
        'home',
        'header',
        'legalNotice',
        'privacyPolicy',
        'refundPolicy',
        'chat',
        'doctor',
        'hospital',
        'aiSupport',
    ],

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

export default configuredI18n;
