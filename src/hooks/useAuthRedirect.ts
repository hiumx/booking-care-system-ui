import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useAuth } from '@/hooks/useAuth';
import { clearError } from '@/store/slices/authSlice';
import { PATHS } from '@/routes/paths';
import { AppDispatch } from '@/store';

/**
 * Custom hook for handling authentication redirects
 * Redirects to home if user is already authenticated
 */
export const useAuthRedirect = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            navigate(PATHS.HOME);
        }
        dispatch(clearError());
    }, [isAuthenticated, navigate, dispatch]);
};
