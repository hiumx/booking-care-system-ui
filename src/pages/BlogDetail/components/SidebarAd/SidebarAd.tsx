import React from 'react';
import styles from './SidebarAd.module.scss';

const SidebarAd: React.FC = () => {
    return (
        <aside className={styles.sidebar}>
            <img
                src={
                    'https://youmed.vn/tin-tuc/wp-content/uploads/2025/08/bannerR4_adapt300x600@4x.png'
                }
                alt="Advertisement"
                className={styles.banner}
            />
        </aside>
    );
};

export default SidebarAd;
