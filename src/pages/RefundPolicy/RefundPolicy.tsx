import React from 'react';
import {
    PolicyPageLayout,
    TermsTextSection,
    TermsListSection,
    TermsKeyValueList,
    ContactSection,
} from '@/components/PolicyPage';
import { usePolicyPageData } from '@/components/PolicyPage/usePolicyPageData';

const RefundPolicy: React.FC = () => {
    const { t, getContactInfo, getKeyValueItems } = usePolicyPageData('refundPolicy');

    const refundProcessItems = t('sections.refundProcess.items', {
        returnObjects: true,
    }) as Array<{ title: string; description: string }>;

    const noRefundCasesItems = t('sections.noRefundCases.items', {
        returnObjects: true,
    }) as string[];

    const refundMethodsItems = getKeyValueItems([
        {
            keyPath: 'sections.refundMethods.items.creditCard',
            valuePath: 'sections.refundMethods.items.creditCardValue',
        },
        {
            keyPath: 'sections.refundMethods.items.eWallet',
            valuePath: 'sections.refundMethods.items.eWalletValue',
        },
        {
            keyPath: 'sections.refundMethods.items.bankTransfer',
            valuePath: 'sections.refundMethods.items.bankTransferValue',
        },
    ]);

    const complaintsInfo = getContactInfo({
        email: 'sections.complaints.email',
        emailValue: 'sections.complaints.emailValue',
        hotline: 'sections.complaints.hotline',
        hotlineValue: 'sections.complaints.hotlineValue',
        address: 'sections.complaints.supportHours',
        addressValue: 'sections.complaints.supportHoursValue',
    });

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
                    {refundProcessItems.map((item) => (
                        <li key={`${item.title}-${item.description}`}>
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
            <ContactSection
                title={t('sections.complaints.title')}
                description={t('sections.complaints.description')}
                contacts={complaintsInfo}
            >
                <p className="mt-3">{t('sections.complaints.commitment')}</p>
            </ContactSection>
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
