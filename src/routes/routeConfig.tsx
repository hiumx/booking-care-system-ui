// src/routes/routeConfig.tsx
import Demo from '@/pages/Demo';
import Home from '@/pages/Home';
import UserProfile from '@/pages/User_Profile';
import { RouteObject } from 'react-router-dom';
import { PATHS } from './paths';

const routes: RouteObject[] = [
    {
        path: PATHS.HOME,
        element: <Home title="Home Page" />,
    },
    {
        path: PATHS.ABOUT,
        element: <h1>About Page</h1>,
    },
    {
        path: PATHS.DEMO,
        element: <Demo />,
    },
    {
        path: PATHS.USER.ROOT,
        children: [{ path: PATHS.USER.PROFILE, element: <UserProfile /> }],
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
