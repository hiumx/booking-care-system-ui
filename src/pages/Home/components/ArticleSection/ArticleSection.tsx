import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PATHS } from '@/routes/paths';
import article01 from '@/assets/img/blog/article-01.jpg';
import article02 from '@/assets/img/blog/article-02.jpg';
import article03 from '@/assets/img/blog/article-03.jpg';
import article04 from '@/assets/img/blog/article-04.jpg';
import BlogService from '@/services/blog.service';

interface Article {
    id: string | number;
    image: string;
    title: string;
    description: string;
    category: string;
    tag?: string;
    date: string;
    day: string;
    month: string;
    slug?: string;
}

interface ArticleSectionProps {
    articles?: Article[];
}

const ArticleSection: React.FC<ArticleSectionProps> = ({ articles }) => {
    const { t, i18n } = useTranslation('home');

    // Get articles from translation
    const translatedArticles = t('article.articles', {
        returnObjects: true,
    }) as Array<{ category: string; title: string; description: string }>;

    const imagePaths = [article01, article02, article03, article04];
    const [fetchedArticles, setFetchedArticles] = useState<Article[] | null>(null);

    // Month names based on language
    const monthNames = {
        en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        vi: ['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12'],
    };

    const dates = [
        { date: '2024-05-15', day: '15', monthIndex: 4 },
        { date: '2024-05-18', day: '18', monthIndex: 4 },
        { date: '2024-04-21', day: '21', monthIndex: 3 },
        { date: '2024-01-22', day: '22', monthIndex: 0 },
    ];

    const currentLang = i18n.language || 'vi';
    const months = monthNames[currentLang as keyof typeof monthNames] || monthNames.vi;

    const defaultArticles: Article[] = translatedArticles.map((item, index) => ({
        id: index + 1,
        image: imagePaths[index] || article01,
        ...item,
        tag: '',
        date: dates[index].date,
        day: dates[index].day,
        month: months[dates[index].monthIndex],
    }));

    useEffect(() => {
        let isMounted = true;
        async function loadLatestBlogs() {
            try {
                const res = await BlogService.getBlogs({ page: 1, pageSize: 4 });
                const items = res.data?.items ?? (res.data as any) ?? [];
                const articlesFromApi: Article[] = (items || [])
                    .slice(0, 4)
                    .map((item: any, index: number) => {
                        const itemDate = item.publishedAt
                            ? new Date(item.publishedAt)
                            : item.date
                              ? new Date(item.date)
                              : new Date();
                        const day = String(itemDate.getDate()).padStart(2, '0');
                        const month = months[itemDate.getMonth()] || months[0];
                        return {
                            id: item.id ?? index + 1,
                            image:
                                item.thumbnailUrl || item.image || imagePaths[index] || article01,
                            title: item.titleVi || item.title || item.name || '',
                            description: item.excerpt || item.description || '',
                            category: item.category?.categoryName || item.category || '',
                            date:
                                item.publishedAt ||
                                item.date ||
                                itemDate.toISOString().split('T')[0],
                            day,
                            month,
                            slug: item.slug ?? String(item.id),
                        };
                    });
                if (isMounted) setFetchedArticles(articlesFromApi);
            } catch {
                // swallow error, keep fallback content
            }
            return;
        }
        loadLatestBlogs();
        return () => {
            isMounted = false;
        };
    }, [i18n.language]);

    const displayArticles = articles || fetchedArticles || defaultArticles;
    // Helpers to extract/clean excerpt similar to FeaturedBlog
    const getRawExcerpt = (item: any): string | null => {
        return (
            item?.excerpt ||
            item?.summary ||
            item?.contentVi ||
            item?.content ||
            item?.description ||
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
        const decoded = decodeHtmlEntities(html);
        const tmp = document.createElement('div');
        tmp.innerHTML = decoded;
        return (tmp.textContent || tmp.innerText || '').trim();
    };

    const truncate = (text: string, max = 120) => {
        if (!text) return '';
        return text.length > max ? text.slice(0, max).trimEnd() + '...' : text;
    };

    return (
        <section className="article-section">
            <div className="container">
                <div className="section-header sec-header-one text-center aos" data-aos="fade-up">
                    <span className="badge badge-primary">{t('article.badge')}</span>
                    <h2>{t('article.title')}</h2>
                </div>
                <div className="row g-4">
                    {displayArticles.map((article) => (
                        <div key={article.id} className="col-lg-6">
                            <div className="article-item aos" data-aos="fade-up">
                                <div className="article-img">
                                    <Link
                                        to={
                                            article.slug
                                                ? `${PATHS.BLOG}/${article.slug}`
                                                : PATHS.BLOG
                                        }
                                    >
                                        <img
                                            src={article.image}
                                            className="img-fluid"
                                            alt={article.title}
                                        />
                                    </Link>
                                    <div className="date-icon">
                                        <span>{article.day}</span>
                                        {article.month}
                                    </div>
                                </div>
                                <div className="article-info">
                                    <span className="badge badge-cyan mb-2">
                                        {article.tag || article.category}
                                    </span>
                                    <h6 className="mb-2">
                                        <Link
                                            to={
                                                article.slug
                                                    ? `${PATHS.BLOG}/${article.slug}`
                                                    : PATHS.BLOG
                                            }
                                            className="text-decoration-none"
                                        >
                                            {article.title}
                                        </Link>
                                    </h6>
                                    {(() => {
                                        const raw = getRawExcerpt(article as any);
                                        const text = raw ? stripHtmlTags(raw) : '';
                                        const excerpt = truncate(text, 120);
                                        return excerpt ? <p>{excerpt}</p> : null;
                                    })()}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="text-center load-item aos" data-aos="fade-up">
                    <Link to={PATHS.BLOG} className="btn btn-dark">
                        {t('article.viewAll')}
                        <i className="isax isax-arrow-right-3 ms-2"></i>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default ArticleSection;
