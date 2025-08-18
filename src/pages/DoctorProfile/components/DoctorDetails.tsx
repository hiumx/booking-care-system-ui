import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import styles from '../DoctorProfile.module.scss';
import Pagination from '@/components/Pagination';
import experienceLogo1 from '@/assets/img/icons/experience-logo-01.svg';
import clinicImg1 from '@/assets/img/clinic/clinic-11.jpg';
import client13 from '@/assets/img/clients/client-13.jpg';
import client14 from '@/assets/img/clients/client-14.jpg';
import client15 from '@/assets/img/clients/client-15.jpg';
import client16 from '@/assets/img/clients/client-16.jpg';

const DoctorDetails = () => {
    const bioRef = useRef<HTMLDivElement>(null);
    const expRef = useRef<HTMLDivElement>(null);
    const specialityRef = useRef<HTMLDivElement>(null);
    const clinicRef = useRef<HTMLDivElement>(null);
    const hoursRef = useRef<HTMLDivElement>(null);
    const reviewRef = useRef<HTMLDivElement>(null);

    const scrollToSection = (el: HTMLDivElement | null) => {
        el?.scrollIntoView({ behavior: 'smooth' });
    };

    const businessHours = [
        { day: 'Today', date: '5 Feb 2024', time: '07:00 AM - 09:00 PM', available: true },
        { day: 'Monday', time: '07:00 AM - 09:00 PM' },
        { day: 'Tuesday', time: '07:00 AM - 09:00 PM' },
        { day: 'Wednesday', time: '07:00 AM - 09:00 PM' },
        { day: 'Thursday', time: '07:00 AM - 09:00 PM' },
        { day: 'Friday', time: '07:00 AM - 09:00 PM' },
        { day: 'Saturday', time: '07:00 AM - 09:00 PM' },
        { day: 'Sunday', time: '07:00 AM - 09:00 PM' },
    ];

    const reviews = [
        {
            id: 1,
            name: 'kadajsalamander',
            avatar: client13,
            rating: 5,
            timeAgo: '2 days ago',
            text: "Thank you for this informative article! I've had a couple of hit-and-miss experiences with freelancers in the past, and I realize now that I wasn't vetting them properly. Your checklist for choosing the right freelancer is going to be my go-to from now on.",
            recommend: true,
        },
        {
            id: 2,
            name: 'Dane jose',
            avatar: client14,
            rating: 5,
            timeAgo: '1 Months ago',
            text: "As a freelancer myself, I find this article spot on! It's important for clients to understand what to look for in a freelancer and how to foster a good working relationship. The point about mutual respect and clear communication is key in my experience. Well done.",
            recommend: true,
        },
        {
            id: 3,
            name: 'Dane jose',
            avatar: client15,
            rating: 5,
            timeAgo: '15 days ago',
            text: "Great article! I've bookmarked it for future reference. I'd love to read more about managing long-term relationships with freelancers, if you have any tips on that.",
            recommend: true,
            replies: [
                {
                    id: 1,
                    name: 'Robert Hollenbeck',
                    avatar: client16,
                    text: 'Thank you for your comment and I will try to make another post on that topic.',
                },
            ],
        },
    ];

    const biographyText =
        'Bác sĩ giàu kinh nghiệm và đầy nhiệt huyết, luôn tận tâm chăm sóc bệnh nhân. Có kinh nghiệm trong nhiều môi trường y tế, đặc biệt am hiểu về chẩn đoán, chăm sóc ban đầu và y học cấp cứu. Thành thạo trong việc sử dụng công nghệ mới nhất để tối ưu hóa quá trình điều trị. Luôn cam kết mang đến sự quan tâm, chăm sóc cá nhân hóa và đầy nhân ái cho từng bệnh nhân...';
    const [expanded, setExpanded] = useState(false);
    const limit = 300;
    const isLongText = biographyText.length > limit;
    const displayText =
        expanded || !isLongText ? biographyText : biographyText.slice(0, limit) + '...';

    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 2;
    const totalPages = Math.ceil(reviews.length / pageSize);
    const displayedReviews = reviews.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
        <div className="doctors-detailed-info">
            {/* Navigation Tabs */}
            <ul className="information-title-list">
                <li className="active">
                    <Link
                        to="#"
                        className={styles.link}
                        onClick={(e) => {
                            e.preventDefault();
                            scrollToSection(bioRef.current);
                        }}
                    >
                        Tiểu sử
                    </Link>
                </li>
                <li>
                    <Link
                        to="#"
                        className={styles.link}
                        onClick={(e) => {
                            e.preventDefault();
                            scrollToSection(expRef.current);
                        }}
                    >
                        Kinh nghiệm
                    </Link>
                </li>
                <li>
                    <Link
                        to="#"
                        className={styles.link}
                        onClick={(e) => {
                            e.preventDefault();
                            scrollToSection(specialityRef.current);
                        }}
                    >
                        Chuyên khoa
                    </Link>
                </li>
                <li>
                    <Link
                        to="#"
                        className={styles.link}
                        onClick={(e) => {
                            e.preventDefault();
                            scrollToSection(clinicRef.current);
                        }}
                    >
                        Phòng khám
                    </Link>
                </li>
                <li>
                    <Link
                        to="#"
                        className={styles.link}
                        onClick={(e) => {
                            e.preventDefault();
                            scrollToSection(hoursRef.current);
                        }}
                    >
                        Lịch làm việc
                    </Link>
                </li>
                <li>
                    <Link
                        to="#"
                        className={styles.link}
                        onClick={(e) => {
                            e.preventDefault();
                            scrollToSection(reviewRef.current);
                        }}
                    >
                        Đánh giá
                    </Link>
                </li>
            </ul>

            <div className="doc-information-main">
                {/* Biography Section */}
                <div ref={bioRef}>
                    <div className="doc-information-details bio-detail" id="doc_bio">
                        <div className="detail-title">
                            <h4>Tiểu sử bác sĩ</h4>
                        </div>
                        <p>{displayText}</p>
                        {isLongText && (
                            <Link
                                to="#"
                                className={clsx(
                                    'show-more',
                                    'd-flex',
                                    'align-items-center',
                                    styles.link
                                )}
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

                {/* Experience Section */}
                <div ref={expRef}>
                    <div className="doc-information-details" id="experience">
                        <div className="detail-title">
                            <h4>Kinh nghiệm</h4>
                        </div>
                        <div className="experience-info">
                            <div className="experience-logo">
                                <span>
                                    <img src={experienceLogo1} alt="Experience Logo" />
                                </span>
                            </div>
                            <div className="experience-content">
                                <h5>Bệnh viện Đà Nẵng</h5>
                                <p>
                                    <strong>Chuyên khoa:</strong> Nha Khoa
                                </p>
                                <p>
                                    <strong>Trình độ:</strong> Tiến sĩ
                                </p>
                                <p>
                                    <strong>Kinh nghiệm:</strong> 21 năm kinh nghiệm
                                </p>
                                <p>
                                    <strong>Mô tả:</strong> Có kinh nghiệm trong nhiều môi trường y
                                    tế khác nhau, đặc biệt là chuyên môn về chẩn đoán, chăm sóc sức
                                    khỏe ban đầu và y học cấp cứu.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Speciality Section */}
                <div ref={specialityRef}>
                    <div className="doc-information-details" id="speciality">
                        <div className="detail-title">
                            <h4>Chuyên khoa</h4>
                        </div>
                        <ul className="special-links">
                            <li>
                                <Link to="#" className={styles.link}>
                                    Orthopedic Consultation
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* ClinicsInfo Section */}
                <div ref={clinicRef}>
                    <div className="doc-information-details" id="clinic">
                        <div className="detail-title">
                            <h4>Clinics & Locations</h4>
                        </div>
                        <div className="clinic-loc">
                            <div className="row align-items-center">
                                <div className="col-lg-7">
                                    <div className="clinic-info">
                                        <div className="clinic-img">
                                            <img src={clinicImg1} alt="Bệnh viện Đà Nẵng" />
                                        </div>
                                        <div className="detail-clinic">
                                            <h5>Bệnh viện Đà Nẵng</h5>
                                            <Link to="/phong-kham/da-nang" className="clinic-link">
                                                Xem thông tin phòng khám
                                            </Link>
                                            <p>Võ Chí Công, Đà Nẵng</p>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center avail-time-slot">
                                        {[
                                            { day: 'Monday', time: '07:00 AM - 09:00 PM' },
                                            { day: 'Tuesday', time: '07:00 AM - 09:00 PM' },
                                        ].map((slot, idx) => (
                                            <div className="availability-date" key={idx}>
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
                                            title="Map for Bệnh viện Đà Nẵng"
                                        ></iframe>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Business Hours Section */}
                <div ref={hoursRef}>
                    <div className="doc-information-details" id="bussiness_hour">
                        <div className="detail-title">
                            <h4>Lịch làm việc</h4>
                        </div>
                        <div className="hours-business">
                            <ul>
                                {businessHours.map((hour, index) => (
                                    <li key={index}>
                                        {hour.day === 'Today' ? (
                                            <>
                                                <div className="today-hours">
                                                    <h6>{hour.day}</h6>
                                                    {hour.date && <span>{hour.date}</span>}
                                                </div>
                                                <div className="availed">
                                                    {hour.available && (
                                                        <span className="badge doc-avail-badge">
                                                            <i className="fa-solid fa-circle"></i>{' '}
                                                            Available
                                                        </span>
                                                    )}
                                                    <p>{hour.time}</p>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <h6>{hour.day}</h6>
                                                <p>{hour.time}</p>
                                            </>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div ref={reviewRef}>
                    <div className="doc-information-details" id="review">
                        <div className="detail-title">
                            <h4>Đánh giá ({reviews.length})</h4>
                        </div>
                        {displayedReviews.map((review, index) => (
                            <div
                                key={review.id}
                                className={`doc-review-card ${index === displayedReviews.length - 1 ? 'mb-0' : ''}`}
                            >
                                <div className="user-info-review">
                                    <div className="reviewer-img">
                                        <Link
                                            to="#"
                                            className={`${styles.link} avatar-img`}
                                            onClick={(e) => e.preventDefault()}
                                        >
                                            <img src={review.avatar} alt={review.name} />
                                        </Link>
                                        <div className="review-star">
                                            <Link
                                                to="#"
                                                className={styles.link}
                                                onClick={(e) => e.preventDefault()}
                                            >
                                                {review.name}
                                            </Link>
                                            <div className="rating">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <i
                                                        key={i}
                                                        className={`fas fa-star ${i < (review.rating ?? 0) ? 'filled' : ''}`}
                                                    ></i>
                                                ))}
                                                <span>
                                                    {(review.rating ?? 0).toFixed(1)} |{' '}
                                                    {review.timeAgo}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    {review.recommend && (
                                        <span className="thumb-icon">
                                            <i className="fa-regular fa-thumbs-up"></i> Yes,
                                            Recommend for Appointment
                                        </span>
                                    )}
                                </div>
                                <p>{review.text}</p>
                                <Link
                                    to="#"
                                    className={`${styles.link} reply d-flex align-items-center`}
                                    onClick={(e) => e.preventDefault()}
                                >
                                    <i className="fa-solid fa-reply me-2"></i>Reply
                                </Link>
                                {review.replies &&
                                    review.replies.map((reply) => (
                                        <div key={reply.id} className="replied-info">
                                            <div className="user-info-review">
                                                <div className="reviewer-img">
                                                    <Link
                                                        to="#"
                                                        className={`${styles.link} avatar-img`}
                                                        onClick={(e) => e.preventDefault()}
                                                    >
                                                        <img src={reply.avatar} alt={reply.name} />
                                                    </Link>
                                                    <div className="review-star">
                                                        <Link
                                                            to="#"
                                                            className={styles.link}
                                                            onClick={(e) => e.preventDefault()}
                                                        >
                                                            {reply.name}
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                            <p>{reply.text}</p>
                                            <Link
                                                to="#"
                                                className={`${styles.link} reply d-flex align-items-center`}
                                                onClick={(e) => e.preventDefault()}
                                            >
                                                <i className="fa-solid fa-reply me-2"></i>Reply
                                            </Link>
                                        </div>
                                    ))}
                            </div>
                        ))}
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorDetails;
