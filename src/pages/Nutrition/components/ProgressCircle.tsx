import React from 'react';
import styles from './ProgressCircle.module.scss';

interface ProgressCircleProps {
    percentage: number;
    size?: number;
}

const ProgressCircle: React.FC<ProgressCircleProps> = ({ percentage, size = 100 }) => {
    const radius = (size - 10) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className={styles['progress-circle']} style={{ width: size, height: size }}>
            <svg width={size} height={size}>
                <circle
                    className={styles['progress-circle-bg']}
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth="8"
                />
                <circle
                    className={styles['progress-circle-fill']}
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                />
            </svg>
            <div className={styles['progress-circle-text']}>
                <span className={styles.percentage}>{Math.round(percentage)}%</span>
            </div>
        </div>
    );
};

export default ProgressCircle;
