import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import Breadcrumb from '@/components/Breadcrumb';
import styles from './MedicalFacilityProfile.module.scss';
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
import MainLayout from '@/layouts/MainLayout';
import TestimonialSection from '@/components/TestimonialSection';
import HeroSection from './components/HeroSection';

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
            if (!hasReachedTabs) {
                setShowHeader(scrollY < tabsTop - 10);
            } else {
                setShowHeader(scrollY <= 0);
                // Reset state when back to top
                if (scrollY <= 0) {
                    setHasReachedTabs(false);
                }
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
        { id: 4, name: 'Huấn luyện cá nhân', img: medicalImg1 },
        { id: 4, name: 'Huấn luyện cá nhân', img: medicalImg1 },
        { id: 4, name: 'Huấn luyện cá nhân', img: medicalImg1 },
    ];

    // Mock ads
    const ads = [
        { id: 1, img: medicalImg1, title: 'Quảng cáo 1' },
        { id: 2, img: patientImg, title: 'Quảng cáo 2' },
        { id: 3, img: patientImg1, title: 'Quảng cáo 3' },
        { id: 4, img: patientImg2, title: 'Quảng cáo 4' },
        { id: 5, img: medicalImg1, title: 'Quảng cáo 5' },
    ];

    // Mock FAQs
    const faqs: Array<{ q: string; a: string }> = [
        {
            q: 'MedFit có những chuyên khoa và dịch vụ khám, điều trị nào?',
            a: 'MedFit cung cấp ba chuyên khoa chính: Nội tiết, Dinh dưỡng và Thẩm mỹ da. Dịch vụ đa dạng gồm giảm cân, giảm mỡ từng vùng bằng công nghệ nội khoa không xâm lấn, trẻ hóa da, tạo đường nét cơ thể kết hợp y khoa và thiết bị chuẩn y khoa.',
        },
        {
            q: 'Có cần đặt lịch hẹn trước khi đến khám không?',
            a: 'Bạn nên đặt lịch trước qua tổng đài 19002115 hoặc nút "Đặt khám ngay" để chủ động thời gian và giảm thời gian chờ.',
        },
        {
            q: 'MedFit có hỗ trợ khám ngoài giờ hoặc cuối tuần không?',
            a: 'Phòng khám hoạt động Thứ 2 – Chủ nhật: 08:00 – 19:00. Vui lòng đặt lịch trước để được phục vụ tốt nhất.',
        },
        {
            q: 'Khi đi khám cần mang theo giấy tờ gì?',
            a: 'Vui lòng mang giấy tờ tùy thân và các kết quả khám/chẩn đoán trước đó (nếu có) để bác sĩ tham khảo.',
        },
        {
            q: 'MedFit có chỗ giữ xe hơi và xe máy không?',
            a: 'Có. Khu vực gửi xe được bố trí ngay trong khuôn viên phòng khám, có nhân sự hỗ trợ.',
        },
        {
            q: 'MedFit có áp dụng bảo hiểm y tế hoặc bảo hiểm tư nhân không?',
            a: 'Phòng khám hỗ trợ xuất hóa đơn để bạn tự quyết toán với bảo hiểm y tế hoặc bảo hiểm tư nhân theo chính sách của bạn.',
        },
        {
            q: 'Chi phí khám và điều trị tại MedFit là bao nhiêu?',
            a: 'Chi phí phụ thuộc vào gói dịch vụ và phác đồ điều trị. Vui lòng liên hệ phòng khám để được tư vấn chi tiết.',
        },
        {
            q: 'Thời gian nhận kết quả khám, xét nghiệm mất bao lâu?',
            a: 'Tùy dịch vụ, hầu hết kết quả cơ bản có trong ngày; các xét nghiệm chuyên sâu có thể cần thêm thời gian xử lý.',
        },
        {
            q: 'Các phương pháp điều trị giảm mỡ và trẻ hóa tại MedFit có cần nghỉ dưỡng không?',
            a: 'Phần lớn liệu trình là xâm lấn tối thiểu hoặc không xâm lấn, bạn có thể sinh hoạt bình thường ngay sau điều trị.',
        },
    ];
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

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
                                    Phòng khám MedFit là phòng khám y học chuyên sâu về giảm cân,
                                    giảm béo và giảm mỡ, được thành lập bởi đội ngũ bác sĩ và chuyên
                                    gia vận động, tâm lý. MedFit tiên phong cung cấp các giải pháp
                                    giúp thon gọn và kiến tạo đường nét cơ thể dựa trên nền tảng y
                                    học chứng cứ.
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
                            {/* Các chuyên khoa */}
                            <div className={styles.sectionBlock}>
                                <h3 className={styles.sectionTitle}>Chuyên khoa</h3>
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
                                            <div className={clsx('spaciality-item')}>
                                                <div className={clsx('spaciality-img')}>
                                                    <img
                                                        src={specialityImg}
                                                        alt="img"
                                                        className={styles.specialityImgEl}
                                                    />
                                                    <span
                                                        className={clsx(
                                                            'spaciality-icon',
                                                            styles.specialityIcon
                                                        )}
                                                    >
                                                        <img src={specialityIcon} alt="img" />
                                                    </span>
                                                </div>
                                                <h6 className={styles.specialityTitle}>
                                                    <a
                                                        href="doctor-grid.html"
                                                        className={styles.specialityTitleLink}
                                                    >
                                                        Cardiology
                                                    </a>
                                                </h6>
                                                <p className={clsx('mb-0', styles.specialityMeta)}>
                                                    254 Doctors
                                                </p>
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
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
                                    Phòng khám điều trị béo phì chuyên sâu chuẩn y khoa MedFit là
                                    địa chỉ tiên phong tại TP.HCM trong điều trị thừa cân, béo phì
                                    theo mô hình giảm cân đa mô thức, ứng dụng các phương pháp không
                                    xâm lấn dựa trên nền tảng y học chứng cứ. Với đội ngũ bác sĩ
                                    giàu kinh nghiệm trong các lĩnh vực Nội tiết, Dinh dưỡng, Nội
                                    khoa, Da liễu, chuyên gia dinh dưỡng và huấn luyện viên, MedFit
                                    mang đến giải pháp giảm cân an toàn, hiệu quả và cá nhân hóa
                                    theo tình trạng sức khỏe từng người.
                                </p>
                                <p>
                                    Trong bài viết này, Medpro sẽ tổng hợp các thông tin quan trọng
                                    về MedFit bao gồm thế mạnh chuyên môn, đội ngũ bác sĩ, dịch vụ
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
                                            Tìm kiếm "Phòng khám Giảm cân chuyên sâu MedFit".
                                        </span>
                                    </div>

                                    <div className={styles.guideStep}>
                                        <span className={styles.stepLabel}>Bước 3:</span>
                                        <span className={styles.stepContent}>
                                            Chọn loại dịch vụ bạn mong muốn như khám giảm cân với
                                            bác sĩ dinh dưỡng, khám giảm cân với bác sĩ nội tiết,
                                            khám tăng cơ giảm mỡ công nghệ cao với bác sĩ da liễu...
                                        </span>
                                    </div>

                                    <div className={styles.guideStep}>
                                        <span className={styles.stepLabel}>Bước 4:</span>
                                        <span className={styles.stepContent}>
                                            Lựa chọn thời gian, bác sĩ và hình thức khám (tại phòng
                                            khám hoặc tư vấn online).
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
                                <div className={styles.faqList} role="list">
                                    {faqs.map((item, idx) => (
                                        <div key={idx} className={styles.faqItem} role="listitem">
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
                                        title="Bản đồ Phòng khám MedFit"
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

export default MedicalFacilityProfile;
