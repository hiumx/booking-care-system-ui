import React from 'react';
import aboutImg1 from '@/assets/img/about-img1.jpg';
import aboutImg2 from '@/assets/img/about-img2.jpg';
import aboutImg3 from '@/assets/img/about-img3.jpg';

const AboutSection: React.FC = () => {
    return (
        <section className="about-section">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-lg-6 col-md-12">
                        <div className="about-img-info">
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="about-inner-img">
                                        <div className="about-img">
                                            <img
                                                src={aboutImg1}
                                                className="img-fluid"
                                                alt="about-image"
                                            />
                                        </div>
                                        <div className="about-img">
                                            <img
                                                src={aboutImg2}
                                                className="img-fluid"
                                                alt="about-image"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="about-inner-img">
                                        <div className="about-box">
                                            <h4>Hơn 25 năm kinh nghiệm</h4>
                                        </div>
                                        <div className="about-img">
                                            <img
                                                src={aboutImg3}
                                                className="img-fluid"
                                                alt="about-image"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-12">
                        <div className="section-inner-header about-inner-header">
                            <h6>Về hệ thống của chúng tôi</h6>
                            <h2>
                                Chúng tôi luôn mang tới dịch vụ y tế tốt nhất cho sức khỏe của bạn
                            </h2>
                        </div>
                        <div className="about-content">
                            <div className="about-content-details">
                                <p>
                                    Tại Doccure, chúng tôi thấu hiểu tầm quan trọng của việc tiếp
                                    cận dịch vụ y tế thuận tiện. Sứ mệnh của chúng tôi là đơn giản
                                    hóa việc tìm kiếm và đặt lịch khám với đội ngũ bác sĩ uy tín,
                                    giúp bạn nhận được sự chăm sóc cần thiết đúng lúc.
                                </p>
                                <p>
                                    Chúng tôi hướng tới một thế giới nơi ai cũng dễ dàng tiếp cận
                                    dịch vụ chăm sóc sức khỏe. Dù là khám định kỳ, tư vấn chuyên
                                    khoa hay cấp cứu, chúng tôi luôn nỗ lực kết nối bạn với bác sĩ
                                    phù hợp một cách nhanh chóng và hiệu quả.
                                </p>
                            </div>
                            <div className="about-contact">
                                <div className="about-contact-icon">
                                    <span>
                                        <i className="isax isax-call-calling5"></i>
                                    </span>
                                </div>
                                <div className="about-contact-text">
                                    <p>Cần hỗ trợ khẩn cấp?</p>
                                    <h4>+1 315 369 5943</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
