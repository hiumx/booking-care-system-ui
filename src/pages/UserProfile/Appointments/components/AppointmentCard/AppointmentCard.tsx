import React from 'react';
import { Link } from 'react-router-dom';
import {
    AppointmentCardData,
    AppointmentUITab,
    getAppointmentTypeText,
    getDisplayName,
    getDisplayAvatar,
    getDisplayEmail,
    getDisplayPhone,
    getDisplaySpecialty,
    getDisplayLabel,
} from '@/types/appointment.types';

interface AppointmentCardProps {
    appointment: AppointmentCardData;
    status: AppointmentUITab;
    variant?: 'full' | 'minimal'; // 'full' shows all actions, 'minimal' only shows view icon
    onCancel?: (appointment: AppointmentCardData) => void; // Callback for cancel action
    onReschedule?: (appointment: AppointmentCardData, action: 'SAME_DOCTOR' | 'NEW_DOCTOR') => void; // Callback for reschedule actions
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
    appointment,
    status,
    variant = 'full',
    onCancel,
    onReschedule,
}) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    // Get display values using helper functions (priority: Doctor > Service > Hospital)
    const displayName = getDisplayName(appointment);
    const displayAvatar = getDisplayAvatar(appointment);
    const displayEmail = getDisplayEmail(appointment);
    const displayPhone = getDisplayPhone(appointment);
    const displaySpecialty = getDisplaySpecialty(appointment);
    const displayLabel = getDisplayLabel(appointment);

    const renderActionButtons = () => {
        // Minimal variant - only show view icon
        if (variant === 'minimal') {
            return (
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
                    </ul>
                </li>
            );
        }

        // Full variant - show all actions based on status
        switch (status) {
            case 'waiting':
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
                                {/* Reschedule with same doctor - only show if has doctor */}
                                {appointment.doctorInfo?.id && (
                                    <li>
                                        <a
                                            href="#"
                                            title="Đổi lịch với cùng bác sĩ"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                onReschedule?.(appointment, 'SAME_DOCTOR');
                                            }}
                                        >
                                            <i className="isax isax-calendar-edit"></i>
                                        </a>
                                    </li>
                                )}
                                {/* Choose new doctor */}
                                <li>
                                    <a
                                        href="#"
                                        title="Chọn bác sĩ mới"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            onReschedule?.(appointment, 'NEW_DOCTOR');
                                        }}
                                    >
                                        <i className="isax isax-user-search"></i>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        title="Hủy lịch hẹn"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            onCancel?.(appointment);
                                        }}
                                    >
                                        <i className="isax isax-close-circle5"></i>
                                    </a>
                                </li>
                            </ul>
                        </li>
                        <li className="appointment-detail-btn">
                            <span className="badge badge-warning">
                                <i className="isax isax-clock5 me-1"></i> Chờ Xác Nhận
                            </span>
                        </li>
                    </>
                );

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
                                {/* Reschedule with same doctor - only show if has doctor */}
                                {appointment.doctorInfo?.id && (
                                    <li>
                                        <a
                                            href="#"
                                            title="Đổi lịch với cùng bác sĩ"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                onReschedule?.(appointment, 'SAME_DOCTOR');
                                            }}
                                        >
                                            <i className="isax isax-calendar-edit"></i>
                                        </a>
                                    </li>
                                )}
                                {/* Choose new doctor */}
                                <li>
                                    <a
                                        href="#"
                                        title="Chọn bác sĩ mới"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            onReschedule?.(appointment, 'NEW_DOCTOR');
                                        }}
                                    >
                                        <i className="isax isax-user-search"></i>
                                    </a>
                                </li>
                                <li>
                                    <Link to="#" title="Nhắn tin">
                                        <i className="isax isax-messages-25"></i>
                                    </Link>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        title="Hủy lịch hẹn"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            onCancel?.(appointment);
                                        }}
                                    >
                                        <i className="isax isax-close-circle5"></i>
                                    </a>
                                </li>
                            </ul>
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
                {/* Display Information - Priority: Doctor > Service > Hospital */}
                <li>
                    <div className="patinet-information">
                        <Link
                            to={`/user/profile?tab=appointment-detail&id=${encodeURIComponent(appointment.appointmentId)}&status=${status}`}
                        >
                            {displayAvatar ? (
                                <img src={displayAvatar} alt={displayName} />
                            ) : (
                                <div className="avatar-placeholder">
                                    <i className="isax isax-user"></i>
                                </div>
                            )}
                        </Link>
                        <div className="patient-info">
                            <p>{displayLabel}</p>
                            <h6>
                                <Link
                                    to={`/user/profile?tab=appointment-detail&id=${encodeURIComponent(appointment.appointmentId)}&status=${status}`}
                                >
                                    {displayName}
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
                        {formatDate(appointment.appointmentDate)}
                        {' | '}
                        {appointment.appointmentTime}
                    </p>
                    <ul className="d-flex apponitment-types">
                        <li>{displaySpecialty}</li>
                        <li>{getAppointmentTypeText(appointment.appointmentType)}</li>
                    </ul>
                </li>

                {/* Contact Information - Show for waiting, upcoming and cancelled */}
                {(status === 'waiting' || status === 'upcoming' || status === 'cancelled') && (
                    <li className="mail-info-patient">
                        <ul>
                            {displayEmail && (
                                <li>
                                    <i className="isax isax-sms5"></i>
                                    <Link to={`mailto:${displayEmail}`}>{displayEmail}</Link>
                                </li>
                            )}
                            {displayPhone && (
                                <li>
                                    <i className="isax isax-call5"></i>
                                    <Link to={`tel:${displayPhone}`}>{displayPhone}</Link>
                                </li>
                            )}
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
