import React, { useState, useRef, useEffect } from 'react';
import { Paperclip, Trash2, Mic, Send } from 'lucide-react';
import styles from './SearchBox.module.scss';

interface SearchBoxProps {
    symptoms: string;
    onSymptomsChange: (symptoms: string) => void;
    onSearch: () => void;
    isLoading?: boolean;
}

const SearchBox: React.FC<SearchBoxProps> = ({
    symptoms,
    onSymptomsChange,
    onSearch,
    isLoading = false,
}) => {
    const [isRecording, setIsRecording] = useState(false);
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const symptomsRef = useRef<string>(symptoms);

    // Update symptomsRef when symptoms prop changes
    useEffect(() => {
        symptomsRef.current = symptoms;
    }, [symptoms]);

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
                console.log('🎤 Speech recognition result:', transcript);
                console.log('🎤 Current symptoms:', symptomsRef.current);

                // Sử dụng symptomsRef.current để đảm bảo có giá trị mới nhất
                const newText = symptomsRef.current + ' ' + transcript.trim();
                onSymptomsChange(newText);
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
        console.log('🔍 SearchBox handleSearch called with symptoms:', symptoms);
        if (symptoms.trim()) {
            console.log('🔍 Calling onSearch...');
            onSearch();
        } else {
            console.log('🔍 No symptoms to search');
        }
    };

    const handleClear = () => {
        onSymptomsChange('');
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
                placeholder="Mô tả triệu chứng hoặc nhu cầu khám bệnh của bạn..."
                rows={4}
                value={symptoms}
                disabled={isLoading}
                onChange={(e) => onSymptomsChange(e.target.value)}
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
                        onClick={() => {}}
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
