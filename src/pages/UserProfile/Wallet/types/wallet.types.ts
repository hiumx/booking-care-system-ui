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
    branch?: string;
    bankCode?: string;
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
    bankCode: string;
}

export interface OtherAccount extends BankDetails {
    id: string;
    isCurrent: boolean;
}
