import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { useTranslation } from 'react-i18next';
import 'swiper/css';
import { Link } from 'react-router-dom';

import { ReviewService } from '@/services/review.service';
import { Review } from '@/types/review.types';

import patient22 from '@/assets/img/patients/patient22.jpg';
import patient21 from '@/assets/img/patients/patient21.jpg';
import patient from '@/assets/img/patients/patient.jpg';
import patient23 from '@/assets/img/patients/patient23.jpg';
import quoteIcon from '@/assets/img/icons/quote-icon.svg';

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

    // State for API testimonials
    const [apiTestimonials, setApiTestimonials] = useState<Testimonial[]>([]);
    const [totalReviewsCount, setTotalReviewsCount] = useState<number | null>(null);

    // Get testimonials from translation (fallback)
    const translatedTestimonials = t('testimonial.testimonials', {
        returnObjects: true,
    }) as Array<{
        rating: number;
        title: string;
        comment: string;
        authorName: string;
        authorLocation: string;
    }>;

    const avatarPaths = [patient22, patient21, patient, patient23];

    const defaultTestimonials: Testimonial[] = translatedTestimonials.map((item, index) => ({
        id: index + 1,
        ...item,
        authorAvatar: avatarPaths[index] || patient,
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

    // Use testimonials in this order: props > API > translation fallback
    const displayTestimonials =
        testimonials || (apiTestimonials.length > 0 ? apiTestimonials : defaultTestimonials);

    // Memoize displayCounters - use translation values directly, no API override
    const displayCounters = useMemo(() => {
        if (counters) return counters;
        return defaultCounters;
    }, [counters, defaultCounters]);

    // Fetch testimonials from API
    useEffect(() => {
        if (testimonials) {
            return; // Use provided testimonials
        }

        const fetchTestimonials = async () => {
            try {
                const response = await ReviewService.getTestimonialReviews({
                    page: 1,
                    pageSize: 20,
                    minRating: 4,
                });

                if (response.success && response.data.reviews.length > 0) {
                    const reviewTestimonials = response.data.reviews.map((review: Review) => ({
                        id: review.id,
                        rating: review.rating,
                        title: `${review.rating} ${t('testimonial.starReview', { defaultValue: 'Star Review' })}`,
                        comment: review.comment,
                        authorName:
                            review.patientInfo?.fullName ||
                            t('testimonial.anonymousUser', { defaultValue: 'Anonymous User' }),
                        authorLocation: t('testimonial.verifiedPatient', {
                            defaultValue: 'Verified Patient',
                        }),
                        authorAvatar: review.patientInfo?.avatarUrl || patient,
                    }));
                    setApiTestimonials(reviewTestimonials);

                    // Set total reviews count from API
                    setTotalReviewsCount(response.data.totalCount);
                }
            } catch (error) {
                console.error('Error fetching testimonial reviews:', error);
                // Fall back to translation testimonials on error
            }
        };

        fetchTestimonials();
    }, [testimonials, t]);

    // Counter animation
    const [counterValues, setCounterValues] = useState<Record<string | number, number>>({});
    const counterRef = useRef<HTMLDivElement>(null);
    const hasAnimatedRef = useRef(false);
    const timersRef = useRef<ReturnType<typeof setInterval>[]>([]);
    const displayCountersRef = useRef(displayCounters);

    // Keep displayCountersRef in sync
    useEffect(() => {
        displayCountersRef.current = displayCounters;
    }, [displayCounters]);

    const runAnimation = useCallback(() => {
        if (hasAnimatedRef.current) return;
        hasAnimatedRef.current = true;

        // Clear existing timers
        for (const timer of timersRef.current) {
            clearInterval(timer);
        }
        timersRef.current = [];

        const currentCounters = displayCountersRef.current;

        // Initialize to 0
        const initialValues: Record<string | number, number> = {};
        for (const counter of currentCounters) {
            initialValues[counter.id] = 0;
        }
        setCounterValues(initialValues);

        // Animate each counter
        for (const counter of currentCounters) {
            const duration = 2000;
            const steps = 60;
            const increment = counter.value / steps;
            let current = 0;

            const timer = setInterval(() => {
                current += increment;
                if (current >= counter.value) {
                    setCounterValues((prev) => ({ ...prev, [counter.id]: counter.value }));
                    clearInterval(timer);
                } else {
                    setCounterValues((prev) => ({ ...prev, [counter.id]: Math.floor(current) }));
                }
            }, duration / steps);

            timersRef.current.push(timer);
        }
    }, []);

    // IntersectionObserver setup - runs once on mount
    useEffect(() => {
        const currentRef = counterRef.current;
        if (!currentRef) return;

        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting && !hasAnimatedRef.current) {
                        runAnimation();
                    }
                }
            },
            { threshold: 0.3 }
        );

        observer.observe(currentRef);

        return () => {
            observer.disconnect();
            for (const timer of timersRef.current) {
                clearInterval(timer);
            }
        };
    }, [runAnimation]);

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
                    <h2>
                        {totalReviewsCount === null
                            ? t('testimonial.title')
                            : `${totalReviewsCount.toLocaleString()}+ ${t('testimonial.titleSuffix', { defaultValue: 'Người dùng Tin tưởng Medcure Toàn cầu' })}`}
                    </h2>
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
                                                    src={quoteIcon}
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
