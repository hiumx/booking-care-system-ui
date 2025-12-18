import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { UserProfile, getGenderText } from '@/types/user.types';
import { AppDispatch, RootState } from '@/store';
import { logoutAsync } from '@/store/slices/authSlice';
import { clearUserProfile } from '@/store/slices/userSlice';
import { PATHS } from '@/routes/paths';
import styles from './ProfileSidebar.module.scss';

interface ProfileSidebarProps {
    userData: UserProfile | null;
    activeTab: string;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ userData, activeTab }) => {
    const { t, i18n } = useTranslation('userProfile');
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { unreadCount } = useSelector((state: RootState) => state.notification);
    const { unreadMessageCount } = useSelector((state: RootState) => state.user);

    const isActive = (tab: string) => activeTab === tab;

    // Helper function to format full name based on current language
    // Vietnamese: lastName firstName (e.g., Nguyễn Văn A)
    // English: firstName lastName (e.g., A Nguyen Van)
    const formatFullName = (firstName?: string, lastName?: string) => {
        if (!firstName && !lastName) return t('sidebar.notUpdated');
        if (i18n.language === 'vi') {
            return `${firstName || ''} ${lastName || ''}`.trim();
        }
        return `${lastName || ''} ${firstName || ''}`.trim();
    };

    // Helper function to format date of birth based on current language
    const formatDateOfBirth = (dateString: string | undefined) => {
        if (!dateString) return t('sidebar.notUpdated');

        try {
            const date = new Date(dateString);
            const locale = i18n.language === 'vi' ? 'vi-VN' : 'en-US';
            return date.toLocaleDateString(locale);
        } catch {
            return dateString;
        }
    };

    // Handle logout
    const handleLogout = async (e: React.MouseEvent) => {
        e.preventDefault();
        try {
            await dispatch(logoutAsync()).unwrap();
            dispatch(clearUserProfile()); // Clear user profile from state
            toast.success(t('sidebar.toast.logoutSuccess'));
            navigate(PATHS.HOME); // Redirect to home page
        } catch (error: any) {
            console.error('Logout failed:', error);
            toast.error(t('sidebar.toast.logoutError'));
        }
    };

    // Show loading state if no user data
    if (!userData) {
        return (
            <div className="profile-sidebar patient-sidebar profile-sidebar-new">
                <div className="widget-profile pro-widget-content">
                    <div className="profile-info-widget text-center">
                        <p>{t('sidebar.loading')}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-sidebar patient-sidebar profile-sidebar-new">
            <div className="widget-profile pro-widget-content">
                <div className="profile-info-widget">
                    <Link
                        to={PATHS.USER.ROOT + '/' + PATHS.USER.PROFILE + '?tab=settings'}
                        className="booking-doc-img"
                    >
                        <img
                            src={userData.avatarUrl || '/assets/img/default-avatar-male.png'}
                            alt={`${formatFullName(userData.firstName, userData.lastName)} avatar`}
                            className={styles.avatarImage}
                        />
                    </Link>
                    <div className="profile-det-info">
                        <h3>
                            <Link
                                to={PATHS.USER.ROOT + '/' + PATHS.USER.PROFILE + '?tab=settings'}
                                className={styles.textFullName}
                            >
                                {formatFullName(userData.firstName, userData.lastName)}
                            </Link>
                        </h3>
                        <div className="patient-details">
                            <h5 className="mb-0">
                                {t('sidebar.role')} : {t('sidebar.patient')}
                            </h5>
                        </div>
                        <span>
                            {t('sidebar.gender')}: {getGenderText(userData.gender)}{' '}
                            <i className="fa-solid fa-circle"></i>
                            {t('sidebar.dateOfBirth')}: {formatDateOfBirth(userData.dateOfBirth)}
                        </span>
                    </div>
                </div>
            </div>
            <div className="dashboard-widget">
                <nav className="dashboard-menu">
                    <ul>
                        <li className={isActive('appointments') ? 'active' : ''}>
                            <Link to="/user/profile?tab=appointments">
                                <i className="isax isax-calendar-1"></i>
                                <span>{t('sidebar.menu.appointments')}</span>
                            </Link>
                        </li>
                        <li className={isActive('favourites') ? 'active' : ''}>
                            <Link to="/user/profile?tab=favourites">
                                <i className="isax isax-star-1"></i>
                                <span>{t('sidebar.menu.favourites')}</span>
                            </Link>
                        </li>
                        <li className={isActive('relatives') ? 'active' : ''}>
                            <Link to="/user/profile?tab=relatives">
                                <i className="isax isax-people"></i>
                                <span>{t('sidebar.menu.relatives')}</span>
                            </Link>
                        </li>
                        <li className={isActive('wallet') ? 'active' : ''}>
                            <Link to="/user/profile?tab=wallet">
                                <i className="isax isax-wallet-2"></i>
                                <span>{t('sidebar.menu.wallet')}</span>
                            </Link>
                        </li>
                        <li className={isActive('invoices') ? 'active' : ''}>
                            <Link to="/user/profile?tab=invoices">
                                <i className="isax isax-document-text"></i>
                                <span>{t('sidebar.menu.invoices')}</span>
                            </Link>
                        </li>
                        <li className={isActive('notifications') ? 'active' : ''}>
                            <Link to="/user/profile?tab=notifications">
                                <i className="isax isax-notification-bing"></i>
                                <span>{t('sidebar.menu.notifications')}</span>
                                {unreadCount > 0 && (
                                    <small className="unread-msg">{unreadCount}</small>
                                )}
                            </Link>
                        </li>
                        <li className={isActive('chat') ? 'active' : ''}>
                            <Link to="/chat">
                                <i className="isax isax-messages-1"></i>
                                <span>{t('sidebar.menu.chat')}</span>
                                {unreadMessageCount > 0 && (
                                    <small className="unread-msg">{unreadMessageCount}</small>
                                )}
                            </Link>
                        </li>

                        <li className={isActive('settings') ? 'active' : ''}>
                            <Link to="/user/profile?tab=settings">
                                <i className="isax isax-setting-2"></i>
                                <span>{t('sidebar.menu.settings')}</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="#" onClick={handleLogout}>
                                <i className="isax isax-logout"></i>
                                <span>{t('sidebar.menu.logout')}</span>
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default ProfileSidebar;
