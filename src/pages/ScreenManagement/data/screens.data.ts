// src/data/screens.data.ts
import { Screen, ScreenCategory, ScreenStatus } from '@/types/screen.types';
import { PATHS } from '@/routes/paths';

export const SCREENS_DATA: Screen[] = [
    // Public Pages
    {
        id: 'home',
        name: 'Home Page',
        path: PATHS.HOME,
        category: ScreenCategory.PUBLIC,
        description: 'Main landing page for the booking care system',
        status: ScreenStatus.COMPLETED,
        component: 'Home',
        icon: 'feather-home',
        tags: ['landing', 'public', 'main'],
    },
    {
        id: 'about',
        name: 'About Page',
        path: PATHS.ABOUT,
        category: ScreenCategory.PUBLIC,
        description: 'Information about the platform and services',
        status: ScreenStatus.PLANNED,
        component: 'About',
        icon: 'feather-info',
        tags: ['information', 'public'],
    },

    // Authentication Pages
    {
        id: 'login',
        name: 'Login',
        path: PATHS.LOGIN,
        category: ScreenCategory.AUTHENTICATION,
        description: 'User login with email/phone and OAuth support',
        status: ScreenStatus.COMPLETED,
        component: 'Login',
        icon: 'feather-log-in',
        tags: ['auth', 'oauth', 'email', 'phone'],
    },
    {
        id: 'register',
        name: 'Register',
        path: PATHS.REGISTER,
        category: ScreenCategory.AUTHENTICATION,
        description: 'User registration form',
        status: ScreenStatus.COMPLETED,
        component: 'Register',
        icon: 'feather-user-plus',
        tags: ['auth', 'signup', 'registration'],
    },
    {
        id: 'forgot-password',
        name: 'Forgot Password',
        path: PATHS.FORGOT_PASSWORD,
        category: ScreenCategory.AUTHENTICATION,
        description: 'Password recovery request form',
        status: ScreenStatus.COMPLETED,
        component: 'ForgotPassword',
        icon: 'feather-help-circle',
        tags: ['auth', 'password', 'recovery'],
    },
    {
        id: 'reset-password',
        name: 'Reset Password',
        path: PATHS.RESET_PASSWORD,
        category: ScreenCategory.AUTHENTICATION,
        description: 'Set new password after recovery',
        status: ScreenStatus.COMPLETED,
        component: 'ResetPassword',
        icon: 'feather-refresh-cw',
        tags: ['auth', 'password', 'reset'],
    },

    // User Profile Pages
    {
        id: 'user-profile',
        name: 'User Profile',
        path: `${PATHS.USER.ROOT}/${PATHS.USER.PROFILE}`,
        category: ScreenCategory.USER_PROFILE,
        description: 'User profile management and information',
        status: ScreenStatus.COMPLETED,
        component: 'UserProfile',
        icon: 'feather-user',
        tags: ['profile', 'user', 'settings'],
    },
    {
        id: 'user-favourite',
        name: 'Favourite Doctors',
        path: `${PATHS.USER.ROOT}/${PATHS.USER.PROFILE}/favourite`,
        category: ScreenCategory.USER_PROFILE,
        description: "List of user's favourite doctors",
        status: ScreenStatus.COMPLETED,
        component: 'Favourite',
        icon: 'feather-heart',
        tags: ['favourite', 'doctors', 'bookmarks'],
    },
    {
        id: 'patient-appointments',
        name: 'Patient Appointments',
        path: `${PATHS.USER.ROOT}/${PATHS.USER.PROFILE}/appointments`,
        category: ScreenCategory.USER_PROFILE,
        description: 'View and manage patient appointments',
        status: ScreenStatus.COMPLETED,
        component: 'PatientAppointments',
        icon: 'feather-calendar',
        tags: ['appointments', 'patient', 'booking'],
    },

    // Doctor Pages
    {
        id: 'doctor-search',
        name: 'Doctor Search Results',
        path: '/doctor/search',
        category: ScreenCategory.DOCTOR,
        description: 'Search and filter doctors by specialty, location, etc.',
        status: ScreenStatus.COMPLETED,
        component: 'SearchResult',
        icon: 'feather-search',
        tags: ['search', 'doctors', 'filter'],
    },
    {
        id: 'services',
        name: 'Services',
        path: '/services',
        category: ScreenCategory.DOCTOR,
        description: 'Search and filter doctors by specialty, location, etc.',
        status: ScreenStatus.COMPLETED,
        component: 'SearchResult',
        icon: 'feather-search',
        tags: ['search', 'doctors', 'filter'],
    },

    // Dashboard Pages
    {
        id: 'dashboard-main',
        name: 'Dashboard',
        path: PATHS.DASHBOARD.ROOT,
        category: ScreenCategory.DASHBOARD,
        description: 'Main dashboard for authenticated users',
        status: ScreenStatus.IN_PROGRESS,
        component: 'Dashboard',
        icon: 'feather-grid',
        tags: ['dashboard', 'overview'],
    },
    {
        id: 'dashboard-settings',
        name: 'Dashboard Settings',
        path: `${PATHS.DASHBOARD.ROOT}/${PATHS.DASHBOARD.SETTINGS}`,
        category: ScreenCategory.DASHBOARD,
        description: 'User preferences and dashboard configuration',
        status: ScreenStatus.PLANNED,
        component: 'DashboardSettings',
        icon: 'feather-settings',
        tags: ['settings', 'preferences'],
    },

    // Demo & Components
    {
        id: 'demo',
        name: 'Demo Components',
        path: PATHS.DEMO,
        category: ScreenCategory.DEMO,
        description: 'Showcase of reusable components and UI elements',
        status: ScreenStatus.COMPLETED,
        component: 'Demo',
        icon: 'feather-layout',
        tags: ['demo', 'components', 'showcase'],
    },

    // Error Pages
    {
        id: 'not-found',
        name: '404 Not Found',
        path: PATHS.NOT_FOUND,
        category: ScreenCategory.PUBLIC,
        description: 'Page not found error screen',
        status: ScreenStatus.PLANNED,
        component: 'NotFound',
        icon: 'feather-alert-circle',
        tags: ['error', '404', 'not-found'],
    },
];

// Helper functions
export const getScreensByCategory = (category: ScreenCategory): Screen[] => {
    return SCREENS_DATA.filter((screen) => screen.category === category);
};

export const getScreensByStatus = (status: ScreenStatus): Screen[] => {
    return SCREENS_DATA.filter((screen) => screen.status === status);
};

export const searchScreens = (query: string): Screen[] => {
    const lowercaseQuery = query.toLowerCase();
    return SCREENS_DATA.filter(
        (screen) =>
            screen.name.toLowerCase().includes(lowercaseQuery) ||
            screen.description?.toLowerCase().includes(lowercaseQuery) ||
            screen.tags?.some((tag) => tag.toLowerCase().includes(lowercaseQuery))
    );
};

export const getScreenStats = () => {
    const stats = {
        total: SCREENS_DATA.length,
        completed: getScreensByStatus(ScreenStatus.COMPLETED).length,
        inProgress: getScreensByStatus(ScreenStatus.IN_PROGRESS).length,
        planned: getScreensByStatus(ScreenStatus.PLANNED).length,
        deprecated: getScreensByStatus(ScreenStatus.DEPRECATED).length,
    };

    return {
        ...stats,
        completionRate: Math.round((stats.completed / stats.total) * 100),
    };
};
