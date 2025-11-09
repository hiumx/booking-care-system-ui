import React from 'react';
import { useTranslation } from 'react-i18next';

interface ServiceItem {
    id: string | number;
    title: string;
    link?: string;
}

interface HorizontalServicesSectionProps {
    services?: ServiceItem[];
    direction?: 'left' | 'right';
    speed?: 'fast' | 'slow';
}

const HorizontalServicesSection: React.FC<HorizontalServicesSectionProps> = ({
    services,
    direction = 'right',
    speed = 'slow',
}) => {
    const { t } = useTranslation('home');

    // Get services from translation
    const translatedServices = t('horizontalServices.services', {
        returnObjects: true,
    }) as string[];

    const defaultServices: ServiceItem[] = translatedServices.map((title, index) => ({
        id: index + 1,
        title,
    }));

    const displayServices = services || defaultServices;

    // Duplicate items for seamless infinite scroll
    const duplicatedServices = [...displayServices, ...displayServices];

    return (
        <section className="services-section aos" data-aos="fade-up">
            <div className="horizontal-slide d-flex" data-direction={direction} data-speed={speed}>
                <div className="slide-list d-flex gap-4">
                    {duplicatedServices.map((service, index) => (
                        <div key={`${service.id}-${index}`} className="services-slide">
                            <h6>
                                <a href="javascript:void(0);">{service.title}</a>
                            </h6>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HorizontalServicesSection;
