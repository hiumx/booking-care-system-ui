import React from 'react';
import styles from './MedicalServices.module.scss';
import { Link } from 'react-router-dom';

const MedicalServices: React.FC = () => {
    const services = [
        {
            id: 1,
            name: 'Đặt khám Bác sĩ',
            image: 'https://cdn.youmed.vn/tin-tuc/wp-content/themes/herb/images/doctor.svg',
            description: 'Book Doctor Appointment',
            href: '#',
        },
        {
            id: 2,
            name: 'Đặt khám Phòng khám',
            image: 'https://cdn.youmed.vn/tin-tuc/wp-content/themes/herb/images/clinic_doctor.svg',
            description: 'Book Clinic Appointment',
            href: '#',
        },
        {
            id: 3,
            name: 'Đặt khám Bệnh viện',
            image: 'https://cdn.youmed.vn/tin-tuc/wp-content/themes/herb/images/hospital.svg',
            description: 'Book Hospital Appointment',
            href: '#',
        },
        {
            id: 4,
            name: 'Tư vấn trực tuyến',
            image: 'https://cdn.youmed.vn/tin-tuc/wp-content/themes/herb/images/smartphone.svg',
            description: 'Online Consultation',
            href: '#',
        },
        {
            id: 5,
            name: 'Thuốc và Dịch vụ y tế',
            image: 'https://cdn.youmed.vn/tin-tuc/wp-content/themes/herb/images/drugs.svg',
            description: 'Medicine and Medical Services',
            href: '#',
        },
    ];

    return (
        <div className={styles.youMedServices}>
            <div className={styles.logoSection}>
                <h2 className={styles.logo}>YouMed</h2>
                <p className={styles.description}>
                    Nền tảng đặt dịch vụ và sản phẩm y tế dành cho bạn và gia đình
                </p>
            </div>

            <div className={styles.servicesList}>
                {services.map((service) => (
                    <Link key={service.id} to={service.href} className={styles.serviceItem}>
                        <div className={styles.serviceIcon}>
                            <img src={service.image} alt={service.name} />
                        </div>
                        <div className={styles.serviceInfo}>
                            <h3 className={styles.serviceName}>{service.name}</h3>
                            <p className={styles.serviceDescription}>{service.description}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default MedicalServices;
