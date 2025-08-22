import React from 'react';
import styles from './BlogSlider.module.scss';
import BlogSlider from '~/components/BlogSlider';

const BlogSlide: React.FC = () => {
    const articles = [
        {
            id: 1,
            image: 'https://cdn.youmed.vn/tin-tuc/wp-content/uploads/2024/12/lomexin-1000-mg-1-1-768x401.jpg',
            title: 'Bắt buộc kê toa điện tử: Phòng khám và Bác sĩ cần lưu ý gì?',
            tag: 'Tin tức YouMed',
            source: 'YouMed',
            date: 'Ngày đăng: 08 Th8, 2025',
            link: '#',
        },
        {
            id: 2,
            image: 'https://cdn.youmed.vn/tin-tuc/wp-content/uploads/2022/10/bien-suc-9-768x401.jpg',
            title: 'Doctor Workspace – Nền tảng tích hợp bộ công cụ làm việc cho Bác sĩ đúng chuẩn',
            tag: 'Tin tức YouMed',
            source: 'YouMed',
            date: 'Ngày đăng: 06 Th8, 2025',
            link: '#',
        },
        {
            id: 3,
            image: 'https://cdn.youmed.vn/tin-tuc/wp-content/uploads/2025/08/ke-toa-dien-tu-6-768x401.jpg',
            title: 'Biển súc – Vị thuốc quý và những công dụng đối với sức khỏe',
            tag: 'Dược liệu',
            source: 'ThS.BS Nguyễn Thị Lệ Quyên',
            date: 'Cập nhật: 23 Th10, 2022',
            link: '#',
        },
        {
            id: 4,
            image: 'https://cdn.youmed.vn/tin-tuc/wp-content/uploads/2025/08/benh-an-dien-tu-768x401.jpg',
            title: 'Thuốc Lomexin 1000 mg là gì? Công dụng, cách dùng và lưu ý khi dùng',
            tag: 'Thuốc',
            source: 'Dược sĩ Bùi Hoàng Ngọc Khánh',
            date: 'Ngày đăng: 25 Th12, 2024',
            link: '#',
        },
        {
            id: 5,
            image: 'https://cdn.youmed.vn/tin-tuc/wp-content/uploads/2025/08/xay-dung-thuong-hieu-ca-nhan-cho-bac-si-6-768x401.jpg',
            title: 'Tư vấn y tế trực tuyến: Giải pháp chăm sóc sức khỏe thời đại số',
            tag: 'Tin tức YouMed',
            source: 'YouMed',
            date: 'Ngày đăng: 05 Th8, 2025',
            link: '#',
        },
        {
            id: 6,
            image: 'https://cdn.youmed.vn/tin-tuc/wp-content/uploads/2025/08/bo-cong-cu-lam-viec-cho-bac-si-768x401.jpg',
            title: 'Công nghệ y tế: Xu hướng mới trong chẩn đoán và điều trị',
            tag: 'Tin tức YouMed',
            source: 'YouMed',
            date: 'Ngày đăng: 04 Th8, 2025',
            link: '#',
        },
    ];

    return (
        <section className={styles.articleSliderSection}>
            <div className={styles.sliderContainer}>
                <div className={styles.sliderHeader}>
                    <h2 className={styles.sliderTitle}>Bài Viết Mới Nhất</h2>
                </div>

                <BlogSlider
                    title={undefined}
                    items={articles.map((a) => ({
                        image: a.image,
                        title: a.title,
                        link: a.link,
                        tag: a.tag,
                        source: a.source,
                        date: a.date,
                    }))}
                    classes={{
                        sectionClassName: styles.articleSliderSection,
                        containerClassName: styles.sliderContainer,
                        headerClassName: styles.sliderHeader,
                        titleClassName: styles.sliderTitle,
                        swiperClassName: styles.swiper,
                        slideClassName: styles.swiperSlide,
                        navigationClassName: styles.customNavigation,
                        paginationClassName: styles.customPagination,
                    }}
                    cardClassNames={{
                        containerClassName: styles.articleCard,
                        imageLinkClassName: styles.imageLink,
                        imageClassName: styles.articleImage,
                        contentClassName: styles.articleContent,
                        tagClassName: styles.articleTag,
                        titleLinkClassName: styles.articleTitle,
                        metaClassName: styles.articleMeta,
                        metaTextClassName: styles.articleMetaText,
                        sourceClassName: styles.articleSource,
                        metaSeparatorClassName: styles.metaSeparator,
                        dateClassName: styles.articleDate,
                    }}
                    autoplayDelayMs={3000}
                    loop={true}
                    breakpoints={{
                        320: { slidesPerView: 1, spaceBetween: 15 },
                        768: { slidesPerView: 2, spaceBetween: 20 },
                        1024: { slidesPerView: 3, spaceBetween: 20 },
                        1200: { slidesPerView: 4, spaceBetween: 20 },
                    }}
                />
            </div>
        </section>
    );
};

export default BlogSlide;
