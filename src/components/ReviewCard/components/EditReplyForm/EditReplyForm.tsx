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
    const maxChars = 300;
    const remainingChars = maxChars - text.length;

    useEffect(() => {
        setText(initialText);
    }, [initialText]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!text.trim()) {
            alert('Vui lòng nhập nội dung phản hồi');
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
                        onChange={(e) => setText(e.target.value)}
                        placeholder={placeholder}
                        className={styles.textarea}
                        rows={3}
                        maxLength={maxChars}
                        required
                        autoFocus
                    />
                    <div className={styles.charCounter}>
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
