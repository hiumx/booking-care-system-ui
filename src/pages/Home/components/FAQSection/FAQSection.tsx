import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface FAQItem {
    id: string | number;
    question: string;
    answer: string;
}

interface FAQSectionProps {
    faqs?: FAQItem[];
}

const FAQSection: React.FC<FAQSectionProps> = ({ faqs }) => {
    const { t } = useTranslation('home');

    // Get FAQs from translation
    const translatedFAQs = t('faq.items', {
        returnObjects: true,
    }) as Array<{ question: string; answer: string }>;

    const defaultFAQs: FAQItem[] = translatedFAQs.map((item, index) => ({
        id: index + 1,
        ...item,
    }));

    const displayFAQs = faqs || defaultFAQs;
    const [openIndex, setOpenIndex] = useState<number | null>(0); // First item open by default

    const handleToggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="faq-section-one">
            <div className="container">
                <div className="section-header sec-header-one text-center aos" data-aos="fade-up">
                    <span className="badge badge-primary">{t('faq.badge')}</span>
                    <h2>{t('faq.title')}</h2>
                </div>
                <div className="row">
                    <div className="col-md-10 mx-auto">
                        <div className="faq-info aos" data-aos="fade-up">
                            <div className="accordion" id="faq-details">
                                {displayFAQs.map((faq, index) => {
                                    const isOpen = openIndex === index;
                                    const headingId = `heading${faq.id}`;
                                    const collapseId = `collapse${faq.id}`;

                                    return (
                                        <div key={faq.id} className="accordion-item">
                                            <h2 className="accordion-header" id={headingId}>
                                                <button
                                                    type="button"
                                                    className={`accordion-button ${isOpen ? '' : 'collapsed'}`}
                                                    onClick={() => handleToggle(index)}
                                                    aria-expanded={isOpen}
                                                    aria-controls={collapseId}
                                                >
                                                    {faq.question}
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
                                                        <p>{faq.answer}</p>
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
            </div>
        </section>
    );
};

export default FAQSection;
