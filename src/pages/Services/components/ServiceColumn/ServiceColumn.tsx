import React from 'react';
import ServiceCard from '../ServiceCard';

interface ServiceColumnProps {
    services: { title: string; image: string; link: string }[];
    reverse?: boolean;
}

const ServiceColumn: React.FC<ServiceColumnProps> = ({ services, reverse }) => {
    return (
        <div className="service-type-cards w-100">
            {services.map((service, index) => (
                <ServiceCard
                    key={index}
                    title={service.title}
                    image={service.image}
                    link={service.link}
                    reverse={reverse}
                />
            ))}
        </div>
    );
};

export default ServiceColumn;
