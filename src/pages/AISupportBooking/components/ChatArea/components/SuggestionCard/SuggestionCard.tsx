import React from 'react';
import { MapPin, Star, Award, Building2, Stethoscope } from 'lucide-react';
import { Suggestion } from '../../../../types';
import clsx from 'clsx';
import styles from './SuggestionCard.module.scss';

interface SuggestionCardProps {
    suggestion: Suggestion;
    onBookAppointment: () => void;
}

const SuggestionCard: React.FC<SuggestionCardProps> = ({ suggestion, onBookAppointment }) => {
    if (suggestion.type === 'doctor' && suggestion.doctor) {
        const doctor = suggestion.doctor;
        return (
            <div className={styles.suggestionCard}>
                <div className={styles.cardHeader}>
                    <div className={styles.doctorIcon}>
                        <Award size={24} />
                    </div>
                    <div className={styles.cardInfo}>
                        <h4 className={styles.cardTitle}>{doctor.name}</h4>
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
                    <button
                        className={clsx('btn', 'btn-outline-primary', styles.bookButton)}
                        onClick={onBookAppointment}
                    >
                        <Stethoscope size={16} />
                        <span>Đặt lịch khám bệnh</span>
                    </button>
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

        return (
            <div className={styles.suggestionCard}>
                <div className={styles.cardHeader}>
                    <div className={styles.hospitalIcon}>
                        <Building2 size={24} />
                    </div>
                    <div className={styles.cardInfo}>
                        <h4 className={styles.cardTitle}>{hospital.name}</h4>
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
                                {displaySpecialties.map((specialty, index) => (
                                    <span key={index} className={styles.specialtyTag}>
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
                    <button
                        className={clsx('btn', 'btn-outline-primary', styles.bookButton)}
                        onClick={onBookAppointment}
                    >
                        <Stethoscope size={16} />
                        <span>Đặt lịch khám bệnh</span>
                    </button>
                </div>
            </div>
        );
    }

    return null;
};

export default SuggestionCard;
