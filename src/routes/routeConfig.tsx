// src/routes/routeConfig.tsx
import Demo from '@/pages/Demo';
import Home from '@/pages/Home';
import UserProfile from '@/pages/UserProfile';
import ScreenManagement from '@/pages/ScreenManagement';
import Chat from '@/pages/Chat';
import { RouteObject } from 'react-router-dom';
import Login from '@/pages/Authentication/Login';
import Register from '@/pages/Authentication/Register';
import ForgotPassword from '@/pages/Authentication/ForgotPassword';
import ResetPassword from '@/pages/Authentication/ResetPassword';
import DoctorProfile from '@/pages/Doctor/DoctorProfile';
import { PATHS } from './paths';
import FAQ from '@/pages/FAQ';
import Blog from '@/pages/Blog';
import BlogDetail from '@/pages/BlogDetail';
import MedicalTerms from '@/pages/MedicalTerms';
import CategoryArticles from '~/pages/CategoryBlogs';
import CategoryArticlesDemo from '~/pages/CategoryBlogsDemo';
import MedicalFacilityProfile from '@/pages/MedicalFacility/MedicalFacilityProfile';

const routes: RouteObject[] = [
    {
        path: PATHS.HOME,
        element: <Home />,
    },
    {
        path: PATHS.ABOUT,
        element: <h1>About Page</h1>,
    },
    {
        path: PATHS.FAQ,
        element: <FAQ />,
    },
    {
        path: PATHS.BLOG,
        element: <Blog />,
    },
    {
        path: PATHS.BLOG_DETAIL,
        element: <BlogDetail />,
    },
    {
        path: PATHS.MEDICAL_TERMS,
        element: <MedicalTerms />,
    },
    {
        path: PATHS.CATEGORY_ARTICLES,
        element: <CategoryArticles />,
    },
    {
        path: PATHS.CATEGORY_ARTICLES_DEMO,
        element: <CategoryArticlesDemo />,
    },

    // Authentication paths
    {
        path: PATHS.DEMO,
        element: <Demo />,
    },
    {
        path: PATHS.LOGIN,
        element: <Login />,
    },
    {
        path: PATHS.REGISTER,
        element: <Register />,
    },
    {
        path: PATHS.FORGOT_PASSWORD,
        element: <ForgotPassword />,
    },
    {
        path: PATHS.RESET_PASSWORD,
        element: <ResetPassword />,
    },
    {
        path: PATHS.SCREEN_MANAGEMENT,
        element: <ScreenManagement />,
    },
    {
        path: PATHS.USER.ROOT,
        children: [{ path: PATHS.USER.PROFILE, element: <UserProfile /> }],
    },
    {
        path: PATHS.MEDICAL_FACILITY.ROOT,
        // element: <MedicalFacility />,
        children: [{ path: PATHS.MEDICAL_FACILITY.PROFILE, element: <MedicalFacilityProfile /> }],
    },
    {
        path: PATHS.CHAT,
        element: <Chat />,
    },

    {
        path: PATHS.DOCTOR.ROOT,
        children: [{ path: PATHS.DOCTOR.PROFILE, element: <DoctorProfile /> }],
    },
    {
        path: PATHS.DASHBOARD.ROOT,
        children: [
            { path: PATHS.DASHBOARD.ROOT, element: <h1>Dashboard</h1> },
            { path: PATHS.DASHBOARD.SETTINGS, element: <h1>Setting</h1> },
        ],
    },
    {
        path: PATHS.NOT_FOUND,
        element: <h1>404 - Page Not Found</h1>,
    },
];

export default routes;
