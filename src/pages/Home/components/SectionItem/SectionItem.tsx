import Carousel from '@/components/Carousel';
import React from 'react';

interface SectionItemProps {
    items: React.ReactNode[];
    breakpoints: object;
}

const SectionItem: React.FC<SectionItemProps> = ({ items, breakpoints }) => {
    return (
        <section className="speciality-section">
            <div className="container">
                <div className="section-header sec-header-one text-center aos">
                    <span className="badge badge-primary">Top Specialties</span>
                    <h2>Highlighting the Care & Support</h2>
                </div>
                <div className="owl-carousel spciality-slider aos">
                    <Carousel slides={items} breakpoints={breakpoints} />
                </div>
            </div>
        </section>
    );
};

export default SectionItem;
