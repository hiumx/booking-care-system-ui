import React from 'react';

interface ServiceCardProps {
    title: string;
    image: string;
    link: string;
    reverse?: boolean; // để xác định layout left/right
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, image, link, reverse }) => {
    return (
        <div
            className={`service-types ${reverse ? 'service-type-right' : ''}`}
            data-aos="fade-down"
        >
            {!reverse && (
                <div className="doctor-image">
                    <a href={link}>
                        <img src={image} alt={title} />
                    </a>
                </div>
            )}
            <div className="service-content">
                <h4>
                    <a href={link}>{title}</a>
                </h4>
                <a href={link} className="explore-link">
                    Explore<i className="feather-arrow-right-circle"></i>
                </a>
            </div>
            {reverse && (
                <div className="doctor-image">
                    <a href={link}>
                        <img src={image} alt={title} />
                    </a>
                </div>
            )}
        </div>
    );
};

export default ServiceCard;
