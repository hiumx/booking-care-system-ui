import React from 'react';
import { useTranslation } from 'react-i18next';
import chooseImg1 from '@/assets/img/icons/choose-01.svg';
import chooseImg2 from '@/assets/img/icons/choose-02.svg';
import chooseImg3 from '@/assets/img/icons/choose-03.svg';
import chooseImg4 from '@/assets/img/icons/choose-04.svg';

const icons = [chooseImg1, chooseImg2, chooseImg3, chooseImg4];

const WhyChooseSection: React.FC = () => {
    const { t } = useTranslation('about');
    const items = t('whyChoose.items', { returnObjects: true }) as Array<{
        title: string;
        description: string;
    }>;

    return (
        <section className="why-choose-section">
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="section-inner-header text-center">
                            <h2>{t('whyChoose.title')}</h2>
                        </div>
                    </div>
                </div>
                <div className="row">
                    {items.map((item, index) => (
                        <div key={index} className="col-lg-3 col-md-6 d-flex">
                            <div className="card why-choose-card w-100">
                                <div className="card-body">
                                    <div className="why-choose-icon">
                                        <span>
                                            <img src={icons[index]} alt="choose-image" />
                                        </span>
                                    </div>
                                    <div className="why-choose-content">
                                        <h4>{item.title}</h4>
                                        <p>{item.description}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhyChooseSection;
