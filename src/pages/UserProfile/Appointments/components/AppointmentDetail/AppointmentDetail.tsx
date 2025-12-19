import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    AppointmentDetailProps,
    StatusConfig,
    getAppointmentTypeIcon,
    getDisplayName,
    getDisplayAvatar,
    getDisplayEmail,
    getDisplayPhone,
    getDisplayLabel,
    getDisplayFeeText,
    isServiceAppointment,
    getRebookingUrl,
} from '@/types/appointment.types';
import { AppointmentStatus, AppointmentType } from '@/enums/appointment.enums';
import {
    formatAppointmentDate,
    getAppointmentTypeText,
} from '../../utils/appointment-format.utils';

const AppointmentDetail: React.FC<AppointmentDetailProps> = ({
    appointment,
    onStartSession,
    onCancel,
    onReschedule,
}) => {
    const { t, i18n } = useTranslation('userProfile');

    // Configuration cho từng trạng thái
    const getStatusConfig = (): StatusConfig => {
        switch (appointment.status) {
            case AppointmentStatus.PENDING:
                return {
                    badge: {
                        className: 'badge bg-warning',
                        text: t('appointments.detailCard.status.pending'),
                    },
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
                    badge: {
                        className: 'badge bg-secondary',
                        text: t('appointments.detailCard.status.confirmed'),
                    },
                    showContactInfo: true,
                    showLocation: true,
                    showStartSession: true,
                    showReschedule: false,
                    showDownloadPrescription: false,
                    showCancelButton: true,
                    showReasonLink: false,
                    bottomSection: 'none',
                };
            case AppointmentStatus.CANCELLED:
                return {
                    badge: {
                        className: 'badge bg-red me-2',
                        text: t('appointments.detailCard.status.cancelled'),
                    },
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
                    badge: {
                        className: 'badge bg-green',
                        text: t('appointments.detailCard.status.completed'),
                    },
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
                    badge: {
                        className: 'badge bg-secondary',
                        text: t('appointments.detailCard.status.unknown'),
                    },
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
                                <i className="isax isax-clock5 me-2"></i>
                                {t('appointments.detailCard.waitingConfirmation')}
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
                                {t('appointments.detailCard.startSession')}
                            </button>
                        </div>
                    </li>
                );
            case 'reschedule_status':
                return (
                    <li>
                        <div className="detail-badge-info">
                            <span className="badge bg-soft-red me-2">
                                {t('appointments.detailCard.rescheduleStatus')}
                            </span>
                            <Link
                                to={getRebookingUrl(appointment)}
                                className="reschedule-btn btn btn-primary-gradient rounded-pill"
                            >
                                {t('appointments.detailCard.rescheduleAppointment')}
                            </Link>
                        </div>
                    </li>
                );
            case 'prescription_reschedule':
                return (
                    <li className="detail-badge-info">
                        <Link
                            to={getRebookingUrl(appointment)}
                            className="btn reschedule-btn btn-primary-gradient rounded-pill"
                        >
                            {t('appointments.detailCard.rescheduleAppointment')}
                        </Link>
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
                            <div
                                className="patient-info"
                                style={{
                                    maxWidth: '280px',
                                    flex: '0 0 280px',
                                }}
                            >
                                <p>{getDisplayLabel(appointment)}</p>
                                <h6
                                    style={{
                                        whiteSpace: 'normal',
                                        wordBreak: 'break-word',
                                        overflowWrap: 'break-word',
                                        lineHeight: 1.4,
                                    }}
                                >
                                    <Link
                                        to="#"
                                        style={{
                                            whiteSpace: 'normal',
                                            wordBreak: 'break-word',
                                            display: 'inline',
                                        }}
                                    >
                                        {getDisplayName(appointment)}
                                    </Link>
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
                                <p>{t('appointments.detailCard.personWithPatient')}</p>
                                <ul className="d-flex apponitment-types">
                                    <li>{appointment.personWithPatient}</li>
                                </ul>
                            </div>
                        )}
                        <div className="person-info">
                            <p>{t('appointments.detailCard.appointmentType')}</p>
                            <ul className="d-flex apponitment-types">
                                <li>
                                    {renderAppointmentTypeIcon()}
                                    {getAppointmentTypeText(appointment.appointmentType, t)}
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
                                    {t('appointments.detailCard.reason')}
                                </Link>
                            )}
                        </div>
                        {/* Hiển thị phí tư vấn cho tất cả trạng thái */}
                        <div className="consult-fees">
                            <h6>
                                {t('appointments.detailCard.consultationFee')}:{' '}
                                {getDisplayFeeText(appointment)}
                            </h6>
                        </div>
                        <ul>
                            <li>
                                <Link to="#">
                                    <i className="isax isax-messages-25"></i>
                                </Link>
                            </li>
                            {/* Option 1: Reschedule with same doctor */}
                            {!isServiceAppointment(appointment) &&
                                (appointment.status === AppointmentStatus.PENDING ||
                                    appointment.status === AppointmentStatus.CONFIRMED) && (
                                    <li>
                                        <Link
                                            to="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                onReschedule?.(appointment, 'SAME_DOCTOR');
                                            }}
                                            title={t(
                                                'appointments.detailCard.rescheduleWithSameDoctor'
                                            )}
                                        >
                                            <i className="isax isax-calendar-edit"></i>
                                        </Link>
                                    </li>
                                )}
                            {/* Option 3: Choose new doctor */}
                            {!isServiceAppointment(appointment) &&
                                (appointment.status === AppointmentStatus.PENDING ||
                                    appointment.status === AppointmentStatus.CONFIRMED) && (
                                    <li>
                                        <Link
                                            to="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                onReschedule?.(appointment, 'NEW_DOCTOR');
                                            }}
                                            title={t('appointments.detailCard.chooseNewDoctor')}
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
                                        title={t('appointments.detailCard.cancelAppointment')}
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
                        <h6>{t('appointments.detailCard.dateTime')}</h6>
                        <span>
                            {formatAppointmentDate(appointment.appointmentDate, i18n.language)}{' '}
                            {' | '}
                            {appointment.appointmentTime}
                        </span>
                    </li>
                    {config.showLocation && (
                        <li>
                            <h6>{t('appointments.detailCard.location')}</h6>
                            <span>{appointment.location}</span>
                        </li>
                    )}
                    {appointment.visitType && (
                        <li>
                            <h6>{t('appointments.detailCard.visitType')}</h6>
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
