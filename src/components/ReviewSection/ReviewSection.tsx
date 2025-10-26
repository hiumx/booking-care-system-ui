import React, { useState } from 'react';
import clsx from 'clsx';
import Pagination from '@/components/Pagination';
import ReviewCard from '@/components/ReviewCard';
import Button from '@/components/Button';
import WriteReview from '@/components/WriteReview';
import { Review } from '@/types/review.types';
import styles from './ReviewSection.module.scss';

// Mock data for Reviews (shared)
const baseReviews = [
    {
        id: 1,
        patient_id: 101,
        doctor_id: 1,
        appointment_id: 201,
        rating: 5,
        comment: 'Cảm ơn bác sĩ vì sự tận tâm! Dịch vụ rất tốt.',
        recommend: true,
        parent_review_id: null,
        created_at: '2025-08-17 14:03:00',
        updated_at: '2025-08-17 14:03:00',
        timeAgo: '2 days ago',
        user: {
            id: 101,
            account_id: 101,
            email: 'patient1@example.com',
            first_name: 'Nguyễn',
            last_name: 'Thị B',
            gender: 'FEMALE',
            address: 'Hải Châu, Đà Nẵng',
            phone: '0905-123-456',
            avatar_url: '',
            created_at: '2025-01-01 10:00:00',
            updated_at: '2025-08-17 14:00:00',
        },
    },
    {
        id: 2,
        patient_id: 102,
        doctor_id: 1,
        appointment_id: 202,
        rating: 5,
        comment: 'Bác sĩ rất chuyên nghiệp, tôi rất hài lòng!',
        recommend: true,
        parent_review_id: null,
        created_at: '2025-07-19 14:03:00',
        updated_at: '2025-07-19 14:03:00',
        timeAgo: '31 days ago',
        user: {
            id: 102,
            account_id: 102,
            email: 'patient2@example.com',
            first_name: 'Trần',
            last_name: 'Văn C',
            gender: 'MALE',
            address: 'Sơn Trà, Đà Nẵng',
            phone: '0905-654-321',
            avatar_url: '',
            created_at: '2025-02-01 10:00:00',
            updated_at: '2025-07-19 14:00:00',
        },
    },
    {
        id: 3,
        patient_id: 103,
        doctor_id: 1,
        appointment_id: 203,
        rating: 5,
        comment: 'Dịch vụ tuyệt vời, sẽ quay lại!',
        recommend: true,
        parent_review_id: null,
        created_at: '2025-08-04 14:03:00',
        updated_at: '2025-08-04 14:03:00',
        timeAgo: '15 days ago',
        user: {
            id: 103,
            account_id: 103,
            email: 'patient3@example.com',
            first_name: 'Lê',
            last_name: 'Thị D',
            gender: 'FEMALE',
            address: 'Ngũ Hành Sơn, Đà Nẵng',
            phone: '0905-789-123',
            avatar_url: '',
            created_at: '2025-03-01 10:00:00',
            updated_at: '2025-08-04 14:00:00',
        },
        replies: [
            {
                id: 4,
                patient_id: 104,
                doctor_id: 1,
                appointment_id: null,
                rating: null,
                comment: 'Cảm ơn ý kiến của bạn, chúng tôi sẽ cải thiện!',
                recommend: false,
                parent_review_id: 3,
                created_at: '2025-08-05 14:03:00',
                updated_at: '2025-08-05 14:03:00',
                user: {
                    id: 104,
                    account_id: 104,
                    email: 'reply1@example.com',
                    first_name: 'Phan',
                    last_name: 'Văn E',
                    gender: 'MALE',
                    address: 'Liên Chiểu, Đà Nẵng',
                    phone: '0905-456-789',
                    avatar_url: '',
                    created_at: '2025-04-01 10:00:00',
                    updated_at: '2025-08-05 14:00:00',
                },
            },
        ],
    },
];

// Generate reviews (shared logic)
export const generateReviews = (count: number = 150, avatarUrl: string = '') => {
    return Array.from({ length: count }, (_, index) => {
        const baseIndex = index % baseReviews.length;
        const baseReview = baseReviews[baseIndex];
        const recommend = index < 141;
        return {
            ...baseReview,
            id: index + 1,
            patient_id: 100 + index + 1,
            appointment_id: 201 + index,
            rating: 5,
            comment: `${baseReview.comment} (Review ${index + 1})`,
            recommend,
            created_at: new Date(Date.now() - index * 86400000).toISOString(),
            updated_at: new Date(Date.now() - index * 86400000).toISOString(),
            timeAgo: `${(index % 30) + 1} days ago`,
            userId: baseReview.user.id,
            user: {
                ...baseReview.user,
                id: 100 + index + 1,
                account_id: 100 + index + 1,
                email: `patient${index + 1}@example.com`,
                first_name: baseReview.user.first_name,
                last_name: `${baseReview.user.last_name}${index + 1}`,
                avatar_url: avatarUrl,
                created_at: new Date(Date.now() - index * 86400000).toISOString(),
                updated_at: new Date(Date.now() - index * 86400000).toISOString(),
            },
            replies: baseReview.replies?.map((reply) => ({
                ...reply,
                id: reply.id + index,
                patient_id: 100 + index + 2,
                recommend: false,
                userId: reply.user.id,
                user: {
                    ...reply.user,
                    id: 100 + index + 2,
                    account_id: 100 + index + 2,
                    email: `reply${index + 1}@example.com`,
                    first_name: reply.user.first_name,
                    last_name: `${reply.user.last_name}${index + 1}`,
                    avatar_url: avatarUrl,
                    created_at: new Date(Date.now() - (index + 1) * 86400000).toISOString(),
                    updated_at: new Date(Date.now() - (index + 1) * 86400000).toISOString(),
                },
            })),
        };
    });
};

