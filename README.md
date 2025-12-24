# 👨‍⚕️ BookingCare - Hệ Thống Đặt Lịch Khám Bệnh (Patient Portal)

## 📋 Mục Lục

- [Giới Thiệu](#giới-thiệu)
- [Mô Tả Dự Án](#mô-tả-dự-án)
- [Tính Năng Chính](#tính-năng-chính)
- [Công Nghệ Sử Dụng](#công-nghệ-sử-dụng)
- [Yêu Cầu Hệ Thống](#yêu-cầu-hệ-thống)
- [Hướng Dẫn Cài Đặt](#hướng-dẫn-cài-đặt)
- [Hướng Dẫn Sử Dụng](#hướng-dẫn-sử-dụng)
- [Cấu Trúc Dự Án](#cấu-trúc-dự-án)
- [API Integration](#api-integration)
- [Troubleshooting](#troubleshooting)

## 🎯 Giới Thiệu

**BookingCare** là một ứng dụng web hiện đại cho phép bệnh nhân đặt lịch khám bệnh trực tuyến một cách dễ dàng và tiện lợi. Ứng dụng được xây dựng với React, TypeScript, và các công nghệ web tiên tiến nhất.

### Lợi Ích Cho Bệnh Nhân

- 🔍 Tìm kiếm bác sĩ chuyên môn dễ dàng
- 📅 Đặt lịch khám nhanh chóng trực tuyến
- 💳 Thanh toán an toàn qua nhiều phương thức
- 📱 Truy cập trên mọi thiết bị (desktop, tablet, mobile)
- 🔔 Nhận thông báo lịch khám sắp tới
- ⭐ Xem đánh giá từ bệnh nhân khác
- 📝 Quản lý lịch sử khám bệnh

## 📖 Mô Tả Dự Án

### Tổng Quan

Ứng dụng Patient Portal của BookingCare cung cấp một giao diện thân thiện, trực quan cho bệnh nhân để:

1. **Tìm kiếm và khám phá**: Tìm bác sĩ, bệnh viện, và dịch vụ y tế
2. **Đặt lịch**: Chọn ngày giờ khám phù hợp
3. **Thanh toán**: Thanh toán trực tuyến an toàn
4. **Quản lý**: Theo dõi và quản lý các lịch khám
5. **Giao tiếp**: Chat trực tuyến với bác sĩ
6. **Đánh giá**: Để lại feedback về dịch vụ

### Stack Công Nghệ Hiện Đại

Ứng dụng được xây dựng với các công nghệ mới nhất và best practices:

- **React 18** - Thư viện UI tiên tiến
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool nhanh
- **TailwindCSS** - Styling utility-first
- **Redux/RTK** - State management
- **React Router** - Routing
- **Axios** - HTTP client
- **Zod/React Hook Form** - Form validation
- **Jest/Vitest** - Testing framework

## ✨ Tính Năng Chính

### 1. 🔐 Xác Thực & Tài Khoản

- Đăng ký tài khoản mới
- Đăng nhập với email/password
- Quên mật khẩu & reset
- OAuth2 integration (Google, Facebook)
- Xác minh email/OTP
- Quản lý phiên đăng nhập

### 2. 👤 Hồ Sơ Bệnh Nhân

- Xem và chỉnh sửa thông tin cá nhân
- Thêm các thành viên gia đình
- Quản lý địa chỉ (nhà, công sở, ...)
- Lịch sử y tế cơ bản
- Cấu hỏa thông báo

### 3. 🔍 Tìm Kiếm & Khám Phá

- Tìm kiếm bác sĩ theo:
    - Chuyên khoa
    - Bệnh viện/phòng khám
    - Tên bác sĩ
    - Địa chỉ
    - Rating
    - Giá
- Lọc kết quả nâng cao
- Xem thông tin chi tiết bác sĩ
- Xem ảnh và video giới thiệu

### 4. 📅 Đặt Lịch Khám

- Chọn bác sĩ/dịch vụ
- Xem lịch khả dụng
- Chọn ngày/giờ phù hợp
- Thêm ghi chú/triệu chứng
- Chọn loại khám (trực tiếp/online)
- Xem chi tiết giá

### 5. 💳 Thanh Toán

- Thanh toán qua thẻ tín dụng/ghi nợ
- Chuyển khoản ngân hàng
- Ví điện tử (Momo, ZaloPay)
- Thanh toán tại phòng khám
- Tích hợp Stripe/PayPal
- Hoàn tiền tự động

### 6. 📜 Quản Lý Appointment

- Xem danh sách lịch khám
- Chi tiết appointment
- Xác nhận/hủy lịch
- Nhắc nhở trước khám
- Download hóa đơn
- Ghi chú sau khám

### 7. 💬 Giao Tiếp

- Chat trực tuyến với bác sĩ
- Video consultation
- Voice call
- Chia sẻ hình ảnh/tài liệu
- Lịch sử chat

### 8. ⭐ Đánh Giá & Nhận Xét

- Xem đánh giá từ bệnh nhân khác
- Để lại đánh giá ngay sau khám
- Xem rating trung bình
- Filter reviews theo rating
- Report review không hợp lệ

### 9. 🎁 Khuyến Mại & Voucher

- Xem các mã khuyến mại
- Nhập mã giảm giá
- Tích điểm reward
- Dùng điểm để giảm giá
- Lịch sử sử dụng voucher

### 10. 📊 Lịch Sử & Thống Kê

- Lịch sử tất cả khám bệnh
- Chi phí trên từng dịch vụ
- Bác sĩ thường xuyên
- Biểu đồ thống kê
- Export dữ liệu

### 11. 📱 Responsive Design

- Hoạt động tốt trên desktop
- Tối ưu cho tablet
- Mobile-first design
- Offline capabilities
- PWA support

### 12. 🌐 Đa Ngôn Ngữ

- Hỗ trợ Tiếng Việt
- Hỗ trợ Tiếng Anh
- Dễ dàng mở rộng
- Locale detection
- RTL support (sẵn sàng)

## 🛠 Công Nghệ Sử Dụng

### Frontend Framework

- **React 18** - UI library
- **TypeScript** - Type safety
- **JSX/TSX** - Component templates

### Build & Bundling

- **Vite** - Ultra-fast build tool
- **Rollup** - Module bundler
- **esbuild** - JavaScript bundler

### Styling

- **TailwindCSS** - Utility-first CSS
- **PostCSS** - CSS processing
- **CSS Modules** - Component scoping

### State Management

- **Redux Toolkit (RTK)** - State management
- **RTK Query** - Data fetching & caching
- **Recoil** (optional) - Atomic state

### Routing & Navigation

- **React Router v6** - Client-side routing
- **History API** - Browser history
- **Link prefetching** - Performance

### HTTP & API

- **Axios** - HTTP client
- **Fetch API** - Native fetching
- **Interceptors** - Request/response handling
- **Error handling** - Custom error handling

### Form Management

- **React Hook Form** - Form handling
- **Zod/Yup** - Schema validation
- **FluentValidation** - Custom validators
- **Field-level validation** - Async validation

### UI Components

- **Material-UI (MUI)** (optional)
- **Headless UI** - Unstyled components
- **Radix UI** - Accessible primitives
- **Custom components** - In-house built

### Testing

- **Vitest/Jest** - Unit testing
- **React Testing Library** - Component testing
- **Cypress/Playwright** - E2E testing
- **Mock Service Worker** - API mocking

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **Conventional Commits** - Commit standard

### Observability

- **Google Analytics** - Website analytics
- **Sentry** - Error tracking
- **LogRocket** - Session replay
- **Custom logging** - Application logs

### Performance

- **Code splitting** - Dynamic imports
- **Tree shaking** - Unused code removal
- **Lazy loading** - On-demand loading
- **Image optimization** - WebP support
- **Service Worker** - Offline support

## ✅ Yêu Cầu Hệ Thống

### Tối Thiểu

- **OS**: Windows 10+, macOS 10.14+, Linux
- **RAM**: 4GB
- **CPU**: 2 cores
- **Disk**: 500MB free space
- **Browser**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

### Khuyến Nghị

- **OS**: Windows 11, macOS 12+, Ubuntu 20.04+
- **RAM**: 8GB+
- **CPU**: 4+ cores
- **Disk**: 2GB SSD
- **Browser**: Latest Chrome/Firefox/Safari/Edge

### Phần Mềm Cần Thiết

#### Node.js

```bash
# Check version
node --version  # v18.0.0 or higher

# macOS (using Homebrew)
brew install node

# Windows
# Download from https://nodejs.org/

# Linux
# Follow https://nodejs.org/en/download/package-manager/
```

#### npm hoặc yarn

```bash
# npm (comes with Node.js)
npm --version

# yarn
npm install -g yarn
yarn --version
```

#### Git

```bash
# macOS
brew install git

# Windows
# Download from https://git-scm.com/download/win

# Linux
sudo apt-get install git
```

#### Docker (cho development)

```bash
brew install --cask docker
```

## 🚀 Hướng Dẫn Cài Đặt

### 1. Clone Repository

```bash
# Clone the repository
git clone https://github.com/Capstone-FA25-MABS/booking-care-system-ui.git
cd booking-care-system-ui

# Or if already cloned
git checkout develop
git pull origin develop
```

### 2. Cài Đặt Dependencies

```bash
# Using npm
npm install

# Or using yarn
yarn install

# Or using pnpm
pnpm install
```

**Thời gian cài đặt**: 2-5 phút (phụ thuộc tốc độ internet)

### 3. Thiết Lập Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env file
# macOS/Linux
nano .env

# Windows
notepad .env
```

**Cấu hình .env:**

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5001/api
VITE_API_GATEWAY_URL=http://localhost:5001
VITE_WEBSOCKET_URL=ws://localhost:5001

# Service URLs
VITE_AUTH_SERVICE_URL=http://localhost:6003
VITE_USER_SERVICE_URL=http://localhost:6016
VITE_DOCTOR_SERVICE_URL=http://localhost:6004
VITE_APPOINTMENT_SERVICE_URL=http://localhost:6002
VITE_PAYMENT_SERVICE_URL=http://localhost:6011

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_SENTRY=false
VITE_ENABLE_LOGROCKET=false

# OAuth Providers
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_FACEBOOK_APP_ID=your_facebook_app_id

# Payment Gateway
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key

# Other Configuration
VITE_APP_NAME=BookingCare
VITE_APP_VERSION=1.0.0
VITE_DEBUG_MODE=false
```

### 4. Khởi Động Development Server

```bash
# Start development server
npm run dev

# Or with yarn
yarn dev

# Server sẽ chạy tại http://localhost:3000
# Auto-reload khi bạn thay đổi code
```

### 5. Kiểm Tra Ứng Dụng

Mở browser và truy cập:

```
http://localhost:3000
```

Bạn sẽ thấy:

- HomePage với danh sách bác sĩ
- Search/Filter options
- Navigation bar với login button
- Footer với liên hệ

## 📖 Hướng Dẫn Sử Dụng

### Cho End Users (Bệnh Nhân)

#### 1. Đăng Ký Tài Khoản

```
1. Click "Đăng Ký" hoặc "Sign Up" ở header
2. Nhập email và mật khẩu
3. Nhập thông tin cá nhân:
   - Họ tên
   - Số điện thoại
   - Ngày sinh
   - Giới tính
   - Địa chỉ
4. Xác minh email (check inbox)
5. Đăng nhập
```

#### 2. Tìm Kiếm Bác Sĩ

```
1. Trên trang chủ, sử dụng search bar
2. Chọn "Chuyên khoa" (Cardiovascular, Dentistry, ...)
3. Hoặc nhập tên bác sĩ
4. Click "Tìm kiếm" hoặc nhấn Enter
5. Xem danh sách kết quả
```

#### 3. Xem Chi Tiết Bác Sĩ

```
1. Click vào bác sĩ trong danh sách
2. Xem thông tin:
   - Ảnh đại diện
   - Chuyên khoa
   - Kinh nghiệm
   - Giá khám
   - Đánh giá
   - Giờ làm việc
3. Xem calendar lịch trống
```

#### 4. Đặt Lịch Khám

```
1. Click nút "Đặt lịch" trên trang bác sĩ
2. Chọn ngày khám từ calendar
3. Chọn giờ phù hợp
4. Chọn loại khám:
   - Trực tiếp tại phòng khám
   - Online (nếu bác sĩ hỗ trợ)
5. Thêm ghi chú (triệu chứng, lịch sử bệnh, ...)
6. Review thông tin
7. Click "Xác nhận đặt lịch"
```

#### 5. Thanh Toán

```
1. Sau khi đặt lịch, chọn phương thức thanh toán:
   - Thẻ tín dụng/ghi nợ
   - Chuyển khoản ngân hàng
   - Ví điện tử
   - Thanh toán tại phòng
2. Nhập thông tin thanh toán
3. Xác nhận thanh toán
4. Nhận email xác nhận
```

#### 6. Quản Lý Lịch Khám

```
1. Click "Lịch khám của tôi" ở menu
2. Xem tất cả appointments
3. Sắp xếp theo ngày, trạng thái
4. Click vào appointment để:
   - Xem chi tiết
   - Hủy/Reschedule
   - Chat với bác sĩ
   - Download hóa đơn
```

#### 7. Đánh Giá Bác Sĩ

```
1. Sau khám xong, click "Đánh giá"
2. Chọn rating (1-5 sao)
3. Viết nhận xét
4. Thêm ảnh (nếu cần)
5. Click "Gửi đánh giá"
```

#### 8. Sử Dụng Voucher

```
1. Khi đặt lịch, scroll xuống
2. Tìm mục "Mã khuyến mại"
3. Nhập mã giảm giá
4. Click "Áp dụng"
5. Xem giá được giảm
```

### Cho Developers

#### Development Workflow

```bash
# 1. Tạo feature branch
git checkout -b feature/amazing-feature

# 2. Thực hiện thay đổi
# Edit files, add features

# 3. Run linter
npm run lint

# 4. Fix lint errors
npm run lint:fix

# 5. Run tests
npm run test

# 6. Run tests with coverage
npm run test:coverage

# 7. Build cho testing
npm run build

# 8. Preview production build
npm run preview

# 9. Commit changes
git add .
git commit -m "feat: add amazing feature"

# 10. Push to remote
git push origin feature/amazing-feature

# 11. Create Pull Request trên GitHub
```

#### Available Scripts

```bash
# Development
npm run dev                 # Start dev server (port 3000)
npm run dev:secure         # Start dev server with HTTPS

# Building
npm run build              # Build for production
npm run build:analyze      # Build with bundle analysis
npm run preview            # Preview production build locally

# Testing
npm run test               # Run unit tests
npm run test:watch        # Run tests in watch mode
npm run test:coverage     # Run tests with coverage report
npm run test:ui           # Run tests with UI

# Code Quality
npm run lint              # Run ESLint
npm run lint:fix          # Fix ESLint errors
npm run format            # Format code with Prettier
npm run format:check      # Check code formatting
npm run typecheck         # Run TypeScript type checking

# Code Analysis
npm run analyze:bundle    # Analyze bundle size
npm run analyze:lighthouse # Run Lighthouse audit

# Docker
npm run docker:build      # Build Docker image
npm run docker:run        # Run Docker container
npm run docker:stop       # Stop Docker container
```

## 📁 Cấu Trúc Dự Án

```
booking-care-system-ui/
├── src/
│   ├── App.tsx                         # Root component
│   ├── main.tsx                        # Entry point
│   ├── vite-env.d.ts                   # Vite types
│   │
│   ├── assets/                         # Static assets
│   │   ├── images/
│   │   │   ├── doctors/
│   │   │   ├── hospitals/
│   │   │   └── icons/
│   │   ├── styles/
│   │   │   ├── global.css
│   │   │   └── variables.css
│   │   └── sounds/
│   │
│   ├── components/                     # Reusable components
│   │   ├── Common/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Navigation.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── Auth/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   └── PasswordReset.tsx
│   │   ├── Doctor/
│   │   │   ├── DoctorCard.tsx
│   │   │   ├── DoctorDetails.tsx
│   │   │   ├── DoctorList.tsx
│   │   │   └── DoctorSearch.tsx
│   │   ├── Appointment/
│   │   │   ├── AppointmentForm.tsx
│   │   │   ├── AppointmentList.tsx
│   │   │   ├── AppointmentCard.tsx
│   │   │   └── SchedulePicker.tsx
│   │   ├── Payment/
│   │   │   ├── PaymentForm.tsx
│   │   │   ├── PaymentStatus.tsx
│   │   │   └── InvoiceViewer.tsx
│   │   ├── Review/
│   │   │   ├── ReviewForm.tsx
│   │   │   └── ReviewList.tsx
│   │   ├── Chat/
│   │   │   ├── ChatWindow.tsx
│   │   │   ├── ChatMessage.tsx
│   │   │   └── ChatList.tsx
│   │   └── UI/                         # UI primitives
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Modal.tsx
│   │       ├── Toast.tsx
│   │       └── ...
│   │
│   ├── pages/                          # Page components
│   │   ├── HomePage.tsx
│   │   ├── DoctorListPage.tsx
│   │   ├── DoctorDetailPage.tsx
│   │   ├── BookingPage.tsx
│   │   ├── PaymentPage.tsx
│   │   ├── AppointmentHistoryPage.tsx
│   │   ├── ProfilePage.tsx
│   │   ├── NotFoundPage.tsx
│   │   └── ...
│   │
│   ├── hooks/                          # Custom hooks
│   │   ├── useAuth.ts
│   │   ├── useApiRequest.ts
│   │   ├── useForm.ts
│   │   ├── usePagination.ts
│   │   ├── useLocalStorage.ts
│   │   └── ...
│   │
│   ├── services/                       # API services
│   │   ├── api.ts                      # Axios instance
│   │   ├── authService.ts
│   │   ├── doctorService.ts
│   │   ├── appointmentService.ts
│   │   ├── paymentService.ts
│   │   ├── reviewService.ts
│   │   └── ...
│   │
│   ├── store/                          # Redux store
│   │   ├── index.ts
│   │   ├── store.ts
│   │   ├── slices/
│   │   │   ├── authSlice.ts
│   │   │   ├── userSlice.ts
│   │   │   ├── appointmentSlice.ts
│   │   │   ├── uiSlice.ts
│   │   │   └── ...
│   │   └── thunks/
│   │       ├── authThunks.ts
│   │       ├── appointmentThunks.ts
│   │       └── ...
│   │
│   ├── utils/                          # Utility functions
│   │   ├── formatters.ts               # Date, currency, text formatting
│   │   ├── validators.ts               # Form validation rules
│   │   ├── constants.ts                # App constants
│   │   ├── errors.ts                   # Error handling
│   │   └── helpers.ts
│   │
│   ├── types/                          # TypeScript types
│   │   ├── index.ts
│   │   ├── api.ts                      # API response types
│   │   ├── domain.ts                   # Domain types
│   │   └── forms.ts
│   │
│   ├── constants/                      # App constants
│   │   ├── api.ts
│   │   ├── routes.ts
│   │   └── messages.ts
│   │
│   ├── contexts/                       # React contexts
│   │   ├── AuthContext.tsx
│   │   ├── ThemeContext.tsx
│   │   └── NotificationContext.tsx
│   │
│   ├── config/                         # Configuration
│   │   ├── api.config.ts
│   │   ├── app.config.ts
│   │   └── routes.config.ts
│   │
│   ├── i18n/                           # Internationalization
│   │   ├── i18n.ts
│   │   ├── locales/
│   │   │   ├── vi.json
│   │   │   └── en.json
│   │   └── types.ts
│   │
│   └── middleware/                     # Custom middleware
│       ├── logging.ts
│       └── errorBoundary.tsx
│
├── tests/                              # Test files
│   ├── unit/                           # Unit tests
│   │   ├── services/
│   │   ├── utils/
│   │   └── hooks/
│   ├── integration/                    # Integration tests
│   │   ├── pages/
│   │   └── flows/
│   ├── e2e/                            # End-to-end tests
│   │   └── cypress/
│   └── setup.ts
│
├── public/                             # Static files
│   ├── index.html
│   ├── manifest.json
│   ├── favicon.ico
│   └── robots.txt
│
├── .github/                            # GitHub config
│   ├── workflows/
│   │   ├── ci.yml
│   │   └── deploy.yml
│   └── ISSUE_TEMPLATE/
│
├── docs/                               # Documentation
│   ├── SETUP.md
│   ├── ARCHITECTURE.md
│   ├── COMPONENTS.md
│   ├── CUSTOM_HOOKS.md
│   ├── API_INTEGRATION.md
│   ├── I18N_GUIDE.md
│   └── DEPLOYMENT.md
│
├── .env.example                        # Environment template
├── .eslintrc.json                      # ESLint config
├── .prettierrc.json                    # Prettier config
├── vite.config.ts                      # Vite config
├── tsconfig.json                       # TypeScript config
├── vitest.config.ts                    # Vitest config
├── package.json                        # Dependencies & scripts
└── README.md                           # This file
```

## 🔌 API Integration

### API Service Structure

```typescript
// src/services/appointmentService.ts
import { api } from './api';
import { Appointment, CreateAppointmentDTO } from '@/types';

export const appointmentService = {
    // Lấy danh sách appointments
    getAppointments: async (params?: any) => {
        const { data } = await api.get<Appointment[]>('/appointments', { params });
        return data;
    },

    // Lấy chi tiết appointment
    getAppointment: async (id: string) => {
        const { data } = await api.get<Appointment>(`/appointments/${id}`);
        return data;
    },

    // Tạo appointment
    createAppointment: async (payload: CreateAppointmentDTO) => {
        const { data } = await api.post<Appointment>('/appointments', payload);
        return data;
    },

    // Hủy appointment
    cancelAppointment: async (id: string) => {
        const { data } = await api.delete(`/appointments/${id}`);
        return data;
    },
};
```

### Sử Dụng API trong Components

```typescript
// src/pages/AppointmentHistoryPage.tsx
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { fetchAppointments } from '@/store/thunks/appointmentThunks';

export const AppointmentHistoryPage = () => {
  const dispatch = useAppDispatch();
  const { appointments, loading, error } = useAppSelector(
    state => state.appointment
  );

  useEffect(() => {
    dispatch(fetchAppointments());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Lịch Khám Của Tôi</h1>
      {appointments.map(apt => (
        <AppointmentCard key={apt.id} appointment={apt} />
      ))}
    </div>
  );
};
```

## 🧪 Testing

### Unit Tests

```bash
# Run all tests
npm run test

# Run specific test file
npm run test appointmentService.test.ts

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### Test Example

```typescript
// src/__tests__/services/appointmentService.test.ts
import { describe, it, expect, vi } from 'vitest';
import { appointmentService } from '@/services';

describe('appointmentService', () => {
    it('should fetch appointments', async () => {
        const mockData = [{ id: '1', doctorId: 'doc1', date: '2024-01-01' }];

        vi.mock('@/services/api', () => ({
            api: {
                get: vi.fn().mockResolvedValue({ data: mockData }),
            },
        }));

        const result = await appointmentService.getAppointments();
        expect(result).toEqual(mockData);
    });
});
```

## 🐛 Troubleshooting

### Problem: Port 3000 already in use

```bash
# Option 1: Use different port
npm run dev -- --port 3001

# Option 2: Kill process on port 3000
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Problem: CORS errors when calling API

```
Error: Access to XMLHttpRequest blocked by CORS policy

Solution:
1. Check API_BASE_URL in .env
2. Verify backend CORS configuration
3. Use proxy in vite.config.ts:

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      }
    }
  }
})
```

### Problem: Blank page after build

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear build cache
rm -rf dist .vite

# Rebuild
npm run build
```

### Problem: Types not working in TypeScript

```bash
# Generate types from API responses
npm run generate:types

# Or install missing @types packages
npm install --save-dev @types/react @types/react-dom
```

## 📚 Tài Liệu Thêm

- [API Integration Guide](./docs/API_INTEGRATION.md)
- [Custom Hooks Guide](./docs/CUSTOM_API_HOOKS_GUIDE.md)
- [Architecture Guide](./docs/architecture.md)
- [i18n Implementation](./docs/I18N_GUIDE.md)
- [Redux Setup](./docs/REDUX_SETUP.md)

## 👥 Support & Kontribusi

### Báo Cáo Lỗi

1. Tìm kiếm trong [Issues](https://github.com/Capstone-FA25-MABS/booking-care-system-ui/issues)
2. Tạo issue mới với chi tiết:
    - Mô tả vấn đề
    - Steps to reproduce
    - Expected behavior
    - Actual behavior
    - Screenshots/logs

### Gửi Pull Requests

1. Fork repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit: `git commit -m 'feat: add amazing feature'`
4. Push: `git push origin feature/amazing-feature`
5. Open Pull Request

### Development Standards

- Code format: ESLint + Prettier
- Commits: Conventional Commits
- Testing: Minimum 80% coverage
- Documentation: Update docs with new features

## 📄 License

MIT License © 2025 BookingCare

## 👥 Team

- **Product Manager**: ...
- **Frontend Lead**: ...
- **UI/UX Designer**: ...
- **Development Team**: ...

---

**Last Updated**: December 2025  
**Version**: 1.0.0  
**Support**: support@bookingcare.com
