import React from 'react';
import { useTranslation } from 'react-i18next';
import {
    PolicyPageLayout,
    TermsTextSection,
    TermsListSection,
    TermsKeyValueList,
} from '@/components/PolicyPage';

const RefundPolicy: React.FC = () => {
    const { t } = useTranslation('refundPolicy');

    const refundProcessItems = t('sections.refundProcess.items', {
        returnObjects: true,
    }) as Array<{ title: string; description: string }>;

    const noRefundCasesItems = t('sections.noRefundCases.items', {
        returnObjects: true,
    }) as string[];

    const refundMethodsItems = [
        {
            key: t('sections.refundMethods.items.creditCard'),
            value: t('sections.refundMethods.items.creditCardValue'),
        },
        {
            key: t('sections.refundMethods.items.eWallet'),
            value: t('sections.refundMethods.items.eWalletValue'),
        },
        {
            key: t('sections.refundMethods.items.bankTransfer'),
            value: t('sections.refundMethods.items.bankTransferValue'),
        },
    ];

    const complaintsInfo = [
        {
            label: t('sections.complaints.email'),
            value: t('sections.complaints.emailValue'),
        },
        {
            label: t('sections.complaints.hotline'),
            value: t('sections.complaints.hotlineValue'),
        },
        {
            label: t('sections.complaints.supportHours'),
            value: t('sections.complaints.supportHoursValue'),
        },
    ];

    const renderRefundCard = (
        percentage: string,
        badgeClass: string,
        titleKey: string,
        descriptionKey: string,
        exampleKey: string,
        exampleValueKey: string
    ) => {
        return (
            <div className="card mb-3">
                <div className="card-body">
                    <div className="d-flex align-items-center mb-3">
                        <div
                            className={`badge ${badgeClass} me-3`}
                            style={{
                                fontSize: '1.2rem',
                                padding: '0.5rem 1rem',
                            }}
                        >
                            {percentage}
                        </div>
                        <div>
                            <h5 className="mb-1">{t(titleKey)}</h5>
                            <p
                                className="mb-0 text-muted"
                                dangerouslySetInnerHTML={{ __html: t(descriptionKey) }}
                            ></p>
                        </div>
                    </div>
                    <p className="mb-0">
                        <strong>{t(exampleKey)}:</strong> {t(exampleValueKey)}
                    </p>
                </div>
            </div>
        );
    };

    return (
        <PolicyPageLayout namespace="refundPolicy">
            <TermsTextSection
                title={t('sections.overview.title')}
                description={t('sections.overview.description')}
            />
            <div className="terms-text">
                <h6>{t('sections.refundRules.title')}</h6>
                <p>{t('sections.refundRules.description')}</p>

                {renderRefundCard(
                    '100%',
                    'bg-success',
                    'sections.refundRules.refund100.title',
                    'sections.refundRules.refund100.description',
                    'sections.refundRules.refund100.example',
                    'sections.refundRules.refund100.exampleValue'
                )}

                {renderRefundCard(
                    '50%',
                    'bg-warning',
                    'sections.refundRules.refund50.title',
                    'sections.refundRules.refund50.description',
                    'sections.refundRules.refund50.example',
                    'sections.refundRules.refund50.exampleValue'
                )}

                {renderRefundCard(
                    '0%',
                    'bg-danger',
                    'sections.refundRules.refund0.title',
                    'sections.refundRules.refund0.description',
                    'sections.refundRules.refund0.example',
                    'sections.refundRules.refund0.exampleValue'
                )}
            </div>
            <TermsTextSection title={t('sections.specialCases.title')} className="terms-text">
                <h5 className="mb-2">{t('sections.specialCases.hospitalCancel.subtitle')}</h5>
                <p>
                    <strong>{t('sections.specialCases.hospitalCancel.title')}:</strong>{' '}
                    {t('sections.specialCases.hospitalCancel.description1')}
                </p>
                <p>{t('sections.specialCases.hospitalCancel.description2')}</p>

                <h5 className="mb-2 mt-4">{t('sections.specialCases.pastAppointment.subtitle')}</h5>
                <p>{t('sections.specialCases.pastAppointment.description')}</p>
            </TermsTextSection>
            <div className="terms-text terms-list">
                <h6>{t('sections.refundProcess.title')}</h6>
                <ol>
                    {refundProcessItems.map((item, index) => (
                        <li key={index}>
                            <strong>{item.title}:</strong> {item.description}
                        </li>
                    ))}
                </ol>
            </div>
            <TermsKeyValueList
                title={t('sections.refundMethods.title')}
                description={t('sections.refundMethods.description')}
                items={refundMethodsItems}
            >
                <p className="mt-3">
                    <strong>{t('sections.refundMethods.note')}:</strong>{' '}
                    {t('sections.refundMethods.noteValue')}
                </p>
            </TermsKeyValueList>
            <TermsTextSection title={t('sections.processingFee.title')}>
                <p
                    dangerouslySetInnerHTML={{ __html: t('sections.processingFee.description1') }}
                ></p>
                <p>{t('sections.processingFee.description2')}</p>
            </TermsTextSection>
            <div className="terms-text terms-list">
                <h6>{t('sections.complaints.title')}</h6>
                <p>{t('sections.complaints.description')}</p>
                <ul>
                    {complaintsInfo.map((contact, index) => (
                        <li key={index}>
                            <strong>{contact.label}:</strong> {contact.value}
                        </li>
                    ))}
                </ul>
                <p className="mt-3">{t('sections.complaints.commitment')}</p>
            </div>
            <TermsListSection
                title={t('sections.noRefundCases.title')}
                description={t('sections.noRefundCases.description')}
                items={noRefundCasesItems}
            />
            <TermsTextSection
                title={t('sections.policyChanges.title')}
                description={t('sections.policyChanges.description')}
            />
            <TermsTextSection
                title={t('sections.additionalTerms.title')}
                descriptions={[
                    t('sections.additionalTerms.description1'),
                    t('sections.additionalTerms.description2'),
                ]}
            />
            <div className="alert alert-info">
                <h5 className="alert-heading">
                    <i className="isax isax-info-circle me-2"></i>
                    {t('sections.importantNote.title')}
                </h5>
                <p className="mb-0">{t('sections.importantNote.description')}</p>
            </div>
        </PolicyPageLayout>
    );
};

export default RefundPolicy;
