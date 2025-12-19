import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import AddCardModal from './components/AddCardModal';
import WalletSummary from './components/WalletSummary';
import TransactionTable from './components/TransactionTable';
import OtherAccountsModal from './components/OtherAccountsModal';
import NotificationToast from '../../../components/NotificationToast';
import { useBankAccounts } from './hooks/useBankAccounts';
import { useRefundHistory } from './hooks/useRefundHistory';
import { transformRefundHistoriesToTransactions } from './utils/transformers';
import { CreateBankAccountRequest } from './types/wallet.types';
import { RootState } from '@/store';

import styles from './Wallet.module.scss';

const Wallet: React.FC = () => {
    const { t } = useTranslation('userProfile');
    // Get userId from Redux profile
    const { profile } = useSelector((state: RootState) => state.user);
    const userId = profile?.id;

    const {
        accounts,
        loading,
        error,
        defaultAccount,
        createAccount,
        setDefaultAccount: setDefaultAccountApi,
        deleteAccount,
        updateAccount,
    } = useBankAccounts(userId || '');

    const {
        refundHistories,
        loading: refundLoading,
        error: refundError,
    } = useRefundHistory(userId);

    const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
    const [isOtherAccountsModalOpen, setIsOtherAccountsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [showErrorToast, setShowErrorToast] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Handle API errors
    useEffect(() => {
        if (error) {
            setErrorMessage(error);
            setShowErrorToast(true);
        }
    }, [error]);

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

    const handleSuccess = (message: string) => {
        setSuccessMessage(message);
        setShowSuccessToast(true);
    };

    const handleSaveAddCard = async (requestData: CreateBankAccountRequest) => {
        try {
            if (modalMode === 'edit' && defaultAccount) {
                // Update existing account
                const updateData = {
                    id: defaultAccount.id,
                    bankCode: requestData.bankCode,
                    accountNumber: requestData.accountNumber,
                    accountName: requestData.accountName,
                };
                await updateAccount(updateData);
            } else {
                // Create new account
                await createAccount(requestData);
            }
            setIsAddCardModalOpen(false);
        } catch (err) {
            console.error('Error saving account:', err);
            setErrorMessage(
                modalMode === 'edit'
                    ? t('wallet.addCardModal.errors.updateFailed')
                    : t('wallet.addCardModal.errors.createFailed')
            );
            setShowErrorToast(true);
        }
    };

    const handleSetDefaultAccount = async (accountId: string) => {
        try {
            await setDefaultAccountApi(accountId);
            setIsOtherAccountsModalOpen(false);
            handleSuccess(t('wallet.success.setDefault'));
        } catch (err) {
            console.error('Error setting default account:', err);
            setErrorMessage(t('wallet.errors.setDefaultFailed'));
            setShowErrorToast(true);
        }
    };

    const handleDeleteAccount = async (accountId: string) => {
        try {
            await deleteAccount(accountId);
            handleSuccess(t('wallet.success.deleted'));
        } catch (err) {
            console.error('Error deleting account:', err);
            setErrorMessage(t('wallet.errors.deleteFailed'));
            setShowErrorToast(true);
        }
    };

    // Show loading if no userId available
    if (!userId) {
        return (
            <div className={clsx(styles.walletContainer, 'accunts-sec')}>
                <div className="dashboard-header">
                    <div className="header-back">
                        <h3>{t('wallet.title')}</h3>
                    </div>
                </div>
                <div className="text-center p-4">
                    <p>{t('wallet.loading')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className={clsx(styles.walletContainer, 'accunts-sec')}>
            <div className="dashboard-header">
                <div className="header-back">
                    <h3>{t('wallet.title')}</h3>
                </div>
            </div>

            <WalletSummary
                defaultAccount={defaultAccount}
                onAddCard={handleOpenAddCardModal}
                onEditDetails={handleOpenEditModal}
                onOtherAccounts={handleOpenOtherAccountsModal}
                accountsCount={accounts.length}
                loading={loading}
            />

            <TransactionTable
                transactions={transformRefundHistoriesToTransactions(refundHistories)}
                loading={refundLoading}
                error={refundError}
            />

            <AddCardModal
                isOpen={isAddCardModalOpen}
                onClose={handleCloseAddCardModal}
                onSave={handleSaveAddCard}
                onSuccess={handleSuccess}
                existingData={modalMode === 'edit' ? defaultAccount : null}
                mode={modalMode}
                userId={userId || ''}
                loading={loading}
            />

            <OtherAccountsModal
                isOpen={isOtherAccountsModalOpen}
                onClose={handleCloseOtherAccountsModal}
                accounts={accounts}
                onSetDefault={handleSetDefaultAccount}
                onDelete={handleDeleteAccount}
                loading={loading}
            />

            {/* Success Toast */}
            <NotificationToast
                isOpen={showSuccessToast}
                onClose={() => setShowSuccessToast(false)}
                message={successMessage}
                type="success"
                icon="fa-solid fa-check-circle"
                duration={3000}
            />

            {/* Error Toast */}
            <NotificationToast
                isOpen={showErrorToast}
                onClose={() => setShowErrorToast(false)}
                message={errorMessage}
                type="error"
                icon="fa-solid fa-exclamation-triangle"
                duration={5000}
            />
        </div>
    );
};

export default Wallet;
