import React, { useRef, useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './TestimonialSection.module.scss';
import shape04 from '@/assets/img/shape-04.png';
import shape05 from '@/assets/img/shape-05.png';
import client01 from '@/assets/img/clients/client-01.jpg';

import { ReviewService } from '@/services/review.service';
import { Review } from '@/types/review.types';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface TestimonialSectionProps {
    hospitalId?: string;
}

interface Testimonial {
    id: string;
    image: string;
    name: string;
    text: string;
    rating: number;
}

const TestimonialSection: React.FC<TestimonialSectionProps> = ({ hospitalId }) => {
    const swiperRef = useRef<any>(null);
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasNoReviews, setHasNoReviews] = useState(false);

    useEffect(() => {
        if (!hospitalId) {
            setTestimonials([]);
            return;
        }

        const fetchReviews = async () => {
            try {
                setLoading(true);
                // Fetch 20 high-quality reviews (4-5 stars) filtered at backend
                // This is more efficient than filtering on frontend
                const response = await ReviewService.getHospitalReviews({
                    hospitalId,
                    page: 1,
                    pageSize: 20,
                    minRating: 4, // Filter at backend for better performance
                });

                if (response.success && response.data.reviews.length > 0) {
                    // Map reviews to testimonial format (already filtered by backend)
                    const reviewTestimonials = response.data.reviews.map((review: Review) => ({
                        id: review.id,
                        image: review.patientInfo?.avatarUrl || client01,
                        name: review.patientInfo?.fullName || 'Người dùng',
                        text: review.comment,
                        rating: review.rating,
                    }));
                    setTestimonials(reviewTestimonials);
                    setHasNoReviews(false);
                } else {
                    // If no high-quality reviews, try fetching all reviews
                    await handleFallbackReviews(hospitalId);
                }
            } catch (error) {
                console.error('Error fetching hospital reviews:', error);
                setTestimonials([]);
                setHasNoReviews(true);
            } finally {
                setLoading(false);
            }
        };

        const handleFallbackReviews = async (hospitalId: string) => {
            const fallbackResponse = await ReviewService.getHospitalReviews({
                hospitalId,
                page: 1,
                pageSize: 10,
            });

            if (fallbackResponse.success && fallbackResponse.data.reviews.length > 0) {
                const allReviews = fallbackResponse.data.reviews.map((review: Review) => ({
                    id: review.id,
                    image: review.patientInfo?.avatarUrl || client01,
                    name: review.patientInfo?.fullName || 'Người dùng',
                    text: review.comment,
                    rating: review.rating,
                }));
                setTestimonials(allReviews);
                setHasNoReviews(false);
            } else {
                setTestimonials([]);
                setHasNoReviews(true);
            }
        };

        fetchReviews();
    }, [hospitalId]);

    const goNext = () => {
        if (swiperRef.current && swiperRef.current.swiper) {
            swiperRef.current.swiper.slideNext();
        }
    };

    const goPrev = () => {
        if (swiperRef.current && swiperRef.current.swiper) {
            swiperRef.current.swiper.slidePrev();
        }
    };

    const renderContent = () => {
        if (loading) {
            return (
                <div className="text-center py-5">
                    <div className="spinner-border">
                        <output className="visually-hidden">Đang tải đánh giá...</output>
                    </div>
                </div>
            );
        }

        if (hasNoReviews) {
            return (
                <div className="text-center py-5">
                    <div className={styles.emptyState}>
                        <h4>Chưa có đánh giá</h4>
                        <p>Hãy là người đầu tiên đánh giá bệnh viện này!</p>
                    </div>
                </div>
            );
        }

        return (
            <div className="testimonial-slider slick">
                <Swiper
                    ref={swiperRef}
                    modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={30}
                    slidesPerView={1}
                    loop={true}
                    speed={2000}
                    autoplay={{
                        delay: 5000,
                        disableOnInteraction: false,
                    }}
                    pagination={{
                        clickable: true,
                        el: '.swiper-pagination',
                    }}
                >
                    {testimonials.map((testimonial) => (
                        <SwiperSlide key={testimonial.id}>
                            <div className="testimonial-grid">
                                <div className="testimonial-info">
                                    <div className="testimonial-img">
                                        <img
                                            src={testimonial.image}
                                            className="img-fluid"
                                            alt="client-image"
                                        />
                                    </div>
                                    <div className="testimonial-content">
                                        <div className="section-inner-header testimonial-header">
                                            <h6>Cảm nhận</h6>
                                            <h2>Khách hàng nói gì</h2>
                                        </div>
                                        <div className="testimonial-details">
                                            <p>{testimonial.text}</p>
                                            <h6>
                                                <span>{testimonial.name}</span>
                                            </h6>
                                            {testimonial.rating > 0 && (
                                                <div className={styles.ratingContainer}>
                                                    {Array(5)
                                                        .fill(0)
                                                        .map((_, index) => (
                                                            <svg
                                                                key={`star-${testimonial.id}-${index}`}
                                                                className={`${styles.star} ${
                                                                    index < testimonial.rating
                                                                        ? styles.starFilled
                                                                        : styles.starEmpty
                                                                }`}
                                                                viewBox="0 0 24 24"
                                                                fill="currentColor"
                                                            >
                                                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                                            </svg>
                                                        ))}
                                                    <span className={styles.ratingText}>
                                                        {testimonial.rating}/5
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Custom Navigation Arrows */}
                <button
                    className={`${styles.swiperNavBtn} ${styles.swiperNavPrev}`}
                    onClick={goPrev}
                    aria-label="Previous testimonial"
                >
                    <ChevronLeft />
                </button>
                <button
                    className={`${styles.swiperNavBtn} ${styles.swiperNavNext}`}
                    onClick={goNext}
                    aria-label="Next testimonial"
                >
                    <ChevronRight />
                </button>
            </div>
        );
    };

    return (
        <section className="testimonial-section">
            <div className="testimonial-shape-img">
                <div className="testimonial-shape-left">
                    <img src={shape04} alt="shape-image" />
                </div>
                <div className="testimonial-shape-right">
                    <img src={shape05} alt="shape-image" />
                </div>
            </div>

            <div className="container">
                <div className="row">
                    <div className="col-md-12">{renderContent()}</div>
                </div>
            </div>
        </section>
    );
};

export default TestimonialSection;
