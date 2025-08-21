import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import styles from '@/pages/Doctor/DoctorProfile/DoctorProfile.module.scss';
import reviewStyles from './ReviewCard.module.scss';
import ReplyForm from './components/ReplyForm';
import EditReviewForm from './components/EditReviewForm';
import EditReplyForm from './components/EditReplyForm';
import Button from '@/components/Button';

interface Reply {
    id: number;
    name: string;
    avatar?: string;
    text: string;
    userId?: number; // Add userId for edit/delete permission
}

interface Review {
    id: number;
    name: string;
    avatar?: string;
    rating?: number;
    timeAgo?: string;
    text: string;
    recommend?: boolean;
    replies?: Reply[];
    // New fields for edit/delete functionality
    userId?: number;
    isEditable?: boolean;
    editedAt?: string;
}

interface ReviewCardProps {
    review: Review;
    isLast?: boolean;
    showReplyLink?: boolean;
    maxTextLength?: number;
    onReply?: (replyData: { reviewId: number; text: string }) => void;
    // New props for edit/delete
    canEdit?: boolean;
    canDelete?: boolean;
    currentUserId?: number;
    onEdit?: (reviewData: {
        reviewId: number;
        rating: number;
        description: string;
        recommend?: boolean;
    }) => void;
    onDelete?: (reviewId: number) => void;
    // New props for reply edit/delete
    onEditReply?: (replyData: { replyId: number; text: string }) => void;
    onDeleteReply?: (replyId: number) => void;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
    review,
    isLast = false,
    showReplyLink = true,
    maxTextLength = 200,
    onReply,
    canEdit = false,
    canDelete = false,
    currentUserId,
    onEdit,
    onDelete,
    onEditReply,
    onDeleteReply,
}) => {
    const [showReplyForm, setShowReplyForm] = useState<boolean>(false);
    const [replyToReplyId, setReplyToReplyId] = useState<number | null>(null);
    const [showEditForm, setShowEditForm] = useState<boolean>(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
    // Reply edit/delete states
    const [editingReplyId, setEditingReplyId] = useState<number | null>(null);
    const [deletingReplyId, setDeletingReplyId] = useState<number | null>(null);
    // Handle missing or invalid rating
    const displayRating =
        review.rating && review.rating >= 0 && review.rating <= 5 ? review.rating : 0;
    const truncatedText =
        review.text.length > maxTextLength
            ? `${review.text.slice(0, maxTextLength)}...`
            : review.text;

    // Recommendation logic
    const recommendStatus =
        review.recommend === true
            ? {
                  icon: 'fa-thumbs-up',
                  text: 'Đề xuất đặt lịch hẹn',
                  className: 'recommend-positive thumb-icon',
              }
            : review.recommend === false
              ? {
                    icon: 'fa-thumbs-down',
                    text: 'Không đề xuất đặt lịch hẹn',
                    className: 'recommend-negative',
                }
              : null;

    // Handle reply submission
    const handleReplySubmit = (replyData: { reviewId: number; text: string }) => {
        if (onReply) {
            onReply(replyData);
        }
        setShowReplyForm(false);
        setReplyToReplyId(null);
    };

    // Handle reply to main review
    const handleReplyToReview = () => {
        setShowReplyForm(true);
        setReplyToReplyId(null);
    };

    // Handle reply to a specific reply
    const handleReplyToReply = (replyId: number) => {
        setReplyToReplyId(replyId);
        setShowReplyForm(true);
    };

    // Handle cancel reply
    const handleCancelReply = () => {
        setShowReplyForm(false);
        setReplyToReplyId(null);
    };

    // Handle edit review
    const handleEditReview = () => {
        setShowEditForm(true);
        setShowReplyForm(false);
        setReplyToReplyId(null);
    };

    // Handle submit edit
    const handleSubmitEdit = (reviewData: {
        reviewId: number;
        rating: number;
        description: string;
        recommend?: boolean;
    }) => {
        if (onEdit) {
            onEdit(reviewData);
        }
        setShowEditForm(false);
    };

    // Handle cancel edit
    const handleCancelEdit = () => {
        setShowEditForm(false);
    };

    // Handle delete review
    const handleDeleteReview = () => {
        setShowDeleteConfirm(true);
    };

    // Handle confirm delete
    const handleConfirmDelete = () => {
        if (onDelete) {
            onDelete(review.id);
        }
        setShowDeleteConfirm(false);
    };

    // Handle cancel delete
    const handleCancelDelete = () => {
        setShowDeleteConfirm(false);
    };

    // Reply edit/delete handlers
    const handleEditReply = (replyId: number) => {
        setEditingReplyId(replyId);
    };

    const handleSaveReply = (replyId: number, newText: string) => {
        if (onEditReply) {
            onEditReply({ replyId, text: newText });
        }
        setEditingReplyId(null);
    };

    const handleCancelEditReply = () => {
        setEditingReplyId(null);
    };

    const handleDeleteReply = (replyId: number) => {
        setDeletingReplyId(replyId);
    };

    const handleConfirmDeleteReply = () => {
        if (deletingReplyId && onDeleteReply) {
            onDeleteReply(deletingReplyId);
        }
        setDeletingReplyId(null);
    };

    const handleCancelDeleteReply = () => {
        setDeletingReplyId(null);
    };

    // Check if current user can edit/delete this review
    const isReviewOwner = currentUserId && review.userId === currentUserId;
    const showEditButton = canEdit && isReviewOwner && !showEditForm;
    const showDeleteButton = canDelete && isReviewOwner;

    return (
        <div
            className={clsx('doc-review-card', reviewStyles.reviewCard, { 'mb-0': isLast })}
            role="article"
            aria-label={`Review by ${review.name}`}
        >
            <div className="user-info-review">
                <div className="reviewer-img">
                    <Link
                        to="#"
                        className={clsx(styles.link, 'avatar-img')}
                        onClick={(e) => e.preventDefault()}
                        aria-label={`View profile of ${review.name}`}
                    >
                        <img
                            src={review.avatar || '/default-avatar.png'}
                            alt={`${review.name}'s avatar`}
                            onError={(e) => {
                                e.currentTarget.src = '/default-avatar.png';
                            }}
                        />
                    </Link>
                    <div className="review-star">
                        <Link
                            to="#"
                            className={styles.link}
                            onClick={(e) => e.preventDefault()}
                            aria-label={`Review by ${review.name}`}
                        >
                            {review.name || 'Anonymous'}
                        </Link>
                        <div
                            className="rating"
                            role="img"
                            aria-label={`${displayRating} out of 5 stars`}
                        >
                            {Array.from({ length: 5 }).map((_, i) => (
                                <i
                                    key={i}
                                    className={clsx('fas fa-star', { filled: i < displayRating })}
                                    aria-hidden="true"
                                />
                            ))}
                            <span className="sr-only">{displayRating} out of 5 stars</span>
                            {review.timeAgo && (
                                <span className="time-ago" aria-hidden="true">
                                    {' | '}
                                    {review.timeAgo}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                {recommendStatus && (
                    <span
                        className={clsx('recommend-icon', recommendStatus.className)}
                        role="note"
                        aria-label={recommendStatus.text}
                    >
                        <i
                            className={clsx('fa-regular', recommendStatus.icon)}
                            aria-hidden="true"
                        ></i>{' '}
                        {recommendStatus.text}
                    </span>
                )}
            </div>
            <p>{truncatedText}</p>

            {/* Action buttons for edit/delete */}
            <div className={reviewStyles.actionButtons}>
                {showReplyLink && (
                    <Link
                        to="#"
                        className={clsx(
                            styles.link,
                            'reply',
                            'd-flex',
                            'align-items-center',
                            reviewStyles.replyButton
                        )}
                        onClick={(e) => {
                            e.preventDefault();
                            handleReplyToReview();
                        }}
                        aria-label="Reply to this review"
                    >
                        <i className="fa-solid fa-reply me-2" aria-hidden="true"></i>Phản hồi
                    </Link>
                )}

                {showEditButton && (
                    <Button
                        text="Chỉnh sửa"
                        type="button"
                        className={reviewStyles.editButton}
                        onClick={handleEditReview}
                    />
                )}

                {showDeleteButton && (
                    <Button
                        text="Xóa"
                        type="button"
                        className={reviewStyles.deleteButton}
                        onClick={handleDeleteReview}
                    />
                )}
            </div>

            {/* Edit Form */}
            {showEditForm && (
                <EditReviewForm
                    review={{
                        id: review.id,
                        rating: review.rating || 0,
                        text: review.text,
                        recommend: review.recommend,
                    }}
                    onSubmitEdit={handleSubmitEdit}
                    onCancel={handleCancelEdit}
                />
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className={reviewStyles.deleteConfirmModal}>
                    <div className={reviewStyles.deleteConfirmContent}>
                        <h4>Xác nhận xóa đánh giá</h4>
                        <p>
                            Bạn có chắc chắn muốn xóa đánh giá này? Hành động này không thể hoàn
                            tác.
                        </p>
                        <div className={reviewStyles.deleteConfirmActions}>
                            <Button
                                text="Hủy"
                                type="button"
                                className={reviewStyles.cancelButton}
                                onClick={handleCancelDelete}
                            />
                            <Button
                                text="Xóa"
                                type="button"
                                className={reviewStyles.confirmDeleteButton}
                                onClick={handleConfirmDelete}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Reply Form for main review */}
            {showReplyForm && replyToReplyId === null && (
                <div className={reviewStyles.replyFormContainer}>
                    <ReplyForm
                        reviewId={review.id}
                        onSubmitReply={handleReplySubmit}
                        onCancel={handleCancelReply}
                        placeholder="Viết phản hồi cho đánh giá này..."
                    />
                </div>
            )}
            {review.replies && review.replies.length > 0 && (
                <div
                    className={clsx('replies-section', reviewStyles.repliesSection)}
                    aria-label="Replies to review"
                >
                    {review.replies.map((reply) => (
                        <div
                            key={reply.id}
                            className={clsx('replied-info', reviewStyles.repliedInfo)}
                        >
                            <div className="user-info-review">
                                <div className="reviewer-img">
                                    <Link
                                        to="#"
                                        className={clsx(styles.link, 'avatar-img')}
                                        onClick={(e) => e.preventDefault()}
                                        aria-label={`View profile of ${reply.name}`}
                                    >
                                        <img
                                            src={reply.avatar || '/default-avatar.png'}
                                            alt={`${reply.name}'s avatar`}
                                            onError={(e) => {
                                                e.currentTarget.src = '/default-avatar.png';
                                            }}
                                        />
                                    </Link>
                                    <div className="review-star">
                                        <Link
                                            to="#"
                                            className={styles.link}
                                            onClick={(e) => e.preventDefault()}
                                            aria-label={`Reply by ${reply.name}`}
                                        >
                                            {reply.name || 'Anonymous'}
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Reply text or edit form */}
                            {editingReplyId === reply.id ? (
                                <EditReplyForm
                                    replyId={reply.id}
                                    initialText={reply.text}
                                    placeholder={`Chỉnh sửa phản hồi cho ${reply.name}...`}
                                    onSave={handleSaveReply}
                                    onCancel={handleCancelEditReply}
                                />
                            ) : (
                                <>
                                    <p>{reply.text}</p>

                                    {/* Reply Action Buttons */}
                                    <div className={reviewStyles.replyActionButtons}>
                                        {showReplyLink && (
                                            <Link
                                                to="#"
                                                className={clsx(
                                                    styles.link,
                                                    'reply',
                                                    'd-flex',
                                                    'align-items-center',
                                                    reviewStyles.replyButton
                                                )}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleReplyToReply(reply.id);
                                                }}
                                                aria-label="Reply to this reply"
                                            >
                                                <i
                                                    className="fa-solid fa-reply me-2"
                                                    aria-hidden="true"
                                                ></i>
                                                Phản hồi
                                            </Link>
                                        )}

                                        {/* Edit button for reply owner */}
                                        {canEdit &&
                                            currentUserId &&
                                            reply.userId === currentUserId && (
                                                <Button
                                                    text="Sửa"
                                                    type="button"
                                                    className={reviewStyles.editReplyButton}
                                                    onClick={() => handleEditReply(reply.id)}
                                                />
                                            )}

                                        {/* Delete button for reply owner */}
                                        {canDelete &&
                                            currentUserId &&
                                            reply.userId === currentUserId && (
                                                <Button
                                                    text="Xóa"
                                                    type="button"
                                                    className={reviewStyles.deleteReplyButton}
                                                    onClick={() => handleDeleteReply(reply.id)}
                                                />
                                            )}
                                    </div>
                                </>
                            )}

                            {/* Delete confirmation for reply */}
                            {deletingReplyId === reply.id && (
                                <div className={reviewStyles.deleteConfirmModal}>
                                    <div className={reviewStyles.deleteConfirmContent}>
                                        <h4>Xác nhận xóa phản hồi</h4>
                                        <p>
                                            Bạn có chắc chắn muốn xóa phản hồi này? Hành động này
                                            không thể hoàn tác.
                                        </p>
                                        <div className={reviewStyles.deleteConfirmActions}>
                                            <Button
                                                text="Hủy"
                                                type="button"
                                                className={reviewStyles.cancelButton}
                                                onClick={handleCancelDeleteReply}
                                            />
                                            <Button
                                                text="Xóa"
                                                type="button"
                                                className={reviewStyles.confirmDeleteButton}
                                                onClick={handleConfirmDeleteReply}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Reply Form for specific reply */}
                            {showReplyForm && replyToReplyId === reply.id && (
                                <div className={reviewStyles.replyFormContainer}>
                                    <ReplyForm
                                        reviewId={review.id}
                                        onSubmitReply={handleReplySubmit}
                                        onCancel={handleCancelReply}
                                        placeholder={`Phản hồi cho ${reply.name}...`}
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReviewCard;
