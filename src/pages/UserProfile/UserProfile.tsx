import { useLocation } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import Breadcrumb from '../../components/Breadcrumb';
import Favourite from './Favourite';
import ProfileSidebar from './ProfileSidebar';
import PatientAppointments from './PatientAppointments';

// Mock user data
const mockUserData = {
    id: 'PT254654',
    fullName: 'Nguyễn Văn An',
    email: 'hendrita.hayes@example.com',
    phoneNumber: '+1 234 567 8900',
    avatarUrl: '/src/assets/img/doctor-grid/doctor-list-01.jpg',
    gender: 'Nữ',
    age: '24/02/2003',
    role: 'Bệnh nhân' as const,
    isActive: true,
    createdAt: '2023-01-15',
    updatedAt: '2024-01-15',
};

const UserProfile = () => {
    const location = useLocation();

    // Get active tab from query parameters
    const getActiveTab = () => {
        const urlParams = new URLSearchParams(location.search);
        const tab = urlParams.get('tab') || '';

        // Valid tabs
        const validTabs = [
            'dashboard',
            'appointments',
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
                    title: 'Wallet',
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
                return <PatientAppointments />;
            case 'favourites':
                return <Favourite />;
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
                            <ProfileSidebar userData={mockUserData} activeTab={getActiveTab()} />
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
