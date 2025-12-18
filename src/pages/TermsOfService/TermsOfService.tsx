import React from 'react';
import {
    PolicyPageLayout,
    TermsTextSection,
    TermsListSection,
    ContactSection,
    TermsKeyValueList,
} from '@/components/PolicyPage';
import { usePolicyPageData } from '@/components/PolicyPage/usePolicyPageData';

const TermsOfService: React.FC = () => {
    const { t, getContactInfo, getKeyValueItems } = usePolicyPageData('termsOfService');

    const definitionItems = getKeyValueItems([
        {
            keyPath: 'sections.definitions.items.service',
            valuePath: 'sections.definitions.items.serviceValue',
        },
        {
            keyPath: 'sections.definitions.items.user',
            valuePath: 'sections.definitions.items.userValue',
        },
        {
            keyPath: 'sections.definitions.items.healthcare',
            valuePath: 'sections.definitions.items.healthcareValue',
        },
        {
            keyPath: 'sections.definitions.items.content',
            valuePath: 'sections.definitions.items.contentValue',
        },
    ]);

    const accountRegistrationItems = t('sections.accountRegistration.items', {
        returnObjects: true,
    }) as string[];

    const serviceUsageItems = t('sections.serviceUsage.items', {
        returnObjects: true,
    }) as string[];

    const bookingPolicyItems = getKeyValueItems([
        {
            keyPath: 'sections.bookingPolicy.items.confirmation',
            valuePath: 'sections.bookingPolicy.items.confirmationValue',
        },
        {
            keyPath: 'sections.bookingPolicy.items.cancellation',
            valuePath: 'sections.bookingPolicy.items.cancellationValue',
        },
        {
            keyPath: 'sections.bookingPolicy.items.reschedule',
            valuePath: 'sections.bookingPolicy.items.rescheduleValue',
        },
        {
            keyPath: 'sections.bookingPolicy.items.noShow',
            valuePath: 'sections.bookingPolicy.items.noShowValue',
        },
    ]);

    const paymentTermsItems = t('sections.paymentTerms.items', {
        returnObjects: true,
    }) as string[];

    const disclaimerItems = t('sections.disclaimer.items', {
        returnObjects: true,
    }) as string[];

    const terminationItems = t('sections.termination.items', {
        returnObjects: true,
    }) as string[];

    const contactInfo = getContactInfo({
        email: 'sections.contact.email',
        emailValue: 'sections.contact.emailValue',
        hotline: 'sections.contact.hotline',
        hotlineValue: 'sections.contact.hotlineValue',
        address: 'sections.contact.address',
        addressValue: 'sections.contact.addressValue',
    });

    return (
        <PolicyPageLayout namespace="termsOfService">
            <TermsTextSection
                title={t('sections.introduction.title')}
                description={t('sections.introduction.description')}
            />
            <TermsKeyValueList
                title={t('sections.definitions.title')}
                description={t('sections.definitions.description')}
                items={definitionItems}
            />
            <TermsListSection
                title={t('sections.accountRegistration.title')}
                description={t('sections.accountRegistration.description')}
                items={accountRegistrationItems}
            />
            <TermsListSection
                title={t('sections.serviceUsage.title')}
                description={t('sections.serviceUsage.description')}
                items={serviceUsageItems}
            />
            <TermsKeyValueList
                title={t('sections.bookingPolicy.title')}
                description={t('sections.bookingPolicy.description')}
                items={bookingPolicyItems}
            />
            <TermsListSection
                title={t('sections.paymentTerms.title')}
                description={t('sections.paymentTerms.description')}
                items={paymentTermsItems}
            />
            <TermsTextSection
                title={t('sections.intellectualProperty.title')}
                description={t('sections.intellectualProperty.description')}
            />
            <TermsListSection
                title={t('sections.disclaimer.title')}
                description={t('sections.disclaimer.description')}
                items={disclaimerItems}
            />
            <TermsTextSection
                title={t('sections.limitation.title')}
                description={t('sections.limitation.description')}
            />
            <TermsListSection
                title={t('sections.termination.title')}
                description={t('sections.termination.description')}
                items={terminationItems}
            />
            <TermsTextSection
                title={t('sections.changes.title')}
                description={t('sections.changes.description')}
            />
            <TermsTextSection
                title={t('sections.governingLaw.title')}
                description={t('sections.governingLaw.description')}
            />
            <ContactSection
                title={t('sections.contact.title')}
                description={t('sections.contact.description')}
                contacts={contactInfo}
            />
        </PolicyPageLayout>
    );
};

export default TermsOfService;
