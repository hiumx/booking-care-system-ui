import React from 'react';
import './StreakBadge.scss';

interface StreakBadgeProps {
    streakCount: number;
}

const StreakBadge: React.FC<StreakBadgeProps> = ({ streakCount }) => {
    return (
        <div className="streak-badge">
            <span className="streak-icon">🔥</span>
            <span className="streak-count">{streakCount}</span>
            <span className="streak-label">ngày liên tiếp</span>
        </div>
    );
};

export default StreakBadge;
