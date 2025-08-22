import React, { MouseEvent } from 'react';
import styles from './BlogDetail.module.scss';
import BlogHeader from '@/pages/Blog/components/BlogHeader/BlogHeader';
import { PATHS } from '@/routes/paths';
import authorAvatar from '@/assets/img/about-img1.jpg';
import BlogCard from '~/components/BLogCard';
import BlogSlider from '~/components/BlogSlider';
import Breadcrumb from '@/pages/BlogDetail/components/Breadcrumb';
import MetaInfo from '@/pages/BlogDetail/components/MetaInfo';
import TableOfContents from '@/pages/BlogDetail/components/TableOfContents';
import ContentSections from '@/pages/BlogDetail/components/ContentSections';
import Benefits from '@/pages/BlogDetail/components/Benefits';
import SidebarAd from '@/pages/BlogDetail/components/SidebarAd';
import TabAccordion from '@/pages/BlogDetail/components/TabAccordion';

// import bannerImg from '@/assets/img/banner/banner-051.jpg';

// Temporary mock data for demo purposes
const mockArticle = {
    title: 'Tầm quan trọng của việc xây dựng thương hiệu cá nhân cho Bác sĩ trong thời đại số',
    author: {
        name: 'YouMed',
        avatar: authorAvatar,
        url: PATHS.BLOG, // placeholder; replace with author profile path when available
    },
    date: 'Ngày đăng: 08 Th8, 2025',
    categories: [
        { label: 'Trang chủ', path: PATHS.HOME },
        { label: 'Bản tin sức khỏe', path: PATHS.BLOG },
        { label: 'Tin tức YouMed' },
    ],
    sections: [
        {
            id: 'role',
            title: 'Vai trò của xây dựng thương hiệu cá nhân cho Bác sĩ trong thời đại số',
        },
        {
            id: 'personal-brand',
            title: 'Xây dựng thương hiệu cá nhân cho Bác sĩ – “chìa khóa” bước vào kỷ nguyên số',
        },
        {
            id: 'how-to',
            title: 'Làm thế nào để xây dựng thương hiệu cá nhân cho Bác sĩ đúng cách?',
        },
        {
            id: 'solution',
            title: 'Doctor Workspace – Giải pháp xây dựng thương hiệu cá nhân cho Bác sĩ một cách hiệu quả',
        },
    ],
};

// TabAccordion moved to components/TabAccordion

const BlogDetail: React.FC = () => {
    // reserved for future data fetching: slug from params
    // All sticky behavior will be handled by pure CSS with a container scope.

    const handleTocClick = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        const el = document.getElementById(id);
        if (!el) return;
        const headerOffset = 90; // offset for sticky BlogHeader
        const elementPosition = el.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    };

    return (
        <>
            <BlogHeader />
            <div className={styles.blogDetailContainer}>
                {/* Breadcrumb under BlogHeader */}
                <Breadcrumb items={mockArticle.categories} />

                <div className={styles.mainArea}>
                    {/* Left: Article */}
                    <article className={styles.article}>
                        <h1 className={styles.title}>{mockArticle.title}</h1>
                        <MetaInfo
                            authorUrl={mockArticle.author.url}
                            authorName={mockArticle.author.name}
                            authorAvatar={mockArticle.author.avatar}
                            date={mockArticle.date}
                        />
                        <TableOfContents items={mockArticle.sections} onClick={handleTocClick} />
                        <ContentSections sections={mockArticle.sections} />
                        <Benefits />
                        {/* Post-actions: Disclaimer / References / Feedback */}

                        <TabAccordion />
                    </article>

                    {/* Right: Banner */}
                    <SidebarAd />
                </div>

                {/* Related Slider */}
                <section aria-label="Bài viết liên quan">
                    <div className={styles.relatedSliderContainer}>
                        <div className={styles.relatedSliderHeader}>
                            <h2 className={styles.relatedSliderTitle}>Bài viết liên quan</h2>
                            <button className="btn btn-primary-gradient">XEM TẤT CẢ</button>
                        </div>
                        <BlogSlider
                            items={[1, 2, 3, 4, 5, 6, 7, 8].map((i) => ({
                                image: `https://picsum.photos/seed/rel-${i}/800/450`,
                                title:
                                    i % 2 === 0
                                        ? 'Nhân sâm: Những điều bạn có thể chưa biết'
                                        : 'Thổ ty tử: Vị thuốc lạ mà quen',
                                link: '#',
                                tag: 'Tin tức YouMed',
                                source: i % 2 === 0 ? 'YouMed' : 'BS chuyên khoa',
                                date:
                                    i % 2 === 0
                                        ? 'Ngày đăng: 11 Th1, 2022'
                                        : 'Cập nhật: 29 Th4, 2022',
                            }))}
                            classes={{
                                sectionClassName: styles.relatedSliderSection,
                                containerClassName: styles.relatedSliderContainer,
                                headerClassName: styles.relatedSliderHeader,
                                titleClassName: styles.relatedSliderTitle,
                                swiperClassName: styles.relatedSwiper,
                                slideClassName: styles.relatedSwiperSlide,
                                navigationClassName: styles.relatedNavigation,
                                paginationClassName: styles.relatedPagination,
                            }}
                            cardClassNames={{
                                containerClassName: styles.relatedSlideCard,
                                imageLinkClassName: styles.relatedSlideImageLink,
                                imageClassName: styles.relatedSlideImage,
                                contentClassName: styles.relatedSlideContent,
                                tagClassName: styles.relatedSlideTag,
                                titleLinkClassName: styles.relatedSlideTitle,
                                metaClassName: styles.relatedSlideMeta,
                                metaTextClassName: styles.relatedSlideMetaText,
                                sourceClassName: styles.relatedSlideSource,
                                metaSeparatorClassName: styles.relatedSlideSeparator,
                                dateClassName: styles.relatedSlideDate,
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

                {/* Related Articles */}
                <section className={styles.relatedSection} aria-label="Có thể bạn quan tâm">
                    <div className={styles.relatedContainer}>
                        <div className={styles.relatedHeader}>
                            <h2 className={styles.relatedTitle}>Có thể bạn quan tâm</h2>
                        </div>
                        <div className={styles.relatedGrid}>
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <BlogCard
                                    key={i}
                                    image={`https://picsum.photos/seed/ym-${i}/800/450`}
                                    title={
                                        i % 2 === 0
                                            ? 'Cỏ mật: Loại cây cỏ độc đáo ít người biết'
                                            : 'Cây cơm nguội: Chữa bệnh bạch đới, khí hư'
                                    }
                                    link={'#'}
                                    tag={'Tin tức YouMed'}
                                    source={i % 2 === 0 ? 'YouMed' : 'BS chuyên khoa'}
                                    date={
                                        i % 2 === 0
                                            ? 'Ngày đăng: 06 Th4, 2022'
                                            : 'Cập nhật: 29 Th4, 2022'
                                    }
                                    containerClassName={styles.relatedCard}
                                    imageLinkClassName={styles.relatedImageLink}
                                    imageClassName={styles.relatedImage}
                                    contentClassName={styles.relatedContent}
                                    tagClassName={styles.relatedTag}
                                    titleLinkClassName={styles.relatedTitleLink}
                                    metaClassName={styles.relatedMeta}
                                    metaTextClassName={styles.relatedMetaText}
                                    sourceClassName={styles.relatedSource}
                                    metaSeparatorClassName={styles.relatedSeparator}
                                    dateClassName={styles.relatedDate}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default BlogDetail;
