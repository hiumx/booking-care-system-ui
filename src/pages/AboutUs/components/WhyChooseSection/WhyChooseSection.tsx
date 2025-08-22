import React from 'react';
import chooseImg1 from '@/assets/img/icons/choose-01.svg';
import chooseImg2 from '@/assets/img/icons/choose-02.svg';
import chooseImg3 from '@/assets/img/icons/choose-03.svg';
import chooseImg4 from '@/assets/img/icons/choose-04.svg';

const WhyChooseSection: React.FC = () => {
    return (
        <section className="why-choose-section">
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="section-inner-header text-center">
                            <h2>Vì sao chọn chúng tôi</h2>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-3 col-md-6 d-flex">
                        <div className="card why-choose-card w-100">
                            <div className="card-body">
                                <div className="why-choose-icon">
                                    <span>
                                        <img src={chooseImg1} alt="choose-image" />
                                    </span>
                                </div>
                                <div className="why-choose-content">
                                    <h4>Đội ngũ bác sĩ chất lượng</h4>
                                    <p>
                                        Nền tảng hợp tác với các bác sĩ giàu kinh nghiệm, tận tâm
                                        mang đến chất lượng khám chữa bệnh tốt nhất cho bạn.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6 d-flex">
                        <div className="card why-choose-card w-100">
                            <div className="card-body">
                                <div className="why-choose-icon">
                                    <span>
                                        <img src={chooseImg2} alt="choose-image" />
                                    </span>
                                </div>
                                <div className="why-choose-content">
                                    <h4>Phục vụ 24/7</h4>
                                    <p>
                                        Truy cập, tìm bác sĩ và đặt lịch mọi lúc mọi nơi — kể cả ban
                                        đêm, cuối tuần và ngày lễ.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6 d-flex">
                        <div className="card why-choose-card w-100">
                            <div className="card-body">
                                <div className="why-choose-icon">
                                    <span>
                                        <img src={chooseImg3} alt="choose-image" />
                                    </span>
                                </div>
                                <div className="why-choose-content">
                                    <h4>Dịch vụ xét nghiệm chất lượng</h4>
                                    <p>
                                        Liên kết phòng xét nghiệm đạt chuẩn; kết quả nhanh, chính
                                        xác hỗ trợ chẩn đoán hiệu quả.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6 d-flex">
                        <div className="card why-choose-card w-100">
                            <div className="card-body">
                                <div className="why-choose-icon">
                                    <span>
                                        <img src={chooseImg4} alt="choose-image" />
                                    </span>
                                </div>
                                <div className="why-choose-content">
                                    <h4>Tư vấn ban đầu miễn phí</h4>
                                    <p>
                                        Bắt đầu hành trình chăm sóc sức khỏe dễ dàng với buổi tư vấn
                                        đầu tiên miễn phí.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhyChooseSection;
