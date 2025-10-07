# Bank Account API Integration

Dự án đã được tích hợp với backend API để quản lý bank accounts của user.

## Các API được tích hợp:

### 1. Lấy danh sách bank accounts

- **Endpoint**: `GET /api/v1.0/bankaccounts/user/{userId}`
- **Mô tả**: Lấy tất cả bank accounts của một user
- **Service**: `BankAccountService.getBankAccountsByUserId()`

### 2. Tạo mới bank account

- **Endpoint**: `POST /api/v1.0/bankaccounts`
- **Mô tả**: Tạo mới một bank account
- **Service**: `BankAccountService.createBankAccount()`

### 3. Cập nhật bank account

- **Endpoint**: `PUT /api/v1.0/bankaccounts/{accountId}`
- **Mô tả**: Cập nhật thông tin bank account (bankCode, accountNumber, accountName)
- **Service**: `BankAccountService.updateBankAccount()`

### 4. Set bank account làm mặc định

- **Endpoint**: `PATCH /api/v1.0/bankaccounts/{accountId}/set-default`
- **Mô tả**: Đặt một bank account làm mặc định
- **Service**: `BankAccountService.setDefaultBankAccount()`

### 5. Xóa bank account

- **Endpoint**: `DELETE /api/v1.0/bankaccounts/{accountId}`
- **Mô tả**: Xóa một bank account
- **Service**: `BankAccountService.deleteBankAccount()`

## Các file đã được thêm/cập nhật:

### 1. Types (wallet.types.ts)

```typescript
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

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    timestamp: string;
}
```

### 2. Service (bankAccount.service.ts)

- `BankAccountService.getBankAccountsByUserId(userId: string)`
- `BankAccountService.createBankAccount(data: CreateBankAccountRequest)`
- `BankAccountService.updateBankAccount(data: UpdateBankAccountRequest)`
- `BankAccountService.setDefaultBankAccount(accountId: string)`
- `BankAccountService.deleteBankAccount(accountId: string)`

**✅ Sử dụng axios instance đã được config sẵn:**

- Tự động handle authentication với cookies
- Error handling thống nhất
- Request/Response interceptors
- Base URL từ config

### 3. Custom Hook (useBankAccounts.ts)

Hook quản lý state và API calls cho bank accounts:

```typescript
const {
    loading,
    error,
    defaultAccount,
    otherAccounts,
    createAccount,
    setDefaultAccount,
    deleteAccount,
} = useBankAccounts(userId);
```

### 4. Components được cập nhật:

- **WalletSummary**: Hiển thị thông tin tài khoản mặc định
- **AddCardModal**: Form tạo mới/chỉnh sửa bank account
- **OtherAccountsModal**: Hiển thị và quản lý các tài khoản khác
- **Wallet**: Component chính tích hợp tất cả functionality

## API Mapping:

| Action             | Endpoint                                | Method | Body                       |
| ------------------ | --------------------------------------- | ------ | -------------------------- |
| **Get accounts**   | `/bankaccounts/user/{userId}`           | GET    | -                          |
| **Create account** | `/bankaccounts`                         | POST   | `CreateBankAccountRequest` |
| **Update account** | `/bankaccounts/{accountId}`             | PUT    | `UpdateBankAccountRequest` |
| **Set default**    | `/bankaccounts/{accountId}/set-default` | PATCH  | -                          |
| **Delete account** | `/bankaccounts/{accountId}`             | DELETE | -                          |

## Cấu hình:

1. **API Base URL**: Được config tự động từ `axios.config.ts`
2. **User ID**: Lấy từ Redux state `profile.id` (user profile)
3. **Authorization**: Tự động handle bằng HttpOnly cookies thông qua axios interceptors

## Sử dụng:

```typescript
// Trong component
import { useBankAccounts } from './hooks/useBankAccounts';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

const MyComponent = () => {
    // Lấy userId từ Redux profile
    const { profile } = useSelector((state: RootState) => state.user);
    const userId = profile?.id;

    const {
        loading,
        error,
        defaultAccount,
        otherAccounts,
        createAccount,
        updateAccount,
        setDefaultAccount,
        deleteAccount,
    } = useBankAccounts(userId || '');

    // Tạo tài khoản mới
    const handleCreate = async () => {
        await createAccount({
            userId,
            bankCode: 'VCB',
            bankName: 'Vietcombank',
            accountNumber: '1234567890',
            accountName: 'NGUYEN VAN A',
            isDefault: false,
        });
    };

    // Cập nhật tài khoản
    const handleUpdate = async (accountId: string) => {
        await updateAccount({
            id: accountId,
            bankCode: 'TCB',
            accountNumber: '1234567891',
            accountName: 'NGUYEN VAN B',
        });
    };

    // Set tài khoản mặc định
    const handleSetDefault = async (accountId: string) => {
        await setDefaultAccount(accountId);
    };

    // Xóa tài khoản
    const handleDelete = async (accountId: string) => {
        await deleteAccount(accountId);
    };

    return (
        // JSX...
    );
};
```

## Lưu ý:

1. **Error Handling**: Tất cả API calls đều có error handling và hiển thị toast notification
2. **Loading States**: Các button và form sẽ disable khi đang loading
3. **Validation**: Form validation được thực hiện ở client-side
4. **Optimistic Updates**: Local state được cập nhật ngay lập tức để UX tốt hơn
5. **User Authentication**: Tự động lấy userId từ Redux profile, hiển thị loading nếu chưa có user info
6. **Axios Integration**: Sử dụng axios instance đã config sẵn với interceptors và error handling
