import React, { useState, useRef, useEffect } from 'react';
import { Paperclip, Trash2, Mic, Send } from 'lucide-react';
import styles from './SearchBox.module.scss';

interface SearchBoxProps {
    onSearch: (text: string) => void; // giống code cũ
    onClear?: () => void;
    onAttach?: () => void;
    isLoading?: boolean;
}

const SearchBox: React.FC<SearchBoxProps> = ({
    onSearch,
    onClear,
    onAttach,
    isLoading = false,
}) => {
    const [text, setText] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const recognitionRef = useRef<SpeechRecognition | null>(null);

    // setup speech recognition
    useEffect(() => {
        const SpeechRecognition =
            (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
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
                setText((prev) => prev + ' ' + transcript.trim());
            };

            recognition.onend = () => {
                setIsRecording(false);
            };
        }
    }, []);

    const handleStartRecording = () => {
        if (isRecording) {
            recognitionRef.current?.stop();
            setIsRecording(false);
        } else {
            recognitionRef.current?.start();
            setIsRecording(true);
        }
    };

    const handleSearch = () => {
        if (text.trim()) {
            onSearch(text.trim());
            setText('');
        }
    };

    const handleClear = () => {
        setText('');
        if (onClear) onClear();
    };

    // 👇 logic Enter giống code cũ
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSearch();
        }
    };

    return (
        <div className={`${styles.searchBoxWrapper} ${isRecording ? styles.recording : ''}`}>
            {/* textarea */}
            <textarea
                placeholder="What do you want to know?"
                rows={4}
                value={text}
                disabled={isLoading}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown} // 👈 giữ logic enter để search
                className={`${styles.textarea} ${isRecording ? styles.textareaRecording : ''}`}
            />

            {/* action row */}
            <div className={styles.iconRow}>
                {/* left actions */}
                <div className={styles.leftIcons}>
                    <button
                        type="button"
                        title="Đính kèm tập tin"
                        onClick={onAttach}
                        className={styles.iconButton}
                    >
                        <Paperclip size={16} />
                    </button>

                    <button
                        type="button"
                        title="Gửi"
                        onClick={handleSearch}
                        className={styles.autoButton}
                    >
                        <Send size={14} />
                        Auto
                    </button>

                    <button
                        type="button"
                        title="Xóa nội dung"
                        onClick={handleClear}
                        className={styles.iconButton}
                    >
                        <Trash2 size={16} />
                    </button>
                </div>

                {/* mic */}
                <button
                    type="button"
                    title={isRecording ? 'Dừng ghi âm' : 'Ghi âm'}
                    onClick={handleStartRecording}
                    className={`${styles.micButton} ${isRecording ? styles.recording : ''}`}
                >
                    <Mic size={16} />
                </button>
            </div>
        </div>
    );
};

export default SearchBox;
