import Carousel from '@/components/Carousel';
import HospitalInfo from '@/components/HospitalInfo';
import React from 'react';

interface SimpleCarouselProps {
    items: { id: string | number; node: React.ReactNode }[];
    breakpoints: object;
    isAutoPlay?: boolean;
}

interface HospitalCarouselProps {
    hospitals: Array<{
        id: number;
        name: string;
        address: string;
        background_url: string;
    }>;
    availabilitySlots?: Array<{
        day: string;
        time: string;
    }>;
}

const SimpleCarousel: React.FC<SimpleCarouselProps> = ({
    items,
    breakpoints,
    isAutoPlay = false,
}) => {
    return (
        <div className="owl-carousel spciality-slider aos">
            <Carousel slides={items} breakpoints={breakpoints} isAutoPlay={isAutoPlay} />
        </div>
    );
};

export const HospitalCarousel: React.FC<HospitalCarouselProps> = ({
    hospitals,
    availabilitySlots,
}) => {
    const hospitalItems: { id: string | number; node: React.ReactNode }[] = hospitals.map(
        (hospital) => ({
            id: hospital.id,
            node: (
                <HospitalInfo
                    key={hospital.id}
                    hospital={hospital}
                    availabilitySlots={availabilitySlots}
                />
            ),
        })
    );

    return (
        <div className="owl-carousel spciality-slider aos">
            <Carousel
                slides={hospitalItems}
                breakpoints={{ 0: { slidesPerView: 1 } }}
                isAutoPlay={true}
            />
        </div>
    );
};

export default SimpleCarousel;
