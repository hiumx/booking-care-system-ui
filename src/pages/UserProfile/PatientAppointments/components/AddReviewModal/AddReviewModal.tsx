import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import styles from './AddReviewModal.module.scss';
import Button from '@/components/Button';

interface AddReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (rating: number, comment: string) => void;
}

const AddReviewModal: React.FC<AddReviewModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [rating, setRating] = useState<number>(5);
    const [comment, setComment] = useState<string>('');
    const [hoveredRating, setHoveredRating] = useState<number>(0);
    const [isAnimating, setIsAnimating] = useState<boolean>(false);
    const [shouldRender, setShouldRender] = useState<boolean>(false);

    // Handle modal animation and rendering
    useEffect(() => {
        if (isOpen) {
            // Start rendering modal
            setShouldRender(true);
            document.body.style.overflow = 'hidden';

            // Reset form
            setRating(5);
            setComment('');
            setHoveredRating(0);

            // Start animation after a small delay
            setTimeout(() => {
                setIsAnimating(true);
            }, 10);
        } else if (shouldRender) {
            // Start closing animation
            setIsAnimating(false);

            // Remove modal from DOM after animation completes
            setTimeout(() => {
                setShouldRender(false);
                document.body.style.overflow = '';
            }, 300); // 300ms matches CSS transition duration
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen, shouldRender]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (rating > 0 && comment.trim()) {
            onSubmit(rating, comment.trim());
            handleClose();
        }
    };

    const handleClose = () => {
        setRating(5);
        setComment('');
        setHoveredRating(0);
        onClose();
    };

    const handleRatingClick = (value: number) => {
        setRating(value);
    };

    const handleRatingHover = (value: number) => {
        setHoveredRating(value);
    };

    const handleRatingLeave = () => {
        setHoveredRating(0);
    };

    if (!shouldRender) return null;

    return (
        <div
            className={clsx('modal fade custom-modals', styles.modalOverlay, {
                [styles.show]: isAnimating,
                show: isAnimating,
            })}
            style={{ display: 'block' }}
            tabIndex={-1}
        >
            <input
                type="button"
                className={clsx('modal-backdrop fade', {
                    [styles.backdropShow]: isAnimating,
                    show: isAnimating,
                })}
                onClick={handleClose}
                onKeyDown={(e) => e.key === 'Escape' && handleClose()}
                tabIndex={0}
                aria-label="Close modal"
                style={{
                    zIndex: 1040,
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    cursor: 'pointer',
                }}
            />
            <div
                className={clsx('modal-dialog modal-dialog-centered', styles.modalDialog)}
                style={{ zIndex: 1050, position: 'relative' }}
            >
                <div
                    className={clsx('modal-content', styles.modalContent, {
                        [styles.modalAnimate]: isAnimating,
                        [styles.modalAnimateOut]: !isAnimating && shouldRender,
                    })}
                >
                    <div className="modal-header">
                        <h3 className="modal-title">Tạo đánh giá</h3>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={handleClose}
                            aria-label="Close"
                        >
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="add-dependent">
                            <div className="modal-body pb-0">
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="mb-3">
                                            <fieldset>
                                                <legend className="form-label">
                                                    Đánh giá <span className="text-danger">*</span>
                                                </legend>
                                                <div className="selection-wrap">
                                                    <div className="d-inline-block">
                                                        <div
                                                            className={clsx(
                                                                styles.ratingSelection,
                                                                'rating-selction'
                                                            )}
                                                        >
                                                            {[5, 4, 3, 2, 1].map((value) => (
                                                                <React.Fragment key={value}>
                                                                    <input
                                                                        type="radio"
                                                                        name="rating"
                                                                        value={value}
                                                                        id={`rating${value}`}
                                                                        checked={rating === value}
                                                                        onChange={() =>
                                                                            handleRatingClick(value)
                                                                        }
                                                                        className="d-none"
                                                                        aria-label={`${value} star${value > 1 ? 's' : ''}`}
                                                                    />
                                                                    <label
                                                                        htmlFor={`rating${value}`}
                                                                        className={clsx(
                                                                            styles.ratingLabel,
                                                                            {
                                                                                [styles.active]:
                                                                                    (hoveredRating ||
                                                                                        rating) >=
                                                                                    value,
                                                                            }
                                                                        )}
                                                                        onMouseEnter={() =>
                                                                            handleRatingHover(value)
                                                                        }
                                                                        onMouseLeave={
                                                                            handleRatingLeave
                                                                        }
                                                                        title={`${value} star${value > 1 ? 's' : ''}`}
                                                                        aria-label={`${value} star${value > 1 ? 's' : ''}`}
                                                                    >
                                                                        <i className="fa-solid fa-star"></i>
                                                                    </label>
                                                                </React.Fragment>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </fieldset>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="reviewComment" className="form-label">
                                                Cảm nghĩ của bạn{' '}
                                                <span className="text-danger">*</span>
                                            </label>
                                            <textarea
                                                id="reviewComment"
                                                className="form-control"
                                                rows={3}
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                                placeholder="Share your experience..."
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <div className="modal-btn text-end">
                                <button
                                    type="button"
                                    className="btn btn-md btn-dark rounded-pill"
                                    onClick={handleClose}
                                >
                                    Huỷ
                                </button>
                                <Button
                                    text="Thêm đánh giá"
                                    type="submit"
                                    className="btn btn-md btn-primary-gradient rounded-pill"
                                    isDisabled={!rating || !comment.trim()}
                                />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddReviewModal;
