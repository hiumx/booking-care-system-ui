/**
 * Path constants for the application
 */
export const PATHS = {
    HOME: '/',
    ABOUT: '/about',
    DEMO: '/demo',

    USER: {
        ROOT: '/user',
        PROFILE: 'profile',
        SETTINGS: 'settings',
    },

    DASHBOARD: {
        ROOT: '/dashboard',
        SETTINGS: 'settings',
    },

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
