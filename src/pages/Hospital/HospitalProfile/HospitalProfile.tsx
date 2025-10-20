import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
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
import patientImg from '@/assets/img/patients/patient.jpg';
import patientImg1 from '@/assets/img/patients/patient1.jpg';
import patientImg2 from '@/assets/img/patients/patient2.jpg';
import specialityIcon from '@/assets/img/specialities/speciality-icon-01.svg';
import specialityImg from '@/assets/img/specialities/speciality-01.jpg';
import specialityIcon1 from '@/assets/img/specialities/speciality-icon-02.svg';
import specialityImg1 from '@/assets/img/specialities/speciality-02.jpg';
import specialityIcon3 from '@/assets/img/specialities/speciality-icon-03.svg';
import specialityImg3 from '@/assets/img/specialities/speciality-03.jpg';
import specialityIcon4 from '@/assets/img/specialities/speciality-icon-04.svg';
import specialityImg4 from '@/assets/img/specialities/speciality-04.jpg';
import specialityIcon5 from '@/assets/img/specialities/speciality-icon-05.svg';
import specialityImg5 from '@/assets/img/specialities/speciality-05.jpg';
import specialityIcon6 from '@/assets/img/specialities/speciality-icon-06.svg';
import specialityImg6 from '@/assets/img/specialities/speciality-06.jpg';
import specialityIcon7 from '@/assets/img/specialities/speciality-icon-07.svg';
import specialityImg7 from '@/assets/img/specialities/speciality-07.jpg';
import specialityIcon8 from '@/assets/img/specialities/speciality-icon-08.svg';
import specialityImg8 from '@/assets/img/specialities/speciality-08.jpg';
import MainLayout from '@/layouts/MainLayout';
import TestimonialSection from '@/components/TestimonialSection';
import HeroSection from './components/HeroSection/HeroSection';

interface BreadcrumbItem {
    label: string;
    path?: string;
    isActive?: boolean;
}

