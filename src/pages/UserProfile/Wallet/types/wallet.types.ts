export interface Transaction {
    id: string;
    accountNo: string;
    reason: string;
    date: string;
    amount: string;
    status: 'completed' | 'pending';
}

// New interface for mapped transaction from RefundHistory
export interface RefundTransaction {
    id: string;
    accountNumber: string;
    refundReason: string;
    updatedAt: string;
    refundAmount: number;
    status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'REJECTED';
}

export interface BankDetails {
    bankName: string;
    accountNumber: string;
    accountName: string;
    branch?: string;
    bankCode?: string;
}

export interface BankAccount {
    id: string;
    userId: string;
    bankCode: string;
    bankName: string;
    accountNumber: string;
    fullAccountNumber: string;
    accountName: string;
    isDefault: boolean;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateBankAccountRequest {
    userId: string;
    bankCode: string;
    bankName: string;
    accountNumber: string;
    accountName: string;
    isDefault: boolean;
}

export interface UpdateBankAccountRequest {
    id: string;
    bankCode: string;
    accountNumber: string;
    accountName: string;
}

export interface BankAccountsResponse {
    accounts: BankAccount[];
    count: number;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    timestamp: string;
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

export interface Payment {
    id: string;
    appointmentId: string;
    clinicId: string | null;
    patientId: string;
    subscriptionId: string | null;
    amount: number;
    transactionType: string;
    paymentMethodId: string;
    paymentMethodName: string;
    status: string;
    createdAt: string;
}

export interface RefundHistory {
    id: string;
    bankAccountId: string;
    bankAccount: BankAccount;
    userId: string;
    status: 'PENDING' | 'COMPLETED';
    transferDate: string | null;
    paymentId: string;
    payment: Payment;
    refundAmount: number;
    refundReason: string | null;
    staffNotes: string | null;
    processedByStaffId: string | null;
    createdAt: string;
    updatedAt: string;
    daysFromCreated: number;
    canProcess: boolean;
    canUpdateBankAccount: boolean;
}

export interface RefundHistoryResponse {
    refundHistories: RefundHistory[];
    count: number;
}
