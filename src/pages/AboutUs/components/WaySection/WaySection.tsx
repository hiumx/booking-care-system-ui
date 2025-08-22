import React from 'react';
import { Link } from 'react-router-dom';
import wayImg from '@/assets/img/way-img.png';
import shape06 from '@/assets/img/shape-06.png';
import shape07 from '@/assets/img/shape-07.png';
const WaySection: React.FC = () => {
    return (
        <section className="way-section">
            <div className="container">
                <div className="way-bg">
                    <div className="way-shapes-img">
                        <div className="way-shapes-left">
                            <img src={shape06} alt="shape-image" />
                        </div>
                        <div className="way-shapes-right">
                            <img src={shape07} alt="shape-image" />
                        </div>
                    </div>
                    <div className="row align-items-end">
                        <div className="col-lg-7 col-md-12">
                            <div className="section-inner-header way-inner-header mb-0">
                                <h2>Đồng hành cùng bạn trên hành trình khỏe mạnh với Doccure</h2>
                                <p>
                                    Chúng tôi ưu tiên sức khỏe của bạn bằng các dịch vụ cá nhân hóa
                                    và dễ tiếp cận — giúp việc chăm sóc y tế trở nên đơn giản hơn.
                                </p>
                                <Link to="/contact" className="btn btn-primary">
                                    Liên hệ với chúng tôi
                                </Link>
                            </div>
                        </div>
                        <div className="col-lg-5 col-md-12">
                            <div className="way-img">
                                <img src={wayImg} className="img-fluid" alt="doctor-way-image" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WaySection;