interface ReviewSectionProps {
    reviews: Review[];
    doctorName: string;
    currentUserId?: string; // For review permission check (patientId)
    currentAccountId?: string; // For reply permission check (authorId)
    isLoading?: boolean;
    onSubmitReview: (reviewData: {
        rating: number;
        description: string;
        termsAccepted: boolean;
    }) => void;
    onReplySubmission: (replyData: { reviewId: string; text: string }) => void;
    onEditReview: (reviewData: {
        reviewId: string;
        rating: number;
        description: string;
        recommend?: boolean;
    }) => void;
    onDeleteReview: (reviewId: string) => void;
    onEditReply: (replyData: { reviewId: string; replyId: string; text: string }) => void;
    onDeleteReply: (replyId: string, reviewId: string) => void;
    className?: string;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({
    reviews,
    doctorName,
    currentUserId,
    currentAccountId,
    isLoading = false,
    onSubmitReview,
    onReplySubmission,
    onEditReview,
    onDeleteReview,
    onEditReply,
    onDeleteReply,
    className,
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;
    const totalPages = Math.ceil(reviews.length / pageSize);
    const displayedReviews = reviews.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const [showWriteReview, setShowWriteReview] = useState(false);

    const handleSubmitReview = (reviewData: {
        rating: number;
        description: string;
        termsAccepted: boolean;
    }) => {
        onSubmitReview(reviewData);
        setShowWriteReview(false);
    };

    // Helper function to calculate time ago
    const getTimeAgo = (dateString: string): string => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMs = now.getTime() - date.getTime();
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        if (diffInDays === 0) return 'Hôm nay';
        if (diffInDays === 1) return 'Hôm qua';
        if (diffInDays < 30) return `${diffInDays} ngày trước`;
        if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} tháng trước`;
        return `${Math.floor(diffInDays / 365)} năm trước`;
    };

    // Helper function to convert MongoDB ObjectId string to number
    const stringToNumber = (str: string): number => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.codePointAt(i) ?? 0;
            hash = (hash << 5) - hash + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash);
    };

    return (
        <div className={clsx('review-section', styles.reviewSection, className)}>
            <div className="detail-title mb-3">
                <h4>Đánh giá ({reviews.length})</h4>
            </div>

            {/* Write Review Section */}
            <div className="write-review-section mb-4">
                {showWriteReview ? (
                    <WriteReview doctorName={doctorName} onSubmitReview={handleSubmitReview} />
                ) : (
                    <Button
                        text="Viết đánh giá"
                        type="button"
                        className="btn-primary"
                        onClick={() => setShowWriteReview(true)}
                    />
                )}

                {showWriteReview && (
                    <Button
                        text="Hủy"
                        type="button"
                        className={clsx('mt-2', styles.cancelButton)}
                        onClick={() => setShowWriteReview(false)}
                    />
                )}
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="text-center py-4">
                    <output className="spinner-border">
                        <span className="visually-hidden">Đang tải...</span>
                    </output>
                </div>
            )}

            {/* Empty State */}
            {!isLoading && reviews.length === 0 && (
                <div className="text-center py-4">
                    <p className="text-muted">Chưa có đánh giá nào.</p>
                </div>
            )}

            {/* Reviews List */}
            {!isLoading && reviews.length > 0 && (
                <>
                    {displayedReviews.map((review, index) => {
                        // Store original string IDs for callbacks
                        const originalReviewId = review.id;
                        const replyIdMap = new Map(
                            review.replies?.map((r) => [stringToNumber(r.id), r.id]) || []
                        );

                        return (
                            <ReviewCard
                                key={review.id}
                                review={{
                                    id: stringToNumber(review.id),
                                    name: review.patientInfo.fullName,
                                    avatar: review.patientInfo.avatarUrl,
                                    rating: review.rating,
                                    timeAgo: getTimeAgo(review.createdAt),
                                    text: review.comment,
                                    recommend: true,
                                    userId: stringToNumber(review.patientId),
                                    isEditable: true,
                                    replies: review.replies?.map((reply) => ({
                                        id: stringToNumber(reply.id),
                                        name: reply.authorInfo.fullName,
                                        avatar: reply.authorInfo.avatarUrl,
                                        text: reply.content,
                                        userId: stringToNumber(reply.authorId),
                                    })),
                                }}
                                isLast={index === displayedReviews.length - 1}
                                onReply={(data) =>
                                    onReplySubmission({
                                        reviewId: originalReviewId,
                                        text: data.text,
                                    })
                                }
                                canEdit={true}
                                canDelete={true}
                                currentUserId={
                                    currentUserId ? stringToNumber(currentUserId) : undefined
                                }
                                currentReplyUserId={
                                    currentAccountId ? stringToNumber(currentAccountId) : undefined
                                }
                                onEdit={(data) =>
                                    onEditReview({
                                        reviewId: originalReviewId,
                                        rating: data.rating,
                                        description: data.description,
                                    })
                                }
                                onDelete={() => onDeleteReview(originalReviewId)}
                                onEditReply={(data) => {
                                    const originalReplyId = replyIdMap.get(data.replyId);
                                    if (originalReplyId) {
                                        onEditReply({
                                            reviewId: originalReviewId,
                                            replyId: originalReplyId,
                                            text: data.text,
                                        });
                                    }
                                }}
                                onDeleteReply={(replyId) => {
                                    const originalReplyId = replyIdMap.get(replyId);
                                    if (originalReplyId) {
                                        onDeleteReply(originalReplyId, originalReviewId);
                                    }
                                }}
                            />
                        );
                    })}
                    {totalPages > 1 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default ReviewSection;
