import React from 'react';
import { Link } from 'react-router-dom';
import {
    AppointmentCardData,
    AppointmentUITab,
    getAppointmentTypeText,
    getAppointmentTypeIcon,
} from '@/types/appointment.types';

interface AppointmentGridCardProps {
    appointment: AppointmentCardData;
    status: AppointmentUITab;
}

const AppointmentGridCard: React.FC<AppointmentGridCardProps> = ({ appointment, status }) => {
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
            'Video Call': 'video-icon',
            'Audio Call': 'telephone-icon',
            Chat: 'chat-icon',
            'In Person': 'hospital-icon',
        };
        return iconClasses[type] || 'video-icon';
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
                                        to={`/user-profile/appointments/${appointment.appointmentId}`}
                                    >
                                        <i className="isax isax-eye4"></i>
                                    </Link>
                                </li>
                                <li>
                                    <a href="#">
                                        <i className="isax isax-messages-25"></i>
                                    </a>
                                </li>
                                <li>
                                    <a href="#">
                                        <i className="isax isax-close-circle5"></i>
                                    </a>
                                </li>
                            </ul>
                            <div className="appointment-detail-btn">
                                <a href="#" className="start-link">
                                    <i className="isax isax-calendar-tick5 me-1"></i>
                                    Attend
                                </a>
                            </div>
                        </li>
                    </>
                );
            case 'cancelled':
            case 'completed':
                return (
                    <li className="appointment-detail-btn">
                        <Link
                            to={`/user-profile/appointments/${appointment.appointmentId}`}
                            className="start-link w-100"
                        >
                            View Details
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
                                    to={`/user-profile/appointments/${appointment.appointmentId}`}
                                >
                                    <img
                                        src={appointment.doctor.avatar}
                                        alt={appointment.doctor.name}
                                        onError={(e) => {
                                            e.currentTarget.src =
                                                '/src/assets/img/doctors/doctor-thumb-01.jpg';
                                        }}
                                    />
                                </Link>
                                <div className="patient-info">
                                    <p>#{appointment.appointmentId.slice(0, 8)}</p>
                                    <h6>
                                        <Link
                                            to={`/user-profile/appointments/${appointment.appointmentId}`}
                                        >
                                            {appointment.doctor.name}
                                        </Link>
                                        {appointment.isNew && (
                                            <span className="badge new-tag">New</span>
                                        )}
                                    </h6>
                                    <p className="visit">{appointment.visitType}</p>
                                </div>
                            </div>
                            <div className="grid-user-msg">
                                <span
                                    className={getAppointmentTypeIconColor(
                                        getAppointmentTypeText(appointment.appointmentType)
                                    )}
                                >
                                    <a href="#">
                                        <i
                                            className={getAppointmentTypeIcon(
                                                appointment.appointmentType
                                            )}
                                        ></i>
                                    </a>
                                </span>
                            </div>
                        </div>
                    </li>
                    <li className="appointment-info">
                        <p>
                            <i className="isax isax-calendar5"></i>
                            {formatDate(appointment.appointmentDate)}
                        </p>
                        <p>
                            <i className="isax isax-clock5"></i>
                            8h-8h30
                        </p>
                    </li>
                    {renderActionButtons()}
                </ul>
            </div>
        </div>
    );
};

export default AppointmentGridCard;
