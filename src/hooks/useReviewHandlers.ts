import { toast } from 'react-toastify';
import { ReviewService } from '@/services/review.service';
import { TargetType } from '@/types/review.types';

interface UseReviewHandlersProps {
    targetType: TargetType;
    targetId: string | undefined;
    currentUserId: string | undefined;
    currentAccountId: string | undefined;
    targetName: string;
    refetchReviews: () => Promise<void>;
    refetchStatistics: () => Promise<void>;
}

/**
 * Custom hook to handle review operations (create, update, delete, reply)
 * Reduces code duplication across Doctor and Service profile pages
 */
export const useReviewHandlers = ({
    targetType,
    targetId,
    currentUserId,
    currentAccountId,
    refetchReviews,
    refetchStatistics,
}: UseReviewHandlersProps) => {
    const handleSubmitReview = async (reviewData: {
        rating: number;
        description: string;
        termsAccepted: boolean;
    }) => {
        if (!targetId || !currentUserId) return;

        try {
            const payload: any = {
                patientId: currentUserId,
                targetType,
                rating: reviewData.rating,
                comment: reviewData.description,
            };

            // Add doctorId or serviceId based on targetType
            if (targetType === TargetType.DOCTOR) {
                payload.doctorId = targetId;
            } else if (targetType === TargetType.SERVICE) {
                payload.serviceId = targetId;
            }

            await ReviewService.createReview(payload);

            await refetchReviews();
            await refetchStatistics();

            toast.success('Đã gửi đánh giá thành công!', {
                position: 'top-right',
                autoClose: 2000,
            });
        } catch (err: any) {
            console.error('Error creating review:', err);

            if (err.message?.includes('appointment')) {
                const entityType = targetType === TargetType.DOCTOR ? 'bác sĩ' : 'dịch vụ';
                toast.error(
                    `Bạn cần hoàn thành ${targetType === TargetType.DOCTOR ? 'lịch hẹn với' : ''} ${entityType} này trước khi đánh giá.`,
                    {
                        position: 'top-center',
                        autoClose: 4000,
                    }
                );
            } else if (err.message?.includes('already reviewed')) {
                const entityType = targetType === TargetType.DOCTOR ? 'bác sĩ' : 'dịch vụ';
                toast.error(
                    `Bạn đã đánh giá ${entityType} này rồi. Vui lòng cập nhật đánh giá hiện tại.`,
                    {
                        position: 'top-center',
                        autoClose: 4000,
                    }
                );
            } else {
                toast.error('Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại.', {
                    position: 'top-center',
                    autoClose: 4000,
                });
            }
        }
    };

    const handleReplySubmission = async (replyData: { reviewId: string; text: string }) => {
        if (!currentAccountId) return;

        try {
            await ReviewService.createReply({
                reviewId: replyData.reviewId,
                authorId: currentAccountId,
                content: replyData.text,
            });
            await refetchReviews();

            toast.success('Đã gửi phản hồi thành công!', {
                position: 'top-right',
                autoClose: 2000,
            });
        } catch (err) {
            console.error('Error creating reply:', err);
            toast.error('Có lỗi xảy ra khi gửi phản hồi. Vui lòng thử lại.', {
                position: 'top-center',
                autoClose: 4000,
            });
        }
    };

    const handleEditReview = async (reviewData: {
        reviewId: string;
        rating: number;
        description: string;
    }) => {
        try {
            await ReviewService.updateReview({
                id: reviewData.reviewId,
                rating: reviewData.rating,
                comment: reviewData.description,
            });
            await refetchReviews();
            await refetchStatistics();

            toast.success('Đã cập nhật đánh giá thành công!', {
                position: 'top-right',
                autoClose: 2000,
            });
        } catch (err) {
            console.error('Error updating review:', err);
            toast.error('Có lỗi xảy ra khi cập nhật đánh giá. Vui lòng thử lại.', {
                position: 'top-center',
                autoClose: 4000,
            });
        }
    };

    const handleDeleteReview = async (reviewId: string) => {
        try {
            await ReviewService.deleteReview(reviewId);
            await refetchReviews();
            await refetchStatistics();

            toast.success('Đã xóa đánh giá thành công!', {
                position: 'top-right',
                autoClose: 2000,
            });
        } catch (err) {
            console.error('Error deleting review:', err);
            toast.error('Có lỗi xảy ra khi xóa đánh giá. Vui lòng thử lại.', {
                position: 'top-center',
                autoClose: 4000,
            });
        }
    };

    const handleEditReply = async (replyData: {
        reviewId: string;
        replyId: string;
        text: string;
    }) => {
        try {
            await ReviewService.updateReply({
                reviewId: replyData.reviewId,
                replyId: replyData.replyId,
                content: replyData.text,
            });
            await refetchReviews();

            toast.success('Đã cập nhật phản hồi thành công!', {
                position: 'top-right',
                autoClose: 2000,
            });
        } catch (err) {
            console.error('Error updating reply:', err);
            toast.error('Có lỗi xảy ra khi cập nhật phản hồi. Vui lòng thử lại.', {
                position: 'top-center',
                autoClose: 4000,
            });
        }
    };

    const handleDeleteReply = async (replyId: string, reviewId: string) => {
        try {
            await ReviewService.deleteReply(reviewId, replyId);
            await refetchReviews();

            toast.success('Đã xóa phản hồi thành công!', {
                position: 'top-right',
                autoClose: 2000,
            });
        } catch (err) {
            console.error('Error deleting reply:', err);
            toast.error('Có lỗi xảy ra khi xóa phản hồi. Vui lòng thử lại.', {
                position: 'top-center',
                autoClose: 4000,
            });
        }
    };

    return {
        handleSubmitReview,
        handleReplySubmission,
        handleEditReview,
        handleDeleteReview,
        handleEditReply,
        handleDeleteReply,
    };
};
