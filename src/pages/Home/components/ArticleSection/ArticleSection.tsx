import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PATHS } from '@/routes/paths';
import article01 from '@/assets/img/blog/article-01.jpg';
import article02 from '@/assets/img/blog/article-02.jpg';
import article03 from '@/assets/img/blog/article-03.jpg';
import article04 from '@/assets/img/blog/article-04.jpg';

interface Article {
    id: string | number;
    image: string;
    title: string;
    description: string;
    category: string;
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
        date: dates[index].date,
        day: dates[index].day,
        month: months[dates[index].monthIndex],
    }));

    const displayArticles = articles || defaultArticles;

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
                                        {article.category}
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
                                    <p>{article.description}</p>
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
