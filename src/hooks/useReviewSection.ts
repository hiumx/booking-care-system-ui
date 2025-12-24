import { useState, useCallback } from 'react';
import { TargetType } from '@/types/review.types';
import { useDoctorReviews } from './useDoctorReviews';
import { useServiceReviews } from './useServiceReviews';
import { useReviewHandlers } from './useReviewHandlers';

interface UseReviewSectionProps {
    targetType: TargetType;
    targetId: string | undefined;
    targetName: string;
    currentUserId: string | undefined;
    currentAccountId: string | undefined;
    hospitalId?: string;
    pageSize?: number;
}

/**
 * Custom hook to encapsulate review section logic
 * Handles review fetching, pagination, and all review/reply operations
 * Reduces code duplication between DoctorProfile and ServiceDetailPage
 */
export const useReviewSection = ({
    targetType,
    targetId,
    targetName,
    currentUserId,
    currentAccountId,
    hospitalId,
    pageSize = 10,
}: UseReviewSectionProps) => {
    const [reviewPage, setReviewPage] = useState(1);

    // Conditionally use the appropriate review hook based on target type
    const useDoctorReviewsHook = targetType === TargetType.DOCTOR ? useDoctorReviews : null;
    const useServiceReviewsHook = targetType === TargetType.SERVICE ? useServiceReviews : null;

    // Call the appropriate hook based on target type
    const doctorReviewsResult = useDoctorReviewsHook?.(targetId, reviewPage, pageSize);
    const serviceReviewsResult = useServiceReviewsHook?.(targetId, reviewPage, pageSize);

    // Use the result from the appropriate hook
    const reviewsResult =
        targetType === TargetType.DOCTOR ? doctorReviewsResult : serviceReviewsResult;

    const {
        reviews = [],
        statistics: reviewStatistics,
        pagination: reviewPagination,
        isLoading: reviewLoading = false,
        fetchReviews = async () => {},
        refetchStatistics = async () => {},
    } = reviewsResult || {};

    // Review handlers using custom hook
    const reviewHandlers = useReviewHandlers({
        targetType,
        targetId,
        currentUserId,
        currentAccountId,
        targetName,
        hospitalId,
        refetchReviews: () => fetchReviews(reviewPage),
        refetchStatistics,
    });

    // Handle page change
    const handlePageChange = useCallback(
        (page: number) => {
            setReviewPage(page);
            fetchReviews(page);
        },
        [fetchReviews]
    );

    return {
        // Review data
        reviews,
        reviewStatistics,
        reviewPagination,
        reviewLoading,
        reviewPage,

        // Handlers
        handlePageChange,
        ...reviewHandlers,
    };
};
