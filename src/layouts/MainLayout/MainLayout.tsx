// src/layouts/MainLayout.tsx
import { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';

import MainFooter from '../components/MainFooter';
import MainHeader from '../components/MainHeader';
import styles from './MainLayout.module.scss';

interface MainLayoutProps {
    children: ReactNode;
    hasFooter?: boolean;
    hasHeader?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({
    children,
    hasFooter = true,
    hasHeader = true,
}) => {
    return (
        <div className={styles.mainLayout}>
            {hasHeader && <MainHeader />}
            <main className={styles.contentContainer}>{children || <Outlet />}</main>
            {hasFooter && <MainFooter />}
        </div>
    );
};

export default MainLayout;
