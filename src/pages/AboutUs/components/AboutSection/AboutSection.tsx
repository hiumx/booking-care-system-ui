import React from 'react';
import { useTranslation } from 'react-i18next';
import aboutImg1 from '@/assets/img/about-img1.jpg';
import aboutImg2 from '@/assets/img/about-img2.jpg';
import aboutImg3 from '@/assets/img/about-img3.jpg';

const AboutSection: React.FC = () => {
    const { t } = useTranslation('about');

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
                                            <h4>{t('aboutSection.experience')}</h4>
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
                            <h6>{t('aboutSection.badge')}</h6>
                            <h2>{t('aboutSection.title')}</h2>
                        </div>
                        <div className="about-content">
                            <div className="about-content-details">
                                <p>{t('aboutSection.description1')}</p>
                                <p>{t('aboutSection.description2')}</p>
                            </div>
                            <div className="about-contact">
                                <div className="about-contact-icon">
                                    <span>
                                        <i className="isax isax-call-calling5"></i>
                                    </span>
                                </div>
                                <div className="about-contact-text">
                                    <p>{t('aboutSection.emergencySupport')}</p>
                                    <h4>{t('aboutSection.phone')}</h4>
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
