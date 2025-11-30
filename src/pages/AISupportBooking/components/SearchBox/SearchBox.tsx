import React, { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import type { LucideIcon } from 'lucide-react';
import {
    Paperclip,
    Trash2,
    Mic,
    Send,
    MapPin,
    Navigation,
    FileText,
    Stethoscope,
    Pill,
    ClipboardList,
    Image,
    Lightbulb,
    Telescope,
    BookOpen,
    MoreHorizontal,
    ChevronRight,
} from 'lucide-react';
import ModalArea from '@/components/ModalArea/ModalArea';
import styles from './SearchBox.module.scss';

interface SearchBoxProps {
    value: string;
    onChange: (value: string) => void;
    onSend: () => void;
    placeholder?: string;
    onLocationChange?: (location: {
        provinceId?: string;
        districtId?: string;
        displayName: string;
    }) => void;
    userLocation?: { provinceId?: string; districtId?: string; displayName: string } | null;
    forceShowLocationModal?: boolean;
    onLabResultFileSelect?: (file: File) => void;
    onDermatologyFileSelect?: (file: File) => void;
}

interface ComingSoonFeature {
    id: string;
    icon: LucideIcon;
    title: string;
}

const comingSoonFeatures: ComingSoonFeature[] = [
    {
        id: 'medicine-lookup',
        icon: Pill,
        title: 'Tra cứu thuốc',
    },
    {
        id: 'medical-history',
        icon: ClipboardList,
        title: 'Lịch sử khám bệnh',
    },
];

const SearchBox: React.FC<SearchBoxProps> = ({
    value,
    onChange,
    onSend,
    placeholder = 'Mô tả triệu chứng hoặc nhu cầu khám bệnh của bạn...',
    onLocationChange,
    userLocation,
    forceShowLocationModal = false,
    onLabResultFileSelect,
    onDermatologyFileSelect,
}) => {
    const [isMultiLine, setIsMultiLine] = useState(false);
    const [showAttachmentModal, setShowAttachmentModal] = useState(false);
    const [showLocationModal, setShowLocationModal] = useState(forceShowLocationModal);
    const [showLocationInputModal, setShowLocationInputModal] = useState(false);
    const [isGettingLocation, setIsGettingLocation] = useState(false);
    const [locationError, setLocationError] = useState<string | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const labFileInputRef = useRef<HTMLInputElement>(null);
    const dermatologyFileInputRef = useRef<HTMLInputElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const locationModalRef = useRef<HTMLDivElement>(null);
    const locationButtonRef = useRef<HTMLButtonElement>(null);
    const locationAbortRef = useRef<AbortController | null>(null);

    // Use speech recognition hook
    const { isRecording, toggleRecording } = useSpeechRecognition({
        onTranscript: onChange,
        currentValue: value,
    });

    // Tự động hiển thị modal vị trí nếu chưa có vị trí
    useEffect(() => {
        if (forceShowLocationModal || !userLocation) {
            setShowLocationModal(true);
        } else {
            setShowLocationModal(false);
        }
    }, [forceShowLocationModal, userLocation]);

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
            // Không cho đóng modal vị trí khi click outside nếu chưa có vị trí (bắt buộc phải chọn)
            if (
                locationModalRef.current &&
                locationButtonRef.current &&
                !locationModalRef.current.contains(event.target as Node) &&
                !locationButtonRef.current.contains(event.target as Node) &&
                userLocation // Chỉ cho đóng nếu đã có vị trí
            ) {
                setShowLocationModal(false);
            }
        };

        if (showAttachmentModal || showLocationModal) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showAttachmentModal, showLocationModal, userLocation]);

    useEffect(() => {
        return () => {
            locationAbortRef.current?.abort();
        };
    }, []);

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
            const lineHeight = Number.parseFloat(
                globalThis.getComputedStyle(textareaRef.current).lineHeight
            );
            const singleLineHeight = lineHeight || 22.5; // fallback to 1.5em for 15px font

            // Check if more than 1 line (with small threshold)
            const isMoreThanOneLine = scrollHeight > singleLineHeight * 1.2;
            setIsMultiLine(isMoreThanOneLine);

            // Set max height to 3 lines
            const maxHeight = singleLineHeight * 3;
            textareaRef.current.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
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
                // Handle file upload - Implementation pending
                // This feature will be implemented in the next sprint
            }
        };
        input.click();
        setShowAttachmentModal(false);
    };

    const handleMenuItemClick = (_action: string) => {
        setShowAttachmentModal(false);
        // Implement actions for each menu item - Implementation pending
        // This feature will be implemented in the next sprint
    };

    const handleLabCardClick = () => {
        labFileInputRef.current?.click();
    };

    const handleLabCardFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && onLabResultFileSelect) {
            onLabResultFileSelect(file);
        }
        if (e.target) {
            e.target.value = '';
        }
    };

    const handleDermatologyCardClick = () => {
        dermatologyFileInputRef.current?.click();
    };

    const handleDermatologyCardFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && onDermatologyFileSelect) {
            onDermatologyFileSelect(file);
        }
        if (e.target) {
            e.target.value = '';
        }
    };

    const handleLocationClick = () => {
        setShowLocationModal(!showLocationModal);
    };

    const handleGetCurrentLocation = async () => {
        if (!navigator.geolocation) {
            setLocationError('Trình duyệt của bạn không hỗ trợ lấy vị trí');
            return;
        }

        setIsGettingLocation(true);
        setLocationError(null);

        // Kiểm tra quyền truy cập vị trí trước (nếu trình duyệt hỗ trợ)
        // Lưu ý: Một số trình duyệt có thể không hỗ trợ Permissions API
        if ('permissions' in navigator) {
            try {
                const permissionStatus = await navigator.permissions.query({
                    name: 'geolocation' as PermissionName,
                });

                if (permissionStatus.state === 'denied') {
                    setLocationError(
                        'Bạn đã từ chối quyền truy cập vị trí. Vui lòng bật lại quyền trong cài đặt trình duyệt hoặc chọn "Nhập vị trí" để nhập thủ công.'
                    );
                    setIsGettingLocation(false);
                    return;
                }
            } catch {
                // Một số trình duyệt không hỗ trợ permissions API, tiếp tục với getCurrentPosition
                // Hoặc có thể do lỗi khác, vẫn tiếp tục thử lấy vị trí
            }
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    locationAbortRef.current?.abort();
                    const controller = new AbortController();
                    locationAbortRef.current = controller;
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
                        { signal: controller.signal }
                    );
                    const data = await response.json();

                    if (data?.address) {
                        const displayName = data.display_name || `${latitude}, ${longitude}`;
                        const location = {
                            displayName,
                        };
                        if (onLocationChange) {
                            onLocationChange(location);
                        }
                        localStorage.setItem('aiSupportLocation', JSON.stringify(location));
                        setShowLocationModal(false);
                        setLocationError(null);
                    } else {
                        setLocationError('Không thể xác định vị trí từ tọa độ');
                    }
                } catch (error: any) {
                    if (error?.name === 'AbortError') {
                        setLocationError('Yêu cầu xác định vị trí đã bị hủy. Vui lòng thử lại.');
                    } else {
                        console.error('Error getting location:', error);
                        setLocationError('Có lỗi xảy ra khi lấy vị trí');
                    }
                } finally {
                    setIsGettingLocation(false);
                    locationAbortRef.current = null;
                }
            },
            (error) => {
                console.error('Geolocation error:', error);
                let errorMessage = 'Không thể lấy vị trí hiện tại';
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage =
                            'Bạn đã từ chối quyền truy cập vị trí. Vui lòng bật lại quyền trong cài đặt trình duyệt hoặc chọn "Nhập vị trí" để nhập thủ công.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'Thông tin vị trí không khả dụng';
                        break;
                    case error.TIMEOUT:
                        errorMessage = 'Hết thời gian chờ lấy vị trí. Vui lòng thử lại.';
                        break;
                }
                setLocationError(errorMessage);
                setIsGettingLocation(false);
                locationAbortRef.current?.abort();
                locationAbortRef.current = null;
            },
            {
                enableHighAccuracy: true,
                timeout: 15000, // Tăng timeout lên 15 giây
                maximumAge: 0,
            }
        );
    };

    const handleInputLocation = () => {
        setShowLocationModal(false);
        setShowLocationInputModal(true);
    };

    const handleApplyLocation = (
        areaDisplay: string,
        _locationId: string, // Prefix with _ to indicate intentionally unused
        provinceId?: string,
        districtId?: string
    ) => {
        const location = {
            provinceId,
            districtId,
            displayName: areaDisplay,
        };
        if (onLocationChange) {
            onLocationChange(location);
        }
        localStorage.setItem('aiSupportLocation', JSON.stringify(location));
        setShowLocationInputModal(false);
        setShowLocationModal(false);
        setLocationError(null);
    };

    return (
        <div
            className={clsx(styles.searchBoxWrapper, {
                [styles.recording]: isRecording,
                [styles.multiLine]: isMultiLine,
            })}
        >
            <div className={styles.quickActions}>
                <div
                    className={clsx(styles.quickActionCard, styles.labActionCard)}
                    onClick={handleLabCardClick}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleLabCardClick();
                        }
                    }}
                >
                    <div className={styles.quickActionIcon}>
                        <FileText size={28} />
                    </div>
                    <div className={styles.quickActionContent}>
                        <p className={styles.quickActionTitle}>Phân tích kết quả xét nghiệm</p>
                    </div>
                </div>

                <div
                    className={clsx(styles.quickActionCard, styles.dermatologyActionCard)}
                    onClick={handleDermatologyCardClick}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleDermatologyCardClick();
                        }
                    }}
                >
                    <div className={styles.quickActionIcon}>
                        <Stethoscope size={28} />
                    </div>
                    <div className={styles.quickActionContent}>
                        <p className={styles.quickActionTitle}>Phân tích hình ảnh y tế</p>
                    </div>
                </div>

                {comingSoonFeatures.map((feature) => {
                    const Icon = feature.icon;
                    return (
                        <div key={feature.id} className={styles.quickActionCard}>
                            <div className={styles.quickActionIcon}>
                                <Icon size={24} />
                            </div>
                            <div className={styles.quickActionContent}>
                                <p className={styles.quickActionTitle}>{feature.title}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <input
                ref={labFileInputRef}
                type="file"
                accept="image/*,.pdf"
                style={{ display: 'none' }}
                onChange={handleLabCardFileChange}
            />

            <input
                ref={dermatologyFileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/bmp,image/tiff"
                style={{ display: 'none' }}
                onChange={handleDermatologyCardFileChange}
            />

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

                    <div className={styles.locationWrapper}>
                        <button
                            ref={locationButtonRef}
                            type="button"
                            data-tooltip="Vị trí"
                            onClick={handleLocationClick}
                            className={clsx(styles.iconButton, {
                                [styles.active]: showLocationModal,
                            })}
                        >
                            <MapPin size={16} />
                        </button>
                        {userLocation && (
                            <span className={styles.locationBadge} title={userLocation.displayName}>
                                Vị trí: {userLocation.displayName}
                            </span>
                        )}
                        {showLocationModal && (
                            <div ref={locationModalRef} className={styles.attachmentModal}>
                                {!userLocation && (
                                    <div className={styles.locationModalHeader}>
                                        <p className={styles.locationModalDescription}>
                                            Bạn cần chọn vị trí để AI đề xuất bác sĩ, hoặc bệnh viện
                                            phù hợp với vị trí của bạn!
                                        </p>
                                    </div>
                                )}
                                <button
                                    className={styles.menuItem}
                                    onClick={handleGetCurrentLocation}
                                    disabled={isGettingLocation}
                                >
                                    <Navigation size={18} />
                                    <span>Vị trí hiện tại</span>
                                    {isGettingLocation && (
                                        <div className={styles.loadingSpinner}></div>
                                    )}
                                </button>
                                <button className={styles.menuItem} onClick={handleInputLocation}>
                                    <MapPin size={18} />
                                    <span>Nhập vị trí</span>
                                </button>
                                {locationError && (
                                    <div className={styles.locationError}>{locationError}</div>
                                )}
                            </div>
                        )}
                    </div>

                    <button
                        type="button"
                        data-tooltip={isRecording ? 'Dừng ghi âm' : 'Ghi âm'}
                        onClick={toggleRecording}
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

            {/* Overlay backdrop khi modal vị trí bắt buộc (chưa có vị trí) */}
            {showLocationModal && !userLocation && (
                <div
                    className={styles.locationModalOverlay}
                    onClick={(e) => {
                        // Không cho đóng modal khi click vào overlay (bắt buộc phải chọn vị trí)
                        e.stopPropagation();
                    }}
                    aria-hidden="true"
                />
            )}

            {/* Modal nhập vị trí */}
            <ModalArea
                isOpen={showLocationInputModal}
                onClose={() => {
                    // Nếu chưa có vị trí, không cho đóng modal
                    if (!userLocation) {
                        return;
                    }
                    setShowLocationInputModal(false);
                }}
                onApply={handleApplyLocation}
                requireSelection={!userLocation}
            />
        </div>
    );
};

export default SearchBox;
