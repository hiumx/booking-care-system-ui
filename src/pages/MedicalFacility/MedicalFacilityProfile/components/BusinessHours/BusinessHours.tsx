// BusinessHours.tsx
import React from 'react';
import clsx from 'clsx';

interface BusinessHour {
    day: string;
    time: string;
}

interface BusinessHoursProps {
    businessHours: BusinessHour[];
    isActive?: boolean;
}

const BusinessHours: React.FC<BusinessHoursProps> = ({ businessHours, isActive = false }) => {
    // Lấy ngày hiện tại
    const today = new Date();
    const currentDay = today.toLocaleDateString('vi-VN', { weekday: 'long' }); // Ví dụ: "Thứ Sáu"

    // Kiểm tra trạng thái mở/đóng dựa trên giờ
    const currentHour = today.getHours();
    const isOpen = currentHour >= 7 && currentHour < 17; // Mở từ 7:00 AM đến 5:00 PM

    return (
        <div
            role="tabpanel"
            className={clsx('tab-pane fade', { 'show active': isActive })}
            id="doc_business_hours"
        >
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <div className="widget business-widget">
                        <div className="widget-content">
                            <div className="listing-hours">
                                {businessHours.map((hour, index) => {
                                    const isCurrentDay = hour.day === currentDay;
                                    return (
                                        <div
                                            className={clsx('listing-day', {
                                                current: isCurrentDay,
                                                closed: isCurrentDay && !isOpen,
                                            })}
                                            key={index}
                                        >
                                            <div className="day">
                                                {isCurrentDay ? (
                                                    <>
                                                        Hôm nay{' '}
                                                        <span>
                                                            {today.toLocaleDateString('vi-VN', {
                                                                day: 'numeric',
                                                                month: 'short',
                                                                year: 'numeric',
                                                            })}
                                                        </span>
                                                    </>
                                                ) : (
                                                    hour.day
                                                )}
                                            </div>
                                            <div className="time-items">
                                                {isCurrentDay && isOpen ? (
                                                    <span className="open-status">
                                                        <span className="badge bg-success-light">
                                                            Đang Mở
                                                        </span>
                                                    </span>
                                                ) : null}
                                                <span className="time">
                                                    {isCurrentDay && !isOpen ? (
                                                        <span className="badge bg-danger-light">
                                                            Đóng cửa
                                                        </span>
                                                    ) : (
                                                        hour.time
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BusinessHours;
