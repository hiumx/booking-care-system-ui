import React, { useEffect, useRef, useState } from 'react';
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

    // Update counters with real total reviews count if available
    const displayCounters =
        counters ||
        defaultCounters.map((counter, index) => {
            // Assuming the first counter (index 0) is for reviews count
            if (index === 0 && totalReviewsCount !== null) {
                return {
                    ...counter,
                    value: totalReviewsCount,
                };
            }
            return counter;
        });

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

        const updateCounterValue = (counterId: string | number, value: number) => {
            setCounterValues((prev) => ({
                ...prev,
                [counterId]: value,
            }));
        };

        const createCounterTimer = (counter: CounterItem): NodeJS.Timeout => {
            const duration = 2000; // 2 seconds
            const steps = 60;
            const increment = counter.value / steps;
            let current = 0;

            const handleCounterUpdate = (timer: NodeJS.Timeout) => {
                current += increment;
                const isComplete = current >= counter.value;
                const valueToSet = isComplete ? counter.value : Math.floor(current);
                updateCounterValue(counter.id, valueToSet);
                if (isComplete) {
                    clearInterval(timer);
                }
            };

            const timer = setInterval(() => handleCounterUpdate(timer), duration / steps);
            return timer;
        };

        const animateCounter = (counter: CounterItem) => {
            const timer = createCounterTimer(counter);
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
                    <h2>
                        {totalReviewsCount !== null
                            ? `${totalReviewsCount.toLocaleString()}+ ${t('testimonial.titleSuffix', { defaultValue: 'Người dùng Tin tưởng Medcure Toàn cầu' })}`
                            : t('testimonial.title')}
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
