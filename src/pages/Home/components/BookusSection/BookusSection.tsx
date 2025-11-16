import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface VisionMissionItem {
    id: string | number;
    number: string;
    title: string;
    description: string;
}

interface BookItem {
    id: string | number;
    icon: string;
    iconClass: 'bg-primary' | 'bg-orange' | 'bg-cyan' | 'bg-indigo';
    title: string;
    description: string;
    showWayIcon?: boolean;
}

interface BookusSectionProps {
    images?: {
        large: string;
        small1: string;
        small2: string;
    };
    visionMission?: VisionMissionItem[];
    bookItems?: BookItem[];
}

const BookusSection: React.FC<BookusSectionProps> = ({ images, visionMission, bookItems }) => {
    const { t } = useTranslation('home');

    // Mock data - có thể thay thế bằng data từ API
    const defaultImages = {
        large: '/src/assets/img/book-01.jpg',
        small1: '/src/assets/img/book-02.jpg',
        small2: '/src/assets/img/book-03.jpg',
    };

    // Get vision/mission from translation
    const translatedVisionMission = t('bookus.visionMission', {
        returnObjects: true,
    }) as Array<{ number: string; title: string; description: string }>;

    const defaultVisionMission: VisionMissionItem[] = translatedVisionMission.map(
        (item, index) => ({
            id: index + 1,
            ...item,
        })
    );

    // Get book items from translation
    const translatedBookItems = t('bookus.bookItems', {
        returnObjects: true,
    }) as Array<{ title: string; description: string }>;

    const iconConfigs = [
        { icon: 'isax isax-search-normal5', iconClass: 'bg-primary' as const, showWayIcon: true },
        { icon: 'isax isax-security-user5', iconClass: 'bg-orange' as const, showWayIcon: true },
        { icon: 'isax isax-calendar5', iconClass: 'bg-cyan' as const, showWayIcon: true },
        { icon: 'isax isax-blend5', iconClass: 'bg-indigo' as const, showWayIcon: false },
    ];

    const defaultBookItems: BookItem[] = translatedBookItems.map((item, index) => ({
        id: index + 1,
        ...iconConfigs[index],
        title: item.title,
        description: item.description,
    }));

    const displayImages = images || defaultImages;
    const displayVisionMission = visionMission || defaultVisionMission;
    const displayBookItems = bookItems || defaultBookItems;

    const [openIndex, setOpenIndex] = useState<number | null>(0); // First item open by default

    const handleToggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="bookus-section bg-dark">
            <div className="container">
                <div className="row align-items-center row-gap-4">
                    {/* Left: Images Grid */}
                    <div className="col-lg-6">
                        <div className="bookus-img">
                            <div className="row g-3">
                                <div className="col-md-12 aos" data-aos="fade-up">
                                    <img
                                        src={displayImages.large}
                                        alt="img"
                                        className="img-fluid"
                                    />
                                </div>
                                <div className="col-sm-6 aos" data-aos="fade-up">
                                    <img
                                        src={displayImages.small1}
                                        alt="img"
                                        className="img-fluid"
                                    />
                                </div>
                                <div className="col-sm-6 aos" data-aos="fade-up">
                                    <img
                                        src={displayImages.small2}
                                        alt="img"
                                        className="img-fluid"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Content */}
                    <div className="col-lg-6">
                        <div className="section-header sec-header-one mb-2 aos" data-aos="fade-up">
                            <span className="badge badge-primary">{t('bookus.badge')}</span>
                            <h2 className="text-white mb-3">
                                {t('bookus.title')}{' '}
                                <span className="text-primary-gradient">
                                    {t('bookus.titleHighlight')}
                                </span>
                            </h2>
                        </div>
                        <p className="text-light mb-4">{t('bookus.description')}</p>
                        <div className="faq-info aos" data-aos="fade-up">
                            <div className="accordion" id="faq-details">
                                {displayVisionMission.map((item, index) => {
                                    const isOpen = openIndex === index;
                                    const headingId = `heading${item.id}`;
                                    const collapseId = `collapse${item.id}`;

                                    return (
                                        <div key={item.id} className="accordion-item">
                                            <h2 className="accordion-header" id={headingId}>
                                                <button
                                                    type="button"
                                                    className={`accordion-button ${isOpen ? '' : 'collapsed'}`}
                                                    onClick={() => handleToggle(index)}
                                                    aria-expanded={isOpen}
                                                    aria-controls={collapseId}
                                                >
                                                    {item.number} . {item.title}
                                                </button>
                                            </h2>
                                            <div
                                                id={collapseId}
                                                className={`accordion-collapse collapse ${isOpen ? 'show' : ''}`}
                                                aria-labelledby={headingId}
                                                data-bs-parent="#faq-details"
                                            >
                                                <div className="accordion-body">
                                                    <div className="accordion-content">
                                                        <p>{item.description}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Book Items */}
                <div className="bookus-sec">
                    <div className="row g-4">
                        {displayBookItems.map((item) => (
                            <div key={item.id} className="col-lg-3">
                                <div className="book-item">
                                    <div className={`book-icon ${item.iconClass}`}>
                                        <i className={item.icon}></i>
                                    </div>
                                    <div className="book-info">
                                        <h6 className="text-white mb-2">{item.title}</h6>
                                        <p className="fs-14 text-light">{item.description}</p>
                                    </div>
                                    {item.showWayIcon && (
                                        <div className="way-icon">
                                            <img
                                                src="/src/assets/img/icons/way-icon.svg"
                                                alt="way"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BookusSection;
