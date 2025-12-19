import React from 'react';
import styles from './StreakBadge.module.scss';

interface StreakBadgeProps {
    streakCount: number;
}

const StreakBadge: React.FC<StreakBadgeProps> = ({ streakCount }) => {
    return (
        <div className={styles['streak-badge']}>
            <span className={styles['streak-icon']}>🔥</span>
            <span className={styles['streak-count']}>{streakCount}</span>
            <span className={styles['streak-label']}>ngày liên tiếp</span>
        </div>
    );
};

export default StreakBadge;
