import React, { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import { Stethoscope, MessageCircle, Menu } from 'lucide-react';
import { Message } from '@/types/ai.types';
import MessageBubble from './components/MessageBubble';
import SuggestionCard from './components/SuggestionCard';
import TypingIndicator from './components/TypingIndicator';
import SearchBox from '../SearchBox';
import Carousel from '@/components/Carousel';
import styles from './ChatArea.module.scss';

interface ChatAreaProps {
    messages: Message[];
    isAITyping: boolean;
    onSendMessage: (content: string) => void;
    onEditMessage?: (messageId: string, newContent: string) => void;
    onToggleSidebar?: () => void;
    userLocation?: { provinceId?: string; districtId?: string; displayName: string } | null;
    onLocationChange?: (location: {
        provinceId?: string;
        districtId?: string;
        displayName: string;
    }) => void;
}

// Breakpoints cho SuggestionCard Carousel
const CAROUSEL_SUGGESTIONS_BREAKPOINTS = {
    1280: {
        slidesPerView: 3, // máy tính để bàn
    },
    1024: {
        slidesPerView: 2, // laptop
    },
    768: {
        slidesPerView: 2, // máy tính bảng
    },
    480: {
        slidesPerView: 1, // điện thoại
    },
    0: {
        slidesPerView: 1, // điện thoại nhỏ
    },
};

const ChatArea: React.FC<ChatAreaProps> = ({
    messages,
    isAITyping,
    onSendMessage,
    onEditMessage,
    onToggleSidebar,
    userLocation,
    onLocationChange,
}) => {
    const [inputValue, setInputValue] = useState('');
    const [activeTab, setActiveTab] = useState<'doctor' | 'hospital'>('doctor');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isAITyping]);

    const handleSend = () => {
        if (inputValue.trim()) {
            onSendMessage(inputValue);
            setInputValue('');
        }
    };

    const handleBookAppointment = (suggestionId: string) => {
        // Navigate to booking page or open booking modal
        console.log('Đặt lịch khám bệnh cho:', suggestionId);
        // TODO: Implement navigation to booking page
    };

    const handleSupportBooking = (suggestionId: string, type: 'doctor' | 'hospital') => {
        // Open support chat or show support options
        console.log('Hỗ trợ đặt lịch cho:', type, suggestionId);
        // TODO: Implement support booking flow
        const supportMessage =
            type === 'doctor'
                ? `Tôi cần hỗ trợ đặt lịch khám với bác sĩ này`
                : `Tôi cần hỗ trợ đặt lịch khám tại bệnh viện này`;
        setInputValue(supportMessage);
    };

    const handleConsultMore = () => {
        // Tự động gửi message "tôi muốn được tư vấn thêm" khi click button
        onSendMessage('tôi muốn được tư vấn thêm');
    };

    return (
        <div className={styles.chatArea}>
            <div className={styles.chatHeader}>
                {onToggleSidebar && (
                    <button
                        className={styles.menuButton}
                        onClick={onToggleSidebar}
                        aria-label="Mở menu"
                    >
                        <Menu size={24} />
                    </button>
                )}
                <div className={styles.headerContent}>
                    <div className={styles.aiAvatar}>
                        <Stethoscope size={24} />
                    </div>
                    <div className={styles.headerInfo}>
                        <h3 className={styles.headerTitle}>AI tư vấn y tế</h3>
                        <p className={styles.headerSubtitle}>Hỗ trợ đặt lịch khám bệnh 24/7</p>
                    </div>
                </div>
            </div>

            <div className={styles.messagesContainer}>
                {messages.length === 0 && !isAITyping ? (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>
                            <MessageCircle size={64} />
                        </div>
                        <h3 className={styles.emptyTitle}>Chào mừng bạn đến với AI tư vấn y tế</h3>
                        <p className={styles.emptyDescription}>
                            Tôi có thể giúp gì cho bạn? Bạn có thể mô tả triệu chứng, tôi sẽ giúp
                            bạn tìm kiếm bác sĩ, bệnh viện.
                        </p>
                        <div className={styles.suggestedQuestions}>
                            <p className={styles.suggestedTitle}>Câu hỏi gợi ý:</p>
                            <div className={styles.questionChips}>
                                <button
                                    className={styles.questionChip}
                                    onClick={() => setInputValue('Tôi bị đau đầu')}
                                >
                                    Tôi bị đau đầu
                                </button>
                                <button
                                    className={styles.questionChip}
                                    onClick={() => setInputValue('Tìm bác sĩ tim mạch')}
                                >
                                    Tìm bác sĩ tim mạch
                                </button>
                                <button
                                    className={styles.questionChip}
                                    onClick={() => setInputValue('Đặt lịch khám tổng quát')}
                                >
                                    Đặt lịch khám tổng quát
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className={styles.messagesList}>
                        {messages.map((message) => (
                            <div key={message.id} className={styles.messageWrapper}>
                                <MessageBubble message={message} onEdit={onEditMessage} />
                                {message.suggestions && message.suggestions.length > 0 && (
                                    <div className={styles.suggestionsContainer}>
                                        <div className={styles.tabsContainer}>
                                            {(() => {
                                                const doctorCount = message.suggestions.filter(
                                                    (s) => s.type === 'doctor'
                                                ).length;
                                                const hospitalCount = message.suggestions.filter(
                                                    (s) => s.type === 'hospital'
                                                ).length;

                                                return (
                                                    <>
                                                        <button
                                                            className={clsx(styles.tab, {
                                                                [styles.activeTab]:
                                                                    activeTab === 'doctor',
                                                            })}
                                                            onClick={() => setActiveTab('doctor')}
                                                        >
                                                            Bác sĩ
                                                            {doctorCount > 0 && (
                                                                <span className={styles.tabBadge}>
                                                                    {doctorCount}
                                                                </span>
                                                            )}
                                                        </button>
                                                        <button
                                                            className={clsx(styles.tab, {
                                                                [styles.activeTab]:
                                                                    activeTab === 'hospital',
                                                            })}
                                                            onClick={() => setActiveTab('hospital')}
                                                        >
                                                            Bệnh viện
                                                            {hospitalCount > 0 && (
                                                                <span className={styles.tabBadge}>
                                                                    {hospitalCount}
                                                                </span>
                                                            )}
                                                        </button>
                                                    </>
                                                );
                                            })()}
                                        </div>
                                        <div className={styles.suggestionsCarousel}>
                                            {(() => {
                                                const filteredSuggestions =
                                                    message.suggestions.filter(
                                                        (suggestion) =>
                                                            suggestion.type === activeTab
                                                    );

                                                const carouselItems = filteredSuggestions.map(
                                                    (suggestion, index) => ({
                                                        id:
                                                            suggestion.type === 'doctor'
                                                                ? suggestion.doctor?.id ||
                                                                  `doctor-${index}`
                                                                : suggestion.hospital?.id ||
                                                                  `hospital-${index}`,
                                                        node: (
                                                            <SuggestionCard
                                                                key={
                                                                    suggestion.type === 'doctor'
                                                                        ? suggestion.doctor?.id ||
                                                                          `doctor-${index}`
                                                                        : suggestion.hospital?.id ||
                                                                          `hospital-${index}`
                                                                }
                                                                suggestion={suggestion}
                                                                onBookAppointment={() =>
                                                                    handleBookAppointment(
                                                                        suggestion.type === 'doctor'
                                                                            ? suggestion.doctor
                                                                                  ?.id || ''
                                                                            : suggestion.hospital
                                                                                  ?.id || ''
                                                                    )
                                                                }
                                                                onSupportBooking={() =>
                                                                    handleSupportBooking(
                                                                        suggestion.type === 'doctor'
                                                                            ? suggestion.doctor
                                                                                  ?.id || ''
                                                                            : suggestion.hospital
                                                                                  ?.id || '',
                                                                        suggestion.type
                                                                    )
                                                                }
                                                            />
                                                        ),
                                                    })
                                                );

                                                return (
                                                    <Carousel
                                                        slides={carouselItems}
                                                        breakpoints={
                                                            CAROUSEL_SUGGESTIONS_BREAKPOINTS
                                                        }
                                                        loop={false}
                                                        isAutoPlay={false}
                                                    />
                                                );
                                            })()}
                                        </div>
                                        <div className={styles.actionButtons}>
                                            <button
                                                className={clsx(
                                                    'btn',
                                                    'btn-md',
                                                    'btn-primary-gradient',
                                                    'd-inline-flex',
                                                    'align-items-center',
                                                    styles.actionButton,
                                                    styles.consultButton
                                                )}
                                                onClick={handleConsultMore}
                                            >
                                                <MessageCircle size={18} className="me-2" />
                                                <span>Tư vấn thêm</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                        {isAITyping && (
                            <div className={styles.messageWrapper}>
                                <div className={styles.aiMessageBubble}>
                                    <div className={styles.aiAvatarSmall}>
                                        <Stethoscope size={16} />
                                    </div>
                                    <TypingIndicator />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            <div className={styles.inputContainer}>
                <SearchBox
                    value={inputValue}
                    onChange={setInputValue}
                    onSend={handleSend}
                    userLocation={userLocation}
                    onLocationChange={onLocationChange}
                />
            </div>
        </div>
    );
};

export default ChatArea;
