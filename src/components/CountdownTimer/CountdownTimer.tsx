import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './CountdownTimer.module.scss';
import clsx from 'clsx';

interface CountdownTimerProps {
    remainingSeconds: number;
    className?: string;
    size?: 'small' | 'medium' | 'large';
    variant?: 'default' | 'warning' | 'danger';
    showIcon?: boolean;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
    remainingSeconds,
    className,
    size = 'medium',
    variant = 'default',
    showIcon = true,
}) => {
    const { t } = useTranslation('booking');

    // Format time as MM:SS
    const formatTime = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const remainingSecs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
    };

    // Determine variant based on remaining time
    const getVariant = (): string => {
        if (variant !== 'default') return variant;

        if (remainingSeconds <= 60) return 'danger'; // Last minute
        if (remainingSeconds <= 120) return 'warning'; // Last 2 minutes
        return 'default';
    };

    const currentVariant = getVariant();

    return (
        <div
            className={clsx(
                styles.countdownTimer,
                styles[`size-${size}`],
                styles[`variant-${currentVariant}`],
                className
            )}
        >
            {showIcon && <i className={clsx('fas fa-clock', styles.icon)} />}
            <span className={styles.time}>
                {t('common.holdSlot', { time: formatTime(remainingSeconds) })}
            </span>
        </div>
    );
};

export default CountdownTimer;
