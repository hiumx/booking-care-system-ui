import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import styles from '../DoctorProfile.module.scss';
import experienceLogo1 from '@/assets/img/icons/experience-logo-01.svg';
import clinicImg1 from '@/assets/img/clinic/clinic-11.jpg';

const DoctorDetails = () => {
    const bioRef = useRef<HTMLDivElement>(null);
    const expRef = useRef<HTMLDivElement>(null);
    const specialityRef = useRef<HTMLDivElement>(null);
    const clinicRef = useRef<HTMLDivElement>(null);
    const hoursRef = useRef<HTMLDivElement>(null);

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

    const biographyText =
        'Bác sĩ giàu kinh nghiệm và đầy nhiệt huyết, luôn tận tâm chăm sóc bệnh nhân. Có kinh nghiệm trong nhiều môi trường y tế, đặc biệt am hiểu về chẩn đoán, chăm sóc ban đầu và y học cấp cứu. Thành thạo trong việc sử dụng công nghệ mới nhất để tối ưu hóa quá trình điều trị. Luôn cam kết mang đến sự quan tâm, chăm sóc cá nhân hóa và đầy nhân ái cho từng bệnh nhân...';
    const [expanded, setExpanded] = useState(false);
    const limit = 300;
    const isLongText = biographyText.length > limit;
    const displayText =
        expanded || !isLongText ? biographyText : biographyText.slice(0, limit) + '...';

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
            </div>
        </div>
    );
};

export default DoctorDetails;
