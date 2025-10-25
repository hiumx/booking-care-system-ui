import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import Button from '@/components/Button';
import styles from './EditReplyForm.module.scss';

interface EditReplyFormProps {
    replyId: number;
    initialText: string;
    placeholder?: string;
    onSave: (replyId: number, text: string) => void;
    onCancel: () => void;
}

const EditReplyForm: React.FC<EditReplyFormProps> = ({
    replyId,
    initialText,
    placeholder = 'Chỉnh sửa phản hồi...',
    onSave,
    onCancel,
}) => {
    const [text, setText] = useState<string>(initialText);
    const [error, setError] = useState<string>('');
    const maxChars = 300;
    const minChars = 3;
    const remainingChars = maxChars - text.length;
    const trimmedLength = text.trim().length;

    useEffect(() => {
        setText(initialText);
        setError('');
    }, [initialText]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Clear previous errors
        setError('');

        if (!text.trim()) {
            setError('Vui lòng nhập nội dung phản hồi');
            return;
        }

        // Validate minimum length (backend requirement)
        if (trimmedLength < minChars) {
            setError(`Nội dung phản hồi phải có ít nhất ${minChars} ký tự`);
            return;
        }

        onSave(replyId, text.trim());
    };

    return (
        <div className={styles.editReplyForm}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.textareaSection}>
                    <textarea
                        value={text}
                        onChange={(e) => {
                            setText(e.target.value);
                            setError(''); // Clear error on change
                        }}
                        placeholder={`${placeholder} (tối thiểu 3 ký tự)`}
                        className={clsx(styles.textarea, {
                            [styles.error]: error,
                        })}
                        rows={3}
                        maxLength={maxChars}
                        required
                        autoFocus
                    />

                    {/* Error Message */}
                    {error && <div className={styles.errorMessage}>{error}</div>}

                    <div className={styles.charCounter}>
                        <span
                            className={clsx({
                                [styles.danger]: trimmedLength < minChars && trimmedLength > 0,
                                [styles.success]: trimmedLength >= minChars,
                            })}
                        >
                            {trimmedLength}/{minChars} ký tự tối thiểu
                        </span>
                        <span className={clsx({ [styles.warning]: remainingChars < 20 })}>
                            {remainingChars} ký tự còn lại
                        </span>
                    </div>
                </div>

                <div className={styles.actions}>
                    <Button
                        text="Hủy"
                        type="button"
                        className={styles.cancelButton}
                        onClick={onCancel}
                    />
                    <Button text="Lưu thay đổi" type="submit" className={styles.saveButton} />
                </div>
            </form>
        </div>
    );
};

export default EditReplyForm;
