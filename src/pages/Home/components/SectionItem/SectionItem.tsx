import Carousel from '@/components/Carousel';
import React from 'react';

interface SectionItemProps {
    title: string;
    desc: string;
    items: React.ReactNode[];
    breakpoints: object;
}

const SectionItem: React.FC<SectionItemProps> = ({ title, desc, items, breakpoints }) => {
    return (
        <section className="speciality-section">
            <div className="container">
                <div className="section-header sec-header-one text-center aos">
                    <span className="badge badge-primary">{title}</span>
                    <h2>{desc}</h2>
                </div>
                <div className="owl-carousel spciality-slider aos">
                    <Carousel slides={items} breakpoints={breakpoints} />
                </div>
            </div>
        </section>
    );
};

export default SectionItem;
