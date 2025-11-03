import React from 'react';
import { Link } from 'react-router-dom';
import {
    AppointmentCardData,
    AppointmentUITab,
    getAppointmentTypeText,
    getAppointmentTypeIcon,
    getDisplayName,
    getDisplayAvatar,
    getDisplaySpecialty,
    getDisplayLabel,
} from '@/types/appointment.types';
import AppointmentActionButtons from '../AppointmentActionButtons/AppointmentActionButtons';

interface AppointmentGridCardProps {
    appointment: AppointmentCardData;
    status: AppointmentUITab;
    onCancel?: (appointment: AppointmentCardData) => void; // Callback for cancel action
    onReschedule?: (appointment: AppointmentCardData, action: 'SAME_DOCTOR' | 'NEW_DOCTOR') => void; // Callback for reschedule actions
    onReview?: (appointment: AppointmentCardData) => void; // Callback for review action
}

const AppointmentGridCard: React.FC<AppointmentGridCardProps> = ({
    appointment,
    status,
    onCancel,
    onReschedule,
    onReview: _onReview, // Available for future use if grid view needs review functionality
}) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    const getAppointmentTypeIconColor = (type: string): string => {
        const iconClasses: Record<string, string> = {
            'Trực tuyến': 'video-icon',
            'Trực tiếp': 'hospital-icon',
        };
        return iconClasses[type] || 'video-icon';
    };

    // Get display values using helper functions (priority: Doctor > Service > Hospital)
    const displayName = getDisplayName(appointment);
    const displayAvatar = getDisplayAvatar(appointment);
    const displaySpecialty = getDisplaySpecialty(appointment);
    const displayLabel = getDisplayLabel(appointment);

    const renderActionButtons = () => {
        // Use AppointmentActionButtons component for waiting and upcoming status
        if (status === 'waiting' || status === 'upcoming') {
            return (
                <li className="appointment-action">
                    <AppointmentActionButtons
                        appointment={appointment}
                        status={status}
                        variant="full"
                        onReschedule={onReschedule}
                        onCancel={onCancel}
                    />
                </li>
            );
        }

        // Handle other status cases
        switch (status) {
            case 'cancelled':
            case 'completed':
                return (
                    <li className="appointment-detail-btn">
                        <Link
                            to={`/user/profile?tab=appointment-detail&id=${encodeURIComponent(appointment.appointmentId)}&status=${status}`}
                            className="start-link w-100"
                        >
                            Xem Chi Tiết
                        </Link>
                    </li>
                );
            default:
                return null;
        }
    };

    return (
        <div className="col-xl-4 col-lg-6 col-md-12 d-flex">
            <div className="appointment-wrap appointment-grid-wrap">
                <ul>
                    <li>
                        <div className="appointment-grid-head">
                            <div className="patinet-information">
                                <Link
                                    to={`/user/profile?tab=appointment-detail&id=${encodeURIComponent(appointment.appointmentId)}&status=${status}`}
                                >
                                    {displayAvatar ? (
                                        <img
                                            src={displayAvatar}
                                            alt={displayName}
                                            onError={(e) => {
                                                e.currentTarget.src =
                                                    '/src/assets/img/doctors/doctor-thumb-01.jpg';
                                            }}
                                        />
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
                                            <span className="badge new-tag">Mới</span>
                                        )}
                                    </h6>
                                    <p className="visit">{displaySpecialty}</p>
                                </div>
                            </div>
                            <div className="grid-user-msg">
                                <span
                                    className={getAppointmentTypeIconColor(
                                        getAppointmentTypeText(appointment.appointmentType)
                                    )}
                                >
                                    <Link to="#">
                                        <i
                                            className={getAppointmentTypeIcon(
                                                appointment.appointmentType
                                            )}
                                        ></i>
                                    </Link>
                                </span>
                            </div>
                        </div>
                    </li>
                    <li className="appointment-info">
                        <p>
                            <i className="isax isax-calendar5"></i>{' '}
                            {formatDate(appointment.appointmentDate)}
                        </p>
                        <p>
                            <i className="isax isax-clock5"></i> {appointment.appointmentTime}
                        </p>
                    </li>
                    {renderActionButtons()}
                </ul>
            </div>
        </div>
    );
};

export default AppointmentGridCard;
