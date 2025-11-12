import React from 'react';
import {
    PolicyPageLayout,
    TermsTextSection,
    TermsListSection,
    ContactSection,
    TermsKeyValueList,
} from '@/components/PolicyPage';
import { usePolicyPageData } from '@/components/PolicyPage/usePolicyPageData';

const LegalNotice: React.FC = () => {
    const { t, getContactInfo, getKeyValueItems } = usePolicyPageData('legalNotice');

    const userResponsibilitiesItems = t('sections.userResponsibilities.items', {
        returnObjects: true,
    }) as string[];

    const bookingcareResponsibilitiesItems = t('sections.bookingcareResponsibilities.items', {
        returnObjects: true,
    }) as string[];

    const companyInfoItems = getKeyValueItems([
        {
            keyPath: 'sections.companyInfo.items.companyName',
            valuePath: 'sections.companyInfo.items.companyNameValue',
        },
        {
            keyPath: 'sections.companyInfo.items.address',
            valuePath: 'sections.companyInfo.items.addressValue',
        },
        {
            keyPath: 'sections.companyInfo.items.email',
            valuePath: 'sections.companyInfo.items.emailValue',
        },
        {
            keyPath: 'sections.companyInfo.items.hotline',
            valuePath: 'sections.companyInfo.items.hotlineValue',
        },
    ]);

    const contactInfo = getContactInfo({
        email: 'sections.contact.email',
        emailValue: 'sections.contact.emailValue',
        hotline: 'sections.contact.hotline',
        hotlineValue: 'sections.contact.hotlineValue',
        address: 'sections.contact.address',
        addressValue: 'sections.contact.addressValue',
    });

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
