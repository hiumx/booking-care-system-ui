import React, { useState, useRef } from 'react';
import { Paperclip, Mic, MicOff, Search } from 'lucide-react';

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
    const [isFocused, setIsFocused] = useState(false);
    const [isRecording, setIsRecording] = useState(false);

    const inputRef = useRef<HTMLTextAreaElement>(null);
    const recognitionRef = useRef<any>(null);

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSearch();
        }
    };

    const handleVoiceInput = () => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            alert('Trình duyệt không hỗ trợ nhận dạng giọng nói');
            return;
        }

        const SpeechRecognition =
            (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();

        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'vi-VN';

        recognitionRef.current.onstart = () => {
            setIsRecording(true);
        };

        recognitionRef.current.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            onSymptomsChange(transcript);
            setIsRecording(false);
        };

        recognitionRef.current.onerror = () => {
            setIsRecording(false);
        };

        recognitionRef.current.onend = () => {
            setIsRecording(false);
        };

        recognitionRef.current.start();
    };

    const stopRecording = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            setIsRecording(false);
        }
    };

    // Đã bỏ gợi ý và bộ lọc

    return (
        <div className="container-fluid">
            <div className="row justify-content-center mb-4">
                <div className="col-12 col-lg-10">
                    <div
                        className={`position-relative ${isFocused ? 'search-focused' : ''}`}
                        style={{ transition: 'all 0.3s ease' }}
                    >
                        {/* Main Search Container */}
                        <div
                            className={`bg-white rounded-4 border ${
                                isFocused ? 'border-primary shadow-lg' : 'border-light shadow-sm'
                            }`}
                            style={{
                                transition: 'all 0.3s ease',
                                transform: isFocused ? 'scale(1.005)' : 'scale(1)',
                                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                            }}
                        >
                            {/* Input Area */}
                            <div className="d-flex align-items-center px-4 py-3">
                                {/* Left Icons */}
                                <div className="d-flex align-items-center me-3">
                                    <button
                                        className="btn btn-link p-2 text-muted border-0 rounded-circle"
                                        style={{ transition: 'all 0.2s ease' }}
                                        onMouseEnter={(e) =>
                                            (e.currentTarget.style.backgroundColor = '#f8f9fa')
                                        }
                                        onMouseLeave={(e) =>
                                            (e.currentTarget.style.backgroundColor = 'transparent')
                                        }
                                        title="Đính kèm hình ảnh"
                                    >
                                        <Paperclip size={18} />
                                    </button>
                                    {/* Nút ghi âm thay cho AI */}
                                    <button
                                        onClick={isRecording ? stopRecording : handleVoiceInput}
                                        className={`btn ms-2 rounded-circle d-flex align-items-center justify-content-center ${
                                            isRecording ? 'btn-danger' : 'btn-outline-primary'
                                        }`}
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            transition: 'all 0.2s ease',
                                        }}
                                        title={isRecording ? 'Dừng ghi âm' : 'Ghi âm giọng nói'}
                                    >
                                        {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
                                    </button>
                                </div>

                                {/* Text Input */}
                                <div className="flex-grow-1 position-relative">
                                    <textarea
                                        ref={inputRef}
                                        value={symptoms}
                                        onChange={(e) => onSymptomsChange(e.target.value)}
                                        onFocus={() => setIsFocused(true)}
                                        onBlur={() => setIsFocused(false)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Mô tả triệu chứng của bạn... (Shift+Enter để xuống dòng)"
                                        className="form-control border-0 bg-transparent"
                                        rows={3}
                                        style={{
                                            fontSize: '16px',
                                            fontWeight: '400',
                                            outline: 'none',
                                            boxShadow: 'none',
                                            resize: 'vertical',
                                        }}
                                        disabled={isLoading}
                                    />
                                </div>

                                {/* Nút tìm kiếm (thay nút ghi âm tròn) */}
                                <button
                                    onClick={onSearch}
                                    disabled={isLoading || !symptoms.trim()}
                                    className="btn btn-primary ms-3 d-flex align-items-center px-4 py-2 rounded-pill"
                                    style={{ transition: 'all 0.2s ease' }}
                                    title="Tìm kiếm"
                                >
                                    <Search size={18} className="me-2" />
                                    Tìm kiếm
                                </button>
                            </div>
                        </div>
                        {/* Bỏ các nút phụ/filters/gợi ý theo yêu cầu */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchBox;
