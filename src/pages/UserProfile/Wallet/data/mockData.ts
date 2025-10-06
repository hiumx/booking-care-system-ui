import { Transaction } from '../types/wallet.types';

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
