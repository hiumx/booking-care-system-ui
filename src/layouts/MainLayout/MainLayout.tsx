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
    hasTopbar?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({
    children,
    hasFooter = true,
    hasHeader = true,
    hasTopbar = true,
}) => {
    return (
        <div className="main-wrapper">
            {hasHeader && <MainHeader hasTopbar={hasTopbar} />}
            <main className={styles.contentContainer}>{children || <Outlet />}</main>
            {hasFooter && <MainFooter />}
        </div>
    );
};

export default MainLayout;
