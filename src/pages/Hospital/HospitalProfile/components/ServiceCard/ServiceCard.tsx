import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../../HospitalProfile.module.scss';
import medicalImg1 from '@/assets/img/medical-img1.jpg';

interface ServiceCardProps {
    name: string;
    img: string;
    onClick?: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ name, img, onClick }) => {
    const handleClick = (e: React.MouseEvent) => {
        if (onClick) {
            e.preventDefault();
            onClick();
        }
    };

    return (
        <Link to="/doctor/list" className={styles.serviceCard} onClick={handleClick}>
            <div className={styles.serviceCardContent}>
                <div className={styles.serviceImage}>
                    <img
                        src={img}
                        alt={name}
                        onError={(e) => {
                            e.currentTarget.src = medicalImg1;
                        }}
                    />
                </div>
                <div className={styles.serviceName}>{name}</div>
            </div>
        </Link>
    );
};

export default ServiceCard;
