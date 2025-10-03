import React, { useState, useMemo } from 'react';
import clsx from 'clsx';

import AddCardModal from './components/AddCardModal';
import WalletSummary from './components/WalletSummary';
import TransactionTable from './components/TransactionTable';
import OtherAccountsModal from './components/OtherAccountsModal';
import NotificationToast from '../../../components/NotificationToast';
import { mockTransactions, mockOtherAccounts } from './data/mockData';
import { BankDetails, CardFormData, OtherAccount } from './types/wallet.types';

import styles from './Wallet.module.scss';

const Wallet: React.FC = () => {
    const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
    const [isOtherAccountsModalOpen, setIsOtherAccountsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [otherAccounts, setOtherAccounts] = useState<OtherAccount[]>(mockOtherAccounts);
    const [showDeleteSuccessToast, setShowDeleteSuccessToast] = useState(false);

    // Initialize bankDetails from current account in otherAccounts
    const [bankDetails, setBankDetails] = useState<BankDetails | null>(() => {
        const currentAccount = mockOtherAccounts.find((account) => account.isCurrent);
        return currentAccount
            ? {
                  bankName: currentAccount.bankName,
                  accountNumber: currentAccount.accountNumber,
                  accountName: currentAccount.accountName,
                  branch: currentAccount.branch,
                  bankCode: currentAccount.bankCode,
              }
            : null;
    });

    // Sort accounts to put current account first
    const sortedAccounts = useMemo(() => {
        return [...otherAccounts].sort((a, b) => {
            if (a.isCurrent && !b.isCurrent) return -1;
            if (!a.isCurrent && b.isCurrent) return 1;
            return 0;
        });
    }, [otherAccounts]);

    const handleOpenAddCardModal = () => {
        setModalMode('add');
        setIsAddCardModalOpen(true);
    };

    const handleOpenEditModal = () => {
        setModalMode('edit');
        setIsAddCardModalOpen(true);
    };

    const handleCloseAddCardModal = () => {
        setIsAddCardModalOpen(false);
    };

    const handleOpenOtherAccountsModal = () => {
        setIsOtherAccountsModalOpen(true);
    };

    const handleCloseOtherAccountsModal = () => {
        setIsOtherAccountsModalOpen(false);
    };

    const handleSaveAddCard = (cardData: CardFormData) => {
        // Convert CardFormData to BankDetails
        const newBankDetails: BankDetails = {
            bankName: cardData.bankName,
            accountNumber: cardData.cardNumber,
            accountName: cardData.cardHolderName,
            branch: cardData.bankName, // For now, use bankName as branch
            bankCode: cardData.bankCode,
        };

        if (modalMode === 'add') {
            // Add new account to otherAccounts
            const newAccount: OtherAccount = {
                id: Date.now().toString(), // Simple ID generation
                ...newBankDetails,
                isCurrent: otherAccounts.length === 0, // First account is current
            };

            // If this is the first account or no current account exists, set as current
            const updatedAccounts =
                otherAccounts.length === 0 ? [newAccount] : [...otherAccounts, newAccount];

            setOtherAccounts(updatedAccounts);

            // If this is the first account, also set as bankDetails
            if (otherAccounts.length === 0) {
                setBankDetails(newBankDetails);
            }
        } else if (modalMode === 'edit') {
            // Update current account in otherAccounts
            setOtherAccounts((accounts) =>
                accounts.map((account) =>
                    account.isCurrent ? { ...account, ...newBankDetails } : account
                )
            );

            // Update current bankDetails
            setBankDetails(newBankDetails);
        }
    };

    const handleSetDefaultAccount = (accountId: string) => {
        setOtherAccounts((accounts) => {
            const updatedAccounts = accounts.map((account) => ({
                ...account,
                isCurrent: account.id === accountId,
            }));

            // Find the selected account and update bankDetails
            const selectedAccount = updatedAccounts.find((account) => account.id === accountId);
            if (selectedAccount) {
                setBankDetails({
                    bankName: selectedAccount.bankName,
                    accountNumber: selectedAccount.accountNumber,
                    accountName: selectedAccount.accountName,
                    branch: selectedAccount.branch,
                    bankCode: selectedAccount.bankCode,
                });
            }

            return updatedAccounts;
        });

        setIsOtherAccountsModalOpen(false);
    };

    const handleDeleteAccount = (accountId: string) => {
        setOtherAccounts((prevAccounts) => {
            const accountToDelete = prevAccounts.find((account) => account.id === accountId);

            if (!accountToDelete) {
                console.error('Account not found for deletion:', accountId);
                return prevAccounts;
            }

            if (accountToDelete.isCurrent) {
                console.error('Cannot delete current account');
                return prevAccounts;
            }

            const updatedAccounts = prevAccounts.filter((account) => account.id !== accountId);
            setShowDeleteSuccessToast(true);
            return updatedAccounts;
        });
    };

    return (
        <div className={clsx(styles.walletContainer, 'accunts-sec')}>
            <div className="dashboard-header">
                <div className="header-back">
                    <h3>Wallet</h3>
                </div>
            </div>

            <WalletSummary
                bankDetails={bankDetails}
                onAddCard={handleOpenAddCardModal}
                onEditDetails={handleOpenEditModal}
                onOtherAccounts={handleOpenOtherAccountsModal}
                accountsCount={otherAccounts.length}
            />

            <TransactionTable transactions={mockTransactions} />

            <AddCardModal
                isOpen={isAddCardModalOpen}
                onClose={handleCloseAddCardModal}
                onSave={handleSaveAddCard}
                existingData={modalMode === 'edit' ? bankDetails : null}
                mode={modalMode}
            />

            <OtherAccountsModal
                isOpen={isOtherAccountsModalOpen}
                onClose={handleCloseOtherAccountsModal}
                accounts={sortedAccounts}
                onSetDefault={handleSetDefaultAccount}
                onDelete={handleDeleteAccount}
            />

            {/* Delete Success Toast */}
            <NotificationToast
                isOpen={showDeleteSuccessToast}
                onClose={() => setShowDeleteSuccessToast(false)}
                message="Xóa tài khoản thành công!"
                type="success"
                icon="fa-solid fa-check-circle"
                duration={3000}
            />
        </div>
    );
};

export default Wallet;
