# Wallet Component

Wallet component cung cấp giao diện quản lý ví điện tử và thông tin thanh toán cho người dùng.

## Cấu trúc Components

```
Wallet/
├── Wallet.tsx                  # Main Wallet component
├── Wallet.module.scss          # Styling với responsive design
├── WalletDemo.tsx              # Demo page để test
├── index.ts                    # Export entry point
├── components/
│   ├── Modal.tsx               # Base modal component với animations
│   ├── AddCardModal/           # Modal thêm thẻ mới
│   ├── EditCardModal/          # Modal chỉnh sửa thẻ
│   ├── WalletSummary/          # Tổng quan ví và bank details
│   └── TransactionTable/       # Bảng lịch sử giao dịch
├── types/
│   └── wallet.types.ts         # TypeScript type definitions
└── data/
    └── mockData.ts             # Mock data cho demo
```

## Features

### 🏦 Wallet Summary

- Hiển thị tổng số dư và tổng giao dịch
- Thông tin chi tiết ngân hàng
- Buttons để thêm/chỉnh sửa thẻ và tài khoản

### 💳 Card Management

- **Add Card Modal**: Thêm thẻ mới với validation
- **Edit Card Modal**: Chỉnh sửa thông tin thẻ hiện có
- Form validation và user-friendly error handling

### 📊 Transaction History

- Bảng lịch sử giao dịch với status badges
- Responsive design cho mobile
- Click vào transaction ID để xem chi tiết

### ✨ Modal Features

- **Fade animation**: Hiệu ứng trượt xuống mượt mà
- **Backdrop blur**: Background bị làm mờ khi mở modal
- **Body scroll prevention**: Ngăn scroll khi modal mở
- **Keyboard support**: ESC để đóng modal
- **Click outside**: Click bên ngoài để đóng modal
- **Accessibility**: Full ARIA support và keyboard navigation

## Usage

```tsx
import { Wallet } from '@/pages/UserProfile';

// Trong component của bạn
<Wallet />;
```

## Props và Types

### WalletBalance

```tsx
interface WalletBalance {
    totalBalance: string;
    totalTransaction: string;
    lastPaymentRequest: string;
}
```

### BankDetails

```tsx
interface BankDetails {
    bankName: string;
    accountNumber: string;
    branchName: string;
    accountName: string;
}
```

### Transaction

```tsx
interface Transaction {
    id: string;
    accountNo: string;
    reason: string;
    date: string;
    amount: string;
    status: 'completed' | 'pending';
}
```

### CardFormData

```tsx
interface CardFormData {
    cardHolderName: string;
    cardNumber: string;
    expireDate: string;
    cvv: string;
    branch: string;
    markAsDefault: boolean;
}
```

## Responsive Design

- **Desktop**: Full layout với sidebar và main content
- **Tablet**: Collapsed navigation, optimized spacing
- **Mobile**: Stacked layout, touch-friendly buttons

## Animations

- **Modal Enter**: Fade in với slide down từ trên
- **Modal Exit**: Fade out với slide up
- **Button Hover**: Smooth color transitions
- **Focus States**: Accessible outline indicators

## Accessibility

- ✅ ARIA labels và roles
- ✅ Keyboard navigation support
- ✅ Focus management
- ✅ Screen reader friendly
- ✅ Color contrast compliance
- ✅ Semantic HTML structure

## Browser Support

- Chrome 70+
- Firefox 65+
- Safari 12+
- Edge 79+

## Customization

Bạn có thể customize styling thông qua CSS variables:

```scss
:root {
    --primary-color: #007bff;
    --primary-color-dark: #0056b3;
    --modal-backdrop: rgba(0, 0, 0, 0.5);
}
```
