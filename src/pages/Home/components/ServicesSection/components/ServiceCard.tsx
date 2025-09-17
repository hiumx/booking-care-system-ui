import React from 'react';
import { buildPath, PATHS, replacePathParams } from '@/routes/paths';
import { Link } from 'react-router-dom';

interface ServiceCardProps {
    id: number;
    name: string;
    image: string;
    reverse?: boolean; // để xác định layout left/right
}

const ServiceCard: React.FC<ServiceCardProps> = ({ id, name, image, reverse }) => {
    const fullLink = replacePathParams(buildPath(PATHS.Service.Service_Types), {
        serviceId: id.toString(),
    });
    return (
        <div
            className={`service-types ${reverse ? 'service-type-right' : ''}`}
            data-aos="fade-down"
        >
            {!reverse && (
                <div className="doctor-image">
                    <Link to={fullLink}>
                        <img src={image} alt={name} />
                    </Link>
                </div>
            )}
            <div className="service-content">
                <h4>
                    <Link to={fullLink}>{name}</Link>
                </h4>
                <Link to={fullLink} className="explore-link">
                    Explore<i className="feather-arrow-right-circle"></i>
                </Link>
            </div>
            {reverse && (
                <div className="doctor-image">
                    <Link to={fullLink}>
                        <img src={image} alt={name} />
                    </Link>
                </div>
            )}
        </div>
    );
};

export default ServiceCard;
