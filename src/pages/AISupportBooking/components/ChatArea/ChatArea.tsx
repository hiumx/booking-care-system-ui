import React, { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import { Stethoscope, MessageCircle, Menu } from 'lucide-react';
import { toast } from 'react-toastify';
import { Message } from '@/types/ai.types';
import MessageBubble from './components/MessageBubble';
import SuggestionCard from './components/SuggestionCard';
import TypingIndicator from './components/TypingIndicator';
import SearchBox from '../SearchBox';
import Carousel from '@/components/Carousel';
import Select from '@/components/Select';
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
    onLabResultFileSelect?: (file: File) => void;
    onDermatologyFileSelect?: (file: File) => void;
    onNutritionClick?: () => void;
    isFileAnalysisMode?: boolean;
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

const normalizeServiceName = (name?: string) => (name || '').trim().toLowerCase();

const resolveDoctorServiceInfo = (doctor: any, selectedServiceType?: string) => {
    const options = doctor.serviceOptions || [];
    const match =
        (selectedServiceType &&
            options.find(
                (o: any) =>
                    normalizeServiceName(o.serviceTypeName) ===
                        normalizeServiceName(selectedServiceType) ||
                    normalizeServiceName(o.serviceTypeName).includes(
                        normalizeServiceName(selectedServiceType)
                    )
            )) ||
        options.find(
            (o: any) =>
                normalizeServiceName(o.serviceTypeName) === 'in_person' ||
                normalizeServiceName(o.serviceTypeName).includes('trực tiếp')
        ) ||
        options[0];

    return {
        ...doctor,
        serviceTypeName: match?.serviceTypeName || doctor.serviceTypeName,
        price: match?.price || doctor.price,
    };
};

const getServiceTypesFromSuggestions = (suggestions: any[]): string[] => {
    const types = suggestions
        .filter((s) => s.type === 'doctor' && s.doctor)
        .flatMap((s) => {
            const doc = s.doctor;
            const opts = doc.serviceOptions || [];
            if (opts.length > 0) return opts.map((o: any) => o.serviceTypeName).filter(Boolean);
            if (doc.serviceTypeName) return [doc.serviceTypeName];
            return [];
        })
        .filter(Boolean) as string[];

    return Array.from(new Set(types));
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
    ) => void,
    selectedServiceType?: string
) => {
    const filteredSuggestions = suggestions.filter((suggestion) => {
        if (suggestion.type !== activeTab) return false;

        if (activeTab === 'doctor' && selectedServiceType) {
            const opts = suggestion.doctor?.serviceOptions || [];
            const normalizedSelected = normalizeServiceName(selectedServiceType);

            const matchFromOptions = opts.some((o: any) => {
                const normalizedName = normalizeServiceName(o.serviceTypeName);
                return (
                    normalizedName === normalizedSelected ||
                    normalizedName.includes(normalizedSelected)
                );
            });

            // Fallback: allow match by serviceTypeName when serviceOptions không có
            const matchFromServiceName =
                opts.length === 0 &&
                !!suggestion.doctor?.serviceTypeName &&
                normalizeServiceName(suggestion.doctor.serviceTypeName).includes(
                    normalizedSelected
                );

            return matchFromOptions || matchFromServiceName || opts.length === 0;
        }

        return true;
    });

    return filteredSuggestions.map((suggestion, index) => {
        const suggestionId =
            suggestion.type === 'doctor'
                ? suggestion.doctor?.id || `doctor-${index}`
                : suggestion.hospital?.id || `hospital-${index}`;

        const entityId =
            suggestion.type === 'doctor'
                ? suggestion.doctor?.id || ''
                : suggestion.hospital?.id || '';

        const resolvedSuggestion =
            suggestion.type === 'doctor' && suggestion.doctor
                ? {
                      ...suggestion,
                      doctor: resolveDoctorServiceInfo(suggestion.doctor, selectedServiceType),
                  }
                : suggestion;

        return {
            id: suggestionId,
            node: (
                <SuggestionCard
                    key={suggestionId}
                    suggestion={resolvedSuggestion}
                    selectedServiceType={selectedServiceType}
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
    onLabResultFileSelect,
    onDermatologyFileSelect,
    onNutritionClick,
    isFileAnalysisMode = false,
}) => {
    const [inputValue, setInputValue] = useState('');
    const [activeTabs, setActiveTabs] = useState<Record<string, 'doctor' | 'hospital'>>({});
    const [serviceSelections, setServiceSelections] = useState<Record<string, string>>({});
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [miniBooking, setMiniBooking] = useState<{
        doctorId?: string;
        hospitalId?: string;
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

    const handleServiceTypeChange = (messageId: string, serviceType: string) => {
        setServiceSelections((prev) => ({
            ...prev,
            [messageId]: serviceType,
        }));
    };

    // Initialize default service type per message (prefer khám trực tiếp/IN_PERSON)
    useEffect(() => {
        messages.forEach((m) => {
            if (!m.suggestions || m.suggestions.length === 0) return;
            const types = getServiceTypesFromSuggestions(m.suggestions);
            if (types.length === 0) return;
            const preferred =
                types.find(
                    (t) =>
                        normalizeServiceName(t) === 'in_person' ||
                        normalizeServiceName(t).includes('trực tiếp')
                ) || types[0];

            setServiceSelections((prev) => (prev[m.id] ? prev : { ...prev, [m.id]: preferred }));
        });
    }, [messages]);

    const handleSend = () => {
        if (inputValue.trim()) {
            // Check if last AI message has high confidence (>= 90%) or max rounds reached
            const lastAIMessage = [...messages].reverse().find((m) => m.sender === 'ai');

            if (lastAIMessage?.disease?.confidence && lastAIMessage.disease.confidence >= 0.9) {
                toast.warning('Chẩn đoán đã đạt độ tin cậy cao. Vui lòng tạo cuộc tư vấn mới.', {
                    position: 'top-right',
                    autoClose: 4000,
                });
                return;
            }

            if (
                lastAIMessage?.currentRound &&
                lastAIMessage.currentRound >= 2 &&
                lastAIMessage.analysisComplete
            ) {
                toast.info('Đã đạt số vòng tư vấn tối đa. Vui lòng bắt đầu cuộc trò chuyện mới.', {
                    position: 'top-right',
                    autoClose: 4000,
                });
                return;
            }

            onSendMessage(inputValue);
            setInputValue('');
        }
    };

    const handleSupportBooking = (
        suggestionId: string,
        type: 'doctor' | 'hospital',
        options?: { appointmentType?: AppointmentType }
    ) => {
        // Find the latest AI message with suggestions to attach mini booking
        const lastMsgWithSuggestions = [...messages]
            .reverse()
            .find((m) => m.sender === 'ai' && m.suggestions && m.suggestions.length > 0);
        const messageId = lastMsgWithSuggestions?.id || (messages[messages.length - 1]?.id ?? '');

        if (type === 'doctor' && suggestionId) {
            // Show inline booking for doctor
            setMiniBooking({
                doctorId: suggestionId,
                messageId,
                appointmentType: options?.appointmentType ?? AppointmentType.IN_PERSON,
            });
            return;
        }

        if (type === 'hospital' && suggestionId) {
            // Show inline booking for hospital
            setMiniBooking({
                hospitalId: suggestionId,
                messageId,
                appointmentType: options?.appointmentType ?? AppointmentType.IN_PERSON,
            });
        }
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
                                        {(() => {
                                            const serviceTypes = getServiceTypesFromSuggestions(
                                                message.suggestions
                                            );
                                            const selectedServiceType =
                                                serviceSelections[message.id] ||
                                                serviceTypes[0] ||
                                                undefined;

                                            return (
                                                <>
                                                    <div className={styles.tabsContainer}>
                                                        <SuggestionTabs
                                                            suggestions={message.suggestions}
                                                            activeTab={getActiveTabForMessage(
                                                                message.id
                                                            )}
                                                            onTabChange={(tab) =>
                                                                handleTabChange(message.id, tab)
                                                            }
                                                        />
                                                    </div>
                                                    {serviceTypes.length > 0 &&
                                                        getActiveTabForMessage(message.id) ===
                                                            'doctor' && (
                                                            <div className={styles.serviceTypeRow}>
                                                                <Select
                                                                    title="Chọn loại dịch vụ"
                                                                    items={serviceTypes.map(
                                                                        (t) => ({
                                                                            label: t,
                                                                            value: t,
                                                                        })
                                                                    )}
                                                                    value={
                                                                        selectedServiceType ||
                                                                        serviceTypes[0]
                                                                    }
                                                                    onChange={(value) =>
                                                                        handleServiceTypeChange(
                                                                            message.id,
                                                                            value
                                                                        )
                                                                    }
                                                                    className={
                                                                        styles.serviceTypeSelect
                                                                    }
                                                                />
                                                            </div>
                                                        )}
                                                    <div className={styles.suggestionsCarousel}>
                                                        <Carousel
                                                            slides={createCarouselItems(
                                                                message.suggestions,
                                                                getActiveTabForMessage(message.id),
                                                                handleSupportBooking,
                                                                selectedServiceType
                                                            )}
                                                            breakpoints={
                                                                CAROUSEL_SUGGESTIONS_BREAKPOINTS
                                                            }
                                                            loop={false}
                                                            isAutoPlay={false}
                                                        />
                                                    </div>
                                                </>
                                            );
                                        })()}
                                        {/* Consultation button - inside suggestions, below carousel */}
                                        {(() => {
                                            const shouldShow = message.canRequestMoreQuestions;
                                            return shouldShow ? (
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
                                            ) : null;
                                        })()}
                                    </div>
                                )}
                                {miniBooking && miniBooking.messageId === message.id && (
                                    <MiniBookingInline
                                        doctorId={miniBooking.doctorId}
                                        hospitalId={miniBooking.hospitalId}
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
                    onLabResultFileSelect={onLabResultFileSelect}
                    onDermatologyFileSelect={onDermatologyFileSelect}
                    onNutritionClick={onNutritionClick}
                    isFileAnalysisMode={isFileAnalysisMode}
                />
            </div>
        </div>
    );
};

export default ChatArea;
