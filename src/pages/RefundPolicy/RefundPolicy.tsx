import React from 'react';
import { useTranslation } from 'react-i18next';
import Breadcrumb from '@/components/Breadcrumb';
import MainLayout from '@/layouts/MainLayout';
import { PATHS } from '@/routes/paths';

const RefundPolicy: React.FC = () => {
    const { t } = useTranslation('refundPolicy');

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
                                    <h6>{t('sections.overview.title')}</h6>
                                    <p>{t('sections.overview.description')}</p>
                                </div>
                                <div className="terms-text">
                                    <h6>{t('sections.refundRules.title')}</h6>
                                    <p>{t('sections.refundRules.description')}</p>

                                    <div className="card mb-3">
                                        <div className="card-body">
                                            <div className="d-flex align-items-center mb-3">
                                                <div
                                                    className="badge bg-success me-3"
                                                    style={{
                                                        fontSize: '1.2rem',
                                                        padding: '0.5rem 1rem',
                                                    }}
                                                >
                                                    100%
                                                </div>
                                                <div>
                                                    <h5 className="mb-1">
                                                        {t('sections.refundRules.refund100.title')}
                                                    </h5>
                                                    <p
                                                        className="mb-0 text-muted"
                                                        dangerouslySetInnerHTML={{
                                                            __html: t(
                                                                'sections.refundRules.refund100.description'
                                                            ),
                                                        }}
                                                    ></p>
                                                </div>
                                            </div>
                                            <p className="mb-0">
                                                <strong>
                                                    {t('sections.refundRules.refund100.example')}:
                                                </strong>{' '}
                                                {t('sections.refundRules.refund100.exampleValue')}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="card mb-3">
                                        <div className="card-body">
                                            <div className="d-flex align-items-center mb-3">
                                                <div
                                                    className="badge bg-warning me-3"
                                                    style={{
                                                        fontSize: '1.2rem',
                                                        padding: '0.5rem 1rem',
                                                    }}
                                                >
                                                    50%
                                                </div>
                                                <div>
                                                    <h5 className="mb-1">
                                                        {t('sections.refundRules.refund50.title')}
                                                    </h5>
                                                    <p
                                                        className="mb-0 text-muted"
                                                        dangerouslySetInnerHTML={{
                                                            __html: t(
                                                                'sections.refundRules.refund50.description'
                                                            ),
                                                        }}
                                                    ></p>
                                                </div>
                                            </div>
                                            <p className="mb-0">
                                                <strong>
                                                    {t('sections.refundRules.refund50.example')}:
                                                </strong>{' '}
                                                {t('sections.refundRules.refund50.exampleValue')}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="card mb-3">
                                        <div className="card-body">
                                            <div className="d-flex align-items-center mb-3">
                                                <div
                                                    className="badge bg-danger me-3"
                                                    style={{
                                                        fontSize: '1.2rem',
                                                        padding: '0.5rem 1rem',
                                                    }}
                                                >
                                                    0%
                                                </div>
                                                <div>
                                                    <h5 className="mb-1">
                                                        {t('sections.refundRules.refund0.title')}
                                                    </h5>
                                                    <p
                                                        className="mb-0 text-muted"
                                                        dangerouslySetInnerHTML={{
                                                            __html: t(
                                                                'sections.refundRules.refund0.description'
                                                            ),
                                                        }}
                                                    ></p>
                                                </div>
                                            </div>
                                            <p className="mb-0">
                                                <strong>
                                                    {t('sections.refundRules.refund0.example')}:
                                                </strong>{' '}
                                                {t('sections.refundRules.refund0.exampleValue')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="terms-text">
                                    <h6>{t('sections.specialCases.title')}</h6>
                                    <h5 className="mb-2">
                                        {t('sections.specialCases.hospitalCancel.subtitle')}
                                    </h5>
                                    <p>
                                        <strong>
                                            {t('sections.specialCases.hospitalCancel.title')}:
                                        </strong>{' '}
                                        {t('sections.specialCases.hospitalCancel.description1')}
                                    </p>
                                    <p>{t('sections.specialCases.hospitalCancel.description2')}</p>

                                    <h5 className="mb-2 mt-4">
                                        {t('sections.specialCases.pastAppointment.subtitle')}
                                    </h5>
                                    <p>{t('sections.specialCases.pastAppointment.description')}</p>
                                </div>
                                <div className="terms-text terms-list">
                                    <h6>{t('sections.refundProcess.title')}</h6>
                                    <ol>
                                        {(
                                            t('sections.refundProcess.items', {
                                                returnObjects: true,
                                            }) as Array<{ title: string; description: string }>
                                        ).map(
                                            (
                                                item: { title: string; description: string },
                                                index: number
                                            ) => (
                                                <li key={index}>
                                                    <strong>{item.title}:</strong>{' '}
                                                    {item.description}
                                                </li>
                                            )
                                        )}
                                    </ol>
                                </div>
                                <div className="terms-text terms-list">
                                    <h6>{t('sections.refundMethods.title')}</h6>
                                    <p>{t('sections.refundMethods.description')}</p>
                                    <ul>
                                        <li>
                                            <strong>
                                                {t('sections.refundMethods.items.creditCard')}:
                                            </strong>{' '}
                                            {t('sections.refundMethods.items.creditCardValue')}
                                        </li>
                                        <li>
                                            <strong>
                                                {t('sections.refundMethods.items.eWallet')}:
                                            </strong>{' '}
                                            {t('sections.refundMethods.items.eWalletValue')}
                                        </li>
                                        <li>
                                            <strong>
                                                {t('sections.refundMethods.items.bankTransfer')}:
                                            </strong>{' '}
                                            {t('sections.refundMethods.items.bankTransferValue')}
                                        </li>
                                    </ul>
                                    <p className="mt-3">
                                        <strong>{t('sections.refundMethods.note')}:</strong>{' '}
                                        {t('sections.refundMethods.noteValue')}
                                    </p>
                                </div>
                                <div className="terms-text">
                                    <h6>{t('sections.processingFee.title')}</h6>
                                    <p
                                        dangerouslySetInnerHTML={{
                                            __html: t('sections.processingFee.description1'),
                                        }}
                                    ></p>
                                    <p>{t('sections.processingFee.description2')}</p>
                                </div>
                                <div className="terms-text terms-list">
                                    <h6>{t('sections.complaints.title')}</h6>
                                    <p>{t('sections.complaints.description')}</p>
                                    <ul>
                                        <li>
                                            <strong>{t('sections.complaints.email')}:</strong>{' '}
                                            {t('sections.complaints.emailValue')}
                                        </li>
                                        <li>
                                            <strong>{t('sections.complaints.hotline')}:</strong>{' '}
                                            {t('sections.complaints.hotlineValue')}
                                        </li>
                                        <li>
                                            <strong>
                                                {t('sections.complaints.supportHours')}:
                                            </strong>{' '}
                                            {t('sections.complaints.supportHoursValue')}
                                        </li>
                                    </ul>
                                    <p className="mt-3">{t('sections.complaints.commitment')}</p>
                                </div>
                                <div className="terms-text terms-list">
                                    <h6>{t('sections.noRefundCases.title')}</h6>
                                    <p>{t('sections.noRefundCases.description')}</p>
                                    <ul>
                                        {(
                                            t('sections.noRefundCases.items', {
                                                returnObjects: true,
                                            }) as string[]
                                        ).map((item: string, index: number) => (
                                            <li key={index}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="terms-text">
                                    <h6>{t('sections.policyChanges.title')}</h6>
                                    <p>{t('sections.policyChanges.description')}</p>
                                </div>
                                <div className="terms-text">
                                    <h6>{t('sections.additionalTerms.title')}</h6>
                                    <p>{t('sections.additionalTerms.description1')}</p>
                                    <p>{t('sections.additionalTerms.description2')}</p>
                                </div>
                                <div className="alert alert-info">
                                    <h5 className="alert-heading">
                                        <i className="isax isax-info-circle me-2"></i>
                                        {t('sections.importantNote.title')}
                                    </h5>
                                    <p className="mb-0">
                                        {t('sections.importantNote.description')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </MainLayout>
        </div>
    );
};

export default RefundPolicy;
