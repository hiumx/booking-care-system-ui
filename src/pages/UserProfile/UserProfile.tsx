import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import MainLayout from '@/layouts/MainLayout';
import Breadcrumb from '@/components/Breadcrumb';
import Favourite from './Favourite';
import ProfileSidebar from './ProfileSidebar';
import Appointments from './Appointments';
import AppointmentDetailPage from './Appointments/AppointmentDetailPage';
import SettingsContainer from './Setting/SettingsContainer/SettingsContainer';
import Invoices from './Invoices';
import Wallet from './Wallet';
import { RootState } from '@/store';

const UserProfile = () => {
    const location = useLocation();
    const { profile } = useSelector((state: RootState) => state.user);

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
            'dependent',
            'medical-records',
            'wallet',
            'invoices',
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

        switch (activeTab) {
            case 'appointments':
                return {
                    items: [...baseItems, { label: 'My Appointments', isActive: true }],
                    title: 'My Appointments',
                };
            case 'favourites':
                return {
                    items: [...baseItems, { label: 'Favourites', isActive: true }],
                    title: 'Favourites',
                };
            case 'dependent':
                return {
                    items: [...baseItems, { label: 'Dependants', isActive: true }],
                    title: 'Dependants',
                };
            case 'medical-records':
                return {
                    items: [...baseItems, { label: 'Medical Records', isActive: true }],
                    title: 'Medical Records',
                };
            case 'wallet':
                return {
                    items: [...baseItems, { label: 'Wallet', isActive: true }],
                    title: 'Lịch sử hoàn tiền',
                };
            case 'invoices':
                return {
                    items: [...baseItems, { label: 'Invoices', isActive: true }],
                    title: 'Invoices',
                };
            case 'chat':
                return {
                    items: [...baseItems, { label: 'Messages', isActive: true }],
                    title: 'Messages',
                };
            case 'vitals':
                return {
                    items: [...baseItems, { label: 'Vitals', isActive: true }],
                    title: 'Vitals',
                };
            case 'settings':
                return {
                    items: [...baseItems, { label: 'Settings', isActive: true }],
                    title: 'Settings',
                };
            default:
                return {
                    items: [...baseItems, { label: 'Dashboard', isActive: true }],
                    title: 'Dashboard',
                };
        }
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
                return <Favourite />;

            case 'wallet':
                return <Wallet />;
            case 'settings':
                return <SettingsContainer />;
            case 'invoices':
                return <Invoices />;
            default:
                return <Favourite />; // Default to favourites
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
