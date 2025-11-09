import React from 'react';
import {
    PolicyPageLayout,
    TermsTextSection,
    TermsListSection,
    ContactSection,
    TermsKeyValueList,
} from '@/components/PolicyPage';
import { usePolicyPageData } from '@/components/PolicyPage/usePolicyPageData';

const PrivacyPolicy: React.FC = () => {
    const { t, getContactInfo, getKeyValueItems } = usePolicyPageData('privacyPolicy');

    const informationUsageItems = t('sections.informationUsage.items', {
        returnObjects: true,
    }) as string[];

    const informationSecurityItems = t('sections.informationSecurity.items', {
        returnObjects: true,
    }) as string[];

    const informationCollectionItems = getKeyValueItems([
        {
            keyPath: 'sections.informationCollection.items.registration',
            valuePath: 'sections.informationCollection.items.registrationValue',
        },
        {
            keyPath: 'sections.informationCollection.items.medical',
            valuePath: 'sections.informationCollection.items.medicalValue',
        },
        {
            keyPath: 'sections.informationCollection.items.payment',
            valuePath: 'sections.informationCollection.items.paymentValue',
        },
        {
            keyPath: 'sections.informationCollection.items.technical',
            valuePath: 'sections.informationCollection.items.technicalValue',
        },
    ]);

    const informationSharingItems = getKeyValueItems([
        {
            keyPath: 'sections.informationSharing.items.healthcare',
            valuePath: 'sections.informationSharing.items.healthcareValue',
        },
        {
            keyPath: 'sections.informationSharing.items.partners',
            valuePath: 'sections.informationSharing.items.partnersValue',
        },
        {
            keyPath: 'sections.informationSharing.items.legal',
            valuePath: 'sections.informationSharing.items.legalValue',
        },
        {
            keyPath: 'sections.informationSharing.items.protection',
            valuePath: 'sections.informationSharing.items.protectionValue',
        },
    ]);

    const userRightsItems = getKeyValueItems([
        {
            keyPath: 'sections.userRights.items.access',
            valuePath: 'sections.userRights.items.accessValue',
        },
        {
            keyPath: 'sections.userRights.items.edit',
            valuePath: 'sections.userRights.items.editValue',
        },
        {
            keyPath: 'sections.userRights.items.delete',
            valuePath: 'sections.userRights.items.deleteValue',
        },
        {
            keyPath: 'sections.userRights.items.withdraw',
            valuePath: 'sections.userRights.items.withdrawValue',
        },
        {
            keyPath: 'sections.userRights.items.complaint',
            valuePath: 'sections.userRights.items.complaintValue',
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
        <PolicyPageLayout namespace="privacyPolicy">
            <TermsTextSection
                title={t('sections.introduction.title')}
                description={t('sections.introduction.description')}
            />
            <TermsKeyValueList
                title={t('sections.informationCollection.title')}
                subtitle={t('sections.informationCollection.subtitle')}
                description={t('sections.informationCollection.description')}
                items={informationCollectionItems}
            />
            <TermsListSection
                title={t('sections.informationUsage.title')}
                description={t('sections.informationUsage.description')}
                items={informationUsageItems}
            />
            <TermsKeyValueList
                title={t('sections.informationSharing.title')}
                description={t('sections.informationSharing.description')}
                items={informationSharingItems}
            />
            <TermsListSection
                title={t('sections.informationSecurity.title')}
                description={t('sections.informationSecurity.description')}
                items={informationSecurityItems}
            />
            <TermsKeyValueList
                title={t('sections.userRights.title')}
                description={t('sections.userRights.description')}
                items={userRightsItems}
            >
                <p className="mt-3">
                    {t('sections.userRights.contactEmail')}{' '}
                    <strong>{t('sections.userRights.email')}</strong>
                </p>
            </TermsKeyValueList>
            <TermsTextSection
                title={t('sections.cookies.title')}
                description={t('sections.cookies.description')}
            />
            <TermsTextSection
                title={t('sections.storage.title')}
                description={t('sections.storage.description')}
            />
            <TermsTextSection
                title={t('sections.children.title')}
                description={t('sections.children.description')}
            />
            <TermsTextSection
                title={t('sections.policyChanges.title')}
                description={t('sections.policyChanges.description')}
            />
            <ContactSection
                title={t('sections.contact.title')}
                description={t('sections.contact.description')}
                contacts={contactInfo}
            />
        </PolicyPageLayout>
    );
};

export default PrivacyPolicy;
