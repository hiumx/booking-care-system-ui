/**
 * Path constants for the application
 */
export const PATHS = {
    // General paths
    HOME: '/',
    DEMO: '/demo',
    DEMO_DATE_RANGE_PICKER: '/demo/date-range-picker',
    FAQ: '/faq',
    BLOG: '/blog',
    BLOG_DETAIL: '/blog/:slug',
    MEDICAL_TERMS: '/medical-terms',
    CATEGORY_ARTICLES: '/category/:categorySlug',
    CATEGORY_ARTICLES_DEMO: '/category-demo',
    SUBSCRIPTION_PLANS: '/subscription-plans',
    ABOUT_US: '/about-us',
    CONTACT_US: '/contact-us',
    SMART_BOOKING: '/smart-booking',

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

    // Hospital paths
    HOSPITAL: {
        ROOT: '/hospitals',
        DETAIL: ':id',
    },

    // Doctor paths
    DOCTOR: {
        ROOT: '/doctors',
        PROFILE: 'profile/:id',
    },

    // Specialties paths
    SPECIALTIES: {
        ROOT: '/specialties',
        PROFILE: 'profile',
    },

    // Service paths
    Service: {
        Service_Types: '/service-types/:serviceId',
    },

    // Booking
    BOOKING: {
        ROOT: '/booking/:doctorId',
        CONFIRMATION: '/booking/confirmation/:appointmentId',
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

/**
 * Replaces path parameters like :param with actual values.
 * @param path Path string with :param
 * @param params Object with key-value pairs to replace in path
 * @returns Path with parameters replaced
 */
export function replacePathParams(path: string, params: Record<string, string | number>): string {
    return path.replace(/:([a-zA-Z0-9_]+)/g, (_, key) => {
        const value = params[key];
        if (value === undefined) {
            throw new Error(`Missing value for path parameter: ${key}`);
        }
        return encodeURIComponent(String(value));
    });
}
