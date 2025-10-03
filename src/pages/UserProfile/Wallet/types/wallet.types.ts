export interface Transaction {
    id: string;
    accountNo: string;
    reason: string;
    date: string;
    amount: string;
    status: 'completed' | 'pending';
}

export interface BankDetails {
    bankName: string;
    accountNumber: string;
    accountName: string;
}

export interface WalletBalance {
    totalBalance: string;
    totalTransaction: string;
    lastPaymentRequest: string;
}

export interface CardFormData {
    cardHolderName: string;
    cardNumber: string;
    bankName: string;
}
