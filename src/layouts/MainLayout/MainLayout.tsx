// src/layouts/MainLayout.tsx
import { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';

import Footer from './components/Footer';
import Header from './components/Header';
import styles from './MainLayout.module.scss';

interface MainLayoutProps {
    children: ReactNode;
    hasFooter?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, hasFooter = true }) => {
    return (
        <div className={styles.mainLayout}>
            <Header />
            <main className={styles.contentContainer}>{children || <Outlet />}</main>
            {hasFooter && <Footer />}
        </div>
    );
};

export default MainLayout;
