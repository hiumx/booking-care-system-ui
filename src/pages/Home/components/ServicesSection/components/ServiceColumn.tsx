import React from 'react';
import ServiceCard from './ServiceCard';

interface ServiceColumnProps {
    services: { id: number; name: string; image: string }[];
    reverse?: boolean;
}

const ServiceColumn: React.FC<ServiceColumnProps> = ({ services, reverse }) => {
    return (
        <div className="service-type-cards w-100">
            {services.map((service) => (
                <ServiceCard
                    key={service.id}
                    id={service.id}
                    name={service.name}
                    image={service.image}
                    reverse={reverse}
                />
            ))}
        </div>
    );
};

export default ServiceColumn;
