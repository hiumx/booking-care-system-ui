import React from 'react';
import styles from './Benefits.module.scss';

const Benefits: React.FC = () => {
    const features = [
        {
            img: 'https://cdn.youmed.vn/tin-tuc/wp-content/uploads/2024/07/block-1.png',
            text: 'Đặt khám không chờ đợi',
        },
        {
            img: 'https://cdn.youmed.vn/tin-tuc/wp-content/uploads/2024/07/block-2.png',
            text: 'Nhắn tin với bác sĩ',
        },
        {
            img: 'https://cdn.youmed.vn/tin-tuc/wp-content/uploads/2024/07/block-3.png',
            text: 'Gọi video với bác sĩ',
        },
        {
            img: 'https://cdn.youmed.vn/tin-tuc/wp-content/uploads/2024/07/block-4.png',
            text: 'Mua sản phẩm y tế giá tốt',
        },
        {
            img: 'https://cdn.youmed.vn/tin-tuc/wp-content/uploads/2024/07/block-5.png',
            text: 'Lưu trữ hồ sơ y tế',
        },
        {
            img: 'https://cdn.youmed.vn/tin-tuc/wp-content/uploads/2024/07/block-6.png',
            text: 'Đọc tin y tế chính thống',
        },
    ];

    return (
        <section className={styles.benefitsSection} aria-label="Đặt khám tiện lợi cùng YouMed">
            <div className={styles.benefitsContainer}>
                <h2 className={styles.benefitsTitle}>Đặt khám tiện lợi cùng Medcure</h2>
                <div className={styles.statsRow}>
                    <div className={styles.statItem}>
                        <div className={styles.statNumber}>+25</div>
                        <div className={styles.statLabel}>Bệnh viện</div>
                    </div>
                    <div className={styles.statItem}>
                        <div className={styles.statNumber}>+700</div>
                        <div className={styles.statLabel}>Bác sĩ</div>
                    </div>
                    <div className={styles.statItem}>
                        <div className={styles.statNumber}>+89</div>
                        <div className={styles.statLabel}>Bệnh viện</div>
                    </div>
                </div>

                <div className={styles.featuresGrid}>
                    {features.map((f, idx) => (
                        <div className={styles.featureItem} key={idx}>
                            <div className={styles.featureIcon}>
                                <img src={f.img} alt="feature" className={styles.featureIconImg} />
                            </div>
                            <div className={styles.featureText}>
                                <span className={styles.featureTextSingle}>{f.text}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Benefits;
