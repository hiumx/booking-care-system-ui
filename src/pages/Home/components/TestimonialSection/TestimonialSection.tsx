import React, { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { useTranslation } from 'react-i18next';
import 'swiper/css';
import { Link } from 'react-router-dom';

interface Testimonial {
    id: string | number;
    rating: number;
    title: string;
    comment: string;
    authorName: string;
    authorLocation: string;
    authorAvatar: string;
}

interface CounterItem {
    id: string | number;
    value: number;
    label: string;
    suffix?: string;
    colorClass?: 'secondary-count' | 'purple-count' | 'pink-count' | 'warning-count';
}

interface TestimonialSectionProps {
    testimonials?: Testimonial[];
    counters?: CounterItem[];
}

const TestimonialSection: React.FC<TestimonialSectionProps> = ({ testimonials, counters }) => {
    const { t } = useTranslation('home');

    // Get testimonials from translation
    const translatedTestimonials = t('testimonial.testimonials', {
        returnObjects: true,
    }) as Array<{
        rating: number;
        title: string;
        comment: string;
        authorName: string;
        authorLocation: string;
    }>;

    const avatarPaths = [
        '/src/assets/img/patients/patient22.jpg',
        '/src/assets/img/patients/patient21.jpg',
        '/src/assets/img/patients/patient.jpg',
        '/src/assets/img/patients/patient23.jpg',
    ];

    const defaultTestimonials: Testimonial[] = translatedTestimonials.map((item, index) => ({
        id: index + 1,
        ...item,
        authorAvatar: avatarPaths[index] || '/src/assets/img/patients/patient.jpg',
    }));

    // Get counters from translation
    const translatedCounters = t('testimonial.counters', {
        returnObjects: true,
    }) as Array<{ value: number; suffix: string; label: string }>;

    const colorClasses: Array<
        'secondary-count' | 'purple-count' | 'pink-count' | 'warning-count' | undefined
    > = [undefined, 'secondary-count', 'purple-count', 'pink-count', 'warning-count'];

    const defaultCounters: CounterItem[] = translatedCounters.map((item, index) => ({
        id: index + 1,
        ...item,
        colorClass: colorClasses[index],
    }));

    const displayTestimonials = testimonials || defaultTestimonials;
    const displayCounters = counters || defaultCounters;

    // Counter animation
    const [countersAnimated, setCountersAnimated] = useState(false);
    const [counterValues, setCounterValues] = useState<Record<string | number, number>>({});
    const counterRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (countersAnimated) return; // Already animated

        const timers: NodeJS.Timeout[] = [];

        const initializeCounters = () => {
            const initialValues: Record<string | number, number> = {};
            for (const counter of displayCounters) {
                initialValues[counter.id] = 0;
            }
            setCounterValues(initialValues);
        };

        const animateCounter = (counter: CounterItem) => {
            const duration = 2000; // 2 seconds
            const steps = 60;
            const increment = counter.value / steps;
            let current = 0;
            const timer = setInterval(() => {
                current += increment;
                if (current >= counter.value) {
                    setCounterValues((prev) => ({
                        ...prev,
                        [counter.id]: counter.value,
                    }));
                    clearInterval(timer);
                } else {
                    setCounterValues((prev) => ({
                        ...prev,
                        [counter.id]: Math.floor(current),
                    }));
                }
            }, duration / steps);
            timers.push(timer);
        };

        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting && !countersAnimated) {
                        setCountersAnimated(true);
                        initializeCounters();
                        for (const counter of displayCounters) {
                            animateCounter(counter);
                        }
                    }
                }
            },
            { threshold: 0.5 }
        );

        if (counterRef.current) {
            observer.observe(counterRef.current);
        }

        return () => {
            if (counterRef.current) {
                observer.unobserve(counterRef.current);
            }
            // Cleanup timers
            for (const timer of timers) {
                clearInterval(timer);
            }
        };
    }, [countersAnimated, displayCounters]);

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, index) => (
            <i
                key={index}
                className={`fa-solid fa-star ${index < rating ? 'filled' : ''} ${
                    index < 4 ? 'me-1' : ''
                }`}
            ></i>
        ));
    };

    const testimonialBreakpoints = {
        320: {
            slidesPerView: 1,
            spaceBetween: 20,
        },
        768: {
            slidesPerView: 2,
            spaceBetween: 30,
        },
        1024: {
            slidesPerView: 3,
            spaceBetween: 30,
        },
    };

    return (
        <section className="testimonial-section-one">
            <div className="container">
                <div className="section-header sec-header-one text-center aos" data-aos="fade-up">
                    <span className="badge badge-primary">{t('testimonial.badge')}</span>
                    <h2>{t('testimonial.title')}</h2>
                </div>

                {/* Testimonial Slider */}
                <div className="owl-carousel testimonials-slider aos" data-aos="fade-up">
                    <Swiper
                        modules={[Autoplay]}
                        spaceBetween={30}
                        slidesPerView={3}
                        autoplay={{
                            delay: 3000,
                            disableOnInteraction: false,
                        }}
                        loop={true}
                        breakpoints={testimonialBreakpoints}
                    >
                        {displayTestimonials.map((testimonial) => (
                            <SwiperSlide key={testimonial.id}>
                                <div className="card shadow-none mb-0">
                                    <div className="card-body">
                                        <div className="d-flex align-items-center mb-4">
                                            <div className="rating d-flex">
                                                {renderStars(testimonial.rating)}
                                            </div>
                                            <span>
                                                <img
                                                    src="/src/assets/img/icons/quote-icon.svg"
                                                    alt="quote"
                                                    className="ms-auto"
                                                />
                                            </span>
                                        </div>
                                        <h6 className="fs-16 fw-medium mb-2">
                                            {testimonial.title}
                                        </h6>
                                        <p>{testimonial.comment}</p>
                                        <div className="d-flex align-items-center">
                                            <Link to="#" className="avatar avatar-lg">
                                                <img
                                                    src={testimonial.authorAvatar}
                                                    className="rounded-circle"
                                                    alt={testimonial.authorName}
                                                />
                                            </Link>
                                            <div className="ms-2">
                                                <h6 className="mb-1">
                                                    <Link to="#">{testimonial.authorName}</Link>
                                                </h6>
                                                <p className="fs-14 mb-0">
                                                    {testimonial.authorLocation}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                {/* Counter */}
                <div className="testimonial-counter" ref={counterRef}>
                    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5 row-gap-4">
                        {displayCounters.map((counter, index) => (
                            <div
                                key={counter.id}
                                className="counter-item text-center aos"
                                data-aos="fade-up"
                                data-aos-delay={index * 100}
                            >
                                <h6 className={`display-6 ${counter.colorClass || ''}`}>
                                    <span className="count-digit">
                                        {counterValues[counter.id] ?? 0}
                                    </span>
                                    {counter.suffix || ''}
                                </h6>
                                <p>{counter.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TestimonialSection;
