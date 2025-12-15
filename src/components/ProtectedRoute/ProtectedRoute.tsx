import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { PATHS } from '@/routes/paths';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

/**
 * Protected Route Component for Patient Front-end
 * Checks if user is authenticated to access protected routes
 * Redirects to login page if not authenticated
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const location = useLocation();
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    if (!isAuthenticated) {
        return <Navigate to={PATHS.LOGIN} state={{ from: location }} replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
