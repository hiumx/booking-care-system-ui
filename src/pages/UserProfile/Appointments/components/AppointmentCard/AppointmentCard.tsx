import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    AppointmentCardData,
    AppointmentUITab,
    getDisplayName,
    getDisplayAvatar,
    getDisplayEmail,
    getDisplayPhone,
    getDisplaySpecialty,
    getDisplayLabel,
    getRebookingUrl,
} from '@/types/appointment.types';
import AppointmentActionButtons from '../AppointmentActionButtons/AppointmentActionButtons';
import {
    formatAppointmentDate,
    getAppointmentTypeText,
} from '../../utils/appointment-format.utils';

interface AppointmentCardProps {
    appointment: AppointmentCardData;
    status: AppointmentUITab;
    variant?: 'full' | 'minimal';
    onCancel?: (appointment: AppointmentCardData) => void;
    onReschedule?: (appointment: AppointmentCardData, action: 'SAME_DOCTOR' | 'NEW_DOCTOR') => void;
    onReview?: (appointment: AppointmentCardData) => void;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
    appointment,
    status,
    variant = 'full',
    onCancel,
    onReschedule,
    onReview,
}) => {
    const { t, i18n } = useTranslation('userProfile');

    // Get display values using helper functions (priority: Doctor > Service > Hospital)
    const displayName = getDisplayName(appointment);
    const displayAvatar = getDisplayAvatar(appointment);
    const displayEmail = getDisplayEmail(appointment);
    const displayPhone = getDisplayPhone(appointment);
    const displaySpecialty = getDisplaySpecialty(appointment);
    const displayLabel = getDisplayLabel(appointment);

    const renderActionButtons = () => {
        // Use AppointmentActionButtons component for waiting and upcoming status
        if (status === 'waiting' || status === 'upcoming') {
            return (
                <AppointmentActionButtons
                    appointment={appointment}
                    status={status}
                    variant={variant}
                    onReschedule={onReschedule}
                    onCancel={onCancel}
                />
            );
        }

        // Handle other status cases
        switch (status) {
            case 'cancelled':
                return (
                    <li className="appointment-detail-btn">
                        <Link to={getRebookingUrl(appointment)}>
                            <i className="isax isax-calendar-tick5 me-1"></i>{' '}
                            {t('appointments.card.rebook')}
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
                                    {t('appointments.card.viewReview')}
                                </Link>
                            ) : (
                                <Link
                                    to="#"
                                    className="text-decoration-underline"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onReview?.(appointment);
                                    }}
                                    data-bs-toggle="modal"
                                    data-bs-target="#add_review"
                                >
                                    {t('appointments.card.addReview')}
                                </Link>
                            )}
                        </li>
                        <li className="appointment-detail-btn d-flex align-items-center gap-3 flex-wrap">
                            <Link to={getRebookingUrl(appointment)} className="btn btn-md btn-dark">
                                {t('appointments.card.rebook')}{' '}
                                <i className="isax isax-arrow-right-3 ms-1"></i>
                            </Link>
                            <Link
                                to={`/user/profile?tab=appointment-detail&id=${encodeURIComponent(appointment.appointmentId)}&status=${status}`}
                                title={t('appointments.card.viewDetail')}
                                className="btn btn-md btn-primary-gradient"
                            >
                                {t('appointments.card.viewDetail')}{' '}
                                <i className="isax isax-arrow-right-3 ms-1"></i>
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
                                {appointment.isNew && (
                                    <span className="badge new-tag">
                                        {t('appointments.card.new')}
                                    </span>
                                )}
                            </h6>
                        </div>
                    </div>
                </li>

                {/* Appointment Information */}
                <li className="appointment-info">
                    <p>
                        <i className="isax isax-clock5"></i>
                        {formatAppointmentDate(appointment.appointmentDate, i18n.language)}
                        {' | '}
                        {appointment.appointmentTime}
                    </p>
                    <ul className="d-flex apponitment-types">
                        <li>{displaySpecialty}</li>
                        <li>{getAppointmentTypeText(appointment.appointmentType, t)}</li>
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
