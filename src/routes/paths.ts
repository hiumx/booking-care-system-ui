/**
 * Path constants for the application
 */
export const PATHS = {
    // General paths
    HOME: '/',
    ABOUT: '/about',
    DEMO: '/demo',
    FAQ: '/faq',

    // Authentication paths
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',

    // Management paths
    SCREEN_MANAGEMENT: '/screen-management',

    // User paths
    USER: {
        ROOT: '/user',
        PROFILE: 'profile',
        SETTINGS: 'settings',
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
