import React from 'react';
import styles from './BlogSlider.module.scss';
import BlogSlider from '@/components/BlogSlider';
import { BlogSummaryDto } from '@/types/blog.types';
import { PATHS, replacePathParams } from '@/routes/paths';

interface BlogSlideProps {
    recentBlogs: BlogSummaryDto[];
    formatDate: (dateString?: string) => string;
}

const BlogSlide: React.FC<BlogSlideProps> = ({ recentBlogs, formatDate }) => {
    if (!recentBlogs || recentBlogs.length === 0) {
        return null;
    }

    return (
        <section className={styles.articleSliderSection}>
            <div className={styles.sliderContainer}>
                <div className={styles.sliderHeader}>
                    <h2 className={styles.sliderTitle}>Bài Viết Mới Nhất</h2>
                </div>

                <BlogSlider
                    title={undefined}
                    items={recentBlogs.map((blog) => ({
                        image: blog.thumbnailUrl || '/placeholder-blog.jpg',
                        title: blog.titleVi,
                        link: replacePathParams(PATHS.BLOG_DETAIL, { id: blog.id }),
                        tag: blog.tag,
                        source: blog.source,
                        date: formatDate(blog.publishedAt),
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
