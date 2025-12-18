import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import wayImg from '@/assets/img/way-img.png';
import shape06 from '@/assets/img/shape-06.png';
import shape07 from '@/assets/img/shape-07.png';
import { PATHS } from '@/routes/paths';

const WaySection: React.FC = () => {
    const { t } = useTranslation('about');

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
                                <h2>{t('waySection.title')}</h2>
                                <p>{t('waySection.description')}</p>
                                <Link to={PATHS.CONTACT_US} className="btn btn-primary">
                                    {t('waySection.contactButton')}
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
