// src/routes/routeConfig.tsx
import Demo from '@/pages/Demo';
import Home from '@/pages/Home';
import { RouteObject } from 'react-router-dom';
import Login from '@/pages/Authentication/Login';
import Register from '@/pages/Authentication/Register';
import ForgotPassword from '@/pages/Authentication/ForgotPassword';
import ResetPassword from '@/pages/Authentication/ResetPassword';

const routes: RouteObject[] = [
    {
        path: '/',
        element: <Home title="Home Page" />,
        children: [
            { path: '', element: <Home title="Home Page" /> },
            { path: 'about', element: <h1>About Page</h1> },
        ],
    },
    {
        path: '/demo',
        element: <Demo />,
    },
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/register',
        element: <Register />,
    },
    {
        path: '/forgot-password',
        element: <ForgotPassword />,
    },
    {
        path: '/reset-password',
        element: <ResetPassword />,
    },
    {
        path: '/dashboard',
        children: [
            { path: '', element: <h1>Dashboard</h1> },
            { path: 'settings', element: <h1>Setting</h1> },
        ],
    },
    {
        path: '*',
        element: <h1>404 - Page Not Found</h1>,
    },
];

export default routes;
