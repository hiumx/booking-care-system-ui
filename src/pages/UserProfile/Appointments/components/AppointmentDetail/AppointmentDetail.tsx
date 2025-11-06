import React from 'react';
import { Link } from 'react-router-dom';
import {
    AppointmentDetailProps,
    StatusConfig,
    getAppointmentTypeText as getTypeText,
    getAppointmentTypeIcon,
    getDisplayName,
    getDisplayAvatar,
    getDisplayEmail,
    getDisplayPhone,
    getDisplayLabel,
} from '@/types/appointment.types';
import { AppointmentStatus, AppointmentType } from '@/enums/appointment.enums';

const AppointmentDetail: React.FC<AppointmentDetailProps> = ({
    appointment,
    onStartSession,
    onCancel,
    onReschedule,
    onDownloadPrescription,
}) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };
    // Configuration cho từng trạng thái
    const getStatusConfig = (): StatusConfig => {
        switch (appointment.status) {
            case AppointmentStatus.PENDING:
                return {
                    badge: { className: 'badge bg-warning', text: 'Chờ Xác Nhận' },
                    showContactInfo: true,
                    showLocation: true,
                    showStartSession: false,
                    showReschedule: false,
                    showDownloadPrescription: false,
                    showCancelButton: true,
                    showReasonLink: false,
                    bottomSection: 'waiting_status',
                };
            case AppointmentStatus.CONFIRMED:
                return {
                    badge: { className: 'badge bg-secondary', text: 'Sắp Tới' },
                    showContactInfo: true,
                    showLocation: true,
                    showStartSession: true,
                    showReschedule: false,
                    showDownloadPrescription: false,
                    showCancelButton: true,
                    showReasonLink: false,
                    bottomSection: 'start_session',
                };
            case AppointmentStatus.CANCELLED:
                return {
                    badge: { className: 'badge bg-red me-2', text: 'Đã Hủy' },
                    showContactInfo: true,
                    showStartSession: false,
                    showLocation: false,
                    showReschedule: true,
                    showDownloadPrescription: false,
                    showCancelButton: false,
                    showReasonLink: true,
                    bottomSection: 'reschedule_status',
                };
            case AppointmentStatus.COMPLETED:
                return {
                    badge: { className: 'badge bg-green', text: 'Hoàn Thành' },
                    showContactInfo: true,
                    showStartSession: false,
                    showLocation: false,
                    showReschedule: true,
                    showDownloadPrescription: true,
                    showCancelButton: false,
                    showReasonLink: false,
                    bottomSection: 'prescription_reschedule',
                };
            default:
                return {
                    badge: { className: 'badge bg-secondary', text: 'Không xác định' },
                    showContactInfo: false,
                    showStartSession: false,
                    showLocation: false,
                    showReschedule: false,
                    showDownloadPrescription: false,
                    showCancelButton: false,
                    showReasonLink: false,
                    bottomSection: 'waiting_status',
                };
        }
    };

    const config = getStatusConfig();

    // Render appointment type icon with custom colors
    const renderAppointmentTypeIcon = () => {
        const iconClass = getAppointmentTypeIcon(appointment.appointmentType);

        // Add custom color classes based on type
        let colorClass = '';
        switch (appointment.appointmentType) {
            case AppointmentType.TELEHEALTH:
                colorClass = 'text-indigo';
                break;
            case AppointmentType.IN_PERSON:
                colorClass = 'text-green';
                break;
        }

        return <i className={`${iconClass} ${colorClass}`}></i>;
    };

    // Render bottom section based on status
    const renderBottomSection = () => {
        switch (config.bottomSection) {
            case 'waiting_status':
                return (
                    <li>
                        <div className="detail-badge-info">
                            <span className="badge badge-warning">
                                <i className="isax isax-clock5 me-2"></i> Đang chờ xác nhận
                            </span>
                        </div>
                    </li>
                );
            case 'start_session':
                return (
                    <li>
                        <div className="start-btn">
                            <button
                                type="button"
                                className="btn btn-md btn-primary-gradient rounded-pill"
                                onClick={onStartSession}
                            >
                                Bắt Đầu Phiên
                            </button>
                        </div>
                    </li>
                );
            case 'reschedule_status':
                return (
                    <li>
                        <div className="detail-badge-info">
                            <span className="badge bg-soft-red me-2">Trạng thái: Đặt lại lịch</span>
                            <button
                                type="button"
                                className="reschedule-btn btn btn-primary-gradient rounded-pill"
                                onClick={() => onReschedule?.()}
                            >
                                Đặt Lại Lịch Hẹn
                            </button>
                        </div>
                    </li>
                );
            case 'prescription_reschedule':
                return (
                    <li className="detail-badge-info">
                        <button
                            type="button"
                            className="btn btn-light rounded-pill me-3"
                            onClick={onDownloadPrescription}
                        >
                            Tải Đơn Thuốc
                        </button>
                        <button
                            type="button"
                            className="btn reschedule-btn btn-primary-gradient rounded-pill"
                            onClick={() => onReschedule?.()}
                        >
                            Đặt Lại Lịch Hẹn
                        </button>
                    </li>
                );
            default:
                return null;
        }
    };

    return (
        <div className="appointment-details-wrap">
            {/* Appointment Detail Card */}
            <div className="appointment-wrap appointment-detail-card">
                <ul>
                    <li>
                        <div className="patinet-information">
                            <Link to="#">
                                <img
                                    src={getDisplayAvatar(appointment)}
                                    alt={getDisplayLabel(appointment)}
                                />
                            </Link>
                            <div className="patient-info">
                                <p>{getDisplayLabel(appointment)}</p>
                                <h6>
                                    <Link to="#">{getDisplayName(appointment)}</Link>
                                </h6>
                                {config.showContactInfo && (
                                    <div className="mail-info-patient">
                                        <ul>
                                            {getDisplayEmail(appointment) && (
                                                <li>
                                                    <i className="isax isax-sms5"></i>
                                                    {getDisplayEmail(appointment)}
                                                </li>
                                            )}
                                            {getDisplayPhone(appointment) && (
                                                <li>
                                                    <i className="isax isax-call5"></i>
                                                    {getDisplayPhone(appointment)}
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </li>
                    <li className="appointment-info">
                        {appointment.personWithPatient && (
                            <div className="person-info">
                                <p>Người đi cùng bệnh nhân</p>
                                <ul className="d-flex apponitment-types">
                                    <li>{appointment.personWithPatient}</li>
                                </ul>
                            </div>
                        )}
                        <div className="person-info">
                            <p>Loại Cuộc Hẹn</p>
                            <ul className="d-flex apponitment-types">
                                <li>
                                    {renderAppointmentTypeIcon()}
                                    {getTypeText(appointment.appointmentType)}
                                </li>
                            </ul>
                        </div>
                    </li>
                    <li className="appointment-action">
                        <div className="detail-badge-info">
                            <span className={config.badge.className}>{config.badge.text}</span>
                            {config.showReasonLink && (
                                <Link
                                    to="#reject_reason"
                                    className="reject-popup"
                                    data-bs-toggle="modal"
                                >
                                    Lý do
                                </Link>
                            )}
                        </div>
                        {/* Hiển thị phí tư vấn cho tất cả trạng thái */}
                        <div className="consult-fees">
                            <h6>
                                Phí Tư Vấn:{' '}
                                {appointment.doctorInfo?.consultationFee
                                    ? `${appointment.doctorInfo?.consultationFee.toLocaleString('vi-VN')} VNĐ`
                                    : 'Đang cập nhật...'}
                            </h6>
                        </div>
                        <ul>
                            <li>
                                <Link to="#">
                                    <i className="isax isax-messages-25"></i>
                                </Link>
                            </li>
                            {/* Option 1: Reschedule with same doctor */}
                            {(appointment.status === AppointmentStatus.PENDING ||
                                appointment.status === AppointmentStatus.CONFIRMED) && (
                                <li>
                                    <Link
                                        to="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            onReschedule?.(appointment, 'SAME_DOCTOR');
                                        }}
                                        title="Đổi lịch với cùng bác sĩ"
                                    >
                                        <i className="isax isax-calendar-edit"></i>
                                    </Link>
                                </li>
                            )}
                            {/* Option 3: Choose new doctor */}
                            {(appointment.status === AppointmentStatus.PENDING ||
                                appointment.status === AppointmentStatus.CONFIRMED) && (
                                <li>
                                    <Link
                                        to="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            onReschedule?.(appointment, 'NEW_DOCTOR');
                                        }}
                                        title="Chọn bác sĩ mới"
                                    >
                                        <i className="isax isax-user-search"></i>
                                    </Link>
                                </li>
                            )}
                            {/* Option 4: Cancel/Refund */}
                            {config.showCancelButton && (
                                <li>
                                    <Link
                                        to="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            onCancel?.();
                                        }}
                                        title="Hủy lịch hẹn"
                                    >
                                        <i className="isax isax-close-circle5"></i>
                                    </Link>
                                </li>
                            )}
                        </ul>
                    </li>
                </ul>
                <ul className="detail-card-bottom-info">
                    <li>
                        <h6>Ngày & Giờ Hẹn</h6>
                        <span>
                            {formatDate(appointment.appointmentDate)} {' | '}
                            {appointment.appointmentTime}
                        </span>
                    </li>
                    {config.showLocation && (
                        <li>
                            <h6>Vị trí</h6>
                            <span>{appointment.location}</span>
                        </li>
                    )}
                    {appointment.visitType && (
                        <li>
                            <h6>Loại Thăm Khám</h6>
                            <span>{appointment.visitType}</span>
                        </li>
                    )}
                    {renderBottomSection()}
                </ul>
            </div>
            {/* /Appointment Detail Card */}
        </div>
    );
};

export default AppointmentDetail;
