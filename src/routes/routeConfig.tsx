// src/routes/routeConfig.tsx
import Demo from '@/pages/Demo';
import DateRangePickerDemo from '@/pages/Demo/DateRangePickerDemo';
import Home from '@/pages/Home';
import UserProfile from '@/pages/UserProfile';
import ScreenManagement from '@/pages/ScreenManagement';
import Chat from '@/pages/Chat';
import { RouteObject } from 'react-router-dom';
import Login from '@/pages/Authentication/Login';
import Register from '@/pages/Authentication/Register';
import ForgotPassword from '@/pages/Authentication/ForgotPassword';
import ResetPassword from '@/pages/Authentication/ResetPassword';
import DoctorProfile from '@/pages/Doctor/DoctorProfile';
import SpecialtiesList from '@/pages/Specialties/SpecialtiesList';
import SpecialtyDetail from '@/pages/Specialties/SpecialtyDetail/SpecialtyDetailPage';
import SubscriptionPlans from '@/pages/SubscriptionPlans';
import Hospital from '@/pages/Hospital/HospitalList';
import { PATHS } from './paths';
import FAQ from '@/pages/FAQ';
import Blog from '@/pages/Blog';
import BlogDetail from '@/pages/BlogDetail';
import MedicalTerms from '@/pages/MedicalTerms';
import CategoryArticles from '@/pages/CategoryBlogs';
import CategoryArticlesDemo from '@/pages/CategoryBlogsDemo';
import HospitalProfile from '@/pages/Hospital/HospitalProfile';
import AboutUs from '@/pages/AboutUs/AboutUs';
import DoctorList from '@/pages/Doctor/DoctorList';
import ContactUs from '@/pages/ContactUs';
import LegalNotice from '@/pages/LegalNotice/LegalNotice';
import PrivacyPolicy from '@/pages/PrivacyPolicy/PrivacyPolicy';
import RefundPolicy from '@/pages/RefundPolicy/RefundPolicy';
import Booking from '@/pages/Booking/Booking';
import BookingConfirmation from '@/pages/BookingConfirmation';
import RescheduleAppointment from '@/pages/Booking/RescheduleAppointment';
import ConfirmNewDoctor from '@/pages/Booking/ConfirmNewDoctor';
import RequestRefund from '@/pages/Booking/RequestRefund';
import ChooseNewDoctor from '@/pages/Booking/ChooseNewDoctor';
import ServiceCategories from '@/pages/MedicalService/ServiceCategories/ServiceCategoriesPage';
import SmartBooking from '@/pages/SmartBooking';
import ServiceList from '@/pages/MedicalService/MedicalService/MedicalServicePage';
import ServiceHospitals from '@/pages/MedicalService/ServiceHospital/ServiceHospitalPage';
import ServiceDetail from '@/pages/MedicalService/ServiceDetail/ServiceDetailPage';
import AISupportBooking from '@/pages/AISupportBooking';
import ContractSigningPage from '@/pages/ContractSigning/ContractSigningPage';
import ContractSigningSuccessPage from '@/pages/ContractSigning/ContractSigningSuccessPage';
import ProtectedRoute from '@/components/ProtectedRoute/ProtectedRoute';
import NotFound from '@/pages/Errors/NotFound';

