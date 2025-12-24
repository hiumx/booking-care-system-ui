import React from 'react';
import styles from './SpecialtySidebar.module.scss';

const SpecialtySidebar: React.FC = () => {
    // Default address for map (can be made dynamic based on specialty location)
    const defaultAddress = 'Ho Chi Minh City, Vietnam';

    return (
        <div className={styles.sidebar}>
            {/* Banner Ads */}
            <div className={styles.bannerAds}>
                <div className={styles.adBadge}>Ads</div>
                <img
                    src="https://youmed.vn/tin-tuc/wp-content/uploads/2025/08/bannerR4_adapt300x600@4x.png"
                    alt="Advertisement"
                    className={styles.bannerImage}
                />
            </div>

            {/* Map Iframe */}
            <div className={styles.mapContainer}>
                <div className={styles.mapHeader}>
                    <h5>Bản đồ</h5>
                </div>
                <div className={styles.mapBody}>
                    <iframe
                        title="Bản đồ chuyên khoa"
                        src={`https://www.google.com/maps?q=${encodeURIComponent(defaultAddress)}&output=embed&zoom=13`}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className={styles.mapIframe}
                    ></iframe>
                </div>
            </div>
        </div>
    );
};

export default SpecialtySidebar;
