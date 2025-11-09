import React from 'react';
import { useTranslation } from 'react-i18next';

interface ReasonItem {
    id: string | number;
    icon: string;
    iconColor: 'text-orange' | 'text-purple' | 'text-cyan';
    title: string;
    description: string;
}

interface ReasonsSectionProps {
    reasons?: ReasonItem[];
}

const ReasonsSection: React.FC<ReasonsSectionProps> = ({ reasons }) => {
    const { t } = useTranslation('home');

    // Get reasons from translation
    const translatedReasons = t('reasons.items', {
        returnObjects: true,
    }) as Array<{ title: string; description: string }>;

    const iconConfigs = [
        { icon: 'isax isax-tag-user5', iconColor: 'text-orange' as const },
        { icon: 'isax isax-voice-cricle', iconColor: 'text-purple' as const },
        { icon: 'isax isax-wallet-add-15', iconColor: 'text-cyan' as const },
    ];

    const defaultReasons: ReasonItem[] = translatedReasons.map((item, index) => ({
        id: index + 1,
        ...iconConfigs[index],
        title: item.title,
        description: item.description,
    }));

    const displayReasons = reasons || defaultReasons;

    return (
        <section className="reason-section">
            <div className="container">
                <div className="section-header sec-header-one text-center aos" data-aos="fade-up">
                    <span className="badge badge-primary">{t('reasons.badge')}</span>
                    <h2>{t('reasons.title')}</h2>
                </div>
                <div className="row row-gap-4 justify-content-center">
                    {displayReasons.map((reason) => (
                        <div key={reason.id} className="col-lg-4 col-md-6">
                            <div className="reason-item aos" data-aos="fade-up">
                                <h6 className="mb-2">
                                    <i className={`${reason.icon} ${reason.iconColor} me-2`}></i>
                                    {reason.title}
                                </h6>
                                <p className="fs-14 mb-0">{reason.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ReasonsSection;
