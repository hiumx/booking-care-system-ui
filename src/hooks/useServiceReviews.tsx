import { useState, useEffect, useCallback } from 'react';
import { ReviewService } from '@/services/review.service';
import { Review, ReviewStatistics } from '@/types/review.types';

interface UseServiceReviewsResult {
    reviews: Review[];
    statistics: ReviewStatistics | null;
    isLoading: boolean;
    error: string | null;
    refetchReviews: () => Promise<void>;
    refetchStatistics: () => Promise<void>;
}

/**
 * Custom hook to fetch and manage service reviews
 * @param serviceId - The service ID to fetch reviews for
 */
export const useServiceReviews = (serviceId?: string): UseServiceReviewsResult => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [statistics, setStatistics] = useState<ReviewStatistics | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchReviews = useCallback(async () => {
        if (!serviceId) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await ReviewService.getServiceReviews({
                serviceId,
                page: 1,
                pageSize: 100, // Get all reviews
            });

            if (response.success && response.data?.reviews) {
                setReviews(response.data.reviews);
            } else {
                setError(response.message || 'Failed to fetch reviews.');
            }
        } catch (err: any) {
            console.error('Error fetching service reviews:', err);
            setError(err.message || 'An error occurred while fetching reviews.');
        } finally {
            setIsLoading(false);
        }
    }, [serviceId]);

    const fetchStatistics = useCallback(async () => {
        if (!serviceId) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await ReviewService.getServiceStatistics(serviceId);

            if (response.success && response.data) {
                setStatistics(response.data);
            } else {
                setError(response.message || 'Failed to fetch review statistics.');
            }
        } catch (err: any) {
            console.error('Error fetching service statistics:', err);
            setError(err.message || 'An error occurred while fetching review statistics.');
        } finally {
            setIsLoading(false);
        }
    }, [serviceId]);

    useEffect(() => {
        fetchReviews();
        fetchStatistics();
    }, [fetchReviews, fetchStatistics]);

    return {
        reviews,
        statistics,
        isLoading,
        error,
        refetchReviews: fetchReviews,
        refetchStatistics: fetchStatistics,
    };
};
