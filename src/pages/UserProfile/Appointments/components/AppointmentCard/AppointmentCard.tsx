import React from 'react';
import { Link } from 'react-router-dom';
import { AppointmentData, AppointmentStatus } from '../../types/appointment.types';

interface AppointmentCardProps {
    appointment: AppointmentData;
    status: AppointmentStatus;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment, status }) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    const getAppointmentTypeLabel = (type: string) => {
        const typeLabels = {
            video_call: 'Video Call',
            audio_call: 'Audio Call',
            chat: 'Chat',
            direct_visit: 'Direct Visit',
        };
        return typeLabels[type as keyof typeof typeLabels] || type;
    };

    const renderActionButtons = () => {
        switch (status) {
            case 'upcoming':
                return (
                    <>
                        <li className="appointment-action">
                            <ul>
                                <li>
                                    <Link
                                        to={`/user/profile?tab=appointment-detail&id=${encodeURIComponent(appointment.appointmentId)}&status=${status}`}
                                        title="Xem chi tiết"
                                    >
                                        <i className="isax isax-eye4"></i>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="#" title="Nhắn tin">
                                        <i className="isax isax-messages-25"></i>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="#" title="Hủy lịch hẹn">
                                        <i className="isax isax-close-circle5"></i>
                                    </Link>
                                </li>
                            </ul>
                        </li>
                        <li className="appointment-detail-btn">
                            <Link to="#" className="btn btn-md btn-primary-gradient">
                                <i className="isax isax-calendar-tick5 me-1"></i> Tham Gia
                            </Link>
                        </li>
                    </>
                );

            case 'cancelled':
                return (
                    <li className="appointment-detail-btn">
                        <Link
                            to={`/user/profile?tab=appointment-detail&id=${encodeURIComponent(appointment.appointmentId)}&status=${status}`}
                        >
                            <i className="isax isax-calendar-tick5 me-1"></i> Đặt Lại
                        </Link>
                    </li>
                );

            case 'completed':
                return (
                    <>
                        <li>
                            {appointment.hasReview ? (
                                <Link
                                    to="#"
                                    className="text-decoration-underline"
                                    data-bs-toggle="modal"
                                    data-bs-target="#view_review"
                                >
                                    Xem Đánh Giá
                                </Link>
                            ) : (
                                <Link
                                    to="#"
                                    className="text-decoration-underline"
                                    data-bs-toggle="modal"
                                    data-bs-target="#add_review"
                                >
                                    Thêm Đánh Giá
                                </Link>
                            )}
                        </li>
                        <li className="appointment-detail-btn d-flex align-items-center gap-3 flex-wrap">
                            <Link to="#" className="btn btn-md btn-dark">
                                Đặt Lại <i className="isax isax-arrow-right-3 ms-1"></i>
                            </Link>
                            <Link
                                to={`/user/profile?tab=appointment-detail&id=${encodeURIComponent(appointment.appointmentId)}&status=${status}`}
                                title="Xem chi tiết"
                                className="btn btn-md btn-primary-gradient"
                            >
                                Xem Chi Tiết <i className="isax isax-arrow-right-3 ms-1"></i>
                            </Link>
                        </li>
                    </>
                );

            default:
                return null;
        }
    };

    return (
        <div className="appointment-wrap">
            <ul>
                {/* Doctor Information */}
                <li>
                    <div className="patinet-information">
                        <Link
                            to={`/user/profile?tab=appointment-detail&id=${encodeURIComponent(appointment.appointmentId)}&status=${status}`}
                        >
                            <img src={appointment.doctor.avatar} alt={appointment.doctor.name} />
                        </Link>
                        <div className="patient-info">
                            <p>{appointment.appointmentId}</p>
                            <h6>
                                <Link
                                    to={`/user/profile?tab=appointment-detail&id=${encodeURIComponent(appointment.appointmentId)}&status=${status}`}
                                >
                                    {appointment.doctor.name}
                                </Link>
                                {appointment.isNew && <span className="badge new-tag">Mới</span>}
                            </h6>
                        </div>
                    </div>
                </li>

                {/* Appointment Information */}
                <li className="appointment-info">
                    <p>
                        <i className="isax isax-clock5"></i>
                        {formatDate(appointment.appointmentDate)} {appointment.appointmentTime}
                    </p>
                    <ul className="d-flex apponitment-types">
                        <li>{appointment.visitType}</li>
                        <li>{getAppointmentTypeLabel(appointment.appointmentType)}</li>
                    </ul>
                </li>

                {/* Contact Information - Only show for upcoming and cancelled */}
                {(status === 'upcoming' || status === 'cancelled') && (
                    <li className="mail-info-patient">
                        <ul>
                            <li>
                                <i className="isax isax-sms5"></i>
                                <Link to={`mailto:${appointment.doctor.email}`}>
                                    {appointment.doctor.email}
                                </Link>
                            </li>
                            <li>
                                <i className="isax isax-call5"></i>
                                <Link to={`tel:${appointment.doctor.phone}`}>
                                    {appointment.doctor.phone}
                                </Link>
                            </li>
                        </ul>
                    </li>
                )}

                {/* Action Buttons */}
                {renderActionButtons()}
            </ul>
        </div>
    );
};

export default AppointmentCard;
