import React from 'react';
import { DailyCompletion } from '@/types/nutrition.types';
import styles from './WeeklyChart.module.scss';

interface WeeklyChartProps {
    weeklyCompletion: DailyCompletion[];
}

const WeeklyChart: React.FC<WeeklyChartProps> = ({ weeklyCompletion }) => {
    const getDayLabel = (dateStr: string) => {
        const date = new Date(dateStr);
        const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
        return days[date.getDay()];
    };

    const maxPercentage = Math.max(...weeklyCompletion.map((d) => d.completionPercentage), 100);

    return (
        <div className={styles['weekly-chart']}>
            {weeklyCompletion.map((day, index) => (
                <div key={index} className={styles['chart-bar']}>
                    <div className={styles['bar-container']}>
                        <div
                            className={`${styles['bar-fill']} ${day.isFullyCompleted ? styles.completed : ''}`}
                            style={{
                                height: `${(day.completionPercentage / maxPercentage) * 100}%`,
                            }}
                        >
                            {day.completionPercentage > 0 && (
                                <span className={styles['bar-value']}>
                                    {Math.round(day.completionPercentage)}%
                                </span>
                            )}
                        </div>
                    </div>
                    <div className={styles['bar-label']}>{getDayLabel(day.date)}</div>
                </div>
            ))}
        </div>
    );
};

export default WeeklyChart;
