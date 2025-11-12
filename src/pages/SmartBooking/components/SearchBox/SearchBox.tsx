import React from 'react';
import { Paperclip, Trash2, Mic, Send } from 'lucide-react';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
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
    // Use speech recognition hook
    const { isRecording, toggleRecording } = useSpeechRecognition({
        onTranscript: onSymptomsChange,
        currentValue: symptoms,
    });

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
                    onClick={toggleRecording}
                    className={`${styles.micButton} ${isRecording ? styles.recording : ''}`}
                >
                    <Mic size={16} />
                </button>
            </div>
        </div>
    );
};

export default SearchBox;
