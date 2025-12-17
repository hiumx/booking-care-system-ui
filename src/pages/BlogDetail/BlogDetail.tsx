import React, { MouseEvent, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './BlogDetail.module.scss';
import BlogHeader from '@/pages/Blog/components/BlogHeader/BlogHeader';
import { PATHS, replacePathParams } from '@/routes/paths';
import authorAvatar from '@/assets/img/about-img1.jpg';
import BlogSlider from '@/components/BlogSlider';
import Breadcrumb from '@/pages/BlogDetail/components/Breadcrumb';
import MetaInfo from '@/pages/BlogDetail/components/MetaInfo';
import TableOfContents from '@/pages/BlogDetail/components/TableOfContents';
import Benefits from '@/pages/BlogDetail/components/Benefits';
import SidebarAd from '@/pages/BlogDetail/components/SidebarAd';
import TabAccordion from '@/pages/BlogDetail/components/TabAccordion';
import { BlogService } from '@/services/blog.service';
import { BlogDetailDto, BlogRelationItemDto, BlogRelationType } from '@/types/blog.types';
import { useApiCall } from '@/hooks/useApiCall';
import Spinner from '@/components/Spinner';
import ExpandableText from '@/components/ExpandableText';
import '@/styles/bio-content.scss';

const BlogDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [blog, setBlog] = useState<BlogDetailDto | null>(null);
    const [relatedBlogs, setRelatedBlogs] = useState<BlogRelationItemDto[]>([]);
    const RELATED_BLOGS_LIMIT = 6;

    // Fetch blog detail
    const {
        data: blogData,
        isLoading: isLoadingBlog,
        error: blogError,
        execute: fetchBlog,
    } = useApiCall(async () => {
        if (!id) throw new Error('Blog ID is required');
        const response = await BlogService.getBlogById(id);
        return response.data;
    });

    // Fetch related blogs
    const { data: relatedData, execute: fetchRelated } = useApiCall<BlogRelationItemDto[]>(
        async () => {
            if (!blog?.category?.id) {
                return [];
            }

            const response = await BlogService.getBlogs({
                categoryId: blog.category.id,
                page: 1,
                pageSize: RELATED_BLOGS_LIMIT + 1,
            });

            const items = response.data?.items ?? [];

            return items
                .filter((item) => item.id !== blog?.id)
                .slice(0, RELATED_BLOGS_LIMIT)
                .map((item) => ({
                    blogId: item.id,
                    relationType: BlogRelationType.Related,
                    titleVi: item.titleVi,
                    thumbnailUrl: item.thumbnailUrl,
                    tag: item.tag,
                    source: item.source,
                    publishedAt: item.publishedAt,
                }));
        }
    );

    useEffect(() => {
        if (id) {
            fetchBlog();
        }
    }, [id]);

    useEffect(() => {
        if (blogData) {
            setBlog(blogData);
        }
    }, [blogData]);

    useEffect(() => {
        if (relatedData) {
            setRelatedBlogs(relatedData);
        }
    }, [relatedData]);

    useEffect(() => {
        if (blog?.category?.id) {
            fetchRelated();
        } else {
            setRelatedBlogs([]);
        }
    }, [blog?.category?.id, blog?.id]);

    // Don't auto-redirect on error - let user see the error message
    // useEffect(() => {
    //     if (blogError) {
    //         console.error('Error fetching blog:', blogError);
    //         navigate(PATHS.BLOG);
    //     }
    // }, [blogError, navigate]);

    const handleTocClick = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        const el = document.getElementById(id);
        if (!el) return;
        const headerOffset = 90; // offset for sticky BlogHeader
        const elementPosition = el.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return `Ngày đăng: ${date.getDate()} Th${date.getMonth() + 1}, ${date.getFullYear()}`;
    };

    // Parse HTML content to extract sections for table of contents
    const parseContentSections = (content: string) => {
        // Simple regex to find h2 tags - can be enhanced
        const h2Regex = /<h2[^>]*>(.*?)<\/h2>/gi;
        const sections: { id: string; title: string }[] = [];
        let match;
        let index = 0;

        while ((match = h2Regex.exec(content)) !== null) {
            const title = match[1]
                .split(/<[^>]*>/g)
                .join('')
                .trim();
            const id = `section-${index}`;
            sections.push({ id, title });
            index++;
        }

        return sections;
    };

    if (isLoadingBlog) {
        return (
            <>
                <BlogHeader />
                <div style={{ textAlign: 'center', padding: '4rem' }}>
                    <Spinner />
                </div>
            </>
        );
    }

    // Show error or not found message
    if (blogError || !blog) {
        const isNotFound =
            blogError?.toLowerCase().includes('not found') ||
            blogError?.toLowerCase().includes('không tìm thấy') ||
            !blogError; // If no error but no blog data, assume not found

        return (
            <>
                <BlogHeader />
                <div style={{ textAlign: 'center', padding: '4rem' }}>
                    <h2>{isNotFound ? 'Blog không tồn tại' : 'Đã xảy ra lỗi'}</h2>
                    {!isNotFound && blogError && (
                        <p style={{ color: '#dc3545', marginBottom: '1rem' }}>{blogError}</p>
                    )}
                    <button onClick={() => navigate(PATHS.BLOG)} className="btn btn-primary">
                        Quay lại danh sách blog
                    </button>
                </div>
            </>
        );
    }

    const sections = parseContentSections(blog.contentVi);
    const categories = [
        { label: 'Trang chủ', path: PATHS.HOME },
        { label: 'Bản tin sức khỏe', path: PATHS.BLOG },
        ...(blog.category ? [{ label: blog.category.categoryName }] : []),
    ];

    return (
        <>
            <BlogHeader />
            <div className={styles.blogDetailContainer}>
                {/* Breadcrumb under BlogHeader */}
                <Breadcrumb items={categories} />

                <div className={styles.mainArea}>
                    {/* Left: Article */}
                    <article className={styles.article}>
                        <h1 className={styles.title}>{blog.titleVi}</h1>
                        <MetaInfo
                            authorUrl={PATHS.BLOG}
                            authorName={blog.createdByName || blog.source || 'Medcure'}
                            authorAvatar={authorAvatar}
                            date={formatDate(blog.publishedAt)}
                        />
                        {sections.length > 0 && (
                            <TableOfContents items={sections} onClick={handleTocClick} />
                        )}
                        <div className={styles.blogContent}>
                            <ExpandableText text={blog.contentVi} limit={500} />
                        </div>
                        <Benefits />
                        <TabAccordion />
                    </article>

                    {/* Right: Banner */}
                    <SidebarAd />
                </div>

                {/* Related Slider */}
                {relatedBlogs.length > 0 && (
                    <section aria-label="Bài viết liên quan">
                        <div className={styles.relatedSliderContainer}>
                            <div className={styles.relatedSliderHeader}>
                                <h2 className={styles.relatedSliderTitle}>Bài viết liên quan</h2>
                                <button
                                    className="btn btn-primary-gradient"
                                    onClick={() => navigate(PATHS.BLOG)}
                                >
                                    XEM TẤT CẢ
                                </button>
                            </div>
                            <BlogSlider
                                items={relatedBlogs.map((related) => ({
                                    image: related.thumbnailUrl || '/placeholder-blog.jpg',
                                    title: related.titleVi,
                                    link: replacePathParams(PATHS.BLOG_DETAIL, {
                                        id: related.blogId,
                                    }),
                                    tag: related.tag,
                                    source: related.source,
                                    date: formatDate(related.publishedAt),
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
                )}
            </div>
        </>
    );
};

export default BlogDetail;
