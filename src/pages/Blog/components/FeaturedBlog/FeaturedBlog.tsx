import React from 'react';
import styles from './FeaturedBlog.module.scss';
import { Link } from 'react-router-dom';
import { PATHS, replacePathParams } from '@/routes/paths';
import { BlogSummaryDto } from '@/types/blog.types';

interface FeaturedBlogProps {
    featuredBlogs: BlogSummaryDto[];
    formatDate: (dateString?: string) => string;
}

const FeaturedBlog: React.FC<FeaturedBlogProps> = ({ featuredBlogs, formatDate }) => {
    // Helper: try to extract an excerpt from possible fields on BlogSummaryDto
    const getRawExcerpt = (blog: BlogSummaryDto): string | null => {
        // Some API responses may include short content fields not typed in BlogSummaryDto
        const anyBlog = blog as any;
        return (
            anyBlog.excerpt ||
            anyBlog.summary ||
            anyBlog.contentVi ||
            anyBlog.content ||
            anyBlog.description ||
            null
        );
    };

    const decodeHtmlEntities = (html: string) => {
        const txt = document.createElement('textarea');
        txt.innerHTML = html;
        return txt.value;
    };

    const stripHtmlTags = (html?: string) => {
        if (!html) return '';
        // Decode HTML entities first (backend may return escaped HTML like '&lt;img ...&gt;')
        const decoded = decodeHtmlEntities(html);
        const tmp = document.createElement('div');
        tmp.innerHTML = decoded;
        return (tmp.textContent || tmp.innerText || '').trim();
    };

    const truncate = (text: string, max = 120) => {
        if (!text) return '';
        return text.length > max ? text.slice(0, max).trimEnd() + '...' : text;
    };
    // Get main article (first featured blog) and small articles (next 2)
    const mainArticle = featuredBlogs[0];
    const smallArticles = featuredBlogs.slice(1, 3);

    // If no blogs, show empty state or return null
    if (!mainArticle) {
        return null;
    }

    return (
        <section className={styles.featuredArticlesSection}>
            <div className={styles.articlesGrid}>
                {/* Main Article - Left Column */}
                <div className={styles.mainArticleColumn}>
                    <div className={styles.mainArticle}>
                        <Link
                            to={replacePathParams(PATHS.BLOG_DETAIL, { id: mainArticle.id })}
                            className={styles.imageLink}
                        >
                            <img
                                src={mainArticle.thumbnailUrl || '/placeholder-blog.jpg'}
                                alt={mainArticle.titleVi}
                                className={styles.mainArticleImage}
                            />
                        </Link>
                        <div className={styles.mainArticleContent}>
                            {mainArticle.tag && (
                                <Link
                                    to={replacePathParams(PATHS.BLOG_DETAIL, {
                                        id: mainArticle.id,
                                    })}
                                    className={styles.articleTag}
                                >
                                    {mainArticle.tag}
                                </Link>
                            )}
                            <h3>
                                <Link
                                    to={replacePathParams(PATHS.BLOG_DETAIL, {
                                        id: mainArticle.id,
                                    })}
                                    className={styles.mainArticleTitle}
                                >
                                    {mainArticle.titleVi}
                                </Link>
                            </h3>
                            <div className={styles.mainArticleMeta}>
                                {mainArticle.createdByName && (
                                    <Link
                                        to={replacePathParams(PATHS.BLOG_DETAIL, {
                                            id: mainArticle.id,
                                        })}
                                        className={styles.articleAuthor}
                                    >
                                        {mainArticle.createdByName}
                                    </Link>
                                )}
                                <span className={styles.articleDate}>
                                    {formatDate(mainArticle.publishedAt)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Small Articles - Right Column */}
                <div className={styles.smallArticlesColumn}>
                    {smallArticles.map((article) => (
                        <div key={article.id} className={styles.smallArticle}>
                            <Link
                                to={replacePathParams(PATHS.BLOG_DETAIL, { id: article.id })}
                                className={styles.smallArticleImage}
                            >
                                <img
                                    src={article.thumbnailUrl || '/placeholder-blog.jpg'}
                                    alt={article.titleVi}
                                />
                            </Link>
                            <div className={styles.smallArticleContent}>
                                {article.tag && (
                                    <Link
                                        to={replacePathParams(PATHS.BLOG_DETAIL, {
                                            id: article.id,
                                        })}
                                        className={styles.articleTag}
                                    >
                                        {article.tag}
                                    </Link>
                                )}
                                <Link
                                    to={replacePathParams(PATHS.BLOG_DETAIL, { id: article.id })}
                                    className={styles.smallArticleTitle}
                                >
                                    {article.titleVi}
                                </Link>
                                {/* Excerpt to avoid empty-looking cards; prefer API-provided short fields when available */}
                                {(() => {
                                    const raw = getRawExcerpt(article);
                                    const text = raw ? stripHtmlTags(raw) : '';
                                    const excerpt = truncate(text, 100);
                                    return excerpt ? (
                                        <p className={styles.smallArticleExcerpt} aria-hidden>
                                            {excerpt}
                                        </p>
                                    ) : null;
                                })()}
                                <div className={styles.smallArticleMeta}>
                                    {article.createdByName && (
                                        <Link
                                            to={replacePathParams(PATHS.BLOG_DETAIL, {
                                                id: article.id,
                                            })}
                                            className={styles.articleAuthor}
                                        >
                                            {article.createdByName}
                                        </Link>
                                    )}
                                    <span className={styles.articleDate}>
                                        {formatDate(article.publishedAt)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedBlog;
