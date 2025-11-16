import { useTranslation } from 'react-i18next';

interface ContactInfo {
    label: string;
    value: string;
}

interface KeyValueItem {
    key: string;
    value: string;
}

export const usePolicyPageData = (namespace: 'legalNotice' | 'privacyPolicy' | 'refundPolicy') => {
    const { t } = useTranslation(namespace);

    const getContactInfo = (contactKeys: {
        email: string;
        emailValue: string;
        hotline: string;
        hotlineValue: string;
        address: string;
        addressValue: string;
    }): ContactInfo[] => {
        return [
            {
                label: t(contactKeys.email),
                value: t(contactKeys.emailValue),
            },
            {
                label: t(contactKeys.hotline),
                value: t(contactKeys.hotlineValue),
            },
            {
                label: t(contactKeys.address),
                value: t(contactKeys.addressValue),
            },
        ];
    };

    const getKeyValueItems = (
        items: Array<{ keyPath: string; valuePath: string }>
    ): KeyValueItem[] => {
        return items.map((item) => ({
            key: t(item.keyPath),
            value: t(item.valuePath),
        }));
    };

    return {
        t,
        getContactInfo,
        getKeyValueItems,
    };
};
