import React, { useEffect, useState } from 'react';
import styles from './HeroSection.module.scss';
import medicalImg1 from '@/assets/img/medical-img1.jpg';
import patientImg from '@/assets/img/patients/patient.jpg';
import patientImg1 from '@/assets/img/patients/patient1.jpg';
import patientImg2 from '@/assets/img/patients/patient2.jpg';
import Button from '@/components/Button';
import { PATHS } from '@/routes/paths';
import { useNavigate } from 'react-router-dom';

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

const HeroSection: React.FC = () => {
    const isMobile = useIsMobile();

    // Mock gallery images (replace with API data later)
    const mockImages: string[] = [
        medicalImg1,
        patientImg,
        patientImg1,
        patientImg2,
        patientImg,
        patientImg1,
        patientImg1,
        patientImg1,
        patientImg1,
        patientImg2,
        patientImg,
        patientImg1,
        patientImg,
        patientImg1,
        patientImg,
        patientImg1,
        patientImg,
        patientImg1,
    ];
    // Dynamic rating value (0 - 5). Change this value to update UI.
    const rating = 4.5;
    const displayedCount = 1 + 3 + 3; // main + right 3 + bottom 3 (one overlay card)
    const remainingCount = Math.max(mockImages.length - displayedCount, 0);

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
                            <div className={styles.cardHeader}>
                                <div className={styles.actions}>
                                    <button className={styles.iconBtn} aria-label="Yêu thích">
                                        <i className="fa-regular fa-heart" aria-hidden="true"></i>
                                    </button>
                                    <button className={styles.iconBtn} aria-label="Chia sẻ">
                                        <i
                                            className="fa-solid fa-share-nodes"
                                            aria-hidden="true"
                                        ></i>
                                    </button>
                                </div>
                            </div>

                            <div className={styles.cardContent}>
                                <div className={styles.brand}>
                                    <img
                                        src="https://medpro.vn/_next/image?url=https%3A%2F%2Fcdn.medpro.vn%2Fprod-partner%2F4e23e3de-5c90-48f4-bd0c-2dd7624b7903-logo_medfit_fix.png&w=3840&q=75"
                                        alt="Vinmec"
                                        className={styles.logo}
                                    />
                                </div>

                                <div className={styles.titleSection}>
                                    <h1 className={styles.title}>
                                        Bệnh viện Vinmec - Bệnh viện đa khoa quốc tế{' '}
                                        <i
                                            className={`fa-solid fa-circle-check ${styles.verified}`}
                                            aria-hidden="true"
                                        ></i>
                                    </h1>
                                    <div className={styles.ratingRow}>
                                        <span className={styles.ratingText}>
                                            ({rating.toFixed(1)}/5)
                                        </span>
                                        <span className={styles.stars}>
                                            {Array.from({ length: 5 }).map((_, i) => {
                                                const fillPct =
                                                    Math.max(0, Math.min(1, rating - i)) * 100;
                                                return (
                                                    <span
                                                        key={`star-${i}-${fillPct}`}
                                                        className={styles.starWrap}
                                                    >
                                                        <i
                                                            className="fa-regular fa-star"
                                                            aria-hidden="true"
                                                        ></i>
                                                        <span
                                                            className={styles.starFill}
                                                            style={{ width: `${fillPct}%` }}
                                                        >
                                                            <i
                                                                className="fa-solid fa-star"
                                                                aria-hidden="true"
                                                            ></i>
                                                        </span>
                                                    </span>
                                                );
                                            })}
                                        </span>
                                        <span className={styles.reviewCount}>5 đánh giá</span>
                                    </div>
                                </div>

                                <div className={styles.divider} />

                                <div className={styles.infoItem}>
                                    <h5>
                                        <strong>Địa chỉ: </strong> 458 Minh Khai, Vĩnh Tuy, Hai Bà
                                        Trưng, Hà Nội
                                    </h5>
                                </div>
                                <div className={styles.infoItem}>
                                    <h5>
                                        <strong>Thời gian: </strong>Thứ 2 – Chủ nhật: 08:00 – 19:00
                                    </h5>
                                </div>
                                <div className={styles.infoItem}>
                                    <h5>
                                        <strong>Tổng đài đặt khám nhanh: </strong>19002115
                                    </h5>
                                </div>

                                <div className={styles.ctaWrap}>
                                    <Button
                                        text="Đặt khám ngay"
                                        className="w-100"
                                        type="button"
                                        onClick={handleClickBookNow}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Right Gallery - matches sample layout */}
                        <div className={styles.gallery}>
                            <div className={styles.galleryGrid}>
                                {/* Main large banner (left) */}
                                <img
                                    src="https://medpro.vn/_next/image?url=https%3A%2F%2Fcdn.medpro.vn%2Fprod-partner%2Fd37704cd-6281-4a57-8688-179369172fef-1.png&w=1920&q=75"
                                    alt="Vinmec banner"
                                    className={styles.mainLarge}
                                />

                                {/* Only show side images and bottom row on desktop/tablet */}
                                {!isMobile && (
                                    <>
                                        {/* Right side: two stacked images */}
                                        <div className={styles.sideStack}>
                                            <img
                                                src="https://medpro.vn/_next/image?url=https%3A%2F%2Fcdn.medpro.vn%2Fprod-partner%2Ffb51587e-7c38-4380-a151-fe0778ef42c1-2.png&w=640&q=75"
                                                alt="Hospital"
                                                className={styles.sideItem}
                                            />
                                            <img
                                                src="https://medpro.vn/_next/image?url=https%3A%2F%2Fcdn.medpro.vn%2Fprod-partner%2F12237528-6ab8-4858-9b8f-5301cf8edd0b-3.png&w=640&q=75"
                                                alt="Consult"
                                                className={styles.sideItem}
                                            />
                                            <img
                                                src="https://medpro.vn/_next/image?url=https%3A%2F%2Fcdn.medpro.vn%2Fprod-partner%2F3a1707fe-17e1-46af-870d-6f11135963d9-5.png&w=640&q=75"
                                                alt="Procedure"
                                                className={styles.sideItem}
                                            />
                                        </div>
                                        {/* Bottom row: four images, last with overlay */}
                                        <div className={styles.bottomRow}>
                                            <img
                                                src="https://medpro.vn/_next/image?url=https%3A%2F%2Fcdn.medpro.vn%2Fprod-partner%2F3a1707fe-17e1-46af-870d-6f11135963d9-5.png&w=640&q=75"
                                                alt="Ảnh 1"
                                                className={styles.thumb}
                                            />
                                            <img
                                                src="https://medpro.vn/_next/image?url=https%3A%2F%2Fcdn.medpro.vn%2Fprod-partner%2F3a1707fe-17e1-46af-870d-6f11135963d9-5.png&w=640&q=75"
                                                alt="Ảnh 2"
                                                className={styles.thumb}
                                            />
                                            <img
                                                src="https://medpro.vn/_next/image?url=https%3A%2F%2Fcdn.medpro.vn%2Fprod-partner%2F3a1707fe-17e1-46af-870d-6f11135963d9-5.png&w=640&q=75"
                                                alt="Ảnh 3"
                                                className={styles.thumb}
                                            />
                                            <button
                                                className={styles.thumbOverlay}
                                                onClick={() => setIsLightboxOpen(true)}
                                                aria-label="Xem thêm hình ảnh"
                                            >
                                                <img
                                                    src="https://medpro.vn/_next/image?url=https%3A%2F%2Fcdn.medpro.vn%2Fprod-partner%2F3a1707fe-17e1-46af-870d-6f11135963d9-5.png&w=640&q=75"
                                                    alt="Xem thêm"
                                                    className={styles.thumb}
                                                />
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
                    onClick={() => setIsLightboxOpen(false)}
                    onKeyDown={(e) => {
                        if (e.key === 'Escape') {
                            setIsLightboxOpen(false);
                        }
                    }}
                    aria-label="Đóng lightbox"
                >
                    <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.lightboxHeader}>
                            <span className={styles.lightboxTitle}>
                                Bệnh viện Vinmec - Bệnh viện đa khoa quốc tế
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
                            {mockImages.map((src, idx) => (
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
