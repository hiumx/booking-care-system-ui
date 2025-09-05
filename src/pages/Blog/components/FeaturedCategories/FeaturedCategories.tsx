import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './FeaturedCategories.module.scss';
import BlogCard from '@/components/BLogCard';

const FeaturedCategories: React.FC = () => {
    const navigate = useNavigate();

    const categories = [
        {
            id: 1,
            title: 'Thuốc Lomexin 1000 mg là gì? Công dụng, cách dùng và lưu ý khi dùng',
            image: 'https://cdn.youmed.vn/tin-tuc/wp-content/uploads/2025/08/ke-toa-dien-tu-6-768x401.jpg',
            tag: 'Thuốc',
            source: 'Dược sĩ Bùi Hoàng Ngọc Khánh',
            date: 'Ngày đăng: 25 Th12, 2024',
            link: '#',
        },
        {
            id: 2,
            title: 'Tư vấn y tế trực tuyến: Giải pháp chăm sóc sức khỏe thời đại số',
            image: 'https://cdn.youmed.vn/tin-tuc/wp-content/uploads/2025/08/bo-cong-cu-lam-viec-cho-bac-si-768x401.jpg',
            tag: 'Tin tức YouMed',
            source: 'YouMed',
            date: 'Ngày đăng: 05 Th8, 2025',
            link: '#',
        },
        {
            id: 3,
            title: 'Công nghệ y tế: Xu hướng mới trong chẩn đoán và điều trị',
            image: 'https://cdn.youmed.vn/tin-tuc/wp-content/uploads/2022/10/bien-suc-9-768x401.jpg',
            tag: 'Tin tức YouMed',
            source: 'YouMed',
            date: 'Ngày đăng: 04 Th8, 2025',
            link: '#',
        },
        {
            id: 4,
            title: 'Y tế số: Chuyển đổi công nghệ trong ngành y tế Việt Nam',
            image: 'https://cdn.youmed.vn/tin-tuc/wp-content/uploads/2024/12/lomexin-1000-mg-1-1-768x401.jpg',
            tag: 'Tin tức YouMed',
            source: 'YouMed',
            date: 'Ngày đăng: 03 Th8, 2025',
            link: '#',
        },
    ];

    const handleViewAll = () => {
        navigate('/category/co-xuong-khop');
    };

    return (
        <section className={styles.featuredCategories}>
            <div className={styles.header}>
                <h2 className={styles.title}>Chuyên Mục Nổi Bật</h2>
                <button className="btn btn-primary-gradient" onClick={handleViewAll}>
                    XEM TẤT CẢ
                </button>
            </div>

            <div className={styles.categoriesGrid}>
                {categories.map((category) => (
                    <BlogCard
                        key={category.id}
                        image={category.image}
                        title={category.title}
                        link={category.link}
                        tag={category.tag}
                        source={category.source}
                        date={category.date}
                        containerClassName={styles.categoryCard}
                        imageLinkClassName={styles.imageLink}
                        imageClassName={''}
                        contentClassName={styles.cardContent}
                        tagClassName={styles.articleTag}
                        titleLinkClassName={styles.cardTitle}
                        metaClassName={styles.articleMeta}
                        metaTextClassName={styles.articleMetaText}
                        sourceClassName={styles.articleSource}
                        metaSeparatorClassName={styles.metaSeparator}
                        dateClassName={styles.articleDate}
                    />
                ))}
            </div>
        </section>
    );
};

export default FeaturedCategories;
