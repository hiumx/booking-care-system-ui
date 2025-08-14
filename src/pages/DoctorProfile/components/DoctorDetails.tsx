import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from '../DoctorProfile.module.scss';
import Biography from './Biography';
import Experience from './Experience';
import Speciality from './Speciality';
import ClinicsInfo from './ClinicsInfo';
import BusinessHours from './BusinessHours';
import Reviews from './Reviews';

import experienceLogo1 from '@/assets/img/icons/experience-logo-01.svg';
import clinicImg1 from '@/assets/img/clinic/clinic-11.jpg';

const DoctorDetails: React.FC = () => {
    const bioRef = useRef<HTMLDivElement>(null);
    const expRef = useRef<HTMLDivElement>(null);
    const specialityRef = useRef<HTMLDivElement>(null);
    const clinicRef = useRef<HTMLDivElement>(null);
    const hoursRef = useRef<HTMLDivElement>(null);
    const reviewRef = useRef<HTMLDivElement>(null);

    const scrollToSection = (el: HTMLDivElement | null) => {
        el?.scrollIntoView({ behavior: 'smooth' });
    };

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
                <div ref={bioRef}>
                    <Biography text="Bác sĩ giàu kinh nghiệm và đầy nhiệt huyết, luôn tận tâm chăm sóc bệnh nhân. Có kinh nghiệm trong nhiều môi trường y tế, đặc biệt am hiểu về chẩn đoán, chăm sóc ban đầu và y học cấp cứu. Thành thạo trong việc sử dụng công nghệ mới nhất để tối ưu hóa quá trình điều trị. Luôn cam kết mang đến sự quan tâm, chăm sóc cá nhân hóa và đầy nhân ái cho từng bệnh nhân..." />
                </div>

                <div ref={expRef}>
                    <Experience
                        logo={experienceLogo1}
                        hospitalName="Bệnh viện Đà Nẵng"
                        specialties="Nha Khoa"
                        positions="Tiến sĩ"
                        experiences="21 năm kinh nghiệm"
                        description="Có kinh nghiệm trong nhiều môi trường y tế khác nhau, đặc biệt là chuyên môn về chẩn đoán, chăm sóc sức khỏe ban đầu và y học cấp cứu."
                    />
                </div>

                <div ref={specialityRef}>
                    <Speciality name="Orthopedic Consultation" link="#" />
                </div>

                <div ref={clinicRef}>
                    <ClinicsInfo
                        image={clinicImg1}
                        name="Bệnh viện Đà Nẵng"
                        clinicLinkText="Xem thông tin phòng khám"
                        clinicUrl="/phong-kham/da-nang"
                        addressOrSpeciality="Võ Chí Công, Đà Nẵng"
                        availability={[
                            { day: 'Monday', time: '07:00 AM - 09:00 PM' },
                            { day: 'Tuesday', time: '07:00 AM - 09:00 PM' },
                        ]}
                        mapUrl="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3193.7301009561315!2d-76.13077892422932!3d36.82498697224007!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89bae976cfe9f8af%3A0xa61eac05156fbdb9!2sBeachStreet%20USA!5e0!3m2!1sen!2sin!4v1669777904208!5m2!1sen!2sin"
                    />
                </div>

                <div ref={hoursRef}>
                    <BusinessHours />
                </div>

                <div ref={reviewRef}>
                    <Reviews />
                </div>
            </div>
        </div>
    );
};

export default DoctorDetails;
