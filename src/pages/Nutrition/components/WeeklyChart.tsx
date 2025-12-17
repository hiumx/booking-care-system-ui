import React from 'react';
import { DailyCompletion } from '@/types/nutrition.types';
import './WeeklyChart.scss';

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
        <div className="weekly-chart">
            {weeklyCompletion.map((day, index) => (
                <div key={index} className="chart-bar">
                    <div className="bar-container">
                        <div
                            className={`bar-fill ${day.isFullyCompleted ? 'completed' : ''}`}
                            style={{
                                height: `${(day.completionPercentage / maxPercentage) * 100}%`,
                            }}
                        >
                            {day.completionPercentage > 0 && (
                                <span className="bar-value">
                                    {Math.round(day.completionPercentage)}%
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="bar-label">{getDayLabel(day.date)}</div>
                </div>
            ))}
        </div>
    );
};

export default WeeklyChart;
