import React, { useEffect } from 'react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import Button from '@/components/Button';
import { useReviewForm } from '@/hooks/useReviewForm';
import { useStarRating } from '@/hooks/useStarRating';
import styles from './EditReviewForm.module.scss';

interface Review {
    id: number;
    rating: number;
    text: string;
    recommend?: boolean;
}

interface EditReviewFormProps {
    review: Review;
    onSubmitEdit: (reviewData: {
        reviewId: number;
        rating: number;
        description: string;
        recommend?: boolean;
    }) => void;
    onCancel: () => void;
}

const EditReviewForm: React.FC<EditReviewFormProps> = ({ review, onSubmitEdit, onCancel }) => {
    const { t } = useTranslation('common');
    // Use custom hooks for form validation and star rating
    const {
        description,
        setDescription,
        recommend,
        descriptionError,
        setDescriptionError,
        trimmedLength,
        remainingChars,
        maxChars,
        minChars,
        validateForm,
        updateFormValues,
    } = useReviewForm({
        initialRating: review.rating || 0,
        initialDescription: review.text || '',
        initialRecommend: review.recommend,
        maxChars: 500,
        minChars: 5,
    });

    const { rating, setRating, handleStarClick, handleStarHover, handleStarLeave, isStarActive } =
        useStarRating(review.rating || 0);

    // Update form when review ID changes (when editing a different review)

    useEffect(() => {
        updateFormValues(review.rating || 0, review.text || '', review.recommend);
        setRating(review.rating || 0);
        // Only depend on review.id to avoid resetting form while user is typing
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [review.id]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form (pass rating from useStarRating)
        if (!validateForm(rating)) {
            return;
        }

        const reviewData = {
            reviewId: review.id,
            rating,
            description: description.trim(),
            recommend,
        };

        onSubmitEdit(reviewData);
    };

    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            const isActive = isStarActive(i);

            stars.push(
                <i
                    key={i}
                    className={clsx('fa-star', isActive ? 'fas' : 'far', styles.star)}
                    onClick={() => handleStarClick(i)}
                    onMouseEnter={() => handleStarHover(i)}
                    onMouseLeave={handleStarLeave}
                    role="button"
                    tabIndex={0}
                    aria-label={`Rate ${i} star${i > 1 ? 's' : ''}`}
                    style={{
                        color: isActive ? '#ffc107' : '#ddd',
                    }}
                />
            );
        }
        return stars;
    };

    return (
        <div className={styles.editReviewForm}>
            <div className={styles.header}>
                <h4>{t('reviewForm.editTitle')}</h4>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
                {/* Rating Section */}
                <div className={styles.ratingSection}>
                    <label className={styles.label}>
                        {t('reviewForm.yourRating')}{' '}
                        <span className={styles.required}>{t('reviewForm.required')}</span>
                    </label>
                    <div className={styles.stars} role="radiogroup" aria-label="Rating">
                        {renderStars()}
                    </div>
                    <span className={styles.ratingText}>
                        {rating > 0
                            ? t('reviewForm.ratingText', { rating })
                            : t('reviewForm.selectRating')}
                    </span>
                </div>

                {/* Description Section */}
                <div className={styles.descriptionSection}>
                    <label htmlFor="edit-description" className={styles.label}>
                        {t('reviewForm.reviewContent')}{' '}
                        <span className={styles.required}>{t('reviewForm.required')}</span>
                    </label>
                    <textarea
                        id="edit-description"
                        value={description}
                        onChange={(e) => {
                            setDescription(e.target.value);
                            setDescriptionError(''); // Clear error on change
                        }}
                        placeholder={t('reviewForm.reviewPlaceholder')}
                        className={clsx(styles.textarea, {
                            [styles.error]: descriptionError,
                        })}
                        rows={4}
                        maxLength={maxChars}
                        required
                    />

                    {/* Error Message */}
                    {descriptionError && (
                        <div className={styles.errorMessage}>{descriptionError}</div>
                    )}

                    <div className={styles.charCounter}>
                        <span
                            className={clsx({
                                [styles.danger]: trimmedLength < minChars && trimmedLength > 0,
                                [styles.success]: trimmedLength >= minChars,
                            })}
                        >
                            {t('reviewForm.minChars', { current: trimmedLength, min: minChars })}
                        </span>
                        <span className={clsx({ [styles.warning]: remainingChars < 20 })}>
                            {t('reviewForm.remainingChars', { count: remainingChars })}
                        </span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className={styles.actions}>
                    <Button
                        text={t('reviewForm.cancel')}
                        type="button"
                        className={styles.cancelButton}
                        onClick={onCancel}
                    />
                    <Button
                        text={t('reviewForm.updateReview')}
                        type="submit"
                        className={styles.submitButton}
                    />
                </div>
            </form>
        </div>
    );
};

export default EditReviewForm;
