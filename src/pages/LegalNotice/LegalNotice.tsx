import React from 'react';
import { useTranslation } from 'react-i18next';
import {
    PolicyPageLayout,
    TermsTextSection,
    TermsListSection,
    ContactSection,
    TermsKeyValueList,
} from '@/components/PolicyPage';

const LegalNotice: React.FC = () => {
    const { t } = useTranslation('legalNotice');

    const userResponsibilitiesItems = t('sections.userResponsibilities.items', {
        returnObjects: true,
    }) as string[];

    const bookingcareResponsibilitiesItems = t('sections.bookingcareResponsibilities.items', {
        returnObjects: true,
    }) as string[];

    const companyInfoItems = [
        {
            key: t('sections.companyInfo.items.companyName'),
            value: t('sections.companyInfo.items.companyNameValue'),
        },
        {
            key: t('sections.companyInfo.items.address'),
            value: t('sections.companyInfo.items.addressValue'),
        },
        {
            key: t('sections.companyInfo.items.email'),
            value: t('sections.companyInfo.items.emailValue'),
        },
        {
            key: t('sections.companyInfo.items.hotline'),
            value: t('sections.companyInfo.items.hotlineValue'),
        },
    ];

    const contactInfo = [
        {
            label: t('sections.contact.email'),
            value: t('sections.contact.emailValue'),
        },
        {
            label: t('sections.contact.hotline'),
            value: t('sections.contact.hotlineValue'),
        },
        {
            label: t('sections.contact.address'),
            value: t('sections.contact.addressValue'),
        },
    ];

    return (
        <PolicyPageLayout namespace="legalNotice">
            <TermsKeyValueList
                title={t('sections.companyInfo.title')}
                description={t('sections.companyInfo.description')}
                items={companyInfoItems}
            />
            <TermsTextSection
                title={t('sections.purpose.title')}
                description={t('sections.purpose.description')}
                className="terms-list"
            />
            <TermsListSection
                title={t('sections.userResponsibilities.title')}
                description={t('sections.userResponsibilities.description')}
                items={userResponsibilitiesItems}
            />
            <TermsListSection
                title={t('sections.bookingcareResponsibilities.title')}
                description={t('sections.bookingcareResponsibilities.description')}
                items={bookingcareResponsibilitiesItems}
            />
            <TermsTextSection
                title={t('sections.liabilityLimitation.title')}
                descriptions={[
                    t('sections.liabilityLimitation.description1'),
                    t('sections.liabilityLimitation.description2'),
                ]}
            />
            <TermsTextSection
                title={t('sections.intellectualProperty.title')}
                description={t('sections.intellectualProperty.description')}
            />
            <TermsTextSection
                title={t('sections.changes.title')}
                description={t('sections.changes.description')}
            />
            <TermsTextSection
                title={t('sections.lawAndDisputes.title')}
                description={t('sections.lawAndDisputes.description')}
            />
            <ContactSection
                title={t('sections.contact.title')}
                description={t('sections.contact.description')}
                contacts={contactInfo}
            />
        </PolicyPageLayout>
    );
};

export default LegalNotice;
