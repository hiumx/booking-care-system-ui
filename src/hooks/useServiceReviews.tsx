import { useState, useEffect, useCallback } from 'react';
import { ReviewService } from '@/services/review.service';
import { Review, ReviewStatistics } from '@/types/review.types';

interface UseServiceReviewsResult {
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
    error: string | null;
    fetchReviews: (page: number) => Promise<void>;
    refetchStatistics: () => Promise<void>;
}

/**
 * Custom hook to fetch and manage service reviews with server-side pagination
 * @param serviceId - The service ID to fetch reviews for
 * @param initialPage - Initial page number (default: 1)
 * @param pageSize - Number of reviews per page (default: 10)
 */
export const useServiceReviews = (
    serviceId?: string,
    initialPage: number = 1,
    pageSize: number = 10
): UseServiceReviewsResult => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [statistics, setStatistics] = useState<ReviewStatistics | null>(null);
    const [pagination, setPagination] = useState<{
        currentPage: number;
        totalPages: number;
        totalCount: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    } | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchReviews = useCallback(
        async (page: number = 1) => {
            if (!serviceId) return;

            setIsLoading(true);
            setError(null);

            try {
                const response = await ReviewService.getServiceReviews({
                    serviceId,
                    page,
                    pageSize,
                });

                if (response.success && response.data?.reviews) {
                    setReviews(response.data.reviews);
                    // Note: Backend might return different response structure
                    // Adjust based on actual API response
                    setPagination({
                        currentPage: page,
                        totalPages: Math.ceil(response.data.totalCount / pageSize),
                        totalCount: response.data.totalCount,
                        hasNextPage: page < Math.ceil(response.data.totalCount / pageSize),
                        hasPreviousPage: page > 1,
                    });
                } else {
                    setError(response.message || 'Failed to fetch reviews.');
                }
            } catch (err: any) {
                console.error('Error fetching service reviews:', err);
                setError(err.message || 'An error occurred while fetching reviews.');
            } finally {
                setIsLoading(false);
            }
        },
        [serviceId, pageSize]
    );

    const fetchStatistics = useCallback(async () => {
        if (!serviceId) return;

        try {
            const response = await ReviewService.getServiceStatistics(serviceId);

            if (response.success && response.data) {
                setStatistics(response.data);
            } else {
                console.error('Failed to fetch review statistics:', response.message);
            }
        } catch (err: any) {
            console.error('Error fetching service statistics:', err);
            // Don't set error for statistics - it's not critical
        }
    }, [serviceId]);

    useEffect(() => {
        fetchReviews(initialPage);
        fetchStatistics();
    }, [fetchReviews, fetchStatistics, initialPage]);

    return {
        reviews,
        statistics,
        pagination,
        isLoading,
        error,
        fetchReviews,
        refetchStatistics: fetchStatistics,
    };
};
