import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import MainLayout from '@/layouts/MainLayout';
import Breadcrumb from '@/components/Breadcrumb';
import Favourite from './Favourite';
import ProfileSidebar from './ProfileSidebar';
import Appointments from './Appointments';
import AppointmentDetailPage from './Appointments/AppointmentDetailPage';
import SettingsContainer from './Setting/SettingsContainer/SettingsContainer';
import Invoices from './Invoices';
import Wallet from './Wallet';
import Notifications from './Notifications';
import PatientRelatives from './PatientRelatives';
import { RootState, AppDispatch } from '@/store';
import { fetchUnreadMessageCount } from '@/store/slices/userSlice';

const UserProfile = () => {
    const location = useLocation();
    const dispatch = useDispatch<AppDispatch>();
    const { profile } = useSelector((state: RootState) => state.user);

    // Fetch unread message count when profile is loaded
    useEffect(() => {
        if (profile?.accountId) {
            dispatch(fetchUnreadMessageCount(profile.accountId));
        }
    }, [profile?.accountId, dispatch]);

    // Get active tab from query parameters
    const getActiveTab = () => {
        const urlParams = new URLSearchParams(location.search);
        const tab = urlParams.get('tab') || '';

        // Valid tabs
        const validTabs = [
            'dashboard',
            'appointments',
            'appointment-detail',
            'favourites',
            'relatives',
            'dependent',
            'medical-records',
            'wallet',
            'invoices',
            'notifications',
            'chat',
            'vitals',
            'settings',
        ];

        return validTabs.includes(tab) ? tab : 'favourites'; // Default to favourites
    };

    // Get active sidebar tab (appointment-detail should show appointments as active)
    const getActiveSidebarTab = () => {
        const activeTab = getActiveTab();
        // If viewing appointment detail, keep appointments active in sidebar
        return activeTab === 'appointment-detail' ? 'appointments' : activeTab;
    };

    // Get breadcrumb items and title based on active tab
    const getBreadcrumbData = () => {
        const activeTab = getActiveTab();

        const baseItems = [
            { label: '', path: '/', isActive: false },
            { label: 'Patient', isActive: false },
        ];

        // Tab configuration map - eliminates switch statement duplication
        const tabConfig: Record<string, { label: string; title: string }> = {
            appointments: { label: 'My Appointments', title: 'My Appointments' },
            favourites: { label: 'Favourites', title: 'Favourites' },
            relatives: { label: 'Người Thân', title: 'Quản lý người thân' },
            dependent: { label: 'Dependants', title: 'Dependants' },
            'medical-records': { label: 'Medical Records', title: 'Medical Records' },
            wallet: { label: 'Wallet', title: 'Lịch sử hoàn tiền' },
            invoices: { label: 'Invoices', title: 'Invoices' },
            notifications: { label: 'Notifications', title: 'Danh sách thông báo' },
            chat: { label: 'Messages', title: 'Messages' },
            vitals: { label: 'Vitals', title: 'Vitals' },
            settings: { label: 'Settings', title: 'Settings' },
        };

        // Get config for active tab or default to dashboard
        const config = tabConfig[activeTab] || { label: 'Dashboard', title: 'Dashboard' };

        return {
            items: [...baseItems, { label: config.label, isActive: true }],
            title: config.title,
        };
    };

    // Render content based on active tab
    const renderContent = () => {
        const activeTab = getActiveTab();

        switch (activeTab) {
            case 'appointments':
                return <Appointments />;
            case 'appointment-detail':
                return <AppointmentDetailPage />;
            case 'favourites':
                return <Favourite patientId={profile?.id} />;
            case 'relatives':
                return <PatientRelatives />;
            case 'wallet':
                return <Wallet />;
            case 'settings':
                return <SettingsContainer />;
            case 'invoices':
                return <Invoices patientId={profile?.id} profile={profile} />;
            case 'notifications':
                return <Notifications />;
            default:
                return <Favourite patientId={profile?.id} />; // Default to favourites
        }
    };

    const breadcrumbData = getBreadcrumbData();

    return (
        <MainLayout>
            <Breadcrumb items={breadcrumbData.items} title={breadcrumbData.title} />
            <div className="content doctor-content">
                <div className="container">
                    <div className="row">
                        {/* Profile Sidebar */}
                        <div className="col-lg-4 col-xl-3 theiaStickySidebar">
                            <ProfileSidebar userData={profile} activeTab={getActiveSidebarTab()} />
                        </div>

                        {/* Main Content */}
                        <div className="col-lg-8 col-xl-9">{renderContent()}</div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default UserProfile;
