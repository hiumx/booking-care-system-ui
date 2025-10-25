import { useState, useEffect, useCallback } from 'react';
import { ReviewService } from '@/services/review.service';
import { Review, ReviewStatistics } from '@/types/review.types';

interface UseDoctorReviewsReturn {
    reviews: Review[];
    statistics: ReviewStatistics | null;
    isLoading: boolean;
    isLoadingStatistics: boolean;
    error: string | null;
    refetchReviews: () => Promise<void>;
    refetchStatistics: () => Promise<void>;
}

/**
 * Custom hook for managing doctor reviews
 * Simple local state management - no Redux needed!
 */
export const useDoctorReviews = (doctorId: string | undefined): UseDoctorReviewsReturn => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [statistics, setStatistics] = useState<ReviewStatistics | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingStatistics, setIsLoadingStatistics] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch reviews
    const fetchReviews = useCallback(async () => {
        if (!doctorId) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await ReviewService.getDoctorReviews({
                doctorId,
                page: 1,
                pageSize: 100, // Get all reviews for now
            });
            setReviews(response.data.reviews);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch reviews');
            console.error('Error fetching reviews:', err);
        } finally {
            setIsLoading(false);
        }
    }, [doctorId]);

    // Fetch statistics
    const fetchStatistics = useCallback(async () => {
        if (!doctorId) return;

        setIsLoadingStatistics(true);

        try {
            const response = await ReviewService.getDoctorStatistics(doctorId);
            setStatistics(response.data);
        } catch (err: any) {
            console.error('Error fetching statistics:', err);
            // Don't set error for statistics - it's not critical
        } finally {
            setIsLoadingStatistics(false);
        }
    }, [doctorId]);

    // Initial fetch
    useEffect(() => {
        fetchReviews();
        fetchStatistics();
    }, [fetchReviews, fetchStatistics]);

    return {
        reviews,
        statistics,
        isLoading,
        isLoadingStatistics,
        error,
        refetchReviews: fetchReviews,
        refetchStatistics: fetchStatistics,
    };
};
