import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import styles from './HeroSection.module.scss';
import Button from '@/components/Button';
import { PATHS } from '@/routes/paths';
import { HospitalProfileResponse } from '@/types/hospital.types';
import { ChatService } from '@/services/chat.service';

import badgeCheck from '@/assets/img/icons/badge-check.svg';
import gmailIcon from '@/assets/img/icons/gmail-icon.svg';
import buildingIcon from '@/assets/img/icons/building-icon.svg';
import watchIcon from '@/assets/img/icons/watch-icon.svg';
import phoneIcon from '@/assets/img/icons/phone.svg';
import locationIcon from '@/assets/img/icons/location-v2.svg';

// Hook to detect mobile screen size
const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth <= 576);
        };

        checkIsMobile();
        window.addEventListener('resize', checkIsMobile);
        return () => window.removeEventListener('resize', checkIsMobile);
    }, []);

    return isMobile;
};

interface Props {
    hospital?: HospitalProfileResponse;
}

const HeroSection: React.FC<Props> = ({ hospital }) => {
    const isMobile = useIsMobile();
    const navigate = useNavigate();

    // Get current user profile from Redux store
    const currentUser = useSelector((state: RootState) => state.user.profile);
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

    const galleryImages: string[] = useMemo(() => {
        if (hospital?.images && hospital.images.length > 0) {
            return hospital.images.map((img) => img.imageUrl);
        }
        return [];
    }, [hospital]);
    // Dynamic rating value (0 - 5). Change this value to update UI.
    const displayedCount = 1 + 3 + 3;
    const remainingCount = Math.max(galleryImages.length - displayedCount, 0);

    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [isCreatingConversation, setIsCreatingConversation] = useState(false);

    // lock body scroll when lightbox open
    useEffect(() => {
        if (isLightboxOpen) {
            const previous = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
            return () => {
                document.body.style.overflow = previous;
            };
        }
    }, [isLightboxOpen]);

    const handleClickBookNow = () => {
        navigate(PATHS.DOCTOR.ROOT);
    };

    const handleChatWithHospital = async () => {
        // Check if user is authenticated
        if (!isAuthenticated || !currentUser?.accountId) {
            alert('Vui lòng đăng nhập để nhắn tin với bệnh viện');
            navigate('/login');
            return;
        }

        // Check if hospital has accountId
        if (!hospital?.accountId) {
            alert('Không thể tạo cuộc trò chuyện. Thông tin bệnh viện chưa đầy đủ.');
            return;
        }

        // Prevent creating conversation with yourself
        if (currentUser.accountId.toUpperCase() === hospital.accountId.toUpperCase()) {
            alert('Bạn không thể nhắn tin với chính mình');
            return;
        }

        setIsCreatingConversation(true);

        try {
            let conversationId: string | null = null;

            // Check if conversation already exists
            try {
                const existingConversation = await ChatService.getConversationBetweenUsers(
                    currentUser.accountId,
                    hospital.accountId
                );

                if (existingConversation.success && existingConversation.data) {
                    conversationId = existingConversation.data.id;
                    console.log('[HeroSection] Found existing conversation:', conversationId);
                }
            } catch {
                // Conversation doesn't exist, will create below
                console.log('[HeroSection] No existing conversation, will create new one');
            }

            // If conversation doesn't exist, create new one
            if (!conversationId) {
                try {
                    const newConversation = await ChatService.createConversation({
                        participants: [currentUser.accountId, hospital.accountId],
                    });

                    if (newConversation.success && newConversation.data) {
                        conversationId = newConversation.data.id;
                        console.log('[HeroSection] Created new conversation:', conversationId);
                    } else {
                        alert('Không thể tạo cuộc trò chuyện. Vui lòng thử lại sau.');
                        return;
                    }
                } catch (createError: any) {
                    console.error('[HeroSection] Error creating conversation:', createError);
                    alert(
                        createError.message ||
                            'Không thể tạo cuộc trò chuyện. Vui lòng thử lại sau.'
                    );
                    return;
                }
            }

            // Navigate to chat page with conversationId to auto-select
            if (conversationId) {
                navigate(PATHS.CHAT, {
                    state: { conversationId },
                });
            }
        } finally {
            setIsCreatingConversation(false);
        }
    };

    return (
        <>
            <section className={styles.hero}>
                <div className={styles.container}>
                    <div className={styles.grid}>
                        {/* Left Info Card */}
                        <div className={styles.card}>
                            <div className={styles.cardWrapper}>
                                <div className={styles.cardBody}>
                                    <div className={styles.cardHeader}>
                                        <div className={styles.actions}>
                                            <button
                                                className={styles.iconBtn}
                                                aria-label="Yêu thích"
                                            >
                                                <i
                                                    className="fa-regular fa-heart"
                                                    aria-hidden="true"
                                                ></i>
                                            </button>
                                            <button
                                                className={styles.iconBtn}
                                                aria-label="Nhắn tin với bệnh viện"
                                                onClick={handleChatWithHospital}
                                                disabled={isCreatingConversation}
                                            >
                                                <i
                                                    className={`fa-${isCreatingConversation ? 'solid fa-spinner fa-spin' : 'regular fa-comment-dots'}`}
                                                    aria-hidden="true"
                                                ></i>
                                            </button>
                                        </div>
                                    </div>

                                    {hospital?.avatarUrl && (
                                        <div className={styles.brand}>
                                            <div className={styles.avatarContainer}>
                                                <img
                                                    src={hospital.avatarUrl}
                                                    alt={hospital.name}
                                                    className={styles.avatar}
                                                />
                                                <div className={styles.avatarBadge}>
                                                    <img
                                                        src={badgeCheck}
                                                        alt="Verified Badge"
                                                        className={styles.badgeIcon}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className={styles.hospitalWidget}>
                                        <div className={styles.hospitalInfo}>
                                            <ul className={styles.hospitalActivities}>
                                                <li className={styles.hospitalActivityItem}>
                                                    <div className={styles.hospitalInfoItem}>
                                                        <span className={styles.hospitalInfoIcon}>
                                                            <img src={buildingIcon} alt="Icon" />
                                                        </span>
                                                        <p className={styles.hospitalInfoText}>
                                                            {hospital?.name || 'Tên bệnh viện'}
                                                        </p>
                                                    </div>
                                                </li>
                                                <li className={styles.hospitalActivityItem}>
                                                    <div className={styles.hospitalInfoItem}>
                                                        <span className={styles.hospitalInfoIcon}>
                                                            <img src={locationIcon} alt="Icon" />
                                                        </span>
                                                        <p className={styles.hospitalInfoText}>
                                                            Địa chỉ:{' '}
                                                            {hospital?.address ||
                                                                'Địa chỉ bệnh viện'}
                                                        </p>
                                                    </div>
                                                </li>
                                                <li className={styles.hospitalActivityItem}>
                                                    <div className={styles.hospitalInfoItem}>
                                                        <span className={styles.hospitalInfoIcon}>
                                                            <img src={gmailIcon} alt="Icon" />
                                                        </span>
                                                        <p className={styles.hospitalInfoText}>
                                                            Email: {hospital?.email || 'email'}
                                                        </p>
                                                    </div>
                                                </li>
                                                <li className={styles.hospitalActivityItem}>
                                                    <div className={styles.hospitalInfoItem}>
                                                        <span className={styles.hospitalInfoIcon}>
                                                            <img src={phoneIcon} alt="Icon" />
                                                        </span>
                                                        <p className={styles.hospitalInfoText}>
                                                            Số điện thoại:{' '}
                                                            {hospital?.phone || 'Số điện thoại'}
                                                        </p>
                                                    </div>
                                                </li>
                                                <li className={styles.hospitalActivityItem}>
                                                    <div className={styles.hospitalInfoItem}>
                                                        <span className={styles.hospitalInfoIcon}>
                                                            <img src={watchIcon} alt="Icon" />
                                                        </span>
                                                        <p className={styles.hospitalInfoText}>
                                                            Thời gian: Thứ 2 – Chủ nhật: 08:00 –
                                                            19:00
                                                        </p>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className={styles.ctaWrap}>
                                        <Button
                                            text="Đặt khám ngay"
                                            className="w-100 mt-2"
                                            type="button"
                                            onClick={handleClickBookNow}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Gallery - matches sample layout */}
                        <div className={styles.gallery}>
                            <div className={styles.galleryGrid}>
                                {/* Main large banner (left) */}
                                <img
                                    src={hospital?.backgroundUrl || galleryImages[0] || ''}
                                    alt={hospital?.name || 'banner'}
                                    className={styles.mainLarge}
                                />

                                {/* Only show side images and bottom row on desktop/tablet */}
                                {!isMobile && (
                                    <>
                                        {/* Right side: two stacked images */}
                                        <div className={styles.sideStack}>
                                            {galleryImages.slice(1, 4).map((src, idx) => (
                                                <img
                                                    key={`side-${src}-${idx}`}
                                                    src={src}
                                                    alt={hospital?.name || 'Hospital'}
                                                    className={styles.sideItem}
                                                />
                                            ))}
                                        </div>
                                        {/* Bottom row: four images, last with overlay */}
                                        <div className={styles.bottomRow}>
                                            {galleryImages.slice(4, 7).map((src, idx) => (
                                                <img
                                                    key={`thumb-${src}-${idx}`}
                                                    src={src}
                                                    alt={hospital?.name || 'Ảnh'}
                                                    className={styles.thumb}
                                                />
                                            ))}
                                            <button
                                                className={styles.thumbOverlay}
                                                onClick={() => setIsLightboxOpen(true)}
                                                aria-label="Xem thêm hình ảnh"
                                            >
                                                {galleryImages[7] && (
                                                    <img
                                                        src={galleryImages[7]}
                                                        alt="Xem thêm"
                                                        className={styles.thumb}
                                                    />
                                                )}
                                                <div className={styles.overlay}>
                                                    +{remainingCount} hình
                                                </div>
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {isLightboxOpen && (
                <button
                    type="button"
                    className={styles.lightbox}
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setIsLightboxOpen(false);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Escape') {
                            setIsLightboxOpen(false);
                        }
                    }}
                    aria-label="Đóng lightbox"
                >
                    <div className={styles.lightboxContent}>
                        <div className={styles.lightboxHeader}>
                            <span className={styles.lightboxTitle}>
                                {hospital?.name || 'Bệnh viện Vinmec - Bệnh viện đa khoa quốc tế'}
                            </span>
                            {/* <span className={styles.lightboxBadge}>{mockImages.length} ảnh</span> */}
                            <button
                                className={styles.lightboxClose}
                                aria-label="Đóng"
                                onClick={() => setIsLightboxOpen(false)}
                            >
                                <i className="fa-solid fa-xmark" aria-hidden="true"></i>
                            </button>
                        </div>
                        <div className={styles.lightboxGrid}>
                            {galleryImages.map((src, idx) => (
                                <img
                                    key={`lightbox-img-${src}-${idx}`}
                                    src={src}
                                    alt={`Hình ${idx + 1}`}
                                    className={styles.lightboxImg}
                                />
                            ))}
                        </div>
                    </div>
                </button>
            )}
        </>
    );
};

export default HeroSection;