const routes: RouteObject[] = [
    // Public routes
    {
        path: PATHS.HOME,
        element: <Home />,
    },
    {
        path: PATHS.FAQ,
        element: <FAQ />,
    },
    {
        path: PATHS.BLOG,
        element: <Blog />,
    },
    {
        path: PATHS.BLOG_DETAIL,
        element: <BlogDetail />,
    },
    {
        path: PATHS.MEDICAL_TERMS,
        element: <MedicalTerms />,
    },
    {
        path: PATHS.CATEGORY_ARTICLES,
        element: <CategoryArticles />,
    },
    {
        path: PATHS.CATEGORY_ARTICLES_DEMO,
        element: <CategoryArticlesDemo />,
    },
    {
        path: PATHS.SUBSCRIPTION_PLANS,
        element: <SubscriptionPlans />,
    },
    {
        path: PATHS.ABOUT_US,
        element: <AboutUs />,
    },
    {
        path: PATHS.CONTACT_US,
        element: <ContactUs />,
    },
    {
        path: PATHS.LEGAL_NOTICE,
        element: <LegalNotice />,
    },
    {
        path: PATHS.PRIVACY_POLICY,
        element: <PrivacyPolicy />,
    },
    {
        path: PATHS.REFUND_POLICY,
        element: <RefundPolicy />,
    },
    {
        path: PATHS.SMART_BOOKING,
        element: <SmartBooking />,
    },
    {
        path: PATHS.DEMO,
        element: <Demo />,
    },
    {
        path: PATHS.DEMO_DATE_RANGE_PICKER,
        element: <DateRangePickerDemo />,
    },
    {
        path: PATHS.HOSPITAL.ROOT,
        children: [
            { index: true, element: <Hospital /> },
            { path: PATHS.HOSPITAL.DETAIL, element: <HospitalProfile /> },
        ],
    },
    {
        path: PATHS.SPECIALTIES.ROOT,
        element: <SpecialtiesList />,
    },
    {
        path: PATHS.SPECIALTIES.DETAIL,
        element: <SpecialtyDetail />,
    },
    {
        path: PATHS.Service.ROOT,
        element: <ServiceList />,
    },
    {
        path: PATHS.Service.CATEGORIES,
        element: <ServiceCategories />,
    },
    {
        path: PATHS.Service.SERVICES,
        element: <ServiceHospitals />,
    },
    {
        path: PATHS.Service.DETAIL,
        element: <ServiceDetail />,
    },
    {
        path: PATHS.DOCTOR.ROOT,
        children: [
            { path: PATHS.DOCTOR.ROOT, element: <DoctorList />, index: true },
            { path: PATHS.DOCTOR.PROFILE, element: <DoctorProfile /> },
        ],
    },

    // Authentication routes (public - redirect if authenticated)
    {
        path: PATHS.LOGIN,
        element: <Login />,
    },
    {
        path: PATHS.REGISTER,
        element: <Register />,
    },
    {
        path: PATHS.FORGOT_PASSWORD,
        element: <ForgotPassword />,
    },
    {
        path: PATHS.RESET_PASSWORD,
        element: <ResetPassword />,
    },

    // Protected routes (require authentication)
    {
        path: PATHS.USER.ROOT,
        children: [
            {
                path: PATHS.USER.PROFILE,
                element: (
                    <ProtectedRoute>
                        <UserProfile />
                    </ProtectedRoute>
                ),
            },
        ],
    },
    {
        path: PATHS.CHAT,
        element: (
            <ProtectedRoute>
                <Chat />
            </ProtectedRoute>
        ),
    },
    {
        path: PATHS.AI_SUPPORT_BOOKING,
        element: (
            <ProtectedRoute>
                <AISupportBooking />
            </ProtectedRoute>
        ),
    },
    {
        path: PATHS.AI_SUPPORT_BOOKING_CHAT,
        element: (
            <ProtectedRoute>
                <AISupportBooking />
            </ProtectedRoute>
        ),
    },
    {
        path: PATHS.BOOKING.ROOT,
        element: (
            <ProtectedRoute>
                <Booking />
            </ProtectedRoute>
        ),
    },
    {
        path: PATHS.BOOKING.SERVICE,
        element: (
            <ProtectedRoute>
                <Booking />
            </ProtectedRoute>
        ),
    },
    {
        path: PATHS.BOOKING.HOSPITAL,
        element: (
            <ProtectedRoute>
                <Booking />
            </ProtectedRoute>
        ),
    },
    {
        path: PATHS.BOOKING.CONFIRMATION,
        element: (
            <ProtectedRoute>
                <BookingConfirmation />
            </ProtectedRoute>
        ),
    },
    {
        path: PATHS.BOOKING.RESCHEDULE,
        element: (
            <ProtectedRoute>
                <RescheduleAppointment />
            </ProtectedRoute>
        ),
    },
    {
        path: PATHS.BOOKING.CONFIRM_NEW_DOCTOR,
        element: (
            <ProtectedRoute>
                <ConfirmNewDoctor />
            </ProtectedRoute>
        ),
    },
    {
        path: PATHS.BOOKING.REQUEST_REFUND,
        element: (
            <ProtectedRoute>
                <RequestRefund />
            </ProtectedRoute>
        ),
    },
    {
        path: PATHS.BOOKING.CHOOSE_NEW_DOCTOR,
        element: (
            <ProtectedRoute>
                <ChooseNewDoctor />
            </ProtectedRoute>
        ),
    },
    {
        path: PATHS.CONTRACT_SIGNING.ROOT,
        element: (
            <ProtectedRoute>
                <ContractSigningPage />
            </ProtectedRoute>
        ),
    },
    {
        path: PATHS.CONTRACT_SIGNING.SUCCESS,
        element: (
            <ProtectedRoute>
                <ContractSigningSuccessPage />
            </ProtectedRoute>
        ),
    },
    {
        path: PATHS.SCREEN_MANAGEMENT,
        element: (
            <ProtectedRoute>
                <ScreenManagement />
            </ProtectedRoute>
        ),
    },
    {
        path: PATHS.DASHBOARD.ROOT,
        children: [
            {
                path: PATHS.DASHBOARD.ROOT,
                element: (
                    <ProtectedRoute>
                        <h1>Dashboard</h1>
                    </ProtectedRoute>
                ),
            },
            {
                path: PATHS.DASHBOARD.SETTINGS,
                element: (
                    <ProtectedRoute>
                        <h1>Setting</h1>
                    </ProtectedRoute>
                ),
            },
        ],
    },

    // 404 Not Found
    {
        path: PATHS.NOT_FOUND,
        element: <NotFound />,
    },
];

export default routes;
