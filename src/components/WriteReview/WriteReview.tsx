import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { toast } from 'react-toastify';
import Button from '@/components/Button';
import styles from './WriteReview.module.scss';

interface WriteReviewProps {
    doctorName: string;
    onSubmitReview?: (reviewData: {
        rating: number;
        description: string;
        termsAccepted: boolean;
    }) => void;
}

const WriteReview: React.FC<WriteReviewProps> = ({ doctorName, onSubmitReview }) => {
    const [rating, setRating] = useState<number>(0);
    const [description, setDescription] = useState<string>('');
    const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
    const [hoveredStar, setHoveredStar] = useState<number>(0);
    const [descriptionError, setDescriptionError] = useState<string>('');

    const maxChars = 100;
    const minChars = 5;
    const remainingChars = maxChars - description.length;
    const trimmedLength = description.trim().length;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Clear previous errors
        setDescriptionError('');

        if (rating === 0) {
            toast.warning('Vui lòng chọn đánh giá sao', {
                position: 'top-center',
                autoClose: 3000,
            });
            return;
        }

        if (!description.trim()) {
            setDescriptionError('Vui lòng nhập nội dung review');
            toast.error('Vui lòng nhập nội dung đánh giá', {
                position: 'top-center',
                autoClose: 3000,
            });
            return;
        }

        // Validate minimum length (backend requirement)
        if (trimmedLength < minChars) {
            setDescriptionError(`Nội dung review phải có ít nhất ${minChars} ký tự`);
            toast.error(`Nội dung đánh giá phải có ít nhất ${minChars} ký tự`, {
                position: 'top-center',
                autoClose: 3000,
            });
            return;
        }

        if (!termsAccepted) {
            toast.warning('Vui lòng đồng ý với điều khoản & điều kiện', {
                position: 'top-center',
                autoClose: 3000,
            });
            return;
        }

        const reviewData = {
            rating,
            description: description.trim(),
            termsAccepted,
        };

        onSubmitReview?.(reviewData);

        // Reset form
        setRating(0);
        setDescription('');
        setTermsAccepted(false);
        setHoveredStar(0);
        setDescriptionError('');
    };

    const handleStarClick = (starValue: number) => {
        setRating(starValue);
    };

    const handleStarHover = (starValue: number) => {
        setHoveredStar(starValue);
    };

    const handleStarLeave = () => {
        setHoveredStar(0);
    };

    const getStarClass = (starValue: number) => {
        if (hoveredStar > 0) {
            return starValue <= hoveredStar ? 'active' : '';
        }
        return starValue <= rating ? 'active' : '';
    };

    return (
        <div className={clsx('write-review', styles.writeReview)}>
            <h4>
                Viết đánh giá cho <strong>{doctorName}</strong>
            </h4>

            {/* Write Review Form */}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="mb-2" htmlFor="star-rating">
                        Đánh giá
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
                                    title={`${starValue} sao`}
                                    onMouseEnter={() => handleStarHover(starValue)}
                                    onMouseLeave={handleStarLeave}
                                    className={styles.starLabel}
                                    aria-label={`${starValue} sao`}
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
                        Nội dung đánh giá <span className="text-danger">*</span>
                    </label>
                    <textarea
                        id="review_desc"
                        maxLength={maxChars}
                        className={clsx(styles.formControl, 'form-control', {
                            'is-invalid': descriptionError,
                        })}
                        rows={4}
                        placeholder="Chia sẻ trải nghiệm của bạn với bác sĩ... (tối thiểu 5 ký tự)"
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
                            {trimmedLength}/{minChars} ký tự tối thiểu
                        </small>
                        <small className="text-muted">
                            <span id="chars">{remainingChars}</span> ký tự còn lại
                        </small>
                    </div>
                </div>

                <hr />

                <div className="mb-3">
                    <div className="terms-accept">
                        <div className={clsx(styles.termsAccept, styles.customCheckbox)}>
                            <input
                                type="checkbox"
                                id="terms_accept"
                                checked={termsAccepted}
                                onChange={(e) => setTermsAccepted(e.target.checked)}
                            />
                            <label htmlFor="terms_accept">
                                Tôi đã đọc và đồng ý với{' '}
                                <Link to="/terms-conditions" target="_blank">
                                    Điều khoản &amp; Điều kiện
                                </Link>
                            </label>
                        </div>
                    </div>
                </div>

                <div className={styles.submitSection}>
                    <Button text="Thêm đánh giá" type="submit" className={styles.submitBtn} />
                </div>
            </form>
            {/* /Write Review Form */}
        </div>
    );
};

export default WriteReview;
