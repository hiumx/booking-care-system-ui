// src/components/QuickNavigation/QuickNavigation.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { PATHS } from '@/routes/paths';
import styles from './QuickNavigation.module.scss';

const QuickNavigation: React.FC = () => {
    const quickLinks = [
        {
            name: 'Home',
            path: PATHS.HOME,
            icon: 'feather-home',
            description: 'Go to homepage',
        },
        {
            name: 'Demo',
            path: PATHS.DEMO,
            icon: 'feather-layout',
            description: 'View component demos',
        },
        {
            name: 'Screen Management',
            path: PATHS.SCREEN_MANAGEMENT,
            icon: 'feather-monitor',
            description: 'Manage all screens',
        },
        {
            name: 'Login',
            path: PATHS.LOGIN,
            icon: 'feather-log-in',
            description: 'User authentication',
        },
        {
            name: 'User Profile',
            path: `${PATHS.USER.ROOT}/${PATHS.USER.PROFILE}`,
            icon: 'feather-user',
            description: 'User profile page',
        },
    ];

    return (
        <div className={styles.quickNavigation}>
            <h6 className="mb-3">Quick Navigation</h6>
            <div className="list-group">
                {quickLinks.map((link) => (
                    <Link
                        key={link.path}
                        to={link.path}
                        className="list-group-item list-group-item-action d-flex align-items-center"
                    >
                        <i className={`${link.icon} me-3`}></i>
                        <div>
                            <div className="fw-medium">{link.name}</div>
                            <small className="text-muted">{link.description}</small>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default QuickNavigation;
