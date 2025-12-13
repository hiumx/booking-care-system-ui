import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import Breadcrumb from '@/components/Breadcrumb';
import styles from './HospitalProfile.module.scss';
import Button from '@/components/Button';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import medicalImg1 from '@/assets/img/medical-img1.jpg';
import MainLayout from '@/layouts/MainLayout';
import TestimonialSection from '@/components/TestimonialSection';
import HeroSection from './components/HeroSection/HeroSection';
import ServiceCard from './components/ServiceCard';
import ExpandableText from '@/components/ExpandableText';
import { SpecialtyItem } from './components/SpecialtyItem';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/store';
import { getHospitalByIdAsync } from '@/store/slices/hospitalSlice';
import { HospitalProfileResponse } from '@/types/hospital.types';
import { RootState } from '@/store';
import { PATHS } from '@/routes/paths';

interface BreadcrumbItem {
    label: string;
    path?: string;
    isActive?: boolean;
}

const HospitalProfile: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const selectedHospital = useSelector(
        (state: RootState) => state.hospital.selectedHospital
    ) as HospitalProfileResponse | null;
    const isLoading = useSelector((state: RootState) => state.hospital.isLoading);

    // Navigate to hospital booking page
    const handleBookingClick = useCallback(() => {
        if (id) {
            navigate(PATHS.BOOKING.HOSPITAL.replace(':hospitalId', id));
        }
    }, [id, navigate]);

    // Navigate to booking with pre-selected specialty
    const handleSpecialtyClick = useCallback(
        (specialtyId: string) => {
            if (id) {
                navigate(
                    `${PATHS.BOOKING.HOSPITAL.replace(':hospitalId', id)}?specialtyId=${specialtyId}`
                );
            }
        },
        [id, navigate]
    );

    // Navigate to booking with pre-selected service
    const handleServiceClick = useCallback(
        (serviceId: string) => {
            if (id) {
                navigate(
                    `${PATHS.BOOKING.HOSPITAL.replace(':hospitalId', id)}?serviceId=${serviceId}`
                );
            }
        },
        [id, navigate]
    );
    const breadcrumbData: { items: BreadcrumbItem[]; title: string } = {
        items: [
            { label: 'Trang Chủ', path: '/', isActive: false },
            { label: 'Bệnh viện', path: '/hospitals', isActive: false },
            { label: selectedHospital?.name || 'Bệnh viện', isActive: true },
        ],
        title: selectedHospital?.name || 'Bệnh viện',
    };

    // Show map CTA and hide header when reaching tabs
    const tabsRef = useRef<HTMLDivElement | null>(null);
    const adPaginationRef = useRef<HTMLDivElement | null>(null);
    const [showMapCta, setShowMapCta] = useState(false);
    const [showHeader, setShowHeader] = useState(true);
    const [hasReachedTabs, setHasReachedTabs] = useState(false);
    const [activeTab, setActiveTab] = useState<'gioi-thieu' | 'bang-gia' | 'huong-dan' | 'faq'>();
    const [expandedDoctorServices, setExpandedDoctorServices] = useState(true);
    const [expandedHospitalServices, setExpandedHospitalServices] = useState(true);

    // Separate useEffect for API call - only runs when id changes
    useEffect(() => {
        if (id) {
            dispatch(getHospitalByIdAsync(id));
        }
    }, [dispatch, id]);

    // Separate useEffect for scroll handling - no API calls
    useEffect(() => {
        const handle = () => {
            if (!tabsRef.current) return;
            const tabsTop = window.scrollY + tabsRef.current.getBoundingClientRect().top;
            const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
            const shouldShowMapCta = scrollY + 10 >= tabsTop;
            setShowMapCta(shouldShowMapCta);

            // Track if user has reached tabs
            if (shouldShowMapCta && !hasReachedTabs) {
                setHasReachedTabs(true);
            }

            // Show header logic:
            // 1. If haven't reached tabs yet: show when scrollY < tabsTop - 10
            // 2. If have reached tabs: only show when back to top (scrollY <= 0)
            if (hasReachedTabs) {
                setShowHeader(scrollY <= 0);
                // Reset state when back to top
                if (scrollY <= 0) {
                    setHasReachedTabs(false);
                }
            } else {
                setShowHeader(scrollY < tabsTop - 10);
            }

            // Do not auto-change active tab by scroll; only via user click
        };
        handle();
        window.addEventListener('scroll', handle, { passive: true });
        window.addEventListener('resize', handle);
        return () => {
            window.removeEventListener('scroll', handle as any);
            window.removeEventListener('resize', handle as any);
        };
    }, [hasReachedTabs]); // Only depend on hasReachedTabs, not dispatch or id

    // Service Types (Dịch vụ khám & tư vấn của bác sĩ) from API
    const doctorServices = (selectedHospital?.serviceTypes || []).map((st) => ({
        id: st.id,
        name: st.name,
        img: st.imageUrl || medicalImg1,
    }));

    // Service Medicals (Dịch vụ y tế tại bệnh viện) from API
    const hospitalServices = (selectedHospital?.serviceMedicals || []).map((sm) => ({
        id: sm.id,
        name: sm.name,
        img: sm.imageUrl || medicalImg1,
    }));

    // Function to get hospital image for specialty using round-robin distribution
    const getHospitalImageForSpecialty = (specialtyIndex: number) => {
        if (selectedHospital?.images && selectedHospital.images.length > 0) {
            const imageIndex = specialtyIndex % selectedHospital.images.length;
            return selectedHospital.images[imageIndex].imageUrl;
        }
        return '';
    };

    // Specialties from API (fallback to empty)
    const specialties = (selectedHospital?.specialties || []).map((s, index) => ({
        id: s.id,
        name: s.name,
        icon: s.imageUrl || '', // Icon chuyên khoa (foreground)
        img: getHospitalImageForSpecialty(index), // Round-robin ảnh từ hospital images (background)
        doctorCount: s.doctorCount || 0,
    }));

    // Mock ads
    const ads = [
        {
            id: 1,
            img: 'https://medpro.vn/_next/image?url=https%3A%2F%2Fcdn.medpro.vn%2Fprod-partner%2Fbd0ca6dd-5a16-410a-bcbf-9087e6155fb7-1.png&w=750&q=75',
            title: 'Quảng cáo 1',
        },
        {
            id: 2,
            img: 'https://medpro.vn/_next/image?url=https%3A%2F%2Fcdn.medpro.vn%2Fprod-partner%2F92564f73-574c-4d93-b4e9-ac27e71f8397-2.png&w=750&q=75',
            title: 'Quảng cáo 2',
        },
        {
            id: 3,
            img: 'https://medpro.vn/_next/image?url=https%3A%2F%2Fcdn.medpro.vn%2Fprod-partner%2F2553f503-06ce-4d2b-8584-ef778e0d7f81-3.png&w=750&q=75',
            title: 'Quảng cáo 3',
        },
    ];

    // Mock FAQs
    const faqs: Array<{ q: string; a: string }> = [
        {
            q: 'Bệnh viện có những chuyên khoa và dịch vụ khám, điều trị nào?',
            a: 'Bệnh viện cung cấp đa dạng các chuyên khoa: Tim mạch, Nội tiết, Da liễu, Tiêu hóa, Thần kinh, Nhi khoa, Sản phụ khoa, Mắt. Dịch vụ đa dạng gồm khám tổng quát, tư vấn dinh dưỡng, điều trị da liễu, xét nghiệm máu, siêu âm, chụp X-quang và nhiều dịch vụ y tế chuyên nghiệp khác.',
        },
        {
            q: 'Có cần đặt lịch hẹn trước khi đến khám không?',
            a: 'Bạn nên đặt lịch trước qua tổng đài 19002115 hoặc nút "Đặt khám ngay" để chủ động thời gian và giảm thời gian chờ.',
        },
        {
            q: 'Bệnh viện có hỗ trợ khám ngoài giờ hoặc cuối tuần không?',
            a: 'Bệnh viện hoạt động Thứ 2 – Chủ nhật: 08:00 – 19:00. Vui lòng đặt lịch trước để được phục vụ tốt nhất.',
        },
        {
            q: 'Khi đi khám cần mang theo giấy tờ gì?',
            a: 'Vui lòng mang giấy tờ tùy thân và các kết quả khám/chẩn đoán trước đó (nếu có) để bác sĩ tham khảo.',
        },
        {
            q: 'Bệnh viện có chỗ giữ xe hơi và xe máy không?',
            a: 'Có. Khu vực gửi xe được bố trí ngay trong khuôn viên bệnh viện, có nhân sự hỗ trợ.',
        },
        {
            q: 'Bệnh viện có áp dụng bảo hiểm y tế hoặc bảo hiểm tư nhân không?',
            a: 'Bệnh viện hỗ trợ xuất hóa đơn để bạn tự quyết toán với bảo hiểm y tế hoặc bảo hiểm tư nhân theo chính sách của bạn.',
        },
        {
            q: 'Chi phí khám và điều trị tại bệnh viện là bao nhiêu?',
            a: 'Chi phí phụ thuộc vào gói dịch vụ và phác đồ điều trị. Vui lòng liên hệ bệnh viện để được tư vấn chi tiết.',
        },
        {
            q: 'Thời gian nhận kết quả khám, xét nghiệm mất bao lâu?',
            a: 'Tùy dịch vụ, hầu hết kết quả cơ bản có trong ngày; các xét nghiệm chuyên sâu có thể cần thêm thời gian xử lý.',
        },
        {
            q: 'Các phương pháp điều trị tại bệnh viện có cần nghỉ dưỡng không?',
            a: 'Phần lớn liệu trình là xâm lấn tối thiểu hoặc không xâm lấn, bạn có thể sinh hoạt bình thường ngay sau điều trị.',
        },
    ];
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

    // Loading state
    if (isLoading) {
        return (
            <MainLayout hasHeader={showHeader}>
                <Breadcrumb items={breadcrumbData.items} title={breadcrumbData.title} />
                <div className="container">
                    <div className="text-center py-5">
                        <div className="spinner-border">
                            <output className="visually-hidden">Loading...</output>
                        </div>
                        <p className="mt-3">Đang tải thông tin bệnh viện...</p>
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout hasHeader={showHeader}>
            <Breadcrumb
                items={breadcrumbData.items}
                title={selectedHospital?.name || breadcrumbData.title}
            />
            {/* Hero Section */}
            <HeroSection hospital={selectedHospital || undefined} />
            {/* Content Section: left details, right sticky sidebar */}
            <section className={styles.content}>
                <div className={styles.container}>
                    <div className={styles.contentGrid}>
                        {/* LEFT: main content */}
                        <div className={styles.mainContent}>
                            {/* Các chuyên khoa */}
                            <div className={styles.sectionBlock}>
                                <h3 className={styles.sectionTitle}>Chuyên khoa</h3>

                                {/* Desktop Slider */}
                                <div className={styles.desktopSlider}>
                                    <Swiper
                                        modules={[Navigation, Pagination, Autoplay]}
                                        spaceBetween={16}
                                        slidesPerView={'auto'}
                                        navigation
                                        pagination={{ clickable: true }}
                                        autoplay={{ delay: 2500, disableOnInteraction: false }}
                                        watchOverflow
                                        className={styles.serviceSwiper}
                                        style={{ width: '100%', maxWidth: '100%' }}
                                        breakpoints={{
                                            0: { spaceBetween: 12 },
                                            480: { spaceBetween: 12 },
                                            768: { spaceBetween: 14 },
                                            1024: { spaceBetween: 16 },
                                        }}
                                    >
                                        {specialties.map((specialty) => (
                                            <SwiperSlide
                                                key={specialty.id}
                                                style={{ width: '160px', maxWidth: '160px' }}
                                            >
                                                <SpecialtyItem
                                                    specialty={specialty}
                                                    onClick={handleSpecialtyClick}
                                                />
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                </div>

                                {/* Mobile Grid */}
                                <div className={styles.mobileSpecialtyList}>
                                    {specialties.map((specialty) => (
                                        <SpecialtyItem
                                            key={specialty.id}
                                            specialty={specialty}
                                            onClick={handleSpecialtyClick}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Dịch vụ khám & tư vấn của bác sĩ */}
                            {doctorServices.length > 0 && (
                                <div className={styles.sectionBlock}>
                                    <div className={styles.categorySection}>
                                        <div
                                            className={styles.categoryHeader}
                                            onClick={() =>
                                                setExpandedDoctorServices(!expandedDoctorServices)
                                            }
                                            role="button"
                                            tabIndex={0}
                                            aria-label={`${expandedDoctorServices ? 'Thu gọn' : 'Mở rộng'} dịch vụ khám & tư vấn của bác sĩ`}
                                            aria-expanded={expandedDoctorServices}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' || e.key === ' ') {
                                                    e.preventDefault();
                                                    setExpandedDoctorServices(
                                                        !expandedDoctorServices
                                                    );
                                                }
                                            }}
                                        >
                                            <div className={styles.categoryInfo}>
                                                <div>
                                                    <h3 className={styles.categoryName}>
                                                        Dịch vụ khám & tư vấn của bác sĩ
                                                    </h3>
                                                    <p className={styles.categoryDescription}>
                                                        Các dịch vụ khám và tư vấn chuyên khoa
                                                    </p>
                                                </div>
                                            </div>
                                            <div className={styles.categoryActions}>
                                                <span className={styles.categoryServiceCount}>
                                                    {doctorServices.length} dịch vụ
                                                </span>
                                                <span
                                                    className={styles.expandIcon}
                                                    aria-hidden="true"
                                                >
                                                    {expandedDoctorServices ? (
                                                        <svg
                                                            width="18"
                                                            height="18"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        >
                                                            <polyline points="18 15 12 9 6 15"></polyline>
                                                        </svg>
                                                    ) : (
                                                        <svg
                                                            width="18"
                                                            height="18"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        >
                                                            <polyline points="6 9 12 15 18 9"></polyline>
                                                        </svg>
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                        {expandedDoctorServices && (
                                            <div className={styles.servicesGrid}>
                                                {doctorServices.map((service) => (
                                                    <ServiceCard
                                                        key={service.id}
                                                        name={service.name}
                                                        img={service.img}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                            {/* Dịch vụ y tế tại bệnh viện */}
                            {hospitalServices.length > 0 && (
                                <div className={styles.sectionBlock}>
                                    <div className={styles.categorySection}>
                                        <div
                                            className={styles.categoryHeader}
                                            onClick={() =>
                                                setExpandedHospitalServices(
                                                    !expandedHospitalServices
                                                )
                                            }
                                            role="button"
                                            tabIndex={0}
                                            aria-label={`${expandedHospitalServices ? 'Thu gọn' : 'Mở rộng'} dịch vụ y tế tại bệnh viện`}
                                            aria-expanded={expandedHospitalServices}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' || e.key === ' ') {
                                                    e.preventDefault();
                                                    setExpandedHospitalServices(
                                                        !expandedHospitalServices
                                                    );
                                                }
                                            }}
                                        >
                                            <div className={styles.categoryInfo}>
                                                <div>
                                                    <h3 className={styles.categoryName}>
                                                        Dịch vụ y tế tại bệnh viện
                                                    </h3>
                                                    <p className={styles.categoryDescription}>
                                                        Các dịch vụ y tế và xét nghiệm chuyên sâu
                                                    </p>
                                                </div>
                                            </div>
                                            <div className={styles.categoryActions}>
                                                <span className={styles.categoryServiceCount}>
                                                    {hospitalServices.length} dịch vụ
                                                </span>
                                                <span
                                                    className={styles.expandIcon}
                                                    aria-hidden="true"
                                                >
                                                    {expandedHospitalServices ? (
                                                        <svg
                                                            width="18"
                                                            height="18"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        >
                                                            <polyline points="18 15 12 9 6 15"></polyline>
                                                        </svg>
                                                    ) : (
                                                        <svg
                                                            width="18"
                                                            height="18"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        >
                                                            <polyline points="6 9 12 15 18 9"></polyline>
                                                        </svg>
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                        {expandedHospitalServices && (
                                            <div className={styles.servicesGrid}>
                                                {hospitalServices.map((service) => (
                                                    <ServiceCard
                                                        key={service.id}
                                                        name={service.name}
                                                        img={service.img}
                                                        onClick={() =>
                                                            handleServiceClick(service.id)
                                                        }
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                            {/* Sticky tabs are above, now add floating CTA on map */}
                            <div className={styles.tabs} ref={tabsRef}>
                                <a
                                    href="#gioi-thieu"
                                    onClick={() => setActiveTab('gioi-thieu')}
                                    className={clsx(
                                        styles.tabItem,
                                        activeTab === 'gioi-thieu' && styles.tabActive
                                    )}
                                >
                                    Giới thiệu
                                </a>
                                <a
                                    href="#bang-gia"
                                    onClick={() => setActiveTab('bang-gia')}
                                    className={clsx(
                                        styles.tabItem,
                                        activeTab === 'bang-gia' && styles.tabActive
                                    )}
                                >
                                    Bảng giá
                                </a>
                                <a
                                    href="#huong-dan"
                                    onClick={() => setActiveTab('huong-dan')}
                                    className={clsx(
                                        styles.tabItem,
                                        activeTab === 'huong-dan' && styles.tabActive
                                    )}
                                >
                                    Hướng dẫn đi khám
                                </a>
                                <a
                                    href="#faq"
                                    onClick={() => setActiveTab('faq')}
                                    className={clsx(
                                        styles.tabItem,
                                        activeTab === 'faq' && styles.tabActive
                                    )}
                                >
                                    Câu hỏi thường gặp
                                </a>
                            </div>

                            <div id="gioi-thieu" className={styles.sectionBlock}>
                                <h3 className={styles.sectionTitle}>Giới thiệu</h3>
                                <ExpandableText text={selectedHospital?.description} limit={300} />
                            </div>

                            <div id="bang-gia" className={styles.sectionBlock}>
                                <h3 className={styles.sectionTitle}>Bảng giá</h3>
                                {selectedHospital?.serviceMedicals &&
                                selectedHospital.serviceMedicals.length > 0 ? (
                                    <div className={styles.priceTable}>
                                        {selectedHospital.serviceMedicals.map((service, index) => (
                                            <div key={service.id} className={styles.priceItem}>
                                                <span className={styles.priceNumber}>
                                                    {index + 1}.
                                                </span>
                                                <span className={styles.priceService}>
                                                    {service.name}
                                                </span>
                                                <span className={styles.priceAmount}>
                                                    {service.price.toLocaleString('vi-VN')}đ
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className={styles.emptyState}>
                                        <p className="text-muted">Chưa có thông tin bảng giá</p>
                                    </div>
                                )}
                            </div>

                            <div id="huong-dan" className={styles.sectionBlock}>
                                <h3 className={styles.sectionTitle}>Hướng dẫn đi khám</h3>
                                <div className={styles.guideContent}>
                                    <div className={styles.guideStep}>
                                        <span className={styles.stepLabel}>Bước 1:</span>
                                        <span className={styles.stepContent}>
                                            Truy cập website{' '}
                                            <a
                                                href="https://medcure.com.vn/"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={styles.guideLink}
                                            >
                                                https://medcure.com.vn/
                                            </a>{' '}
                                            hoặc tải ứng dụng MedCure – Đặt lịch khám bệnh trên điện
                                            thoại.
                                        </span>
                                    </div>

                                    <div className={styles.guideStep}>
                                        <span className={styles.stepLabel}>Bước 2:</span>
                                        <span className={styles.stepContent}>
                                            Tìm kiếm "{selectedHospital?.name || 'Bệnh viện'}".
                                        </span>
                                    </div>

                                    <div className={styles.guideStep}>
                                        <span className={styles.stepLabel}>Bước 3:</span>
                                        <span className={styles.stepContent}>
                                            Chọn loại dịch vụ bạn mong muốn như{' '}
                                            {selectedHospital?.serviceMedicals &&
                                            selectedHospital.serviceMedicals.length > 0 ? (
                                                <>
                                                    {selectedHospital.serviceMedicals
                                                        .slice(0, 3)
                                                        .map((service, index) => (
                                                            <React.Fragment key={service.id}>
                                                                {index > 0 && ', '}
                                                                {service.name}
                                                            </React.Fragment>
                                                        ))}
                                                    {selectedHospital.serviceMedicals.length > 3 &&
                                                        '...'}
                                                </>
                                            ) : (
                                                'khám tổng quát, khám chuyên khoa, xét nghiệm, chẩn đoán hình ảnh...'
                                            )}
                                        </span>
                                    </div>

                                    <div className={styles.guideStep}>
                                        <span className={styles.stepLabel}>Bước 4:</span>
                                        <span className={styles.stepContent}>
                                            Lựa chọn thời gian, bác sĩ và hình thức khám (tại bệnh
                                            viện hoặc tư vấn trực tuyến).
                                        </span>
                                    </div>

                                    <div className={styles.guideStep}>
                                        <span className={styles.stepLabel}>Bước 5:</span>
                                        <span className={styles.stepContent}>
                                            Xác nhận thông tin, nhận phiếu khám điện tử qua email
                                            hoặc ứng dụng.
                                        </span>
                                    </div>

                                    <div className={styles.guideNote}>
                                        <span className={styles.noteLabel}>Lưu ý:</span>
                                        <span className={styles.noteContent}>
                                            Vui lòng đến sớm 15 phút trước giờ hẹn để được hỗ trợ
                                            đón tiếp, do chi số cơ bản và hoàn thiện thủ tục trước
                                            khi vào khám.
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div id="faq" className={styles.sectionBlock}>
                                <h3 className={styles.sectionTitle}>Câu hỏi thường gặp</h3>
                                <div className={styles.faqList}>
                                    {faqs.map((item, idx) => (
                                        <div key={`faq-${item.q}`} className={styles.faqItem}>
                                            <button
                                                className={clsx(
                                                    styles.faqQuestion,
                                                    openFaqIndex === idx && styles.faqOpen
                                                )}
                                                aria-expanded={openFaqIndex === idx}
                                                onClick={() =>
                                                    setOpenFaqIndex(
                                                        openFaqIndex === idx ? null : idx
                                                    )
                                                }
                                            >
                                                <span className={styles.faqIndex}>{idx + 1}.</span>
                                                <span className={styles.faqText}>{item.q}</span>
                                                <i
                                                    className="fa-solid fa-chevron-right"
                                                    aria-hidden="true"
                                                />
                                            </button>
                                            {openFaqIndex === idx && (
                                                <div className={styles.faqAnswer}>{item.a}</div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: sticky sidebar with map and ad banner */}
                        <aside
                            className={styles.sidebar}
                            aria-label="Thông tin vị trí và quảng cáo"
                        >
                            <div className={clsx(styles.mapCtaBar, showMapCta && styles.visible)}>
                                <Button
                                    className={clsx(styles.mapBookBtn)}
                                    text="Đặt khám ngay"
                                    type="button"
                                    onClick={handleBookingClick}
                                />
                            </div>
                            <div className={styles.mapCard}>
                                <div className={styles.mapBody}>
                                    <iframe
                                        title={`Bản đồ ${selectedHospital?.name || 'Bệnh viện'}`}
                                        src={`https://www.google.com/maps?q=${encodeURIComponent(selectedHospital?.address || '462/9 Nguyen Tri Phuong, Ho Chi Minh')}&output=embed&markers=color:red|label:H|${encodeURIComponent(selectedHospital?.address || '462/9 Nguyen Tri Phuong, Ho Chi Minh')}`}
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    ></iframe>
                                </div>
                            </div>
                            <div className={styles.adCard}>
                                <div className={styles.adBadge}>Ads</div>
                                <Swiper
                                    modules={[Pagination, Autoplay]}
                                    spaceBetween={0}
                                    slidesPerView={1}
                                    pagination={{
                                        clickable: true,
                                        el: `.${styles.adPagination}`,
                                    }}
                                    autoplay={{ delay: 3000, disableOnInteraction: false }}
                                    loop={true}
                                    className={styles.adSwiper}
                                >
                                    {ads.map((ad) => (
                                        <SwiperSlide key={ad.id}>
                                            <img
                                                src={ad.img}
                                                alt={ad.title}
                                                className={styles.adImg}
                                            />
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                                <div ref={adPaginationRef} className={styles.adPagination}></div>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>
            {/* Testimonial Section */}
            <section className={styles.testimonialSection}>
                <TestimonialSection hospitalId={id} />
            </section>
        </MainLayout>
    );
};

export default HospitalProfile;
