import React from 'react';
import MainLayout from '@/layouts/MainLayout';
import Breadcrumb from '@/components/Breadcrumb';
import Wallet from './Wallet';

const WalletDemo: React.FC = () => {
    const breadcrumbItems = [
        { label: 'Home', path: '/' },
        { label: 'User Profile', path: '/profile' },
        { label: 'Wallet', isActive: true },
    ];

    return (
        <MainLayout>
            <Breadcrumb items={breadcrumbItems} title="Wallet Demo" />
            <div className="container">
                <Wallet />
            </div>
        </MainLayout>
    );
};

export default WalletDemo;
