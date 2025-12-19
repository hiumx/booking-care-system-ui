import React from 'react';
import styles from './ServiceCard.module.scss';
import { buildPath, PATHS, replacePathParams } from '@/routes/paths';
import { Link } from 'react-router-dom';

interface ServiceCardProps {
    id: string;
    name: string;
    image: string;
    reverse?: boolean; // để xác định layout left/right
}

const ServiceCard: React.FC<ServiceCardProps> = ({ id, name, image, reverse }) => {
    const fullLink = replacePathParams(buildPath(PATHS.Service.CATEGORIES), {
        servicesparentId: id,
    });

    return (
        <div
            className={`service-types ${reverse ? 'service-type-right' : ''} ${styles.serviceCard}`}
            data-aos="fade-down"
        >
            {!reverse && (
                <div className={`doctor-image ${styles.imageWrapper}`}>
                    <Link to={fullLink}>
                        <img src={image} alt={name} className={styles.image} />
                    </Link>
                </div>
            )}
            <div className={`service-content ${styles.content}`}>
                <h4>
                    <Link to={fullLink}>{name}</Link>
                </h4>
                <Link to={fullLink} className="explore-link">
                    Khám phá<i className="feather-arrow-right-circle"></i>
                </Link>
            </div>
            {reverse && (
                <div className={`doctor-image ${styles.imageWrapper}`}>
                    <Link to={fullLink}>
                        <img src={image} alt={name} className={styles.image} />
                    </Link>
                </div>
            )}
        </div>
    );
};

export default ServiceCard;
