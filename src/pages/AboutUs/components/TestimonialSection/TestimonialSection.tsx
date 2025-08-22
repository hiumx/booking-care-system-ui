import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './TestimonialSection.module.scss';
import shape04 from '@/assets/img/shape-04.png';
import shape05 from '@/assets/img/shape-05.png';
import client01 from '@/assets/img/clients/client-01.jpg';
import client02 from '@/assets/img/clients/client-02.jpg';
import client03 from '@/assets/img/clients/client-03.jpg';
import client04 from '@/assets/img/clients/client-04.jpg';
import client05 from '@/assets/img/clients/client-05.jpg';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const testimonials = [
    {
        id: 1,
        image: client01,
        name: 'Nguyễn Minh Anh',
        location: 'Hà Nội',
        text: 'Doccure đã vượt ngoài mong đợi của tôi. Quy trình đặt lịch nhanh gọn, đội ngũ bác sĩ chuyên môn cao mang lại trải nghiệm tuyệt vời. Tôi rất khuyến khích Doccure cho mọi nhu cầu chăm sóc sức khỏe.',
    },
    {
        id: 2,
        image: client02,
        name: 'Trần Thu Hằng',
        location: 'Đà Nẵng',
        text: 'Dịch vụ thuận tiện, chất lượng và đáng tin cậy. Tôi dễ dàng tìm bác sĩ phù hợp và đặt lịch chỉ trong vài phút.',
    },
    {
        id: 3,
        image: client03,
        name: 'Lê Quang',
        location: 'Hải Phòng',
        text: 'Trải nghiệm rất mượt mà từ khâu tìm kiếm đến khám bệnh. Thực sự hữu ích cho những người bận rộn.',
    },
    {
        id: 4,
        image: client04,
        name: 'Phạm Thu Trang',
        location: 'TP. Hồ Chí Minh',
        text: 'Tôi yêu thích cách hệ thống gợi ý bác sĩ phù hợp và nhắc lịch tự động. Rất chuyên nghiệp.',
    },
    {
        id: 5,
        image: client05,
        name: 'Đỗ Minh',
        location: 'Cần Thơ',
        text: 'Doccure giúp tôi tiết kiệm thời gian đáng kể và vẫn đảm bảo chất lượng dịch vụ y tế.',
    },
];

const TestimonialSection: React.FC = () => {
    const swiperRef = useRef<any>(null);

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
                    <div className="col-md-12">
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
                                                            <span>{testimonial.name}</span>{' '}
                                                            {testimonial.location}
                                                        </h6>
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
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TestimonialSection;
