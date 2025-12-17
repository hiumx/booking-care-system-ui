import React from 'react';
import './MacroBar.scss';

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
        <div className="macro-bar">
            <div className="macro-bar-header">
                <span className="macro-label">{label}</span>
                <span className="macro-value">
                    {current.toFixed(1)} / {target.toFixed(1)} {unit}
                </span>
            </div>
            <div className="macro-bar-track">
                <div
                    className="macro-bar-fill"
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
