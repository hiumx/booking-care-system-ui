import clsx from 'clsx';
import React from 'react';
import styles from './BookingHeader.module.scss';

export interface DoctorInfo {
    name: string;
    specialty: string;
    rating: number;
    location: string;
    avatar: string;
}

export interface AppointmentInfo {
    service: string;
    serviceType: string;
    dateTime: string;
    appointmentType: string;
}

interface BookingHeaderProps {
    doctor: DoctorInfo;
    appointment: AppointmentInfo;
    isShowInfo?: boolean;
}

const BookingHeader: React.FC<BookingHeaderProps> = ({
    doctor,
    appointment,
    isShowInfo = true,
}) => {
    // Parse date and time from appointment.dateTime
    // Format: "15/10/2025 - 09:00-10:00, 14:00-15:00" or "15/10/2025" or "Chưa chọn"
    const parseDateTime = (dateTimeString: string) => {
        if (dateTimeString === 'Chưa chọn') {
            return { date: 'Chưa chọn', timeSlots: [] };
        }

        const parts = dateTimeString.split(' - ');
        const date = parts[0];
        const timeSlots = parts.length > 1 ? parts.slice(1).join(', ').split(', ') : [];

        return { date, timeSlots };
    };

    const { date, timeSlots } = parseDateTime(appointment.dateTime);

    return (
        <div className="card-header pt-3">
            <div className="booking-header pb-0">
                <div className="card mb-0">
                    <div className="card-body">
                        <div
                            className={clsx(
                                'd-flex align-items-center flex-wrap rpw-gap-2 flex-wrap row-gap-2',
                                { 'mb-4': isShowInfo }
                            )}
                        >
                            <span className="avatar avatar-xxxl avatar-rounded me-2 flex-shrink-0">
                                <img src={doctor.avatar} alt={doctor.name} />
                            </span>
                            <div>
                                <h4 className="mb-1 d-flex align-items-center gap-1">
                                    <span>{doctor.name}</span>
                                    <span className="badge bg-orange fs-12">
                                        <i className="fa-solid fa-star me-1"></i>
                                        {doctor.rating}
                                    </span>
                                </h4>
                                <p className="text-indigo mb-3 fw-medium">{doctor.specialty}</p>
                                <p className="mb-0">
                                    <i className="isax isax-location me-2"></i>
                                    {doctor.location}
                                </p>
                            </div>
                        </div>
                        {isShowInfo && (
                            <>
                                <h6 className="mb-2">Thông tin lịch khám</h6>
                                <div className="row gx-2 gy-3">
                                    <div className="col-lg-3 col-sm-6">
                                        <div>
                                            <h6 className="fs-14 fw-medium mb-1">Dịch vụ</h6>
                                            <p className="mb-0">{appointment.service}</p>
                                        </div>
                                    </div>
                                    <div className="col-lg-3 col-sm-6">
                                        <div>
                                            <h6 className="fs-14 fw-medium mb-1">Dịch vụ</h6>
                                            <p className="mb-0">{appointment.serviceType}</p>
                                        </div>
                                    </div>
                                    <div className="col-lg-3 col-sm-6">
                                        <div>
                                            <h6 className="fs-14 fw-medium mb-1">Ngày khám</h6>
                                            <p className="mb-0">
                                                <i className="fa-regular fa-calendar me-1"></i>
                                                {date}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="col-lg-3 col-sm-6">
                                        <div>
                                            <h6 className="fs-14 fw-medium mb-1">Loại lịch khám</h6>
                                            <p className="mb-0">{appointment.appointmentType}</p>
                                        </div>
                                    </div>
                                    <div className="mt-2">
                                        {
                                            <>
                                                <h6 className="fs-14 fw-medium mb-2 mt-2">
                                                    Giờ khám{' '}
                                                    {`${Math.max(timeSlots.length, 0)} khung`}
                                                </h6>
                                                <div className="d-flex flex-wrap gap-1">
                                                    {timeSlots.length > 0 ? (
                                                        timeSlots.map((slot) => (
                                                            <span
                                                                key={`${slot}-${timeSlots.indexOf(slot)}`}
                                                                className={clsx(
                                                                    styles.slotBadge,
                                                                    'badge bg-primary-transparent mb-1 me-1'
                                                                )}
                                                                style={{ fontSize: '0.75rem' }}
                                                            >
                                                                <i className="fa-regular fa-clock me-1"></i>
                                                                {slot}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <p className="mb-0">Chưa chọn khung giờ</p>
                                                    )}
                                                </div>
                                            </>
                                        }
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingHeader;
