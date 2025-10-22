import axiosInstance from '@/configs/axios.config';

// Types for Payment Methods API
export interface PaymentMethod {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    status: 'ACTIVE' | 'INACTIVE';
}

export interface PaymentMethodsResponse {
    success: boolean;
    message: string;
    data: PaymentMethod[];
    timestamp: string;
}

// Types for Create Payment API
export interface CreatePaymentRequest {
    appointmentId: string;
    patientId: string;
    amount: number;
    paymentMethodId: string;
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

export interface CreatePaymentResponse {
    success: boolean;
    message: string;
    data: {
        payment: Payment;
        paymentUrl: string;
        paymentGateway: string;
        expireAt: string;
        paymentReference: string;
    };
    timestamp: string;
}

// Types for Invoice/Payment History API
export interface InvoiceItem {
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
    appointmentDate: string;
    appointmentType: string;
}

export interface InvoiceResponse {
    success: boolean;
    message: string;
    data: {
        items: InvoiceItem[];
        totalCount: number;
        pageNumber: number;
        pageSize: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };
    timestamp: string;
}

export class PaymentService {
    /**
     * Lấy danh sách các phương thức thanh toán đang hoạt động
     */
    static async getActivePaymentMethods(): Promise<PaymentMethod[]> {
        try {
            const result: PaymentMethodsResponse =
                await axiosInstance.get('/PaymentMethods/active');

            if (!result.success) {
                throw new Error(result.message || 'Failed to fetch payment methods');
            }

            return result.data;
        } catch (error: any) {
            console.error('Error fetching payment methods:', error);
            throw new Error(error.message || 'Failed to fetch payment methods');
        }
    }

    /**
     * Tạo URL thanh toán cho appointment
     */
    static async createAppointmentPayment(
        request: CreatePaymentRequest
    ): Promise<CreatePaymentResponse['data']> {
        try {
            const result: CreatePaymentResponse = await axiosInstance.post(
                '/payments/appointment',
                request
            );

            if (!result.success) {
                throw new Error(result.message || 'Failed to create payment URL');
            }

            return result.data;
        } catch (error: any) {
            console.error('Error creating payment:', error);
            throw new Error(error.message || 'Failed to create payment URL');
        }
    }

    /**
     * Create supplementary payment for appointment price difference
     * Used when patient chooses new doctor with higher price (Option 3)
     */
    static async createSupplementaryPayment(request: {
        appointmentId: string;
        patientId: string;
        additionalAmount: number;
        paymentMethodId: string;
        rescheduleToken: string;
        reason?: string;
        isStaffAssigned?: boolean; // For callback handling
    }): Promise<{
        appointmentId: string;
        additionalAmount: number;
        paymentUrl: string;
        paymentGateway: string;
        expireAt?: string;
        paymentReference?: string;
        supplementaryPaymentId: string;
    }> {
        try {
            const result: any = await axiosInstance.post('/payments/supplementary', request);

            if (!result.success) {
                throw new Error(result.message || 'Failed to create supplementary payment URL');
            }

            return result.data;
        } catch (error: any) {
            console.error('Error creating supplementary payment:', error);
            throw new Error(error.message || 'Failed to create supplementary payment URL');
        }
    }

    /**
     * Lấy danh sách hóa đơn theo patient ID với đầy đủ query parameters
     */
    static async getPatientInvoices(
        patientId: string,
        pageNumber: number = 1,
        pageSize: number = 10,
        searchTerm?: string,
        sortBy: string = 'CreatedAt',
        sortOrder: string = 'desc'
    ): Promise<InvoiceResponse['data']> {
        try {
            const params = new URLSearchParams({
                pageNumber: pageNumber.toString(),
                pageSize: pageSize.toString(),
                sortBy,
                sortOrder,
            });

            if (searchTerm?.trim()) {
                params.append('searchTerm', searchTerm.trim());
            }

            const result: InvoiceResponse = await axiosInstance.get(
                `/payments/patient/${patientId}?${params.toString()}`
            );

            if (!result.success) {
                throw new Error(result.message || 'Failed to fetch patient invoices');
            }

            return result.data;
        } catch (error: any) {
            console.error('Error fetching patient invoices:', error);
            throw new Error(error.message || 'Failed to fetch patient invoices');
        }
    }
}

export default PaymentService;
