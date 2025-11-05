# 🔄 I18n Migration Guide

Hướng dẫn migrate các components hiện tại sang sử dụng i18n.

---

## 📋 Checklist Cho Mỗi Component

- [ ] Import `useTranslation` hook
- [ ] Identify hardcoded text
- [ ] Add translations to appropriate JSON files
- [ ] Replace hardcoded text with `t()` function
- [ ] Test component in both languages
- [ ] Update component tests if needed

---

## 🔨 Step-by-Step Migration

### Step 1: Identify Hardcoded Text

Tìm tất cả text hardcoded trong component:

```tsx
// ❌ Before
const MyComponent = () => {
    return (
        <div>
            <h1>Đặt lịch khám</h1>
            <button>Tiếp theo</button>
            <p>Vui lòng nhập thông tin</p>
        </div>
    );
};
```

### Step 2: Add Translations to JSON

Thêm translations vào file JSON phù hợp:

**`src/i18n/locales/vi/booking.json`**

```json
{
    "myComponent": {
        "title": "Đặt lịch khám",
        "nextButton": "Tiếp theo",
        "instruction": "Vui lòng nhập thông tin"
    }
}
```

**`src/i18n/locales/en/booking.json`**

```json
{
    "myComponent": {
        "title": "Book Appointment",
        "nextButton": "Next",
        "instruction": "Please enter your information"
    }
}
```

### Step 3: Update Component

```tsx
// ✅ After
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
    const { t } = useTranslation('booking');

    return (
        <div>
            <h1>{t('myComponent.title')}</h1>
            <button>{t('myComponent.nextButton')}</button>
            <p>{t('myComponent.instruction')}</p>
        </div>
    );
};
```

### Step 4: Test Both Languages

1. Chuyển sang English và kiểm tra
2. Chuyển lại Vietnamese và kiểm tra
3. Refresh page để test localStorage persistence

---

## 📝 Common Patterns

### Pattern 1: Button Labels

```tsx
// Before
<button>Lưu</button>
<button>Hủy</button>
<button>Xóa</button>

// After
const { t } = useTranslation('common')
<button>{t('actions.save')}</button>
<button>{t('actions.cancel')}</button>
<button>{t('actions.delete')}</button>
```

### Pattern 2: Form Labels

```tsx
// Before
<Input label="Họ và tên" placeholder="Nhập họ và tên" />

// After
const { t } = useTranslation('common')
<Input
	label={t('form.fullName')}
	placeholder={t('form.placeholder.fullName')}
/>
```

### Pattern 3: Error Messages

```tsx
// Before
toast.error('Có lỗi xảy ra');

// After
const { t } = useTranslation('common');
toast.error(t('messages.error'));
```

### Pattern 4: Dynamic Content

```tsx
// Before
<p>Bạn có {count} lịch hẹn</p>

// After
const { t } = useTranslation('booking')
<p>{t('appointmentCount', { count })}</p>

// Translation JSON:
// "appointmentCount": "Bạn có {{count}} lịch hẹn"
```

---

## 🎯 Priority Order

Migrate theo thứ tự ưu tiên:

### 1. High Priority (Critical User-Facing)

- ✅ Authentication pages (Login, Register)
- ✅ Booking flow
- ✅ User profile
- ✅ Main navigation/header

### 2. Medium Priority

- Forms and validation messages
- Dashboard pages
- Settings pages
- Doctor/Hospital listing pages

### 3. Low Priority

- Static content pages
- Footer
- About Us, FAQ, Terms
- Admin-only pages

---

## 🔍 Example: Full Component Migration

### Before

```tsx
import { useState } from 'react';
import Input from '@/components/Input';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email) {
            alert('Vui lòng nhập email');
            return;
        }
        // ... login logic
        toast.success('Đăng nhập thành công');
    };

    return (
        <form onSubmit={handleSubmit}>
            <h1>Đăng nhập</h1>
            <Input
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email của bạn"
            />
            <Input
                label="Mật khẩu"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu"
            />
            <button type="submit">Đăng nhập</button>
            <p>
                Chưa có tài khoản? <a href="/register">Đăng ký ngay</a>
            </p>
        </form>
    );
};
```

### After

```tsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Input from '@/components/Input';

const LoginForm = () => {
    const { t } = useTranslation('auth');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email) {
            alert(t('login.validation.emailRequired'));
            return;
        }
        // ... login logic
        toast.success(t('login.success'));
    };

    return (
        <form onSubmit={handleSubmit}>
            <h1>{t('login.title')}</h1>
            <Input
                label={t('login.email')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('login.placeholder.email')}
            />
            <Input
                label={t('login.password')}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('login.placeholder.password')}
            />
            <button type="submit">{t('login.submit')}</button>
            <p>
                {t('login.noAccount')}
                <a href="/register">{t('login.signUp')}</a>
            </p>
        </form>
    );
};
```

**Translation Files:**

**`auth.json` (vi)**

```json
{
    "login": {
        "title": "Đăng nhập",
        "email": "Email",
        "password": "Mật khẩu",
        "submit": "Đăng nhập",
        "noAccount": "Chưa có tài khoản?",
        "signUp": "Đăng ký ngay",
        "success": "Đăng nhập thành công",
        "placeholder": {
            "email": "Nhập email của bạn",
            "password": "Nhập mật khẩu"
        },
        "validation": {
            "emailRequired": "Vui lòng nhập email"
        }
    }
}
```

**`auth.json` (en)**

```json
{
    "login": {
        "title": "Login",
        "email": "Email",
        "password": "Password",
        "submit": "Login",
        "noAccount": "Don't have an account?",
        "signUp": "Sign up now",
        "success": "Login successful",
        "placeholder": {
            "email": "Enter your email",
            "password": "Enter password"
        },
        "validation": {
            "emailRequired": "Please enter email"
        }
    }
}
```

---

## ✅ Quality Checklist

Sau khi migrate, đảm bảo:

- [ ] Không còn hardcoded text
- [ ] Tất cả keys đều có trong cả 2 ngôn ngữ
- [ ] Translations có ý nghĩa và tự nhiên
- [ ] Component hoạt động đúng ở cả 2 ngôn ngữ
- [ ] Không có missing keys trong console
- [ ] Layout không bị vỡ với text dài hơn
- [ ] Tests (nếu có) đã được update

---

## 🆘 Need Help?

Tham khảo:

- `I18N_GUIDE.md` - Hướng dẫn chi tiết
- `BasicInfoSection.tsx` - Component đã migrate mẫu
- `src/i18n/locales/` - Translation files có sẵn

---

**Happy Migrating! 🚀**