const HospitalProfile: React.FC = () => {
    const breadcrumbData: { items: BreadcrumbItem[]; title: string } = {
        items: [
            { label: 'Trang Chủ', path: '/', isActive: false },
            { label: 'Bệnh viện', path: '/hospitals', isActive: false },
            { label: 'Vinmec Medical Center', isActive: true },
        ],
        title: 'Vinmec Medical Center',
    };

    // Show map CTA and hide header when reaching tabs
    const tabsRef = useRef<HTMLDivElement | null>(null);
    const adPaginationRef = useRef<HTMLDivElement | null>(null);
    const [showMapCta, setShowMapCta] = useState(false);
    const [showHeader, setShowHeader] = useState(true);
    const [hasReachedTabs, setHasReachedTabs] = useState(false);
    const [activeTab, setActiveTab] = useState<'gioi-thieu' | 'bang-gia' | 'huong-dan' | 'faq'>();

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
    }, [hasReachedTabs]);

    // Mock services
    const services = [
        { id: 1, name: 'Khám tổng quát', img: patientImg },
        { id: 2, name: 'Tư vấn dinh dưỡng ', img: patientImg1 },
        { id: 3, name: 'Điều trị da liễu', img: patientImg2 },
        { id: 4, name: 'Huấn luyện cá nhân', img: medicalImg1 },
        { id: 5, name: 'Xét nghiệm máu', img: patientImg },
        { id: 6, name: 'Siêu âm', img: patientImg1 },
        { id: 7, name: 'Chụp X-quang', img: patientImg2 },
    ];

    // Mock specialties
    const specialties = [
        { id: 1, name: 'Tim mạch', icon: specialityIcon, img: specialityImg, doctorCount: 12 },
        { id: 2, name: 'Nội tiết', icon: specialityIcon1, img: specialityImg1, doctorCount: 8 },
        { id: 3, name: 'Da liễu', icon: specialityIcon3, img: specialityImg3, doctorCount: 15 },
        { id: 4, name: 'Tiêu hóa', icon: specialityIcon4, img: specialityImg4, doctorCount: 10 },
        { id: 5, name: 'Thần kinh', icon: specialityIcon5, img: specialityImg5, doctorCount: 6 },
        { id: 6, name: 'Nhi khoa', icon: specialityIcon6, img: specialityImg6, doctorCount: 20 },
        {
            id: 7,
            name: 'Sản phụ khoa',
            icon: specialityIcon7,
            img: specialityImg7,
            doctorCount: 14,
        },
        { id: 8, name: 'Mắt', icon: specialityIcon8, img: specialityImg8, doctorCount: 9 },
    ];

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

    return (
        <MainLayout hasHeader={showHeader}>
            <Breadcrumb items={breadcrumbData.items} title={breadcrumbData.title} />
            {/* Hero Section */}
            <HeroSection />
            {/* Content Section: left details, right sticky sidebar */}
            <section className={styles.content}>
                <div className={styles.container}>
                    <div className={styles.contentGrid}>
                        {/* LEFT: main content */}
                        <div className={styles.mainContent}>
                            <div className={styles.sectionBlock}>
                                <h3 className={styles.sectionTitle}>Mô tả</h3>
                                <p>
                                    Bệnh viện Vinmec là bệnh viện đa khoa quốc tế chất lượng cao,
                                    được thành lập với đội ngũ bác sĩ và chuyên gia y tế giàu kinh
                                    nghiệm. Vinmec tiên phong cung cấp các giải pháp y tế toàn diện
                                    và hiện đại dựa trên nền tảng y học chứng cứ và công nghệ tiên
                                    tiến.
                                </p>
                            </div>
                            {/* Các dịch vụ */}
                            <div className={styles.sectionBlock}>
                                <h3 className={styles.sectionTitle}>Dịch vụ</h3>
                                <Swiper
                                    modules={[Navigation, Pagination, Autoplay]}
                                    spaceBetween={16}
                                    slidesPerView={'auto'}
                                    navigation
                                    pagination={{ clickable: true }}
                                    autoplay={{ delay: 2500, disableOnInteraction: false }}
                                    watchOverflow
                                    className={styles.serviceSwiper}
                                >
                                    {services.map((service) => (
                                        <SwiperSlide key={service.id}>
                                            <Link to="/doctor/list" className={styles.serviceCard}>
                                                <img
                                                    src={service.img}
                                                    alt={service.name}
                                                    className={styles.serviceImg}
                                                />
                                                <div className={styles.serviceName}>
                                                    {service.name}
                                                </div>
                                            </Link>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>
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
                                        breakpoints={{
                                            0: { spaceBetween: 12 },
                                            480: { spaceBetween: 12 },
                                            768: { spaceBetween: 14 },
                                            1024: { spaceBetween: 16 },
                                        }}
                                    >
                                        {specialties.map((specialty) => (
                                            <SwiperSlide key={specialty.id}>
                                                <Link
                                                    to="/doctor/list"
                                                    className={clsx('spaciality-item')}
                                                >
                                                    <div className={clsx('spaciality-img')}>
                                                        <img
                                                            src={specialty.img}
                                                            alt={specialty.name}
                                                            className={styles.specialityImgEl}
                                                        />
                                                        <span
                                                            className={clsx(
                                                                'spaciality-icon',
                                                                styles.specialityIcon
                                                            )}
                                                        >
                                                            <img src={specialty.icon} alt="icon" />
                                                        </span>
                                                    </div>
                                                    <h6 className={styles.specialityTitle}>
                                                        <Link
                                                            to="/doctor/list"
                                                            className={styles.specialityTitleLink}
                                                        >
                                                            {specialty.name}
                                                        </Link>
                                                    </h6>
                                                    <p
                                                        className={clsx(
                                                            'mb-0',
                                                            styles.specialityMeta
                                                        )}
                                                    >
                                                        {specialty.doctorCount} Bác sĩ
                                                    </p>
                                                </Link>
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                </div>

                                {/* Mobile Simple List */}
                                <div className={styles.mobileSpecialtyList}>
                                    {specialties.map((specialty) => (
                                        <Link
                                            key={specialty.id}
                                            to="/doctor/list"
                                            className={styles.specialtyItem}
                                        >
                                            <div className={styles.specialtyIcon}>
                                                <img src={specialty.icon} alt="icon" />
                                            </div>
                                            <div className={styles.specialtyText}>
                                                <h6 className={styles.specialtyTitle}>
                                                    {specialty.name}
                                                </h6>
                                                <p className={styles.specialtyMeta}>
                                                    {specialty.doctorCount} Bác sĩ
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
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
                                <p>
                                    Bệnh viện đa khoa quốc tế Vinmec là địa chỉ tiên phong tại Việt
                                    Nam trong cung cấp dịch vụ y tế chất lượng cao theo tiêu chuẩn
                                    quốc tế, ứng dụng các phương pháp điều trị hiện đại dựa trên nền
                                    tảng y học chứng cứ. Với đội ngũ bác sĩ giàu kinh nghiệm trong
                                    các lĩnh vực Tim mạch, Nội tiết, Nội khoa, Da liễu, chuyên gia
                                    dinh dưỡng và các chuyên khoa khác, Vinmec mang đến giải pháp y
                                    tế an toàn, hiệu quả và cá nhân hóa theo tình trạng sức khỏe
                                    từng người.
                                </p>
                                <p>
                                    Trong bài viết này, Medpro sẽ tổng hợp các thông tin quan trọng
                                    về Vinmec bao gồm thế mạnh chuyên môn, đội ngũ bác sĩ, dịch vụ
                                    nổi bật, chi phí tham khảo và cách đặt lịch khám để bạn đọc có
                                    thể dễ dàng lựa chọn và chủ động chăm sóc sức khỏe một cách toàn
                                    diện.
                                </p>
                            </div>

                            <div id="bang-gia" className={styles.sectionBlock}>
                                <h3 className={styles.sectionTitle}>Bảng giá</h3>
                                <div className={styles.priceTable}>
                                    <div className={styles.priceItem}>
                                        <span className={styles.priceNumber}>1.</span>
                                        <span className={styles.priceService}>
                                            Khám bệnh Da dày & Đại tràng
                                        </span>
                                        <span className={styles.priceAmount}>200.000đ</span>
                                    </div>
                                    <div className={styles.priceItem}>
                                        <span className={styles.priceNumber}>2.</span>
                                        <span className={styles.priceService}>
                                            Khám bệnh Tiêu hóa - Gan mật
                                        </span>
                                        <span className={styles.priceAmount}>200.000đ</span>
                                    </div>
                                    <div className={styles.priceItem}>
                                        <span className={styles.priceNumber}>3.</span>
                                        <span className={styles.priceService}>
                                            Nội soi Da dày không đau
                                        </span>
                                        <span className={styles.priceAmount}>3.100.000đ</span>
                                    </div>
                                    <div className={styles.priceItem}>
                                        <span className={styles.priceNumber}>4.</span>
                                        <span className={styles.priceService}>
                                            Nội soi Đại tràng không đau
                                        </span>
                                        <span className={styles.priceAmount}>4.100.000đ</span>
                                    </div>
                                    <div className={styles.priceItem}>
                                        <span className={styles.priceNumber}>5.</span>
                                        <span className={styles.priceService}>
                                            Nội soi Da dày và Đại tràng không đau
                                        </span>
                                        <span className={styles.priceAmount}>6.700.000đ</span>
                                    </div>
                                    <div className={styles.priceItem}>
                                        <span className={styles.priceNumber}>6.</span>
                                        <span className={styles.priceService}>
                                            Tầm soát ung thư Da dày
                                        </span>
                                        <span className={styles.priceAmount}>3.100.000đ</span>
                                    </div>
                                    <div className={styles.priceItem}>
                                        <span className={styles.priceNumber}>7.</span>
                                        <span className={styles.priceService}>
                                            Tầm soát ung thư Đại tràng
                                        </span>
                                        <span className={styles.priceAmount}>4.340.000đ</span>
                                    </div>
                                    <div className={styles.priceItem}>
                                        <span className={styles.priceNumber}>8.</span>
                                        <span className={styles.priceService}>
                                            Tầm soát ung thư Da dày & Đại tràng
                                        </span>
                                        <span className={styles.priceAmount}>6.940.000đ</span>
                                    </div>
                                </div>
                            </div>

                            <div id="huong-dan" className={styles.sectionBlock}>
                                <h3 className={styles.sectionTitle}>Hướng dẫn đi khám</h3>
                                <div className={styles.guideContent}>
                                    <div className={styles.guideStep}>
                                        <span className={styles.stepLabel}>Bước 1:</span>
                                        <span className={styles.stepContent}>
                                            Truy cập website{' '}
                                            <a
                                                href="https://medpro.vn/"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={styles.guideLink}
                                            >
                                                https://medpro.vn/
                                            </a>{' '}
                                            hoặc tải ứng dụng Medpro – Đặt lịch khám bệnh trên điện
                                            thoại.
                                        </span>
                                    </div>

                                    <div className={styles.guideStep}>
                                        <span className={styles.stepLabel}>Bước 2:</span>
                                        <span className={styles.stepContent}>
                                            Tìm kiếm "Bệnh viện Vinmec".
                                        </span>
                                    </div>

                                    <div className={styles.guideStep}>
                                        <span className={styles.stepLabel}>Bước 3:</span>
                                        <span className={styles.stepContent}>
                                            Chọn loại dịch vụ bạn mong muốn như khám tổng quát, khám
                                            chuyên khoa, xét nghiệm, chẩn đoán hình ảnh...
                                        </span>
                                    </div>

                                    <div className={styles.guideStep}>
                                        <span className={styles.stepLabel}>Bước 4:</span>
                                        <span className={styles.stepContent}>
                                            Lựa chọn thời gian, bác sĩ và hình thức khám (tại bệnh
                                            viện hoặc tư vấn online).
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
                                />
                            </div>
                            <div className={styles.mapCard}>
                                <div className={styles.mapBody}>
                                    <iframe
                                        title="Bản đồ Bệnh viện Vinmec"
                                        src="https://www.google.com/maps?q=462/9+Nguyen+Tri+Phuong,+Ho+Chi+Minh&output=embed"
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
                <TestimonialSection />
            </section>
        </MainLayout>
    );
};

export default HospitalProfile;
