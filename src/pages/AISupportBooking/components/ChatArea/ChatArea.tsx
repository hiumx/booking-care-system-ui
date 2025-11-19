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
import MiniBookingInline from './components/MiniBookingModal/MiniBookingInline';
import { AppointmentType } from '@/enums/appointment.enums';

interface ChatAreaProps {
    messages: Message[];
    isAITyping: boolean;
    onSendMessage: (content: string) => void;
    onToggleSidebar?: () => void;
    activeChatId?: string | null;
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

// Helper component for rendering tabs
const SuggestionTabs: React.FC<{
    suggestions: any[];
    activeTab: 'doctor' | 'hospital';
    onTabChange: (tab: 'doctor' | 'hospital') => void;
}> = ({ suggestions, activeTab, onTabChange }) => {
    const doctorCount = suggestions.filter((s) => s.type === 'doctor').length;
    const hospitalCount = suggestions.filter((s) => s.type === 'hospital').length;

    return (
        <>
            <button
                className={clsx(styles.tab, {
                    [styles.activeTab]: activeTab === 'doctor',
                })}
                onClick={() => onTabChange('doctor')}
            >
                Bác sĩ
                {doctorCount > 0 && <span className={styles.tabBadge}>{doctorCount}</span>}
            </button>
            <button
                className={clsx(styles.tab, {
                    [styles.activeTab]: activeTab === 'hospital',
                })}
                onClick={() => onTabChange('hospital')}
            >
                Bệnh viện
                {hospitalCount > 0 && <span className={styles.tabBadge}>{hospitalCount}</span>}
            </button>
        </>
    );
};

// Helper function to create carousel items
const createCarouselItems = (
    suggestions: any[],
    activeTab: 'doctor' | 'hospital',
    handleSupportBooking: (
        id: string,
        type: 'doctor' | 'hospital',
        options?: { appointmentType?: AppointmentType }
    ) => void
) => {
    const filteredSuggestions = suggestions.filter((suggestion) => suggestion.type === activeTab);

    return filteredSuggestions.map((suggestion, index) => {
        const suggestionId =
            suggestion.type === 'doctor'
                ? suggestion.doctor?.id || `doctor-${index}`
                : suggestion.hospital?.id || `hospital-${index}`;

        const entityId =
            suggestion.type === 'doctor'
                ? suggestion.doctor?.id || ''
                : suggestion.hospital?.id || '';

        return {
            id: suggestionId,
            node: (
                <SuggestionCard
                    key={suggestionId}
                    suggestion={suggestion}
                    onSupportBooking={(options) =>
                        handleSupportBooking(entityId, suggestion.type, options)
                    }
                />
            ),
        };
    });
};

const ChatArea: React.FC<ChatAreaProps> = ({
    messages,
    isAITyping,
    onSendMessage,
    onToggleSidebar,
    activeChatId,
    userLocation,
    onLocationChange,
}) => {
    const [inputValue, setInputValue] = useState('');
    const [activeTabs, setActiveTabs] = useState<Record<string, 'doctor' | 'hospital'>>({});
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [miniBooking, setMiniBooking] = useState<{
        doctorId: string;
        messageId: string;
        appointmentType: AppointmentType;
    } | null>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isAITyping]);

    useEffect(() => {
        setMiniBooking(null);
    }, [activeChatId]);

    const getActiveTabForMessage = (messageId: string) => {
        return activeTabs[messageId] ?? 'doctor';
    };

    const handleTabChange = (messageId: string, tab: 'doctor' | 'hospital') => {
        setActiveTabs((prev) => ({
            ...prev,
            [messageId]: tab,
        }));
    };

    const handleSend = () => {
        if (inputValue.trim()) {
            onSendMessage(inputValue);
            setInputValue('');
        }
    };

    const handleSupportBooking = (
        suggestionId: string,
        type: 'doctor' | 'hospital',
        options?: { appointmentType?: AppointmentType }
    ) => {
        if (type === 'doctor' && suggestionId) {
            // Show inline booking below the latest AI message that has suggestions
            const lastMsgWithSuggestions = [...messages]
                .reverse()
                .find((m) => m.sender === 'ai' && m.suggestions && m.suggestions.length > 0);
            const messageId =
                lastMsgWithSuggestions?.id || (messages[messages.length - 1]?.id ?? '');
            setMiniBooking({
                doctorId: suggestionId,
                messageId,
                appointmentType: options?.appointmentType ?? AppointmentType.IN_PERSON,
            });
            return;
        }
        // For hospital suggestions, fall back to message prompt
        const supportMessage = `Tôi cần hỗ trợ đặt lịch khám tại bệnh viện này`;
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
                                    onClick={() =>
                                        onSendMessage(
                                            'Tôi bị chóng mặt thường xuyên, nên khám chuyên khoa nào?'
                                        )
                                    }
                                >
                                    Tôi bị chóng mặt thường xuyên, nên khám chuyên khoa nào?
                                </button>
                                <button
                                    className={styles.questionChip}
                                    onClick={() =>
                                        onSendMessage(
                                            'Tôi cảm thấy đau tức ngực, có cần đi cấp cứu không?'
                                        )
                                    }
                                >
                                    Tôi cảm thấy đau tức ngực, có cần đi cấp cứu không?
                                </button>
                                <button
                                    className={styles.questionChip}
                                    onClick={() =>
                                        onSendMessage(
                                            'Tôi bị đau bụng kéo dài nhiều ngày, nên khám bác sĩ gì?'
                                        )
                                    }
                                >
                                    Tôi bị đau bụng kéo dài nhiều ngày, nên khám bác sĩ gì?
                                </button>
                                <button
                                    className={styles.questionChip}
                                    onClick={() =>
                                        onSendMessage(
                                            'Tôi bị sốt cao không hạ, có cần đi khám ngay không?'
                                        )
                                    }
                                >
                                    Tôi bị sốt cao không hạ, có cần đi khám ngay không?
                                </button>
                                <button
                                    className={styles.questionChip}
                                    onClick={() =>
                                        onSendMessage(
                                            'Tôi bị khó thở và mệt nhiều, cần đến khoa nào?'
                                        )
                                    }
                                >
                                    Tôi bị khó thở và mệt nhiều, cần đến khoa nào?
                                </button>
                                <button
                                    className={styles.questionChip}
                                    onClick={() =>
                                        onSendMessage(
                                            'Tôi bị mất ngủ lâu ngày, có nên khám chuyên khoa tâm thần kinh không?'
                                        )
                                    }
                                >
                                    Tôi bị mất ngủ lâu ngày, có nên khám chuyên khoa tâm thần kinh
                                    không?
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className={styles.messagesList}>
                        {messages.map((message) => (
                            <div key={message.id} className={styles.messageWrapper}>
                                <MessageBubble message={message} />
                                {message.suggestions && message.suggestions.length > 0 && (
                                    <div className={styles.suggestionsContainer}>
                                        <div className={styles.tabsContainer}>
                                            <SuggestionTabs
                                                suggestions={message.suggestions}
                                                activeTab={getActiveTabForMessage(message.id)}
                                                onTabChange={(tab) =>
                                                    handleTabChange(message.id, tab)
                                                }
                                            />
                                        </div>
                                        <div className={styles.suggestionsCarousel}>
                                            <Carousel
                                                slides={createCarouselItems(
                                                    message.suggestions,
                                                    getActiveTabForMessage(message.id),
                                                    handleSupportBooking
                                                )}
                                                breakpoints={CAROUSEL_SUGGESTIONS_BREAKPOINTS}
                                                loop={false}
                                                isAutoPlay={false}
                                            />
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
                                {miniBooking && miniBooking.messageId === message.id && (
                                    <MiniBookingInline
                                        doctorId={miniBooking.doctorId}
                                        appointmentType={miniBooking.appointmentType}
                                        onClose={() => {
                                            setMiniBooking(null);
                                        }}
                                    />
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
