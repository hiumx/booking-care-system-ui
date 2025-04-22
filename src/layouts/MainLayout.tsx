// src/layouts/MainLayout.tsx
import { ReactNode } from 'react';
import { Link, Outlet } from 'react-router-dom';

interface Props {
    children?: ReactNode;
}

const MainLayout = ({ children }: Props) => {
    return (
        <div>
            <header>
                <nav>
                    <Link to="/">Home</Link> | <Link to="/about">About</Link>
                </nav>
            </header>

            <main>{children || <Outlet />}</main>

            <footer>© 2025 BookingCare</footer>
        </div>
    );
};

export default MainLayout;
