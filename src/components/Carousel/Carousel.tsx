import { FC, ReactNode, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import styles from './Carousel.module.scss';

import 'swiper/css';
import 'swiper/css/pagination';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

type CarouselProps = {
    slides: { id: string | number; node: ReactNode }[];
    autoPlayDelayMs?: number;
    loop?: boolean;
    isAutoPlay?: boolean;
    breakpoints: object;
};

const Carousel: FC<CarouselProps> = ({
    slides,
    autoPlayDelayMs = 5000,
    loop = true,
    isAutoPlay = false,
    breakpoints,
}) => {
    const prevRef = useRef<HTMLButtonElement>(null);
    const nextRef = useRef<HTMLButtonElement>(null);
    const swiperRef = useRef<any>(null);

    useEffect(() => {
        if (swiperRef.current && prevRef.current && nextRef.current) {
            swiperRef.current.params.navigation.prevEl = prevRef.current;
            swiperRef.current.params.navigation.nextEl = nextRef.current;

            // re-init navigation
            swiperRef.current.navigation.destroy();
            swiperRef.current.navigation.init();
            swiperRef.current.navigation.update();
        }
    }, []);

    return (
        <div className={styles.carouselContainer}>
            <Swiper
                modules={[Navigation, Autoplay]}
                spaceBetween={20}
                slidesPerView={8}
                navigation={{ nextEl: nextRef.current, prevEl: prevRef.current }}
                pagination={{ clickable: false }}
                autoplay={
                    isAutoPlay ? { delay: autoPlayDelayMs, disableOnInteraction: false } : false
                }
                loop={loop}
                className={`w-full`}
                onSwiper={(swiper) => (swiperRef.current = swiper)}
                breakpoints={breakpoints as any}
            >
                {slides.map((content) => (
                    <SwiperSlide key={content.id}>{content.node}</SwiperSlide>
                ))}
            </Swiper>

            <div className={styles.carouselNav}>
                <button ref={prevRef} className={clsx(styles.carouselButton, styles.prev)}>
                    <ChevronLeft size={20} />
                </button>
                <button ref={nextRef} className={clsx(styles.carouselButton, styles.next)}>
                    <ChevronRight size={20} />
                </button>
            </div>
        </div>
    );
};

export default Carousel;
