import React, { useEffect, useMemo, useState } from 'react';
import styles from './HeroSection.module.scss';
import Button from '@/components/Button';
import { PATHS } from '@/routes/paths';
import { useNavigate } from 'react-router-dom';
import { HospitalProfileResponse } from '@/types/hospital.types';

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

    const navigate = useNavigate();

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
                                            <button className={styles.iconBtn} aria-label="Chia sẻ">
                                                <i
                                                    className="fa-solid fa-share-nodes"
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
                                                            Tổng đài đặt khám nhanh:{' '}
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
                                                    key={`side-${idx}`}
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
                                                    key={`thumb-${idx}`}
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
