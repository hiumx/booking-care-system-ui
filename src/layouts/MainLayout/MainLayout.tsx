// src/layouts/MainLayout.tsx
import { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import Footer from './components/Footer';
import Header from './components/Header';

interface MainLayoutProps {
    children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
        <div>
            <Header />

            <main>{children || <Outlet />}</main>

            <Footer />
        </div>
    );
};

export default MainLayout;
