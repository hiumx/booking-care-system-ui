import React from 'react';
import { useTranslation } from 'react-i18next';
import {
    PolicyPageLayout,
    TermsTextSection,
    TermsListSection,
    ContactSection,
    TermsKeyValueList,
} from '@/components/PolicyPage';

const PrivacyPolicy: React.FC = () => {
    const { t } = useTranslation('privacyPolicy');

    const informationUsageItems = t('sections.informationUsage.items', {
        returnObjects: true,
    }) as string[];

    const informationSecurityItems = t('sections.informationSecurity.items', {
        returnObjects: true,
    }) as string[];

    const informationCollectionItems = [
        {
            key: t('sections.informationCollection.items.registration'),
            value: t('sections.informationCollection.items.registrationValue'),
        },
        {
            key: t('sections.informationCollection.items.medical'),
            value: t('sections.informationCollection.items.medicalValue'),
        },
        {
            key: t('sections.informationCollection.items.payment'),
            value: t('sections.informationCollection.items.paymentValue'),
        },
        {
            key: t('sections.informationCollection.items.technical'),
            value: t('sections.informationCollection.items.technicalValue'),
        },
    ];

    const informationSharingItems = [
        {
            key: t('sections.informationSharing.items.healthcare'),
            value: t('sections.informationSharing.items.healthcareValue'),
        },
        {
            key: t('sections.informationSharing.items.partners'),
            value: t('sections.informationSharing.items.partnersValue'),
        },
        {
            key: t('sections.informationSharing.items.legal'),
            value: t('sections.informationSharing.items.legalValue'),
        },
        {
            key: t('sections.informationSharing.items.protection'),
            value: t('sections.informationSharing.items.protectionValue'),
        },
    ];

    const userRightsItems = [
        {
            key: t('sections.userRights.items.access'),
            value: t('sections.userRights.items.accessValue'),
        },
        {
            key: t('sections.userRights.items.edit'),
            value: t('sections.userRights.items.editValue'),
        },
        {
            key: t('sections.userRights.items.delete'),
            value: t('sections.userRights.items.deleteValue'),
        },
        {
            key: t('sections.userRights.items.withdraw'),
            value: t('sections.userRights.items.withdrawValue'),
        },
        {
            key: t('sections.userRights.items.complaint'),
            value: t('sections.userRights.items.complaintValue'),
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
