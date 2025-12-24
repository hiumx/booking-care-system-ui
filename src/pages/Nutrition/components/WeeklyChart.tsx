import React from 'react';
import { useTranslation } from 'react-i18next';
import { DailyCompletion } from '@/types/nutrition.types';
import styles from './WeeklyChart.module.scss';

interface WeeklyChartProps {
    weeklyCompletion: DailyCompletion[];
}

const WeeklyChart: React.FC<WeeklyChartProps> = ({ weeklyCompletion }) => {
    const { t } = useTranslation('nutrition');

    const getDayLabel = (dateStr: string) => {
        const date = new Date(dateStr);
        const dayIndex = date.getDay();
        const dayKeys = [
            'sunday',
            'monday',
            'tuesday',
            'wednesday',
            'thursday',
            'friday',
            'saturday',
        ];
        return t(`weekDays.${dayKeys[dayIndex]}`);
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
