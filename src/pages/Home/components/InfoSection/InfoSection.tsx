import React from 'react';
import { useTranslation } from 'react-i18next';

const InfoSection: React.FC = () => {
    const { t } = useTranslation('home');

    return (
        <section className="info-section">
            <div className="container">
                <div className="contact-info">
                    <div className="d-lg-flex align-items-center justify-content-between w-100 gap-4">
                        <div className="mb-4 mb-lg-0 aos" data-aos="fade-up">
                            <h6 className="display-6 text-white">{t('info.heading')}</h6>
                        </div>
                        <div
                            className="d-sm-flex align-items-center justify-content-lg-end gap-4 aos"
                            data-aos="fade-up"
                        >
                            <div className="con-info d-flex align-items-center mb-3 mb-sm-0">
                                <span className="con-icon">
                                    <i className="isax isax-headphone"></i>
                                </span>
                                <div className="ms-2">
                                    <p className="text-white mb-1">
                                        {t('info.customerSupport.label')}
                                    </p>
                                    <p className="text-white fw-medium mb-0">
                                        {t('info.customerSupport.value')}
                                    </p>
                                </div>
                            </div>
                            <div className="con-info d-flex align-items-center">
                                <span className="con-icon">
                                    <i className="isax isax-message-2"></i>
                                </span>
                                <div className="ms-2">
                                    <p className="text-white mb-1">{t('info.email.label')}</p>
                                    <p className="text-white fw-medium mb-0">
                                        <a
                                            href={`mailto:${t('info.email.value')}`}
                                            className="text-white text-decoration-none"
                                        >
                                            {t('info.email.value')}
                                        </a>
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

export default InfoSection;
