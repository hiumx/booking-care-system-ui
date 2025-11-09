import React, { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import Breadcrumb from '@/components/Breadcrumb';
import MainLayout from '@/layouts/MainLayout';
import { PATHS } from '@/routes/paths';

interface PolicyPageLayoutProps {
    namespace: 'legalNotice' | 'privacyPolicy' | 'refundPolicy';
    children: ReactNode;
}

const PolicyPageLayout: React.FC<PolicyPageLayoutProps> = ({ namespace, children }) => {
    const { t } = useTranslation(namespace);

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
                            <div className="col-md-12">{children}</div>
                        </div>
                    </div>
                </div>
            </MainLayout>
        </div>
    );
};

export default PolicyPageLayout;
