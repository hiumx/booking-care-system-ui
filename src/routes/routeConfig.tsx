// src/routes/routeConfig.tsx
import MainLayout from '../layouts/MainLayout';
import Demo from '../pages/Demo';
import Home from '../pages/Home';
import { RouteObject } from 'react-router-dom';

const routes: RouteObject[] = [
    {
        path: '/',
        element: <MainLayout />,
        children: [
            { path: '', element: <Home /> },
            { path: 'about', element: <h1>About Page</h1> },
        ],
    },
    {
        path: '/demo',
        element: <Demo />,
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
