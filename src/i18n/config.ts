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
import contactVi from './locales/vi/contact.json';
import contactEn from './locales/en/contact.json';
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
import aboutVi from './locales/vi/about.json';
import aboutEn from './locales/en/about.json';
import contractSigningVi from './locales/vi/contractSigning.json';
import contractSigningEn from './locales/en/contractSigning.json';
import specialtyVi from './locales/vi/specialty.json';
import specialtyEn from './locales/en/specialty.json';
import termsOfServiceVi from './locales/vi/termsOfService.json';
import termsOfServiceEn from './locales/en/termsOfService.json';
import nutritionVi from './locales/vi/nutrition.json';
import nutritionEn from './locales/en/nutrition.json';

// Define resources
const resources = {
    vi: {
        common: commonVi,
        booking: bookingVi,
        auth: authVi,
        errors: errorsVi,
        userProfile: userProfileVi,
        home: homeVi,
        contact: contactVi,
        header: headerVi,
        legalNotice: legalNoticeVi,
        privacyPolicy: privacyPolicyVi,
        refundPolicy: refundPolicyVi,
        chat: chatVi,
        doctor: doctorVi,
        hospital: hospitalVi,
        aiSupport: aiSupportVi,
        about: aboutVi,
        contractSigning: contractSigningVi,
        specialty: specialtyVi,
        termsOfService: termsOfServiceVi,
        nutrition: nutritionVi,
    },
    en: {
        common: commonEn,
        booking: bookingEn,
        auth: authEn,
        errors: errorsEn,
        userProfile: userProfileEn,
        home: homeEn,
        contact: contactEn,
        header: headerEn,
        legalNotice: legalNoticeEn,
        privacyPolicy: privacyPolicyEn,
        refundPolicy: refundPolicyEn,
        chat: chatEn,
        doctor: doctorEn,
        hospital: hospitalEn,
        aiSupport: aiSupportEn,
        about: aboutEn,
        contractSigning: contractSigningEn,
        specialty: specialtyEn,
        termsOfService: termsOfServiceEn,
        nutrition: nutritionEn,
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
        'contact',
        'header',
        'legalNotice',
        'privacyPolicy',
        'refundPolicy',
        'chat',
        'doctor',
        'hospital',
        'aiSupport',
        'about',
        'contractSigning',
        'specialty',
        'termsOfService',
        'nutrition',
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
