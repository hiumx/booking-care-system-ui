import React from 'react';
import { useTranslation } from 'react-i18next';
import Breadcrumb from '@/components/Breadcrumb';
import MainLayout from '@/layouts/MainLayout';
import { PATHS } from '@/routes/paths';

const PrivacyPolicy: React.FC = () => {
    const { t } = useTranslation('privacyPolicy');

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
                                    <h6>{t('sections.introduction.title')}</h6>
                                    <p>{t('sections.introduction.description')}</p>
                                </div>
                                <div className="terms-text terms-list">
                                    <h6>{t('sections.informationCollection.title')}</h6>
                                    <h5 className="mb-2">
                                        {t('sections.informationCollection.subtitle')}
                                    </h5>
                                    <p>{t('sections.informationCollection.description')}</p>
                                    <ul>
                                        <li>
                                            <strong>
                                                {t(
                                                    'sections.informationCollection.items.registration'
                                                )}
                                                :
                                            </strong>{' '}
                                            {t(
                                                'sections.informationCollection.items.registrationValue'
                                            )}
                                        </li>
                                        <li>
                                            <strong>
                                                {t('sections.informationCollection.items.medical')}:
                                            </strong>{' '}
                                            {t('sections.informationCollection.items.medicalValue')}
                                        </li>
                                        <li>
                                            <strong>
                                                {t('sections.informationCollection.items.payment')}:
                                            </strong>{' '}
                                            {t('sections.informationCollection.items.paymentValue')}
                                        </li>
                                        <li>
                                            <strong>
                                                {t(
                                                    'sections.informationCollection.items.technical'
                                                )}
                                                :
                                            </strong>{' '}
                                            {t(
                                                'sections.informationCollection.items.technicalValue'
                                            )}
                                        </li>
                                    </ul>
                                </div>
                                <div className="terms-text terms-list">
                                    <h6>{t('sections.informationUsage.title')}</h6>
                                    <p>{t('sections.informationUsage.description')}</p>
                                    <ul>
                                        {(
                                            t('sections.informationUsage.items', {
                                                returnObjects: true,
                                            }) as string[]
                                        ).map((item: string, index: number) => (
                                            <li key={index}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="terms-text terms-list">
                                    <h6>{t('sections.informationSharing.title')}</h6>
                                    <p>{t('sections.informationSharing.description')}</p>
                                    <ul>
                                        <li>
                                            <strong>
                                                {t('sections.informationSharing.items.healthcare')}:
                                            </strong>{' '}
                                            {t('sections.informationSharing.items.healthcareValue')}
                                        </li>
                                        <li>
                                            <strong>
                                                {t('sections.informationSharing.items.partners')}:
                                            </strong>{' '}
                                            {t('sections.informationSharing.items.partnersValue')}
                                        </li>
                                        <li>
                                            <strong>
                                                {t('sections.informationSharing.items.legal')}:
                                            </strong>{' '}
                                            {t('sections.informationSharing.items.legalValue')}
                                        </li>
                                        <li>
                                            <strong>
                                                {t('sections.informationSharing.items.protection')}:
                                            </strong>{' '}
                                            {t('sections.informationSharing.items.protectionValue')}
                                        </li>
                                    </ul>
                                </div>
                                <div className="terms-text terms-list">
                                    <h6>{t('sections.informationSecurity.title')}</h6>
                                    <p>{t('sections.informationSecurity.description')}</p>
                                    <ul>
                                        {(
                                            t('sections.informationSecurity.items', {
                                                returnObjects: true,
                                            }) as string[]
                                        ).map((item: string, index: number) => (
                                            <li key={index}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="terms-text terms-list">
                                    <h6>{t('sections.userRights.title')}</h6>
                                    <p>{t('sections.userRights.description')}</p>
                                    <ul>
                                        <li>
                                            <strong>
                                                {t('sections.userRights.items.access')}:
                                            </strong>{' '}
                                            {t('sections.userRights.items.accessValue')}
                                        </li>
                                        <li>
                                            <strong>{t('sections.userRights.items.edit')}:</strong>{' '}
                                            {t('sections.userRights.items.editValue')}
                                        </li>
                                        <li>
                                            <strong>
                                                {t('sections.userRights.items.delete')}:
                                            </strong>{' '}
                                            {t('sections.userRights.items.deleteValue')}
                                        </li>
                                        <li>
                                            <strong>
                                                {t('sections.userRights.items.withdraw')}:
                                            </strong>{' '}
                                            {t('sections.userRights.items.withdrawValue')}
                                        </li>
                                        <li>
                                            <strong>
                                                {t('sections.userRights.items.complaint')}:
                                            </strong>{' '}
                                            {t('sections.userRights.items.complaintValue')}
                                        </li>
                                    </ul>
                                    <p className="mt-3">
                                        {t('sections.userRights.contactEmail')}{' '}
                                        <strong>{t('sections.userRights.email')}</strong>
                                    </p>
                                </div>
                                <div className="terms-text">
                                    <h6>{t('sections.cookies.title')}</h6>
                                    <p>{t('sections.cookies.description')}</p>
                                </div>
                                <div className="terms-text">
                                    <h6>{t('sections.storage.title')}</h6>
                                    <p>{t('sections.storage.description')}</p>
                                </div>
                                <div className="terms-text">
                                    <h6>{t('sections.children.title')}</h6>
                                    <p>{t('sections.children.description')}</p>
                                </div>
                                <div className="terms-text">
                                    <h6>{t('sections.policyChanges.title')}</h6>
                                    <p>{t('sections.policyChanges.description')}</p>
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

export default PrivacyPolicy;
