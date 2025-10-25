import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { FavoriteDoctorService } from '@/services/favoriteDoctor.service';

interface UseFavoriteDoctorResult {
    isFavorited: boolean;
    isLoading: boolean;
    toggleFavorite: () => Promise<void>;
}

/**
 * Custom hook to manage favorite doctor status
 * @param patientId - Patient's ID
 * @param doctorId - Doctor's ID
 * @param initialIsFavorited - Initial favorite status (if known, to skip API check)
 */
export const useFavoriteDoctor = (
    patientId?: string,
    doctorId?: string,
    initialIsFavorited?: boolean
): UseFavoriteDoctorResult => {
    const [isFavorited, setIsFavorited] = useState<boolean>(initialIsFavorited ?? false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Check favorite status on mount - skip if initialIsFavorited is provided
    const checkStatus = useCallback(async () => {
        if (!patientId || !doctorId) return;
        // Skip check if initial value is already provided
        if (initialIsFavorited !== undefined) return;

        setIsLoading(true);
        try {
            const data = await FavoriteDoctorService.checkFavoriteStatus(patientId, doctorId);
            setIsFavorited(data.isFavorited);
        } catch (error) {
            console.error('Error checking favorite status:', error);
            // Don't show error toast for check - just default to false
            setIsFavorited(false);
        } finally {
            setIsLoading(false);
        }
    }, [patientId, doctorId, initialIsFavorited]);

    useEffect(() => {
        checkStatus();
    }, [checkStatus]);

    // Toggle favorite status
    const toggleFavorite = useCallback(async () => {
        if (!patientId || !doctorId) {
            toast.warning('Vui lòng đăng nhập để yêu thích bác sĩ', {
                position: 'top-center',
                autoClose: 3000,
            });
            return;
        }

        setIsLoading(true);
        try {
            const data = await FavoriteDoctorService.toggleFavorite({
                patientId,
                doctorId,
            });

            setIsFavorited(data.isFavorited);

            if (data.action === 'Added') {
                toast.success('Đã thêm bác sĩ vào danh sách yêu thích!', {
                    position: 'top-right',
                    autoClose: 2000,
                });
            } else {
                toast.info('Đã xóa bác sĩ khỏi danh sách yêu thích', {
                    position: 'top-right',
                    autoClose: 2000,
                });
            }
        } catch (error: any) {
            console.error('Error toggling favorite:', error);
            toast.error('Có lỗi xảy ra. Vui lòng thử lại.', {
                position: 'top-center',
                autoClose: 3000,
            });
        } finally {
            setIsLoading(false);
        }
    }, [patientId, doctorId]);

    return {
        isFavorited,
        isLoading,
        toggleFavorite,
    };
};
