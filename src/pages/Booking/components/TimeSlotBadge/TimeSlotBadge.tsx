interface TimeSlotBadgeProps {
    startTime: string;
    endTime: string;
    minWidth?: string;
    type?: string;
}

const TimeSlotBadge: React.FC<TimeSlotBadgeProps> = ({
    startTime,
    endTime,
    minWidth = 'none',
    type = 'primary',
}) => {
    return (
        <div
            className={`text-${type} badge bg-${type}-subtle px-2 py-2`}
            style={{
                fontSize: '0.875rem',
                fontWeight: '500',
                minWidth: minWidth,
            }}
        >
            <i className="fa-regular fa-clock me-1"></i>
            {startTime} - {endTime}
        </div>
    );
};

export default TimeSlotBadge;
