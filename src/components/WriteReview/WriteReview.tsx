import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import Button from '@/components/Button';
import { useReviewForm } from '@/hooks/useReviewForm';
import { useStarRating } from '@/hooks/useStarRating';
import styles from './WriteReview.module.scss';

interface WriteReviewProps {
    doctorName: string;
    onSubmitReview?: (reviewData: {
        rating: number;
        description: string;
        termsAccepted: boolean;
    }) => void;
    onCancel?: () => void;
}

const WriteReview: React.FC<WriteReviewProps> = ({ doctorName, onSubmitReview, onCancel }) => {
    const { t } = useTranslation('common');
    const [termsAccepted, setTermsAccepted] = useState<boolean>(false);

    // Use custom hooks for form validation and star rating
    const {
        description,
        setDescription,
        descriptionError,
        setDescriptionError,
        trimmedLength,
        remainingChars,
        maxChars,
        minChars,
        validateForm,
    } = useReviewForm({ maxChars: 100, minChars: 5 });

    const { rating, setRating, handleStarClick, handleStarHover, handleStarLeave, isStarActive } =
        useStarRating(0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form (pass rating to validateForm)
        if (!validateForm(rating)) {
            return;
        }

        const reviewData = {
            rating,
            description: description.trim(),
            termsAccepted,
        };

        onSubmitReview?.(reviewData);

        // Reset form
        setDescription('');
        setRating(0);
        setTermsAccepted(false);
    };

    const getStarClass = (starValue: number) => {
        return isStarActive(starValue) ? 'active' : '';
    };

    return (
        <div className={clsx('write-review', styles.writeReview)}>
            <h4>
                {t('writeReview.title')} <strong>{doctorName}</strong>
            </h4>

            {/* Write Review Form */}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="mb-2" htmlFor="star-rating">
                        {t('writeReview.ratingLabel')}
                    </label>
                    <div className={clsx('star-rating', styles.starRating)} id="star-rating">
                        {[5, 4, 3, 2, 1].map((starValue) => (
                            <React.Fragment key={starValue}>
                                <input
                                    id={`star-${starValue}`}
                                    type="radio"
                                    name="rating"
                                    value={`star-${starValue}`}
                                    checked={rating === starValue}
                                    onChange={() => handleStarClick(starValue)}
                                    className={styles.starInput}
                                />
                                <label
                                    htmlFor={`star-${starValue}`}
                                    title={t('writeReview.starTitle', { count: starValue })}
                                    onMouseEnter={() => handleStarHover(starValue)}
                                    onMouseLeave={handleStarLeave}
                                    className={styles.starLabel}
                                    aria-label={t('writeReview.starTitle', { count: starValue })}
                                >
                                    <i
                                        className={clsx('fa fa-star', styles.faStar, {
                                            [styles.active]: getStarClass(starValue) === 'active',
                                        })}
                                    ></i>
                                </label>
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                <div className="mb-3">
                    <label className="mb-2" htmlFor="review_desc">
                        {t('writeReview.contentLabel')}{' '}
                        <span className="text-danger">{t('writeReview.required')}</span>
                    </label>
                    <textarea
                        id="review_desc"
                        maxLength={maxChars}
                        className={clsx(styles.formControl, 'form-control', {
                            'is-invalid': descriptionError,
                        })}
                        rows={4}
                        placeholder={t('writeReview.placeholder')}
                        value={description}
                        onChange={(e) => {
                            setDescription(e.target.value);
                            setDescriptionError(''); // Clear error on change
                        }}
                    />

                    {/* Error Message */}
                    {descriptionError && (
                        <div className="invalid-feedback d-block">{descriptionError}</div>
                    )}

                    <div className="d-flex justify-content-between mt-2">
                        <small
                            className={clsx({
                                'text-danger': trimmedLength < minChars && trimmedLength > 0,
                                'text-success': trimmedLength >= minChars,
                                'text-muted': trimmedLength === 0,
                            })}
                        >
                            {t('writeReview.minChars', { current: trimmedLength, min: minChars })}
                        </small>
                        <small className="text-muted">
                            <span id="chars">
                                {t('writeReview.remainingChars', { count: remainingChars })}
                            </span>
                        </small>
                    </div>
                </div>

                <hr />

                <div className="mb-3 d-none">
                    <div className="terms-accept">
                        <div className={clsx(styles.termsAccept, styles.customCheckbox)}>
                            <input
                                type="checkbox"
                                id="terms_accept"
                                checked={termsAccepted}
                                onChange={(e) => setTermsAccepted(e.target.checked)}
                            />
                            <label htmlFor="terms_accept">
                                {t('writeReview.termsText')}{' '}
                                <Link to="/terms-conditions" target="_blank">
                                    {t('writeReview.termsLink')}
                                </Link>
                            </label>
                        </div>
                    </div>
                </div>

                <div className={styles.submitSection}>
                    <Button
                        text={t('writeReview.submitButton')}
                        type="submit"
                        className={styles.submitBtn}
                    />
                    {onCancel && (
                        <Button
                            text={t('writeReview.cancelButton')}
                            type="button"
                            className={clsx('ms-2', styles.cancelBtn)}
                            onClick={onCancel}
                        />
                    )}
                </div>
            </form>
            {/* /Write Review Form */}
        </div>
    );
};

export default WriteReview;
