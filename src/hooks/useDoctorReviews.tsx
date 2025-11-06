import { useState, useEffect, useCallback } from 'react';
import { ReviewService } from '@/services/review.service';
import { Review, ReviewStatistics } from '@/types/review.types';

interface UseDoctorReviewsReturn {
    reviews: Review[];
    statistics: ReviewStatistics | null;
    pagination: {
        currentPage: number;
        totalPages: number;
        totalCount: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    } | null;
    isLoading: boolean;
    isLoadingStatistics: boolean;
    error: string | null;
    fetchReviews: (page: number) => Promise<void>;
    refetchStatistics: () => Promise<void>;
}

/**
 * Custom hook for managing doctor reviews with server-side pagination
 * Simple local state management - no Redux needed!
 */
export const useDoctorReviews = (
    doctorId: string | undefined,
    initialPage: number = 1,
    pageSize: number = 10
): UseDoctorReviewsReturn => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [statistics, setStatistics] = useState<ReviewStatistics | null>(null);
    const [pagination, setPagination] = useState<{
        currentPage: number;
        totalPages: number;
        totalCount: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingStatistics, setIsLoadingStatistics] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch reviews with pagination
    const fetchReviews = useCallback(
        async (page: number = 1) => {
            if (!doctorId) return;

            setIsLoading(true);
            setError(null);

            try {
                const response = await ReviewService.getDoctorReviews({
                    doctorId,
                    page,
                    pageSize,
                });
                setReviews(response.data.reviews);
                setPagination({
                    currentPage: response.data.page,
                    totalPages: response.data.totalPages,
                    totalCount: response.data.totalCount,
                    hasNextPage: response.data.hasNextPage,
                    hasPreviousPage: response.data.hasPreviousPage,
                });
            } catch (err: any) {
                setError(err.message || 'Failed to fetch reviews');
                console.error('Error fetching reviews:', err);
            } finally {
                setIsLoading(false);
            }
        },
        [doctorId, pageSize]
    );

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
        fetchReviews(initialPage);
        fetchStatistics();
    }, [fetchReviews, fetchStatistics, initialPage]);

    return {
        reviews,
        statistics,
        pagination,
        isLoading,
        isLoadingStatistics,
        error,
        fetchReviews,
        refetchStatistics: fetchStatistics,
    };
};
