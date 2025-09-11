import React, { useEffect, useState } from 'react';
// no route params used for this UI-only section yet
import Breadcrumb from '@/components/Breadcrumb';
import styles from './MedicalFacilityProfile.module.scss';
import Button from '@/components/Button'; // Import the Button component
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import medicalImg1 from '@/assets/img/medical-img1.jpg';
import patientImg from '@/assets/img/patients/patient.jpg';
import patientImg1 from '@/assets/img/patients/patient1.jpg';
import patientImg2 from '@/assets/img/patients/patient2.jpg';
import reactLogo from '@/assets/react.svg';
import MainLayout from '@/layouts/MainLayout';

interface BreadcrumbItem {
    label: string;
    path?: string;
    isActive?: boolean;
}

const MedicalFacilityProfile: React.FC = () => {
    // const { id } = useParams<{ id: string }>();

    const breadcrumbData: { items: BreadcrumbItem[]; title: string } = {
        items: [
            { label: 'Trang Chủ', path: '/', isActive: false },
            { label: 'Cơ Sở Y Tế', path: '/medical-facility', isActive: false },
            { label: 'Vinmec Medical Center', isActive: true },
        ],
        title: 'Vinmec Medical Center',
    };

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

    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    // Dynamic rating value (0 - 5). Change this value to update UI.
    const rating = 4.5;
    const displayedCount = 1 + 3 + 3; // main + right 3 + bottom 3 (one overlay card)
    const remainingCount = Math.max(mockImages.length - displayedCount, 0);

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

    // Mock services
    const services = [
        { id: 1, name: 'Khám tổng quát', img: patientImg },
        { id: 2, name: 'Tư vấn dinh dưỡng ', img: patientImg1 },
        { id: 3, name: 'Điều trị da liễu', img: patientImg2 },
        { id: 4, name: 'Huấn luyện cá nhân', img: medicalImg1 },
        { id: 4, name: 'Huấn luyện cá nhân', img: medicalImg1 },
        { id: 4, name: 'Huấn luyện cá nhân', img: medicalImg1 },
        { id: 4, name: 'Huấn luyện cá nhân', img: medicalImg1 },
    ];

    return (
        <MainLayout>
            <Breadcrumb items={breadcrumbData.items} title={breadcrumbData.title} />
            {/* Hero Section */}
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
                                    <img src={reactLogo} alt="MedFit" className={styles.logo} />
                                </div>

                                <div className={styles.titleSection}>
                                    <h1 className={styles.title}>
                                        Phòng khám MedFit - Phòng khám giảm cân chuyên sâu
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
                                                const idx = i + 1;
                                                const fillPct =
                                                    Math.max(0, Math.min(1, rating - i)) * 100;
                                                return (
                                                    <span key={idx} className={styles.starWrap}>
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
                                        <strong>Địa chỉ: </strong>
                                        462/2 Nguyễn Tri Phương, Phường Vườn Lài, TP. Hồ Chí Minh
                                        (Địa chỉ cũ: Số 462/2 đường Nguyễn Tri Phương, Phường 09,
                                        Quận 10, Thành phố Hồ Chí Minh)
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
                                    <Button text="Đặt khám ngay" className="w-100" type="button" />
                                </div>
                            </div>
                        </div>

                        {/* Right Gallery - matches sample layout */}
                        <div className={styles.gallery}>
                            <div className={styles.galleryGrid}>
                                {/* Main large banner (left) */}
                                <img
                                    src={medicalImg1}
                                    alt="MedFit banner"
                                    className={styles.mainLarge}
                                />
                                {/* Right side: two stacked images */}
                                <div className={styles.sideStack}>
                                    <img
                                        src={mockImages[1]}
                                        alt="Clinic"
                                        className={styles.sideItem}
                                    />
                                    <img
                                        src={mockImages[2]}
                                        alt="Consult"
                                        className={styles.sideItem}
                                    />
                                    <img
                                        src={mockImages[3]}
                                        alt="Procedure"
                                        className={styles.sideItem}
                                    />
                                </div>
                                {/* Bottom row: four images, last with overlay */}
                                <div className={styles.bottomRow}>
                                    <img src={mockImages[4]} alt="Ảnh 1" className={styles.thumb} />
                                    <img src={mockImages[5]} alt="Ảnh 2" className={styles.thumb} />
                                    <img src={mockImages[6]} alt="Ảnh 3" className={styles.thumb} />
                                    <div
                                        className={styles.thumbOverlay}
                                        onClick={() => setIsLightboxOpen(true)}
                                        role="button"
                                        tabIndex={0}
                                        aria-label="Xem thêm hình ảnh"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ')
                                                setIsLightboxOpen(true);
                                        }}
                                    >
                                        <img
                                            src={mockImages[7]}
                                            alt="Xem thêm"
                                            className={styles.thumb}
                                        />
                                        <div className={styles.overlay}>+{remainingCount} hình</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* Content Section: left details, right sticky sidebar */}
            <section className={styles.content}>
                <div className={styles.container}>
                    <div className={styles.contentGrid}>
                        {/* LEFT: main content */}
                        <div className={styles.mainContent}>
                            <div id="gioi-thieu" className={styles.sectionBlock}>
                                <h3 className={styles.sectionTitle}>Mô tả</h3>
                                <p>
                                    Phòng khám MedFit là phòng khám y học chuyên sâu về giảm cân,
                                    giảm béo và giảm mỡ, được thành lập bởi đội ngũ bác sĩ và chuyên
                                    gia vận động, tâm lý. MedFit tiên phong cung cấp các giải pháp
                                    giúp thon gọn và kiến tạo đường nét cơ thể dựa trên nền tảng y
                                    học chứng cứ.
                                </p>
                            </div>
                            {/* Các dịch vụ */}
                            <div id="services" className={styles.sectionBlock}>
                                <h3 className={styles.sectionTitle}>Các dịch vụ</h3>
                                <Swiper
                                    modules={[Navigation, Pagination, Autoplay]}
                                    spaceBetween={16}
                                    slidesPerView={'auto'}
                                    navigation
                                    pagination={{ clickable: true }}
                                    autoplay={{ delay: 2500, disableOnInteraction: false }}
                                    watchOverflow
                                    className={styles.serviceSwiper}
                                    breakpoints={{
                                        0: { spaceBetween: 12 },
                                        480: { spaceBetween: 12 },
                                        768: { spaceBetween: 14 },
                                        1024: { spaceBetween: 16 },
                                    }}
                                >
                                    {services.map((service) => (
                                        <SwiperSlide key={service.id}>
                                            <a href="#" className={styles.serviceCard}>
                                                <img
                                                    src={service.img}
                                                    alt={service.name}
                                                    className={styles.serviceImg}
                                                />
                                                <div className={styles.serviceName}>
                                                    {service.name}
                                                </div>
                                            </a>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>
                            <div className={styles.tabs}>
                                <a href="#gioi-thieu" className={styles.tabItem}>
                                    Giới thiệu
                                </a>
                                <a href="#chuyen-khoa" className={styles.tabItem}>
                                    Chuyên khoa
                                </a>
                                <a href="#huong-dan" className={styles.tabItem}>
                                    Hướng dẫn đi khám
                                </a>
                                <a href="#faq" className={styles.tabItem}>
                                    Câu hỏi thường gặp
                                </a>
                            </div>

                            <div id="gioi-thieu" className={styles.sectionBlock}>
                                <h3 className={styles.sectionTitle}>Giới thiệu</h3>
                                <p>
                                    Phòng khám MedFit là phòng khám y học chuyên sâu về giảm cân,
                                    giảm béo và giảm mỡ, được thành lập bởi đội ngũ bác sĩ và chuyên
                                    gia vận động, tâm lý. MedFit tiên phong cung cấp các giải pháp
                                    giúp thon gọn và kiến tạo đường nét cơ thể dựa trên nền tảng y
                                    học chứng cứ.
                                </p>
                            </div>

                            <div id="chuyen-khoa" className={styles.sectionBlock}>
                                <h3 className={styles.sectionTitle}>Chuyên khoa</h3>
                                <ul className={styles.bulletList}>
                                    <li>Dinh dưỡng - Tiết chế</li>
                                    <li>Nội tiết</li>
                                    <li>Da liễu thẩm mỹ</li>
                                    <li>Huấn luyện viên cá nhân</li>
                                </ul>
                            </div>

                            <div id="huong-dan" className={styles.sectionBlock}>
                                <h3 className={styles.sectionTitle}>Hướng dẫn đi khám</h3>
                                <ol className={styles.numberList}>
                                    <li>
                                        Đặt lịch trước qua tổng đài 19002115 hoặc nút "Đặt khám
                                        ngay".
                                    </li>
                                    <li>
                                        Đến đúng giờ hẹn, mang theo giấy tờ tùy thân và kết quả cũ
                                        (nếu có).
                                    </li>
                                    <li>
                                        Thanh toán tại quầy lễ tân hoặc qua ví điện tử được hỗ trợ.
                                    </li>
                                </ol>
                            </div>

                            <div id="faq" className={styles.sectionBlock}>
                                <h3 className={styles.sectionTitle}>Câu hỏi thường gặp</h3>
                                <div className={styles.qaItem}>
                                    <div className={styles.q}>Tôi có thể hủy lịch hẹn không?</div>
                                    <div className={styles.a}>
                                        Có, vui lòng liên hệ tổng đài tối thiểu 24 giờ trước giờ
                                        khám.
                                    </div>
                                </div>
                                <div className={styles.qaItem}>
                                    <div className={styles.q}>Có hỗ trợ bảo hiểm y tế không?</div>
                                    <div className={styles.a}>
                                        Hiện phòng khám hỗ trợ xuất hóa đơn để bạn tự quyết toán với
                                        bảo hiểm.
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: sticky sidebar with map and ad banner */}
                        <aside
                            className={styles.sidebar}
                            aria-label="Thông tin vị trí và quảng cáo"
                        >
                            <div className={styles.mapCard}>
                                <div className={styles.mapHeader}>Bản đồ</div>
                                <div className={styles.mapBody}>
                                    <iframe
                                        title="Bản đồ Phòng khám MedFit"
                                        src="https://www.google.com/maps?q=462/9+Nguyen+Tri+Phuong,+Ho+Chi+Minh&output=embed"
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    ></iframe>
                                </div>
                            </div>
                            <div className={styles.adCard}>
                                <div className={styles.adBadge}>Ads</div>
                                <img src={medicalImg1} alt="Quảng cáo" />
                            </div>
                        </aside>
                    </div>
                </div>
            </section>
            {isLightboxOpen && (
                <div className={styles.lightbox} onClick={() => setIsLightboxOpen(false)}>
                    <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.lightboxHeader}>
                            <span className={styles.lightboxTitle}>
                                Phòng khám MedFit - Phòng khám giảm cân chuyên sâu
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
                                    key={idx}
                                    src={src}
                                    alt={`Hình ${idx + 1}`}
                                    className={styles.lightboxImg}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </MainLayout>
    );
};

export default MedicalFacilityProfile;
