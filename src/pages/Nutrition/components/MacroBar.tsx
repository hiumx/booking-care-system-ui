import React from 'react';
import styles from './MacroBar.module.scss';

interface MacroBarProps {
    label: string;
    current: number;
    target: number;
    unit: string;
    color: string;
}

const MacroBar: React.FC<MacroBarProps> = ({ label, current, target, unit, color }) => {
    const percentage = Math.min((current / target) * 100, 100);

    return (
        <div className={styles['macro-bar']}>
            <div className={styles['macro-bar-header']}>
                <span className={styles['macro-label']}>{label}</span>
                <span className={styles['macro-value']}>
                    {current.toFixed(1)} / {target.toFixed(1)} {unit}
                </span>
            </div>
            <div className={styles['macro-bar-track']}>
                <div
                    className={styles['macro-bar-fill']}
                    style={{
                        width: `${percentage}%`,
                        backgroundColor: color,
                    }}
                />
            </div>
        </div>
    );
};

export default MacroBar;
