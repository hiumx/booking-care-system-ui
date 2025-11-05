# 🌐 Hướng Dẫn Sử Dụng i18n (Đa Ngôn Ngữ)

## 📖 Mục Lục

- [Giới Thiệu](#giới-thiệu)
- [Cấu Trúc](#cấu-trúc)
- [Cách Sử Dụng](#cách-sử-dụng)
- [Quản Lý Translation Files](#quản-lý-translation-files)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

---

## Giới Thiệu

Dự án sử dụng **react-i18next** để hỗ trợ đa ngôn ngữ (Việt-Anh).

### ✨ Tính Năng

- ✅ Tự động phát hiện ngôn ngữ từ browser
- ✅ Lưu ngôn ngữ đã chọn vào localStorage
- ✅ Lazy loading translations (performance tốt)
- ✅ TypeScript support
- ✅ Namespace organization
- ✅ Interpolation & pluralization

### 🌍 Ngôn Ngữ Hỗ Trợ

- **Tiếng Việt** (vi) - Mặc định
- **English** (en)

---

## Cấu Trúc

```
src/
├── i18n/
│   ├── config.ts              # Cấu hình i18next
│   ├── index.ts               # Export chính
│   └── locales/
│       ├── vi/                # Translations Tiếng Việt
│       │   ├── common.json    # Từ vựng chung
│       │   ├── booking.json   # Module booking
│       │   └── auth.json      # Module authentication
│       └── en/                # Translations English
│           ├── common.json
│           ├── booking.json
│           └── auth.json
└── components/
    └── LanguageSwitcher/      # Component chuyển đổi ngôn ngữ
```

### 📦 Namespaces

| Namespace | Mô Tả                                              | File           |
| --------- | -------------------------------------------------- | -------------- |
| `common`  | Từ vựng dùng chung (buttons, messages, validation) | `common.json`  |
| `booking` | Module đặt lịch khám                               | `booking.json` |
| `auth`    | Module đăng nhập/đăng ký                           | `auth.json`    |

---

## Cách Sử Dụng

### 1️⃣ **Sử Dụng trong Component**

```tsx
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
    // Load single namespace
    const { t } = useTranslation('common');

    // Hoặc load multiple namespaces
    const { t } = useTranslation(['common', 'booking']);

    return (
        <div>
            <h1>{t('common:app.name')}</h1>
            <button>{t('common:actions.save')}</button>
            <p>{t('booking:basicInfo.title')}</p>
        </div>
    );
};
```

### 2️⃣ **Interpolation (Truyền Biến)**

**Translation file:**

```json
{
    "welcome": "Xin chào, {{name}}!",
    "itemsCount": "Bạn có {{count}} mục"
}
```

**Component:**

```tsx
const { t } = useTranslation('common')

<h1>{t('welcome', { name: 'Nguyễn Văn A' })}</h1>
// Output: "Xin chào, Nguyễn Văn A!"

<p>{t('itemsCount', { count: 5 })}</p>
// Output: "Bạn có 5 mục"
```

### 3️⃣ **Sử Dụng LanguageSwitcher**

Component `LanguageSwitcher` đã được tích hợp vào Header. Nếu cần thêm vào nơi khác:

```tsx
import LanguageSwitcher from '@/components/LanguageSwitcher';

const MyLayout = () => {
    return (
        <div>
            <LanguageSwitcher />
        </div>
    );
};
```

### 4️⃣ **Thay Đổi Ngôn Ngữ Programmatically**

```tsx
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
    const { i18n } = useTranslation();

    const changeToEnglish = () => {
        i18n.changeLanguage('en');
    };

    const changeToVietnamese = () => {
        i18n.changeLanguage('vi');
    };

    // Lấy ngôn ngữ hiện tại
    console.log(i18n.language); // 'vi' hoặc 'en'
};
```

### 5️⃣ **Nested Translations**

**Translation file:**

```json
{
    "user": {
        "profile": {
            "title": "Thông tin cá nhân",
            "edit": "Chỉnh sửa hồ sơ"
        }
    }
}
```

**Component:**

```tsx
<h1>{t('user.profile.title')}</h1>
<button>{t('user.profile.edit')}</button>
```

---

## Quản Lý Translation Files

### 📝 Thêm Translation Mới

**Bước 1:** Thêm vào file JSON tương ứng

**`src/i18n/locales/vi/common.json`**

```json
{
    "newFeature": {
        "title": "Tính năng mới",
        "description": "Mô tả tính năng"
    }
}
```

**`src/i18n/locales/en/common.json`**

```json
{
    "newFeature": {
        "title": "New Feature",
        "description": "Feature description"
    }
}
```

**Bước 2:** Sử dụng trong component

```tsx
{
    t('common:newFeature.title');
}
```

### 🆕 Tạo Namespace Mới

**Bước 1:** Tạo file JSON mới

- `src/i18n/locales/vi/newNamespace.json`
- `src/i18n/locales/en/newNamespace.json`

**Bước 2:** Import vào config

**`src/i18n/config.ts`**

```typescript
// Import translation files
import newNamespaceVi from './locales/vi/newNamespace.json';
import newNamespaceEn from './locales/en/newNamespace.json';

// Add to resources
const resources = {
    vi: {
        common: commonVi,
        booking: bookingVi,
        auth: authVi,
        newNamespace: newNamespaceVi, // ✅ Thêm vào đây
    },
    en: {
        common: commonEn,
        booking: bookingEn,
        auth: authEn,
        newNamespace: newNamespaceEn, // ✅ Thêm vào đây
    },
};

// Update ns array
i18n.init({
    // ...
    ns: ['common', 'booking', 'auth', 'newNamespace'], // ✅ Thêm vào đây
});
```

**Bước 3:** Sử dụng

```tsx
const { t } = useTranslation('newNamespace');
{
    t('someKey');
}
```

---

## Best Practices

### ✅ DO

1. **Sử dụng namespace phù hợp**

    ```tsx
    // ✅ Good
    {
        t('common:actions.save');
    } // Common actions
    {
        t('booking:basicInfo.title');
    } // Booking-specific
    ```

2. **Tổ chức translation theo tính năng**

    ```json
    {
      "booking": {
        "steps": { ... },
        "basicInfo": { ... },
        "payment": { ... }
      }
    }
    ```

3. **Sử dụng interpolation thay vì concat**

    ```tsx
    // ✅ Good
    {
        t('welcome', { name: userName });
    }

    // ❌ Bad
    {
        'Xin chào, ' + userName;
    }
    ```

4. **Keys descriptive và có ý nghĩa**

    ```json
    // ✅ Good
    {
      "basicInfo": {
        "firstName": "Họ",
        "lastName": "Tên"
      }
    }

    // ❌ Bad
    {
      "field1": "Họ",
      "field2": "Tên"
    }
    ```

5. **Nhóm related translations**
    ```json
    {
        "validation": {
            "required": "Trường này là bắt buộc",
            "invalidEmail": "Email không hợp lệ",
            "minLength": "Tối thiểu {{count}} ký tự"
        }
    }
    ```

### ❌ DON'T

1. **Không hardcode text**

    ```tsx
    // ❌ Bad
    <button>Lưu</button>

    // ✅ Good
    <button>{t('common:actions.save')}</button>
    ```

2. **Không translate trong service/utils**

    ```typescript
    // ❌ Bad - API service
    const error = 'Lỗi kết nối';

    // ✅ Good - Return error code, translate in component
    const error = 'CONNECTION_ERROR';
    // Component: {t('errors.connectionError')}
    ```

3. **Không duplicate translations**

    ```json
    // ❌ Bad
    {
      "save1": "Lưu",
      "save2": "Lưu",
      "saveButton": "Lưu"
    }

    // ✅ Good - Dùng chung 1 key
    {
      "actions": {
        "save": "Lưu"
      }
    }
    ```

---

## Ví Dụ Thực Tế

### Example 1: Form với Validation

**Translation:**

```json
{
    "form": {
        "firstName": "Họ",
        "lastName": "Tên",
        "email": "Email",
        "submit": "Gửi"
    },
    "validation": {
        "required": "Trường {{field}} là bắt buộc",
        "invalidEmail": "Email không hợp lệ"
    }
}
```

**Component:**

```tsx
const MyForm = () => {
    const { t } = useTranslation('common');

    return (
        <form>
            <label>{t('form.firstName')}</label>
            <input required />
            {error && <p>{t('validation.required', { field: t('form.firstName') })}</p>}

            <button type="submit">{t('form.submit')}</button>
        </form>
    );
};
```

### Example 2: Dynamic List

**Translation:**

```json
{
    "appointments": {
        "title": "Danh sách lịch hẹn",
        "empty": "Không có lịch hẹn nào",
        "itemCount": "{{count}} lịch hẹn"
    }
}
```

**Component:**

```tsx
const AppointmentList = ({ items }) => {
    const { t } = useTranslation('booking');

    return (
        <div>
            <h1>{t('appointments.title')}</h1>
            <p>{t('appointments.itemCount', { count: items.length })}</p>

            {items.length === 0 && <p>{t('appointments.empty')}</p>}

            {items.map((item) => (
                <AppointmentCard key={item.id} {...item} />
            ))}
        </div>
    );
};
```

---

## Troubleshooting

### ❓ Translation không hiển thị

**Nguyên nhân:**

- Key không tồn tại trong translation file
- Namespace chưa được load

**Giải pháp:**

```tsx
// 1. Kiểm tra key có đúng không
{
    t('common:actions.save');
} // ✅ Đúng format: namespace:key

// 2. Kiểm tra namespace đã load
const { t } = useTranslation(['common', 'booking']); // Load cả 2

// 3. Check browser console
// i18next sẽ log warning nếu key không tìm thấy
```

### ❓ Ngôn ngữ không được persist

**Giải pháp:**

- Đảm bảo `i18next-browser-languagedetector` đã được cài
- Check localStorage có key `i18nextLng` không
- Clear browser cache và thử lại

### ❓ Performance issues với nhiều translations

**Giải pháp:**

- Sử dụng lazy loading (đã được config sẵn)
- Split translations thành nhiều namespaces nhỏ
- Load namespace khi cần thiết

```tsx
// Load namespace on demand
const { t } = useTranslation(); // Don't load any namespace initially

useEffect(() => {
    i18n.loadNamespaces(['booking', 'payment']);
}, []);
```

---

## 📚 Resources

- [react-i18next Documentation](https://react.i18next.com/)
- [i18next Documentation](https://www.i18next.com/)
- [Best Practices](https://www.i18next.com/principles/fallback)

---

## 🤝 Contribution

Khi thêm translation mới:

1. ✅ Thêm vào **cả 2** ngôn ngữ (vi và en)
2. ✅ Sử dụng keys có ý nghĩa
3. ✅ Nhóm theo namespace phù hợp
4. ✅ Test translation hoạt động đúng
5. ✅ Update documentation nếu cần

---

**💡 Tip:** Sử dụng browser extension **i18next DevTools** để debug translations dễ dàng hơn!
