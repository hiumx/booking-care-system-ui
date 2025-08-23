/**
 * Path constants for the application
 */
export const PATHS = {
    // General paths
    HOME: '/',
    ABOUT: '/about',
    DEMO: '/demo',
    FAQ: '/faq',
    BLOG: '/blog',
    BLOG_DETAIL: '/blog/:slug',
    MEDICAL_TERMS: '/medical-terms',
    CATEGORY_ARTICLES: '/category/:categorySlug',
    CATEGORY_ARTICLES_DEMO: '/category-demo',
    SUBSCRIPTION_PLANS: '/subscription-plans',
    ABOUT_US: '/about-us',
    CONTACT_US: '/contact-us',

    // Authentication paths
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
    CHAT: '/chat',
    // Management paths
    SCREEN_MANAGEMENT: '/screen-management',

    // User paths
    USER: {
        ROOT: '/user',
        PROFILE: 'profile',
        SETTINGS: 'settings',
    },

    // Doctor paths
    DOCTOR: {
        ROOT: '/doctor',
        PROFILE: 'profile',
    },

    // Specialties paths
    SPECIALTIES: {
        ROOT: '/specialties',
        PROFILE: 'profile',
    },

    // Medical Facility paths
    MEDICAL_FACILITY: {
        ROOT: '/medical-facility',
        PROFILE: 'profile',
    },

    // Dashboard paths
    DASHBOARD: {
        ROOT: '/dashboard',
        SETTINGS: 'settings',
    },

    // Not Found path
    NOT_FOUND: '*',
} as const;

/**
 * Utility function to get relative path
 * @param parts
 * @returns
 */
export function buildPath(...parts: string[]): string {
    return parts
        .filter(Boolean)
        .map((p, i) => (i === 0 ? p.replace(/\/+$/, '') : p.replace(/^\/+|\/+$/g, '')))
        .join('/')
        .replace(/\/{2,}/g, '/');
}
