import { FC } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { Briefcase } from 'lucide-react';
import { useSelector } from 'react-redux';
import { PATHS } from '@/routes/paths';
import { useFavoriteDoctor } from '@/hooks/useFavoriteDoctor';
import { RootState } from '@/store';
import styles from './DoctorCard.module.scss';

export type DoctorCardProps = {
    image: string;
    name: string;
    specialty: string;
    hospitalName: string; // Đổi từ location thành hospitalName
    hospitalId?: string; // Thêm hospitalId để tạo link
    rating: number;
    available?: boolean;
    experience: string;
    positionName?: string; // Thêm position name
    serviceTypeName?: string; // Thêm service type name
    amount?: number; // Thêm amount thay cho fee
    profileLink?: string;
    bookingLink?: string;
    specialtiesLink?: string;
    className?: string;
    doctorId?: string; // Add doctorId for favorite functionality
    initialIsFavorited?: boolean; // Initial favorite status (optional)
};

const DoctorCard: FC<DoctorCardProps> = ({
    image,
    name,
    specialty,
    hospitalName, // Đổi từ location thành hospitalName
    hospitalId, // Thêm hospitalId
    rating,
    available = true,
    experience,
    positionName,
    serviceTypeName,
    amount,
    profileLink = '#',
    bookingLink = '#',
    specialtiesLink = '#',
    className,
    doctorId,
    initialIsFavorited,
}) => {
    // Tạo link cho hospital
    const hospitalLink = hospitalId ? `${PATHS.HOSPITAL.ROOT}/${hospitalId}` : '#';

    // Get patient ID from Redux store
    const userProfile = useSelector((state: RootState) => state.user.profile);
    const patientId = userProfile?.id;

    // Use favorite doctor hook
    const { isFavorited, isLoading, toggleFavorite } = useFavoriteDoctor(
        patientId,
        doctorId,
        initialIsFavorited
    );

    return (
        <div className={clsx(styles.doctorCardContainer, 'card', className)}>
            <div className="card-img card-img-hover">
                <Link to={profileLink}>
                    <img src={image} alt={name} className={styles.doctorImage} />
                </Link>
                <div className="grid-overlay-item d-flex align-items-center justify-content-between">
                    <span className="badge bg-orange">
                        <i className="fa-solid fa-star me-1"></i> {rating.toFixed(1)}
                    </span>
                    <div className={styles.favWrapper}>
                        <button
                            className={`${styles.favIcon} ${isFavorited ? styles.active : ''}`}
                            onClick={toggleFavorite}
                            disabled={isLoading}
                        >
                            <i
                                className={`fa${isFavorited ? ' fa-heart' : ' fa-regular fa-heart'}`}
                            ></i>
                        </button>
                    </div>
                </div>
            </div>

            <div className="card-body p-0">
                <div className="d-flex active-bar align-items-center justify-content-between p-3">
                    <Link to={specialtiesLink} className="text-indigo fw-medium fs-14">
                        {specialty}
                    </Link>
                    <span className="badge bg-success-light d-inline-flex align-items-center">
                        <div className={styles.dotIconWrapper}>
                            <i className="fa-solid fa-circle me-1"></i>
                        </div>
                        {available ? 'Sẵn sàng' : 'Không sẵn sàng'}
                    </span>
                </div>

                <div className="p-2 pt-0">
                    <div className="doctor-info-detail mb-2">
                        <div className={styles.doctorName}>
                            <h4 className="mb-1">
                                <Link to={profileLink}>{name}</Link>
                            </h4>
                            {positionName && (
                                <p className="text-muted fs-14 mb-1">{positionName}</p>
                            )}
                        </div>
                        <div className={styles.hospitalInfo}>
                            <p className="d-flex align-items-center mb-2 fs-14">
                                <i className="isax isax-location me-2"></i>
                                {hospitalId && hospitalLink !== '#' ? (
                                    <Link to={hospitalLink} className={styles.hospitalLink}>
                                        {hospitalName}
                                    </Link>
                                ) : (
                                    <span className={styles.hospitalText}>{hospitalName}</span>
                                )}
                            </p>
                        </div>
                        <div className={styles.experienceInfo}>
                            <p className="d-flex align-items-center mb-0 fs-14">
                                <Briefcase className={styles.experienceIcon} size={16} />
                                <span className="ms-2">{experience}</span>
                            </p>
                        </div>
                    </div>

                    <div className="d-flex align-items-center justify-content-between mt-2">
                        {amount && (
                            <div>
                                <p className="mb-1 fs-14 text-muted">
                                    {serviceTypeName || 'Phí tư vấn'}
                                </p>
                                <h5 className="text-orange mb-0">
                                    {amount.toLocaleString('vi-VN')} VNĐ
                                </h5>
                            </div>
                        )}
                        <Link
                            to={bookingLink}
                            className="btn btn-sm btn-dark d-inline-flex align-items-center rounded-pill"
                        >
                            <i className="isax isax-calendar-1 me-2"></i>
                            {'Đặt ngay'}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorCard;
