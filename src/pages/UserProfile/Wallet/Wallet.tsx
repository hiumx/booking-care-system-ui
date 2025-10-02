import React, { useState } from 'react';
import clsx from 'clsx';

import AddCardModal from './components/AddCardModal';
import EditCardModal from './components/EditCardModal';
import WalletSummary from './components/WalletSummary';
import TransactionTable from './components/TransactionTable';
import { mockTransactions, mockBankDetails, mockWalletBalance } from './data/mockData';

import styles from './Wallet.module.scss';

const Wallet: React.FC = () => {
    const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
    const [isEditCardModalOpen, setIsEditCardModalOpen] = useState(false);

    const handleOpenAddCardModal = () => {
        setIsAddCardModalOpen(true);
    };

    const handleCloseAddCardModal = () => {
        setIsAddCardModalOpen(false);
    };

    const handleOpenEditCardModal = () => {
        setIsEditCardModalOpen(true);
    };

    const handleCloseEditCardModal = () => {
        setIsEditCardModalOpen(false);
    };

    const handleOtherAccounts = () => {
        console.log('Other accounts clicked');
        // Handle other accounts logic here
    };

    return (
        <div className={clsx(styles.walletContainer, 'accunts-sec')}>
            <div className="dashboard-header">
                <div className="header-back">
                    <h3>Wallet</h3>
                </div>
            </div>

            <WalletSummary
                walletBalance={mockWalletBalance}
                bankDetails={mockBankDetails}
                onAddPayment={handleOpenAddCardModal}
                onEditDetails={handleOpenEditCardModal}
                onAddCards={handleOpenAddCardModal}
                onOtherAccounts={handleOtherAccounts}
            />

            <TransactionTable transactions={mockTransactions} />

            <AddCardModal isOpen={isAddCardModalOpen} onClose={handleCloseAddCardModal} />
            <EditCardModal isOpen={isEditCardModalOpen} onClose={handleCloseEditCardModal} />
        </div>
    );
};

export default Wallet;
