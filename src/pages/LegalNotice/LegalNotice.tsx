import React from 'react';
import { useTranslation } from 'react-i18next';
import Breadcrumb from '@/components/Breadcrumb';
import MainLayout from '@/layouts/MainLayout';
import { PATHS } from '@/routes/paths';

const LegalNotice: React.FC = () => {
    const { t } = useTranslation('legalNotice');

    return (
        <div>
            <MainLayout>
                <Breadcrumb
                    items={[
                        { label: t('breadcrumb.home'), path: PATHS.HOME },
                        { label: t('breadcrumb.current'), isActive: true },
                    ]}
                    title={t('title')}
                />

                <div className="terms-section">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="terms-text">
                                    <h6>{t('sections.companyInfo.title')}</h6>
                                    <p>{t('sections.companyInfo.description')}</p>
                                    <ul>
                                        <li>
                                            <strong>
                                                {t('sections.companyInfo.items.companyName')}:
                                            </strong>{' '}
                                            {t('sections.companyInfo.items.companyNameValue')}
                                        </li>
                                        <li>
                                            <strong>
                                                {t('sections.companyInfo.items.address')}:
                                            </strong>{' '}
                                            {t('sections.companyInfo.items.addressValue')}
                                        </li>
                                        <li>
                                            <strong>
                                                {t('sections.companyInfo.items.email')}:
                                            </strong>{' '}
                                            {t('sections.companyInfo.items.emailValue')}
                                        </li>
                                        <li>
                                            <strong>
                                                {t('sections.companyInfo.items.hotline')}:
                                            </strong>{' '}
                                            {t('sections.companyInfo.items.hotlineValue')}
                                        </li>
                                    </ul>
                                </div>
                                <div className="terms-text terms-list">
                                    <h6>{t('sections.purpose.title')}</h6>
                                    <p>{t('sections.purpose.description')}</p>
                                </div>
                                <div className="terms-text terms-list">
                                    <h6>{t('sections.userResponsibilities.title')}</h6>
                                    <p>{t('sections.userResponsibilities.description')}</p>
                                    <ul>
                                        {(
                                            t('sections.userResponsibilities.items', {
                                                returnObjects: true,
                                            }) as string[]
                                        ).map((item: string, index: number) => (
                                            <li key={index}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="terms-text terms-list">
                                    <h6>{t('sections.bookingcareResponsibilities.title')}</h6>
                                    <p>{t('sections.bookingcareResponsibilities.description')}</p>
                                    <ul>
                                        {(
                                            t('sections.bookingcareResponsibilities.items', {
                                                returnObjects: true,
                                            }) as string[]
                                        ).map((item: string, index: number) => (
                                            <li key={index}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="terms-text">
                                    <h6>{t('sections.liabilityLimitation.title')}</h6>
                                    <p>{t('sections.liabilityLimitation.description1')}</p>
                                    <p>{t('sections.liabilityLimitation.description2')}</p>
                                </div>
                                <div className="terms-text">
                                    <h6>{t('sections.intellectualProperty.title')}</h6>
                                    <p>{t('sections.intellectualProperty.description')}</p>
                                </div>
                                <div className="terms-text">
                                    <h6>{t('sections.changes.title')}</h6>
                                    <p>{t('sections.changes.description')}</p>
                                </div>
                                <div className="terms-text">
                                    <h6>{t('sections.lawAndDisputes.title')}</h6>
                                    <p>{t('sections.lawAndDisputes.description')}</p>
                                </div>
                                <div className="terms-text terms-list">
                                    <h6>{t('sections.contact.title')}</h6>
                                    <p>{t('sections.contact.description')}</p>
                                    <ul>
                                        <li>
                                            <strong>{t('sections.contact.email')}:</strong>{' '}
                                            {t('sections.contact.emailValue')}
                                        </li>
                                        <li>
                                            <strong>{t('sections.contact.hotline')}:</strong>{' '}
                                            {t('sections.contact.hotlineValue')}
                                        </li>
                                        <li>
                                            <strong>{t('sections.contact.address')}:</strong>{' '}
                                            {t('sections.contact.addressValue')}
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </MainLayout>
        </div>
    );
};

export default LegalNotice;
