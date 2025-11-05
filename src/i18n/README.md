# 🌐 i18n Configuration

Thư mục này chứa cấu hình và translation files cho tính năng đa ngôn ngữ.

## 📂 Cấu Trúc

```
i18n/
├── config.ts          # Cấu hình i18next chính
├── index.ts           # Export entry point
├── README.md          # File này
└── locales/
    ├── vi/            # Tiếng Việt (mặc định)
    │   ├── common.json
    │   ├── booking.json
    │   └── auth.json
    └── en/            # English
        ├── common.json
        ├── booking.json
        └── auth.json
```

## 🔧 Configuration

### `config.ts`

File này config:

- Ngôn ngữ mặc định (vi)
- Namespaces
- Language detection strategy
- localStorage persistence

### Namespaces

| Namespace | Mục Đích                                           |
| --------- | -------------------------------------------------- |
| `common`  | Translations chung (buttons, messages, validation) |
| `booking` | Module booking/appointment                         |
| `auth`    | Authentication (login, register, etc.)             |

## ➕ Thêm Namespace Mới

1. Tạo file JSON trong cả `vi/` và `en/`
2. Import vào `config.ts`
3. Thêm vào `resources` object
4. Thêm vào `ns` array trong init config

## 📖 Documentation

Xem hướng dẫn chi tiết tại:

- `/docs/I18N_GUIDE.md` - Hướng dẫn sử dụng
- `/docs/I18N_MIGRATION_GUIDE.md` - Hướng dẫn migrate components

## 🚀 Quick Start

```tsx
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
    const { t } = useTranslation('common');

    return <button>{t('actions.save')}</button>;
};
```

## 🔍 Translation Keys Format

```
namespace:category.subcategory.key

Examples:
- common:actions.save
- booking:basicInfo.firstName
- auth:login.title
```

## ⚠️ Important Notes

- **Luôn** thêm translations cho cả 2 ngôn ngữ
- Sử dụng keys có ý nghĩa, dễ đọc
- Nhóm translations theo logic
- Không hardcode text trong components
