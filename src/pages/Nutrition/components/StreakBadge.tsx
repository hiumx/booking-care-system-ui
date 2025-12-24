import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './StreakBadge.module.scss';

interface StreakBadgeProps {
    streakCount: number;
}

const StreakBadge: React.FC<StreakBadgeProps> = ({ streakCount }) => {
    const { t } = useTranslation('nutrition');

    return (
        <div className={styles['streak-badge']}>
            <span className={styles['streak-icon']}>🔥</span>
            <span className={styles['streak-count']}>{streakCount}</span>
            <span className={styles['streak-label']}>{t('common.consecutiveDays')}</span>
        </div>
    );
};

export default StreakBadge;
