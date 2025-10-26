import React, { useState } from 'react';
import Button from '@/components/Button';
import clsx from 'clsx';
import styles from './ReplyForm.module.scss';

interface ReplyFormProps {
    reviewId: number;
    onSubmitReply: (replyData: { reviewId: number; text: string }) => void;
    onCancel: () => void;
    placeholder?: string;
}

const ReplyForm: React.FC<ReplyFormProps> = ({
    reviewId,
    onSubmitReply,
    onCancel,
    placeholder = 'Viết phản hồi của bạn...',
}) => {
    const [replyText, setReplyText] = useState<string>('');
    const [error, setError] = useState<string>('');
    const maxChars = 300;
    const minChars = 3;
    const remainingChars = maxChars - replyText.length;
    const trimmedLength = replyText.trim().length;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Clear previous errors
        setError('');

        if (!replyText.trim()) {
            setError('Vui lòng nhập nội dung phản hồi');
            return;
        }

        // Validate minimum length (backend requirement)
        if (trimmedLength < minChars) {
            setError(`Nội dung phản hồi phải có ít nhất ${minChars} ký tự`);
            return;
        }

        if (replyText.length > maxChars) {
            setError(`Nội dung phản hồi không được vượt quá ${maxChars} ký tự`);
            return;
        }

        onSubmitReply({
            reviewId,
            text: replyText.trim(),
        });

        // Reset form
        setReplyText('');
        setError('');
    };

    return (
        <div className={clsx('reply-form', styles.replyForm)}>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <textarea
                        className={clsx('form-control', {
                            'is-invalid': error,
                        })}
                        rows={3}
                        placeholder={`${placeholder} (tối thiểu 3 ký tự)`}
                        value={replyText}
                        onChange={(e) => {
                            setReplyText(e.target.value);
                            setError(''); // Clear error on change
                        }}
                        maxLength={maxChars}
                    />

                    {/* Error Message */}
                    {error && <div className="invalid-feedback d-block">{error}</div>}

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
                            <span>{remainingChars}</span> ký tự còn lại
                        </small>
                    </div>
                </div>

                <div className={clsx('d-flex', 'gap-2', styles.buttonGroup)}>
                    <Button text="Gửi phản hồi" type="submit" className={styles.submitButton} />
                    <Button
                        text="Hủy"
                        type="button"
                        className={styles.cancelButton}
                        onClick={onCancel}
                    />
                </div>
            </form>
        </div>
    );
};

export default ReplyForm;
