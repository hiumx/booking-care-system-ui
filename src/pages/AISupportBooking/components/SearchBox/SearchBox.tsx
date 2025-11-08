import React, { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import {
    Paperclip,
    Trash2,
    Mic,
    Send,
    Image,
    Lightbulb,
    Telescope,
    BookOpen,
    MoreHorizontal,
    ChevronRight,
} from 'lucide-react';
import styles from './SearchBox.module.scss';

interface SearchBoxProps {
    value: string;
    onChange: (value: string) => void;
    onSend: () => void;
    placeholder?: string;
}

const SearchBox: React.FC<SearchBoxProps> = ({
    value,
    onChange,
    onSend,
    placeholder = 'Mô tả triệu chứng hoặc nhu cầu khám bệnh của bạn...',
}) => {
    const [isRecording, setIsRecording] = useState(false);
    const [isMultiLine, setIsMultiLine] = useState(false);
    const [showAttachmentModal, setShowAttachmentModal] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const valueRef = useRef<string>(value);
    const modalRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    // Update valueRef when value changes
    useEffect(() => {
        valueRef.current = value;
    }, [value]);

    // Close modal when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                modalRef.current &&
                buttonRef.current &&
                !modalRef.current.contains(event.target as Node) &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setShowAttachmentModal(false);
            }
        };

        if (showAttachmentModal) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showAttachmentModal]);

    // Setup speech recognition
    useEffect(() => {
        const SpeechRecognition =
            (globalThis as any).SpeechRecognition || (globalThis as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'vi-VN';
            recognitionRef.current = recognition;

            recognition.onresult = (event: SpeechRecognitionEvent) => {
                let transcript = '';
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    transcript += event.results[i][0].transcript;
                }
                const newText = valueRef.current + ' ' + transcript.trim();
                onChange(newText);
            };

            recognition.onend = () => {
                setIsRecording(false);
            };
        }
    }, [onChange]);

    const handleSend = () => {
        if (value.trim()) {
            onSend();
            setIsMultiLine(false);
            // Reset textarea height
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
            }
            textareaRef.current?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange(e.target.value);
        // Auto-resize textarea
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            const scrollHeight = textareaRef.current.scrollHeight;
            const lineHeight = parseFloat(window.getComputedStyle(textareaRef.current).lineHeight);
            const singleLineHeight = lineHeight || 22.5; // fallback to 1.5em for 15px font

            // Check if more than 1 line (with small threshold)
            const isMoreThanOneLine = scrollHeight > singleLineHeight * 1.2;
            setIsMultiLine(isMoreThanOneLine);

            // Set max height to 3 lines
            const maxHeight = singleLineHeight * 3;
            textareaRef.current.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
        }
    };

    const handleStartRecording = () => {
        if (isRecording) {
            recognitionRef.current?.stop();
            setIsRecording(false);
        } else {
            recognitionRef.current?.start();
            setIsRecording(true);
        }
    };

    const handleClear = () => {
        onChange('');
        setIsMultiLine(false);
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }
    };

    const handleAttachmentClick = () => {
        setShowAttachmentModal(!showAttachmentModal);
    };

    const handleFileUpload = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*,application/pdf,.doc,.docx';
        input.multiple = true;
        input.onchange = (e) => {
            const files = (e.target as HTMLInputElement).files;
            if (files && files.length > 0) {
                // TODO: Handle file upload
                console.log('Files selected:', files);
            }
        };
        input.click();
        setShowAttachmentModal(false);
    };

    const handleMenuItemClick = (action: string) => {
        console.log('Menu item clicked:', action);
        setShowAttachmentModal(false);
        // TODO: Implement actions for each menu item
    };

    return (
        <div
            className={clsx(styles.searchBoxWrapper, {
                [styles.recording]: isRecording,
                [styles.multiLine]: isMultiLine,
            })}
        >
            <textarea
                ref={textareaRef}
                placeholder={placeholder}
                rows={1}
                value={value}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className={clsx(styles.textarea, {
                    [styles.textareaRecording]: isRecording,
                })}
            />

            <div className={styles.iconRow}>
                <div className={styles.leftIcons}>
                    <div className={styles.attachmentWrapper}>
                        <button
                            ref={buttonRef}
                            type="button"
                            data-tooltip="Đính kèm tập tin"
                            onClick={handleAttachmentClick}
                            className={clsx(styles.iconButton, {
                                [styles.active]: showAttachmentModal,
                            })}
                        >
                            <Paperclip size={16} />
                        </button>
                        {showAttachmentModal && (
                            <div ref={modalRef} className={styles.attachmentModal}>
                                <button className={styles.menuItem} onClick={handleFileUpload}>
                                    <Paperclip size={18} />
                                    <span>Add photos & files</span>
                                </button>
                                <div className={styles.menuDivider}></div>
                                <button
                                    className={styles.menuItem}
                                    onClick={() => handleMenuItemClick('create-image')}
                                >
                                    <Image size={18} />
                                    <span>Create image</span>
                                </button>
                                <button
                                    className={styles.menuItem}
                                    onClick={() => handleMenuItemClick('thinking')}
                                >
                                    <Lightbulb size={18} />
                                    <span>Thinking</span>
                                </button>
                                <button
                                    className={styles.menuItem}
                                    onClick={() => handleMenuItemClick('deep-research')}
                                >
                                    <Telescope size={18} />
                                    <span>Deep research</span>
                                </button>
                                <button
                                    className={styles.menuItem}
                                    onClick={() => handleMenuItemClick('study-learn')}
                                >
                                    <BookOpen size={18} />
                                    <span>Study and learn</span>
                                </button>
                                <button
                                    className={styles.menuItem}
                                    onClick={() => handleMenuItemClick('more')}
                                >
                                    <MoreHorizontal size={18} />
                                    <span>... More</span>
                                    <ChevronRight size={16} className={styles.chevronIcon} />
                                </button>
                            </div>
                        )}
                    </div>

                    <button
                        type="button"
                        data-tooltip={isRecording ? 'Dừng ghi âm' : 'Ghi âm'}
                        onClick={handleStartRecording}
                        className={clsx(styles.micButton, {
                            [styles.recording]: isRecording,
                        })}
                    >
                        <Mic size={16} />
                    </button>

                    <button
                        type="button"
                        data-tooltip="Xóa nội dung"
                        onClick={handleClear}
                        className={styles.iconButton}
                    >
                        <Trash2 size={16} />
                    </button>
                </div>

                <button
                    type="button"
                    data-tooltip="Gửi"
                    onClick={handleSend}
                    className={styles.autoButton}
                >
                    <Send size={14} />
                    Gửi
                </button>
            </div>
        </div>
    );
};

export default SearchBox;
