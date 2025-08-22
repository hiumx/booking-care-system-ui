import React from 'react';
import styles from './FeaturedBlog.module.scss';
import { Link } from 'react-router-dom';

const FeaturedBlog: React.FC = () => {
    const mainArticle = {
        id: 1,
        image: 'https://cdn.youmed.vn/tin-tuc/wp-content/uploads/2025/08/cap-nhat-kien-thuc-y-khoa-lien-tuc.jpg',
        title: 'YouMed & Trung tâm Đào tạo Kỹ năng Nghề nghiệp Y khoa ĐHQG-HCM ký kết thỏa thuận hợp tác chiến lược, chung tay nâng cao chất lượng Cập nhật kiến thức y khoa liên tục, mở rộng cơ hội ',
        source: 'ThS.BS Nguyễn Thị Lệ Quyên',
        date: 'Cập nhật: 17 Th8, 2025',
        link: '1',
        tag: 'Tin tức',
    };

    const smallArticles = [
        {
            id: 2,
            image: 'https://cdn.youmed.vn/tin-tuc/wp-content/uploads/2025/08/xay-dung-thuong-hieu-ca-nhan-cho-bac-si-6-768x401.jpg',
            title: 'Tầm quan trọng của việc xây dựng thương hiệu cá nhân thương hiệu cá nhân',
            description:
                'Ngày nay, việc xây dựng thương hiệu cá nhân dành cho Bác sĩ ngày càng trở nên quan trọng. Không chỉ giúp khẳng định vị thế chuyên môn mà còn tạo dựng niềm tin với bệnh nhân trong thời đại số hóa.',
            source: 'ThS.BS Nguyễn Thị Lệ Quyên',
            date: 'Ngày đăng: 08 Th8, 2025',
            link: '2',
            tag: 'Chuyên môn',
        },
        {
            id: 3,
            image: 'https://cdn.youmed.vn/tin-tuc/wp-content/uploads/2025/08/benh-an-dien-tu-768x401.jpg',
            title: 'Triển khai bệnh án điện tử đạt chuẩn Bộ Y tế: Phòng khám Bác sĩ cần lưu ý gì?',
            description:
                'Bệnh án điện tử là chủ đề nhận được nhiều sự quan tâm trong bối cảnh ngành y tế đẩy mạnh chuyển đổi số. Dù không còn xa lạ, việc triển khai đúng chuẩn vẫn còn nhiều thách thức.',
            source: 'YouMed',
            date: 'Ngày đăng: 08 Th8, 2025',
            link: '3',
            tag: 'Công nghệ',
        },
    ];

    return (
        <section className={styles.featuredArticlesSection}>
            <div className={styles.articlesGrid}>
                {/* Main Article - Left Column */}
                <div className={styles.mainArticleColumn}>
                    <div className={styles.mainArticle}>
                        <Link to={mainArticle.link} className={styles.imageLink}>
                            <img
                                src={mainArticle.image}
                                alt={mainArticle.title}
                                className={styles.mainArticleImage}
                            />
                        </Link>
                        <div className={styles.mainArticleContent}>
                            <Link to={mainArticle.link} className={styles.articleTag}>
                                {mainArticle.tag}
                            </Link>
                            <h3>
                                <Link to={mainArticle.link} className={styles.mainArticleTitle}>
                                    {mainArticle.title}
                                </Link>
                            </h3>
                            <div className={styles.mainArticleMeta}>
                                <Link to={mainArticle.link} className={styles.articleSource}>
                                    {mainArticle.source}
                                </Link>
                                <span className={styles.metaSeparator}>·</span>
                                <span className={styles.articleDate}>{mainArticle.date}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Small Articles - Right Column */}
                <div className={styles.smallArticlesColumn}>
                    {smallArticles.map((article) => (
                        <div key={article.id} className={styles.smallArticle}>
                            <Link to={article.link} className={styles.smallArticleImage}>
                                <img src={article.image} alt={article.title} />
                            </Link>
                            <div className={styles.smallArticleContent}>
                                <Link to={article.link} className={styles.articleTag}>
                                    {article.tag}
                                </Link>
                                <Link to={article.link} className={styles.smallArticleTitle}>
                                    {article.title}
                                </Link>
                                <p className={styles.smallArticleDescription}>
                                    {article.description}
                                </p>
                                <div className={styles.smallArticleMeta}>
                                    <span className={styles.articleMetaText}>
                                        <Link to={article.link} className={styles.articleSource}>
                                            {article.source}
                                        </Link>
                                        <span className={styles.metaSeparator}>·</span>
                                        <span className={styles.articleDate}>{article.date}</span>
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
