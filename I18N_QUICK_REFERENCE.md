# 🚀 I18n Quick Reference Card

## 📝 Basic Usage

### Import

```tsx
import { useTranslation } from 'react-i18next';
```

### Single Namespace

```tsx
const { t } = useTranslation('common')
<button>{t('actions.save')}</button>
```

### Multiple Namespaces

```tsx
const { t } = useTranslation(['common', 'booking'])
<h1>{t('common:app.name')}</h1>
<p>{t('booking:basicInfo.title')}</p>
```

---

## 🔑 Common Keys

### Actions (common:actions.\*)

```tsx
t('actions.save'); // Lưu / Save
t('actions.cancel'); // Hủy / Cancel
t('actions.delete'); // Xóa / Delete
t('actions.edit'); // Chỉnh sửa / Edit
t('actions.next'); // Tiếp theo / Next
t('actions.back'); // Quay lại / Back
t('actions.loading'); // Đang tải... / Loading...
```

### Messages (common:messages.\*)

```tsx
t('messages.success'); // Thành công! / Success!
t('messages.error'); // Có lỗi xảy ra! / An error occurred!
t('messages.uploadSuccess'); // Tải lên thành công / Upload successful
t('messages.uploadError'); // Không thể tải tệp lên / Failed to upload file
```

### Validation (common:validation.\*)

```tsx
t('validation.required'); // Trường này là bắt buộc / This field is required
t('validation.invalidEmail'); // Email không hợp lệ / Invalid email address
```

---

## 💡 Advanced Usage

### With Variables

```tsx
// Translation: "Xin chào, {{name}}!"
t('welcome', { name: 'John' });
// Output: "Xin chào, John!"
```

### With Count

```tsx
// Translation: "{{count}} tệp đã chọn"
t('filesSelected', { count: 3 });
// Output: "3 tệp đã chọn"
```

### Change Language

```tsx
const { i18n } = useTranslation();
i18n.changeLanguage('en'); // Switch to English
i18n.changeLanguage('vi'); // Switch to Vietnamese
```

### Get Current Language

```tsx
const { i18n } = useTranslation();
console.log(i18n.language); // 'vi' or 'en'
```

---

## 📦 Available Namespaces

| Namespace | Keys | Usage                                 |
| --------- | ---- | ------------------------------------- |
| `common`  | ~35  | General actions, messages, validation |
| `booking` | ~25  | Booking flow, appointments            |
| `auth`    | ~30  | Login, register, password             |

---

## ✅ Checklist for New Component

- [ ] Import `useTranslation`
- [ ] Load appropriate namespace(s)
- [ ] Replace all hardcoded text with `t()`
- [ ] Add translations to both `vi/` and `en/` files
- [ ] Test in both languages
- [ ] Check console for missing keys

---

## 🎨 LanguageSwitcher Component

Already available in header. To add elsewhere:

```tsx
import LanguageSwitcher from '@/components/LanguageSwitcher';

<LanguageSwitcher />;
```

---

## 📂 File Structure

```
src/i18n/locales/
├── vi/
│   ├── common.json
│   ├── booking.json
│   └── auth.json
└── en/
    ├── common.json
    ├── booking.json
    └── auth.json
```

---

## 🆘 Quick Troubleshooting

### Translation not showing?

1. Check key exists in JSON file
2. Check namespace is loaded
3. Check console for warnings

### Language not persisting?

1. Check localStorage (`i18nextLng`)
2. Clear cache and try again

### TypeScript errors?

1. Ensure `resolveJsonModule: true` in tsconfig
2. Restart TS server

---

## 📚 Full Documentation

- **Usage Guide**: `docs/I18N_GUIDE.md`
- **Migration Guide**: `docs/I18N_MIGRATION_GUIDE.md`
- **Implementation Summary**: `I18N_IMPLEMENTATION_SUMMARY.md`

---

## 💻 Example Component

```tsx
import { useTranslation } from 'react-i18next';
import Input from '@/components/Input';

const MyForm = () => {
    const { t } = useTranslation(['common', 'booking']);
    const [name, setName] = useState('');

    return (
        <form>
            <h1>{t('booking:basicInfo.title')}</h1>

            <Input
                label={t('booking:basicInfo.firstName')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('booking:basicInfo.placeholder.firstName')}
            />

            <button type="submit">{t('common:actions.submit')}</button>
        </form>
    );
};
```

---

**Keep this handy while developing! 📌**
