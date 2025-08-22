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
    const maxChars = 300;
    const remainingChars = maxChars - replyText.length;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!replyText.trim()) {
            alert('Vui lòng nhập nội dung phản hồi');
            return;
        }

        if (replyText.length > maxChars) {
            alert(`Nội dung phản hồi không được vượt quá ${maxChars} ký tự`);
            return;
        }

        onSubmitReply({
            reviewId,
            text: replyText.trim(),
        });

        // Reset form
        setReplyText('');
    };

    return (
        <div className={clsx('reply-form', styles.replyForm)}>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <textarea
                        className="form-control"
                        rows={3}
                        placeholder={placeholder}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        maxLength={maxChars}
                    />
                    <div className="d-flex justify-content-between mt-2">
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
