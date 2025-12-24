import React from 'react';
import styles from './CommitmentSection.module.scss';
import { Link } from 'react-router-dom';

const CommitmentSection: React.FC = () => {
    const items = [
        {
            id: 1,
            icon: 'https://cdn.youmed.vn/tin-tuc/wp-content/themes/herb/images/icon-01.svg',
            title: 'Biên soạn bởi Bác sĩ và Dược sĩ',
        },
        {
            id: 2,
            icon: 'https://cdn.youmed.vn/tin-tuc/wp-content/themes/herb/images/icon-02.svg',
            title: 'Chính sách biên tập nội dung minh bạch',
        },
    ];

    return (
        <section className={styles.commitmentSection}>
            <h2 className={styles.title}>Cam Kết Từ Medcure</h2>
            <div className={styles.card}>
                <div className={styles.headingBlock}>
                    <p className={styles.leadText}>
                        Tạo nên một nguồn thông tin sức khỏe đáng tin cậy, dễ đọc, dễ hiểu cho mọi
                        đối tượng độc giả
                    </p>
                    <div className={styles.cta}>
                        Cam kết của chúng tôi{''}
                        <span className={styles.ctaIcon} aria-hidden="true">
                            →
                        </span>
                    </div>
                </div>
                <div className={styles.itemsGrid}>
                    {items.map((i) => (
                        <Link key={i.id} to="#" className={styles.item}>
                            <div className={styles.iconBox}>
                                <img src={i.icon} alt={i.title} />
                            </div>
                            <div className={styles.itemTitle}>{i.title}</div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CommitmentSection;
