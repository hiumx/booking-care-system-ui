import React from 'react';
import { Link } from 'react-router-dom';
import doctor03 from '@/assets/img/doctors/doctor-03.jpg';
import doctor04 from '@/assets/img/doctors/doctor-04.jpg';
import doctor05 from '@/assets/img/doctors/doctor-05.jpg';
import doctor02 from '@/assets/img/doctors/doctor-02.jpg';

const DoctorsSection: React.FC = () => {
    return (
        <section className="doctors-section professional-section">
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="section-inner-header text-center">
                            <h2>Bác sĩ tiêu biểu</h2>
                        </div>
                    </div>
                </div>

                <div className="row">
                    {/* Doctor Item */}
                    <div className="col-lg-3 col-md-6 d-flex">
                        <div className="doctor-profile-widget doc-item w-100">
                            <div className="doc-pro-img">
                                <Link to="/doctor/profile">
                                    <div className="doctor-profile-img">
                                        <img
                                            src={doctor03}
                                            className="img-fluid"
                                            alt="Ruby Perrin"
                                        />
                                    </div>
                                </Link>
                            </div>
                            <div className="doc-content">
                                <div className="doc-pro-info">
                                    <div className="doc-pro-name">
                                        <Link to="/doctor/profile">BS. Ruby Perrin</Link>
                                        <p>Tim mạch</p>
                                    </div>
                                    <div className="reviews-ratings">
                                        <p>
                                            <span>
                                                <i className="fas fa-star"></i> 4.5
                                            </span>{' '}
                                            (35)
                                        </p>
                                    </div>
                                </div>
                                <div className="doc-pro-location">
                                    <p>
                                        <i className="isax isax-location"></i>Hà Nội, Việt Nam
                                    </p>
                                    <span className="badge badge-success doc-badge">
                                        <i className="fa-solid fa-circle"></i>Đang khám
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Doctor Item */}
                    <div className="col-lg-3 col-md-6 d-flex">
                        <div className="doctor-profile-widget doc-item w-100">
                            <div className="doc-pro-img">
                                <Link to="/doctor/profile">
                                    <div className="doctor-profile-img">
                                        <img
                                            src={doctor04}
                                            className="img-fluid"
                                            alt="Darren Elder"
                                        />
                                    </div>
                                </Link>
                            </div>
                            <div className="doc-content">
                                <div className="doc-pro-info">
                                    <div className="doc-pro-name">
                                        <Link to="/doctor/profile">BS. Darren Elder</Link>
                                        <p>Thần kinh</p>
                                    </div>
                                    <div className="reviews-ratings">
                                        <p>
                                            <span>
                                                <i className="fas fa-star"></i> 4.0
                                            </span>{' '}
                                            (20)
                                        </p>
                                    </div>
                                </div>
                                <div className="doc-pro-location">
                                    <p>
                                        <i className="isax isax-location"></i>Đà Nẵng, Việt Nam
                                    </p>
                                    <span className="badge badge-success doc-badge">
                                        <i className="fa-solid fa-circle"></i>Đang khám
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Doctor Item */}
                    <div className="col-lg-3 col-md-6 d-flex">
                        <div className="doctor-profile-widget doc-item w-100">
                            <div className="doc-pro-img">
                                <Link to="/doctor/profile">
                                    <div className="doctor-profile-img">
                                        <img
                                            src={doctor05}
                                            className="img-fluid"
                                            alt="Sofia Brient"
                                        />
                                    </div>
                                </Link>
                            </div>
                            <div className="doc-content">
                                <div className="doc-pro-info">
                                    <div className="doc-pro-name">
                                        <Link to="/doctor/profile">BS. Sofia Brient</Link>
                                        <p>Tiết niệu</p>
                                    </div>
                                    <div className="reviews-ratings">
                                        <p>
                                            <span>
                                                <i className="fas fa-star"></i> 4.5
                                            </span>{' '}
                                            (30)
                                        </p>
                                    </div>
                                </div>
                                <div className="doc-pro-location">
                                    <p>
                                        <i className="isax isax-location"></i>Hồ Chí Minh, Việt Nam
                                    </p>
                                    <span className="badge badge-danger doc-badge">
                                        <i className="fa-solid fa-circle"></i>Tạm nghỉ
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Doctor Item */}
                    <div className="col-lg-3 col-md-6 d-flex">
                        <div className="doctor-profile-widget doc-item w-100">
                            <div className="doc-pro-img">
                                <Link to="/doctor/profile">
                                    <div className="doctor-profile-img">
                                        <img
                                            src={doctor02}
                                            className="img-fluid"
                                            alt="Paul Richard"
                                        />
                                    </div>
                                </Link>
                            </div>
                            <div className="doc-content">
                                <div className="doc-pro-info">
                                    <div className="doc-pro-name">
                                        <Link to="/doctor/profile">BS. Paul Richard</Link>
                                        <p>Chấn thương chỉnh hình</p>
                                    </div>
                                    <div className="reviews-ratings">
                                        <p>
                                            <span>
                                                <i className="fas fa-star"></i> 4.3
                                            </span>{' '}
                                            (45)
                                        </p>
                                    </div>
                                </div>
                                <div className="doc-pro-location">
                                    <p>
                                        <i className="isax isax-location"></i>Cần Thơ, Việt Nam
                                    </p>
                                    <span className="badge badge-success doc-badge">
                                        <i className="fa-solid fa-circle"></i>Đang khám
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DoctorsSection;
