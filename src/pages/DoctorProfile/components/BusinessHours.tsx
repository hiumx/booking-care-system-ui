import React from 'react';

interface BusinessHour {
    day: string;
    date?: string; // chỉ có Today mới có
    time: string;
    available?: boolean; // Today mới có badge
}

const businessHours: BusinessHour[] = [
    { day: 'Today', date: '5 Feb 2024', time: '07:00 AM - 09:00 PM', available: true },
    { day: 'Monday', time: '07:00 AM - 09:00 PM' },
    { day: 'Tuesday', time: '07:00 AM - 09:00 PM' },
    { day: 'Wednesday', time: '07:00 AM - 09:00 PM' },
    { day: 'Thursday', time: '07:00 AM - 09:00 PM' },
    { day: 'Friday', time: '07:00 AM - 09:00 PM' },
    { day: 'Saturday', time: '07:00 AM - 09:00 PM' },
    { day: 'Sunday', time: '07:00 AM - 09:00 PM' },
];

const BusinessHours: React.FC = () => {
    return (
        <div className="doc-information-details" id="bussiness_hour">
            <div className="detail-title">
                <h4>Lịch làm việc</h4>
            </div>
            <div className="hours-business">
                <ul>
                    {businessHours.map((hour, index) => (
                        <li key={index}>
                            {hour.day === 'Today' ? (
                                <>
                                    <div className="today-hours">
                                        <h6>{hour.day}</h6>
                                        {hour.date && <span>{hour.date}</span>}
                                    </div>
                                    <div className="availed">
                                        {hour.available && (
                                            <span className="badge doc-avail-badge">
                                                <i className="fa-solid fa-circle"></i> Available
                                            </span>
                                        )}
                                        <p>{hour.time}</p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <h6>{hour.day}</h6>
                                    <p>{hour.time}</p>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default BusinessHours;
