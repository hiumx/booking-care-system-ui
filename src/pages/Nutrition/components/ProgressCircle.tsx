import React from 'react';
import './ProgressCircle.scss';

interface ProgressCircleProps {
    percentage: number;
    size?: number;
}

const ProgressCircle: React.FC<ProgressCircleProps> = ({ percentage, size = 100 }) => {
    const radius = (size - 10) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="progress-circle" style={{ width: size, height: size }}>
            <svg width={size} height={size}>
                <circle
                    className="progress-circle-bg"
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth="8"
                />
                <circle
                    className="progress-circle-fill"
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                />
            </svg>
            <div className="progress-circle-text">
                <span className="percentage">{Math.round(percentage)}%</span>
            </div>
        </div>
    );
};

export default ProgressCircle;
