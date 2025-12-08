import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Star, Building2, HelpCircle } from 'lucide-react';
import { Suggestion } from '@/types/ai.types';
import { PATHS, replacePathParams } from '@/routes/paths';
import clsx from 'clsx';
import styles from './SuggestionCard.module.scss';
import { AppointmentType } from '@/enums/appointment.enums';

interface SuggestionCardProps {
    suggestion: Suggestion;
    onSupportBooking?: (options?: { appointmentType?: AppointmentType }) => void;
    selectedServiceType?: string;
}

interface CardFooterProps {
    onSupportBooking?: (options?: { appointmentType?: AppointmentType }) => void;
    appointmentType?: AppointmentType;
}

const CardFooter: React.FC<CardFooterProps> = ({ onSupportBooking, appointmentType }) => {
    if (!onSupportBooking) return null;

    return (
        <div className={styles.cardFooter}>
            <div className={styles.buttonGroup}>
                {onSupportBooking && (
                    <button
                        className={clsx('btn', 'btn-primary', styles.supportButton)}
                        onClick={() =>
                            onSupportBooking(appointmentType ? { appointmentType } : undefined)
                        }
                    >
                        <HelpCircle size={16} />
                        <span>Hỗ trợ đặt lịch</span>
                    </button>
                )}
            </div>
        </div>
    );
};

const SuggestionCard: React.FC<SuggestionCardProps> = ({
    suggestion,
    onSupportBooking,
    selectedServiceType,
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
        const serviceOptions = doctor.serviceOptions || [];
        const selectedOption =
            (selectedServiceType &&
                serviceOptions.find(
                    (o) =>
                        o.serviceTypeName?.toLowerCase() === selectedServiceType.toLowerCase() ||
                        o.serviceTypeName?.toLowerCase().includes(selectedServiceType.toLowerCase())
                )) ||
            serviceOptions[0];
        const displayServiceName = selectedOption?.serviceTypeName || doctor.serviceTypeName;
        const displayPrice = selectedOption?.price || doctor.price;
        const appointmentType =
            (displayServiceName || '').toLowerCase().includes('telehealth') ||
            (displayServiceName || '').toLowerCase().includes('tư vấn trực tuyến')
                ? AppointmentType.TELEHEALTH
                : AppointmentType.IN_PERSON;
        const getInitials = () => {
            const name = doctor.name || '';
            const names = name.trim().split(' ');
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
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    handleDoctorNameClick(doctor.id);
                                }
                            }}
                            role="button"
                            tabIndex={0}
                            data-tooltip="Xem thông tin bác sĩ"
                            aria-label={`Xem thông tin bác sĩ ${doctor.name}`}
                        >
                            {doctor.name || 'Bác sĩ'}
                        </h4>
                        <p className={styles.cardSubtitle}>
                            Chuyên khoa: {doctor.specialtyName || 'Chưa xác định'}
                        </p>
                    </div>
                </div>
                <div className={styles.cardBody}>
                    <div className={styles.cardDetail}>
                        <Building2 size={16} />
                        <span>{doctor.hospitalName || 'Chưa có thông tin'}</span>
                    </div>
                    {displayServiceName && (
                        <div className={styles.cardDetail}>
                            <span className={styles.label}>Loại dịch vụ:</span>
                            <span className={styles.value}>{displayServiceName}</span>
                        </div>
                    )}
                    {displayPrice && (
                        <div className={styles.cardDetail}>
                            <span className={styles.label}>Giá:</span>
                            <span className={styles.priceValue}>{displayPrice}</span>
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
                <CardFooter onSupportBooking={onSupportBooking} appointmentType={appointmentType} />
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
            const name = hospital.name || '';
            const words = name.trim().split(' ');
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
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    handleHospitalNameClick(hospital.id);
                                }
                            }}
                            role="button"
                            tabIndex={0}
                            data-tooltip="Xem thông tin bệnh viện"
                            aria-label={`Xem thông tin bệnh viện ${hospital.name || ''}`}
                        >
                            {hospital.name || 'Bệnh viện'}
                        </h4>
                    </div>
                </div>
                <div className={styles.cardBody}>
                    <div className={styles.cardDetail}>
                        <MapPin size={16} />
                        <span>{hospital.address || 'Chưa có địa chỉ'}</span>
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
                <CardFooter onSupportBooking={onSupportBooking} />
            </div>
        );
    }

    return null;
};

export default SuggestionCard;
