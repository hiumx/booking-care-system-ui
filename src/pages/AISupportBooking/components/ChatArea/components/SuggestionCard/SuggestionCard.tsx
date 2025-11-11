import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Star, Building2, Stethoscope, HelpCircle } from 'lucide-react';
import { Suggestion } from '@/types/ai.types';
import { PATHS, replacePathParams } from '@/routes/paths';
import clsx from 'clsx';
import styles from './SuggestionCard.module.scss';

interface SuggestionCardProps {
    suggestion: Suggestion;
    onBookAppointment: () => void;
    onSupportBooking?: () => void;
}

const SuggestionCard: React.FC<SuggestionCardProps> = ({
    suggestion,
    onBookAppointment,
    onSupportBooking,
}) => {
    const navigate = useNavigate();
    const [doctorAvatarError, setDoctorAvatarError] = useState(false);
    const [hospitalImageError, setHospitalImageError] = useState(false);

    const handleDoctorNameClick = (doctorId: string) => {
        const doctorProfilePath = replacePathParams(
            `${PATHS.DOCTOR.ROOT}/${PATHS.DOCTOR.PROFILE}`,
            { id: doctorId }
        );
        navigate(doctorProfilePath);
    };

    const handleHospitalNameClick = (hospitalId: string) => {
        const hospitalProfilePath = replacePathParams(
            `${PATHS.HOSPITAL.ROOT}/${PATHS.HOSPITAL.DETAIL}`,
            { id: hospitalId }
        );
        navigate(hospitalProfilePath);
    };

    if (suggestion.type === 'doctor' && suggestion.doctor) {
        const doctor = suggestion.doctor;
        const getInitials = () => {
            const names = doctor.name.trim().split(' ');
            if (names.length >= 2) {
                return (names[0][0] + names[names.length - 1][0]).toUpperCase();
            }
            return names[0]?.[0]?.toUpperCase() || 'D';
        };

        return (
            <div className={styles.suggestionCard}>
                <div className={styles.cardHeader}>
                    <div className={styles.doctorIcon}>
                        {doctor.avatarUrl && !doctorAvatarError ? (
                            <img
                                src={doctor.avatarUrl}
                                alt={doctor.name}
                                onError={() => setDoctorAvatarError(true)}
                                className={styles.avatarImage}
                            />
                        ) : (
                            <div className={styles.avatarFallback}>{getInitials()}</div>
                        )}
                    </div>
                    <div className={styles.cardInfo}>
                        <h4
                            className={clsx(styles.cardTitle, styles.clickableTitle)}
                            onClick={() => handleDoctorNameClick(doctor.id)}
                            data-tooltip="Xem thông tin bác sĩ"
                        >
                            {doctor.name}
                        </h4>
                        <p className={styles.cardSubtitle}>Chuyên khoa: {doctor.specialtyName}</p>
                    </div>
                </div>
                <div className={styles.cardBody}>
                    <div className={styles.cardDetail}>
                        <Building2 size={16} />
                        <span>{doctor.hospitalName}</span>
                    </div>
                    {doctor.serviceTypeName && (
                        <div className={styles.cardDetail}>
                            <span className={styles.label}>Loại dịch vụ:</span>
                            <span className={styles.value}>{doctor.serviceTypeName}</span>
                        </div>
                    )}
                    {doctor.price && (
                        <div className={styles.cardDetail}>
                            <span className={styles.label}>Giá:</span>
                            <span className={styles.priceValue}>{doctor.price}</span>
                        </div>
                    )}
                    <div className={styles.cardDetails}>
                        <div className={styles.cardDetail}>
                            <Star size={16} className={styles.starIcon} />
                            <span>{doctor.rating}/5.0</span>
                        </div>
                        <div className={styles.cardDetail}>
                            <span>Kinh nghiệm: {doctor.yearOfExperience} năm</span>
                        </div>
                    </div>
                </div>
                <div className={styles.cardFooter}>
                    <div className={styles.buttonGroup}>
                        <button
                            className={clsx('btn', 'btn-outline-primary', styles.bookButton)}
                            onClick={onBookAppointment}
                        >
                            <Stethoscope size={16} />
                            <span>Đặt lịch khám bệnh</span>
                        </button>
                        {onSupportBooking && (
                            <button
                                className={clsx('btn', 'btn-primary', styles.supportButton)}
                                onClick={onSupportBooking}
                            >
                                <HelpCircle size={16} />
                                <span>Hỗ trợ đặt lịch</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Hospital type
    if (suggestion.type === 'hospital' && suggestion.hospital) {
        const hospital = suggestion.hospital;
        const specialties = hospital.specialtyName || [];
        const displaySpecialties = specialties.slice(0, 3);
        const remainingCount = specialties.length - 3;

        const getInitials = () => {
            const words = hospital.name.trim().split(' ');
            if (words.length >= 2) {
                return (words[0][0] + words[words.length - 1][0]).toUpperCase();
            }
            return words[0]?.[0]?.toUpperCase() || 'H';
        };

        return (
            <div className={styles.suggestionCard}>
                <div className={styles.cardHeader}>
                    <div className={styles.hospitalIcon}>
                        {hospital.imageUrl && !hospitalImageError ? (
                            <img
                                src={hospital.imageUrl}
                                alt={hospital.name}
                                onError={() => setHospitalImageError(true)}
                                className={styles.avatarImage}
                            />
                        ) : (
                            <div className={styles.avatarFallback}>{getInitials()}</div>
                        )}
                    </div>
                    <div className={styles.cardInfo}>
                        <h4
                            className={clsx(styles.cardTitle, styles.clickableTitle)}
                            onClick={() => handleHospitalNameClick(hospital.id)}
                            data-tooltip="Xem thông tin bệnh viện"
                        >
                            {hospital.name}
                        </h4>
                    </div>
                </div>
                <div className={styles.cardBody}>
                    <div className={styles.cardDetail}>
                        <MapPin size={16} />
                        <span>{hospital.address}</span>
                    </div>
                    {specialties.length > 0 && (
                        <div className={styles.specialties}>
                            <p className={styles.specialtiesLabel}>Chuyên khoa:</p>
                            <div className={styles.specialtyTags}>
                                {displaySpecialties.map((specialty: string, index: number) => (
                                    <span
                                        key={`specialty-${specialty}-${index}`}
                                        className={styles.specialtyTag}
                                    >
                                        {specialty}
                                    </span>
                                ))}
                                {remainingCount > 0 && (
                                    <span className={styles.specialtyTag}>
                                        +{remainingCount} chuyên khoa
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                </div>
                <div className={styles.cardFooter}>
                    <div className={styles.buttonGroup}>
                        <button
                            className={clsx('btn', 'btn-outline-primary', styles.bookButton)}
                            onClick={onBookAppointment}
                        >
                            <Stethoscope size={16} />
                            <span>Đặt lịch khám bệnh</span>
                        </button>
                        {onSupportBooking && (
                            <button
                                className={clsx('btn', 'btn-primary', styles.supportButton)}
                                onClick={onSupportBooking}
                            >
                                <HelpCircle size={16} />
                                <span>Hỗ trợ đặt lịch</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return null;
};

export default SuggestionCard;
