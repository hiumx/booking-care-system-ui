import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AppointmentUITab } from '@/types/appointment.types';
import doctorThumb01 from '@/assets/img/doctors/doctor-thumb-01.jpg';

interface PatientInfoDisplayProps {
    appointmentId: string;
    status: AppointmentUITab;
    displayAvatar: string | null;
    displayName: string;
    displayLabel: string;
    isNew?: boolean;
    displaySpecialty?: string;
    showSpecialty?: boolean;
    useFallbackImage?: boolean;
}

/**
 * Shared component for displaying patient/doctor info in appointment cards
 * Used by both AppointmentCard and AppointmentGridCard to reduce code duplication
 */
const PatientInfoDisplay: React.FC<PatientInfoDisplayProps> = ({
    appointmentId,
    status,
    displayAvatar,
    displayName,
    displayLabel,
    isNew = false,
    displaySpecialty,
    showSpecialty = false,
    useFallbackImage = false,
}) => {
    const { t } = useTranslation('userProfile');

    const detailUrl = `/user/profile?tab=appointment-detail&id=${encodeURIComponent(appointmentId)}&status=${status}`;

    const renderAvatar = () => {
        if (displayAvatar) {
            return useFallbackImage ? (
                <img
                    src={displayAvatar}
                    alt={displayName}
                    onError={(e) => {
                        e.currentTarget.src = doctorThumb01;
                    }}
                />
            ) : (
                <img src={displayAvatar} alt={displayName} />
            );
        }

        return (
            <div className="avatar-placeholder">
                <i className="isax isax-user"></i>
            </div>
        );
    };

    return (
        <div className="patinet-information">
            <Link to={detailUrl}>{renderAvatar()}</Link>
            <div className="patient-info">
                <p>{displayLabel}</p>
                <h6>
                    <Link to={detailUrl}>{displayName}</Link>
                    {isNew && <span className="badge new-tag">{t('appointments.card.new')}</span>}
                </h6>
                {showSpecialty && displaySpecialty && <p className="visit">{displaySpecialty}</p>}
            </div>
        </div>
    );
};

export default PatientInfoDisplay;
