import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import styles from '@/pages/Doctor/DoctorProfile/DoctorProfile.module.scss';
import reviewStyles from './ReviewCard.module.scss';
import ReplyForm from './components/ReplyForm';
import EditReviewForm from './components/EditReviewForm';
import EditReplyForm from './components/EditReplyForm';
import Button from '@/components/Button';
import ConfirmDialog from '@/components/ConfirmDialog';
import userDefault from '@/assets/img/patients/patient.jpg';

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
    currentUserId?: number; // For review permission check (patientId)
    currentReplyUserId?: number; // For reply permission check (authorId)
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
    currentReplyUserId,
    onEdit,
    onDelete,
    onEditReply,
    onDeleteReply,
}) => {
    const { t } = useTranslation('common');
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
        setShowEditForm(false);
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

        setShowReplyForm(false);
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
            aria-label={t('review.reviewBy', { name: review.name })}
        >
            <div className="user-info-review">
                <div className="reviewer-img">
                    <Link
                        to="#"
                        className={clsx(styles.link, 'avatar-img')}
                        onClick={(e) => e.preventDefault()}
                        aria-label={t('review.viewProfile', { name: review.name })}
                    >
                        <img
                            src={review.avatar || userDefault}
                            alt={`${review.name}'s avatar`}
                            onError={(e) => {
                                e.currentTarget.src = userDefault;
                            }}
                        />
                    </Link>
                    <div className="review-star">
                        <Link
                            to="#"
                            className={styles.link}
                            onClick={(e) => e.preventDefault()}
                            aria-label={t('review.reviewBy', { name: review.name })}
                        >
                            {review.name || t('review.anonymous')}
                        </Link>
                        <div
                            className="rating"
                            role="img"
                            aria-label={t('review.outOf5Stars', { rating: displayRating })}
                        >
                            {Array.from({ length: 5 }).map((_, i) => (
                                <i
                                    key={i}
                                    className={clsx('fas fa-star', { filled: i < displayRating })}
                                    aria-hidden="true"
                                />
                            ))}
                            <span className="sr-only">
                                {t('review.outOf5Stars', { rating: displayRating })}
                            </span>
                            {review.timeAgo && (
                                <span className="time-ago" aria-hidden="true">
                                    {' | '}
                                    {review.timeAgo}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
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
                        aria-label={t('review.replyToReview')}
                    >
                        <i className="fa-solid fa-reply me-2" aria-hidden="true"></i>
                        {t('review.reply')}
                    </Link>
                )}

                {showEditButton && (
                    <Button
                        text={t('review.edit')}
                        type="button"
                        className={reviewStyles.editButton}
                        onClick={handleEditReview}
                    />
                )}

                {showDeleteButton && (
                    <Button
                        text={t('review.delete')}
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

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                isOpen={showDeleteConfirm}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                title={t('review.confirmDeleteTitle')}
                message={t('review.confirmDeleteMessage')}
                confirmText={t('review.confirmButton')}
                cancelText={t('review.cancelButton')}
                type="danger"
            />

            {/* Reply Form for main review */}
            {showReplyForm && replyToReplyId === null && (
                <div className={reviewStyles.replyFormContainer}>
                    <ReplyForm
                        reviewId={review.id}
                        onSubmitReply={handleReplySubmit}
                        onCancel={handleCancelReply}
                        placeholder={t('replyForm.replyToReview')}
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
                                        aria-label={t('review.viewProfile', { name: reply.name })}
                                    >
                                        <img
                                            src={reply.avatar || userDefault}
                                            alt={`${reply.name}'s avatar`}
                                            onError={(e) => {
                                                e.currentTarget.src = userDefault;
                                            }}
                                        />
                                    </Link>
                                    <div className="review-star">
                                        <Link
                                            to="#"
                                            className={styles.link}
                                            onClick={(e) => e.preventDefault()}
                                            aria-label={t('review.replyBy', { name: reply.name })}
                                        >
                                            {reply.name || t('review.anonymous')}
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Reply text or edit form */}
                            {editingReplyId === reply.id ? (
                                <EditReplyForm
                                    replyId={reply.id}
                                    initialText={reply.text}
                                    placeholder={t('replyForm.editReplyTo', { name: reply.name })}
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
                                                aria-label={t('review.replyToReply')}
                                            >
                                                <i
                                                    className="fa-solid fa-reply me-2"
                                                    aria-hidden="true"
                                                ></i>
                                                {t('review.reply')}
                                            </Link>
                                        )}

                                        {/* Edit button for reply owner */}
                                        {canEdit &&
                                            currentReplyUserId &&
                                            reply.userId === currentReplyUserId && (
                                                <Button
                                                    text={t('review.editReply')}
                                                    type="button"
                                                    className={reviewStyles.editReplyButton}
                                                    onClick={() => handleEditReply(reply.id)}
                                                />
                                            )}

                                        {/* Delete button for reply owner */}
                                        {canDelete &&
                                            currentReplyUserId &&
                                            reply.userId === currentReplyUserId && (
                                                <Button
                                                    text={t('review.deleteReply')}
                                                    type="button"
                                                    className={reviewStyles.deleteReplyButton}
                                                    onClick={() => handleDeleteReply(reply.id)}
                                                />
                                            )}
                                    </div>
                                </>
                            )}

                            {/* Delete confirmation for reply */}
                            <ConfirmDialog
                                isOpen={deletingReplyId === reply.id}
                                onClose={handleCancelDeleteReply}
                                onConfirm={handleConfirmDeleteReply}
                                title={t('review.confirmDeleteReplyTitle')}
                                message={t('review.confirmDeleteReplyMessage')}
                                confirmText={t('review.confirmButton')}
                                cancelText={t('review.cancelButton')}
                                type="danger"
                            />

                            {/* Reply Form for specific reply */}
                            {showReplyForm && replyToReplyId === reply.id && (
                                <div className={reviewStyles.replyFormContainer}>
                                    <ReplyForm
                                        reviewId={review.id}
                                        onSubmitReply={handleReplySubmit}
                                        onCancel={handleCancelReply}
                                        placeholder={t('replyForm.replyTo', { name: reply.name })}
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
