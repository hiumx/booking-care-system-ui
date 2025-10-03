import React, { useState } from 'react';
import clsx from 'clsx';

import AddCardModal from './components/AddCardModal';
import WalletSummary from './components/WalletSummary';
import TransactionTable from './components/TransactionTable';
import { mockTransactions } from './data/mockData';
import { BankDetails, CardFormData } from './types/wallet.types';

import styles from './Wallet.module.scss';

const Wallet: React.FC = () => {
    const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
    const [bankDetails, setBankDetails] = useState<BankDetails | null>(null);

    const handleOpenAddCardModal = () => {
        setIsAddCardModalOpen(true);
    };

    const handleCloseAddCardModal = () => {
        setIsAddCardModalOpen(false);
    };

    const handleSaveAddCard = (cardData: CardFormData) => {
        // Convert CardFormData to BankDetails
        const newBankDetails: BankDetails = {
            bankName: cardData.bankName, // Assuming branch contains bank name
            accountNumber: cardData.cardNumber,
            accountName: cardData.cardHolderName,
        };

        setBankDetails(newBankDetails);
        console.log('Card saved:', newBankDetails);
    };

    return (
        <div className={clsx(styles.walletContainer, 'accunts-sec')}>
            <div className="dashboard-header">
                <div className="header-back">
                    <h3>Wallet</h3>
                </div>
            </div>

            <WalletSummary bankDetails={bankDetails} onAddPayment={handleOpenAddCardModal} />

            <TransactionTable transactions={mockTransactions} />

            <AddCardModal
                isOpen={isAddCardModalOpen}
                onClose={handleCloseAddCardModal}
                onSave={handleSaveAddCard}
                existingData={bankDetails}
            />
        </div>
    );
};

export default Wallet;
