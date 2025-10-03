import { Transaction, BankDetails, WalletBalance, OtherAccount } from '../types/wallet.types';

export const mockWalletBalance: WalletBalance = {
    totalBalance: '$1200',
    totalTransaction: '$2300',
    lastPaymentRequest: '24 Mar 2023',
};

export const mockBankDetails: BankDetails = {
    bankName: 'Vietcombank',
    accountNumber: '5396 5250 1908 XXXX',
    branch: 'London',
    accountName: 'Darren',
    bankCode: 'VCB',
};

export const mockOtherAccounts: OtherAccount[] = [
    {
        id: '1',
        bankName: 'Ngân hàng TMCP Ngoại Thương Việt Nam',
        accountNumber: '5396 5250 1908 XXXX',
        accountName: 'Edalin Hendry',
        branch: 'London',
        bankCode: 'VCB',
        isCurrent: false,
    },
    {
        id: '2',
        bankName: 'Ngân hàng TMCP Công thương Việt Nam',
        accountNumber: '7382 4924 4924 XXXX',
        accountName: 'Edalin Hendry',
        branch: 'New York',
        bankCode: 'ICB',
        isCurrent: false,
    },
    {
        id: '3',
        bankName: 'Ngân hàng Đầu tư và Phát triển Việt Nam',
        accountNumber: '8934 4902 9024 XXXX',
        accountName: 'Edalin Hendry',
        branch: 'Chicago',
        bankCode: 'BIDV',
        isCurrent: true,
    },
];

export const mockTransactions: Transaction[] = [
    {
        id: '#AC1234',
        accountNo: '5396 5250 1908 XXXX',
        reason: 'Appointment',
        date: '26 Mar 2024',
        amount: '$300',
        status: 'completed',
    },
    {
        id: '#AC3656',
        accountNo: '6372 4902 4902 XXXX',
        reason: 'Appointment',
        date: '28 Mar 2024',
        amount: '$480',
        status: 'completed',
    },
    {
        id: '#AC1246',
        accountNo: '4892 0204 4924 XXXX',
        reason: 'Appointment',
        date: '11 Apr 2024',
        amount: '$250',
        status: 'completed',
    },
    {
        id: '#AC6985',
        accountNo: '5730 4892 0492 XXXX',
        reason: 'Refund',
        date: '18 Apr 2024',
        amount: '$220',
        status: 'pending',
    },
    {
        id: '#AC3659',
        accountNo: '7922 9024 5824 XXXX',
        reason: 'Appointment',
        date: '29 Apr 2024',
        amount: '$350',
        status: 'completed',
    },
];
