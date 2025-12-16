import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
    placeholder,
}) => {
    const { t } = useTranslation('common');
    const defaultPlaceholder = placeholder || t('replyForm.placeholder');
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
            setError(t('replyForm.emptyError'));
            return;
        }

        // Validate minimum length (backend requirement)
        if (trimmedLength < minChars) {
            setError(t('replyForm.minLengthError', { min: minChars }));
            return;
        }

        if (replyText.length > maxChars) {
            setError(t('replyForm.maxLengthError', { max: maxChars }));
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
                        placeholder={t('replyForm.placeholderWithMin', {
                            placeholder: defaultPlaceholder,
                        })}
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
                            {t('replyForm.minChars', { current: trimmedLength, min: minChars })}
                        </small>
                        <small className="text-muted">
                            {t('replyForm.remainingChars', { count: remainingChars })}
                        </small>
                    </div>
                </div>

                <div className={clsx('d-flex', 'gap-2', styles.buttonGroup)}>
                    <Button
                        text={t('replyForm.submit')}
                        type="submit"
                        className={styles.submitButton}
                    />
                    <Button
                        text={t('replyForm.cancel')}
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
