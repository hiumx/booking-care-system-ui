import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import AvailabilityInfo from '@/components/AvailabilityInfo';
import { ProfileType, ProfileData, Hospital, Specialty, Position } from '@/types/profile.types';

// Import images
import experienceLogo1 from '@/assets/img/icons/experience-logo-01.svg';

interface ProfileDetailsProps {
    type: ProfileType;
    profile: ProfileData;
    hospital: Hospital;
    specialty: Specialty;
    specialties?: Specialty[]; // Optional list for service type
    position?: Position;
}

const ProfileDetails: React.FC<ProfileDetailsProps> = ({
    type,
    profile,
    hospital,
    specialty,
    specialties,
    position,
}) => {
    const bioRef = useRef<HTMLDivElement>(null);
    const expRef = useRef<HTMLDivElement>(null);
    const specialityRef = useRef<HTMLDivElement>(null);
    const hospitalRef = useRef<HTMLDivElement>(null);
    const hoursRef = useRef<HTMLDivElement>(null);
    const reviewRef = useRef<HTMLDivElement>(null);

    const scrollToSection = (el: HTMLDivElement | null) => {
        el?.scrollIntoView({ behavior: 'smooth' });
    };

    const [expanded, setExpanded] = useState(false);

    const limit = 300;
    const isLongText = profile.bio.length > limit;
    const displayText = expanded || !isLongText ? profile.bio : profile.bio.slice(0, limit) + '...';

    // Get tab labels based on type
    const getTabLabels = () => {
        if (type === 'doctor') {
            return {
                bio: 'Tiểu sử',
                exp: 'Kinh nghiệm',
                speciality: 'Chuyên khoa',
                hospital: 'Phòng khám',
                hours: 'Lịch làm việc',
                review: 'Đánh giá',
            };
        } else {
            return {
                bio: 'Mô tả dịch vụ',
                exp: 'Kinh nghiệm',
                speciality: 'Chuyên khoa',
                hospital: 'Phòng khám',
                hours: 'Lịch làm việc',
                review: 'Đánh giá',
            };
        }
    };

    const tabLabels = getTabLabels();

    return (
        <div className="doctors-detailed-info">
            <ul className="information-title-list">
                <li className="active">
                    <Link
                        to="#"
                        onClick={(e) => {
                            e.preventDefault();
                            scrollToSection(bioRef.current);
                        }}
                    >
                        {tabLabels.bio}
                    </Link>
                </li>
                <li>
                    <Link
                        to="#"
                        onClick={(e) => {
                            e.preventDefault();
                            scrollToSection(expRef.current);
                        }}
                    >
                        {tabLabels.exp}
                    </Link>
                </li>
                <li>
                    <Link
                        to="#"
                        onClick={(e) => {
                            e.preventDefault();
                            scrollToSection(specialityRef.current);
                        }}
                    >
                        {tabLabels.speciality}
                    </Link>
                </li>
                <li>
                    <Link
                        to="#"
                        onClick={(e) => {
                            e.preventDefault();
                            scrollToSection(hospitalRef.current);
                        }}
                    >
                        {tabLabels.hospital}
                    </Link>
                </li>
                <li>
                    <Link
                        to="#"
                        onClick={(e) => {
                            e.preventDefault();
                            scrollToSection(hoursRef.current);
                        }}
                    >
                        {tabLabels.hours}
                    </Link>
                </li>
                <li>
                    <Link
                        to="#"
                        onClick={(e) => {
                            e.preventDefault();
                            scrollToSection(reviewRef.current);
                        }}
                    >
                        {tabLabels.review}
                    </Link>
                </li>
            </ul>
            <div>
                <div ref={bioRef}>
                    <div className="doc-information-details bio-detail" id="doc_bio">
                        <div className="detail-title">
                            <h4>{tabLabels.bio}</h4>
                        </div>
                        <p>{displayText}</p>
                        {isLongText && (
                            <Link
                                to="#"
                                className="show-more d-flex align-items-center"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setExpanded((prev) => !prev);
                                }}
                            >
                                {expanded ? 'Thu gọn' : 'Xem thêm'}
                                <i
                                    className={clsx('fa-solid', 'ms-2', {
                                        'fa-chevron-up': expanded,
                                        'fa-chevron-down': !expanded,
                                    })}
                                ></i>
                            </Link>
                        )}
                    </div>
                </div>
                <div ref={expRef}>
                    <div className="doc-information-details" id="experience">
                        <div className="detail-title">
                            <h4>{tabLabels.exp}</h4>
                        </div>
                        <div className="experience-info">
                            <div className="experience-logo">
                                <span>
                                    <img src={experienceLogo1} alt="Experience Logo" />
                                </span>
                            </div>
                            <div className="experience-content">
                                <h5>{hospital.name}</h5>
                                {position && (
                                    <p>
                                        <strong>Trình độ:</strong> {position.name}
                                    </p>
                                )}
                                <p>
                                    <strong>Kinh nghiệm:</strong> {profile.years_of_experience} năm
                                    kinh nghiệm
                                </p>
                                <p>
                                    <strong>Mô tả:</strong> {profile.bio.substring(0, 100)}...
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div ref={specialityRef}>
                    <div className="doc-information-details" id="speciality">
                        <div className="detail-title">
                            <h4>{tabLabels.speciality}</h4>
                        </div>
                        <ul className="special-links">
                            {type === 'doctor' ? (
                                <li>
                                    <Link to="#">{specialty.name}</Link>
                                </li>
                            ) : (
                                specialties?.map((spec) => (
                                    <li key={spec.id}>
                                        <Link to="#">{spec.name}</Link>
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                </div>
                <div ref={hospitalRef}>
                    <div className="doc-information-details" id="clinic">
                        <div className="detail-title">
                            <h4>Bệnh Viện & Vị Trí</h4>
                        </div>
                        <div className="clinic-loc">
                            <div className="row align-items-center">
                                <div className="col-lg-7">
                                    <div className="clinic-info">
                                        <div className="clinic-img">
                                            <img
                                                src={hospital.background_url}
                                                alt={hospital.name}
                                            />
                                        </div>
                                        <div className="detail-clinic">
                                            <h5>{hospital.name}</h5>
                                            <Link to="/phong-kham/da-nang" className="clinic-link">
                                                Xem thông tin phòng khám
                                            </Link>
                                            <p>{hospital.address}</p>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center avail-time-slot">
                                        {[
                                            {
                                                day: 'Monday',
                                                time: '07:00 AM - 09:00 PM',
                                            },
                                            {
                                                day: 'Tuesday',
                                                time: '07:00 AM - 09:00 PM',
                                            },
                                        ].map((slot) => (
                                            <div
                                                className="availability-date"
                                                key={`${slot.day}-${slot.time}`}
                                            >
                                                <div className="book-date">
                                                    <h6>{slot.day}</h6>
                                                    <span>{slot.time}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="col-lg-5">
                                    <div className="contact-map d-flex">
                                        <iframe
                                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3193.7301009561315!2d-76.13077892422932!3d36.82498697224007!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89bae976cfe9f8af%3A0xa61eac05156fbdb9!2sBeachStreet%20USA!5e0!3m2!1sen!2sin!4v1669777904208!5m2!1sen!2sin"
                                            allowFullScreen
                                            loading="lazy"
                                            referrerPolicy="no-referrer-when-downgrade"
                                            title={`Map for ${hospital.name}`}
                                        ></iframe>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div ref={hoursRef}>
                    <div className="doc-information-details" id="bussiness_hour">
                        <div className="detail-title">
                            <h4>{tabLabels.hours}</h4>
                        </div>
                        <AvailabilityInfo
                            entityId={profile.id.toString()}
                            title="Chọn Khung Giờ Có Sẵn"
                        />
                    </div>
                </div>
                <div ref={reviewRef}>
                    {/* Reviews section will be handled by ReviewsSection component */}
                </div>
            </div>
        </div>
    );
};

export default ProfileDetails;
