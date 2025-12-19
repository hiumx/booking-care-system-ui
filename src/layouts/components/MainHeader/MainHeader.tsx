import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import clsx from 'clsx';
import { PATHS } from '@/routes/paths';
import { AppDispatch, RootState } from '@/store';
import { logoutAsync } from '@/store/slices/authSlice';
import {
    fetchUserProfile,
    clearUserProfile,
    fetchUnreadMessageCount,
} from '@/store/slices/userSlice';
import {
    fetchNotifications,
    fetchNotificationSummary,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearNotifications,
    fetchNotificationCountsByType,
} from '@/store/slices/notificationSlice';
import { getLocalizedNotification } from '@/types/notification.types';
import { signalRService } from '@/services/signalr.service';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { formatDistanceToNow } from 'date-fns';
import { vi, enUS } from 'date-fns/locale';
import useTheme from '@/hooks/useTheme';
import logo from '@/assets/img/logo_medcure.png';
import profile06 from '@/assets/img/doctors-dashboard/profile-06.jpg';
import styles from './MainHeader.module.scss';
interface HeaderProps {
    isHeaderMenu?: boolean;
}

const MainHeader: React.FC<HeaderProps> = ({ isHeaderMenu = true }) => {
    const { t } = useTranslation('header');
    const { isDark, setDarkMode } = useTheme();
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { i18n } = useTranslation();
    const currentLanguage = (i18n.language || 'vi') as 'vi' | 'en';

    const { isAuthenticated, accessToken } = useSelector((state: RootState) => state.auth);
    const { profile, unreadMessageCount } = useSelector((state: RootState) => state.user);
    const { notifications, unreadCount } = useSelector((state: RootState) => state.notification);

    const [showNotifications, setShowNotifications] = useState(false);
    const notificationRef = useRef<HTMLLIElement>(null);

    // Fetch user profile when authenticated and not attempted yet
    useEffect(() => {
        if (isAuthenticated && profile === null) {
            dispatch(fetchUserProfile())
                .unwrap()
                .catch((error) => {
                    console.error('Failed to fetch user profile:', error);
                    toast.error(t('toast.loadProfileError'));
                });
        }
    }, [isAuthenticated, profile, dispatch]);

    // Fetch unread message count when authenticated and profile is available
    useEffect(() => {
        if (isAuthenticated && profile?.accountId) {
            dispatch(fetchUnreadMessageCount(profile.accountId));
        }
    }, [isAuthenticated, profile?.accountId, dispatch]);

    // Initialize SignalR and fetch notifications when authenticated
    useEffect(() => {
        if (isAuthenticated && accessToken) {
            // Initialize SignalR connection
            signalRService
                .initialize(dispatch, accessToken)
                .then(() => {
                    console.log('[MainHeader] SignalR connected');
                })
                .catch((error) => {
                    console.error('[MainHeader] SignalR connection failed:', error);
                });

            // Fetch 5 unread notifications for dropdown
            dispatch(fetchNotifications({ pageNumber: 1, pageSize: 5, isRead: false }));
            dispatch(fetchNotificationSummary());

            return () => {
                // Cleanup: disconnect SignalR when component unmounts or user logs out
                signalRService.stop().then(() => {
                    console.log('[MainHeader] SignalR disconnected');
                });
            };
        } else {
            // Clear notifications when user logs out
            dispatch(clearNotifications());
        }
    }, [isAuthenticated, accessToken, dispatch]);

    // Close notification dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                notificationRef.current &&
                !notificationRef.current.contains(event.target as Node)
            ) {
                setShowNotifications(false);
            }
        };

        if (showNotifications) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showNotifications]);

    const handleLogout = async () => {
        try {
            await dispatch(logoutAsync()).unwrap();
            dispatch(clearUserProfile()); // Clear user profile from state
            dispatch(clearNotifications()); // Clear notifications
            toast.success(t('toast.logoutSuccess'));
            navigate(PATHS.HOME); // Redirect to home page
        } catch (error: unknown) {
            console.error('Logout failed:', error);
            toast.error(t('toast.logoutError'));
        }
    };

    const handleNotificationClick = async (notificationId: string, actionUrl?: string) => {
        try {
            await dispatch(markNotificationAsRead(notificationId)).unwrap();
            await dispatch(fetchNotificationCountsByType(false)).unwrap();
            // Close dropdown using Bootstrap API
            if (notificationRef.current) {
                const dropdownElement = notificationRef.current.querySelector('.dropdown-menu');
                if (dropdownElement) {
                    dropdownElement.classList.remove('show');
                }
            }

            if (actionUrl) {
                navigate(actionUrl);
            }
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await dispatch(markAllNotificationsAsRead()).unwrap();
            await dispatch(fetchNotificationCountsByType(false)).unwrap();
            toast.success(t('notification.markedAllRead'));
        } catch (error) {
            console.error('Failed to mark all as read:', error);
            toast.error(t('notification.markAllError'));
        }
    };

    const formatNotificationTime = (createdAt: string) => {
        const locale = currentLanguage === 'en' ? enUS : vi;
        const formatted = formatDistanceToNow(new Date(createdAt), {
            addSuffix: true,
            locale,
        });
        // Remove "about" prefix for Vietnamese
        return currentLanguage === 'vi'
            ? formatted.replace('khoảng ', '')
            : formatted.replace('about ', '');
    };

    return (
        <header className="header header-custom header-fixed inner-header relative">
            <div className="container">
                <nav className="navbar navbar-expand-lg header-nav">
                    <div className="navbar-header">
                        <Link to={PATHS.HOME} className="navbar-brand logo">
                            <img src={logo} className="img-fluid" alt="Logo" />
                        </Link>
                    </div>
                    {isHeaderMenu && (
                        <div className="header-menu">
                            <div className={clsx('main-menu-wrapper', styles.mainMenuWrapper)}>
                                <div className="menu-header">
                                    <Link to={PATHS.HOME} className="menu-logo">
                                        <img
                                            src="assets/img/logo.svg"
                                            className="img-fluid"
                                            alt="Logo"
                                        />
                                    </Link>
                                    <Link to="#" id="menu_close" className="menu-close">
                                        <i className="fas fa-times"></i>
                                    </Link>
                                </div>
                                <ul className="main-nav">
                                    <li className="has-submenu">
                                        <Link to="#">
                                            {t('menu.booking.title')}{' '}
                                            <i className="fas fa-chevron-down"></i>
                                        </Link>
                                        <ul className="submenu">
                                            <li>
                                                <Link to={PATHS.DOCTOR.ROOT}>
                                                    {t('menu.booking.doctor')}
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to={PATHS.HOSPITAL.ROOT}>
                                                    {t('menu.booking.hospital')}
                                                </Link>
                                            </li>
                                        </ul>
                                    </li>
                                    <li className="has-submenu">
                                        <Link to="#">
                                            {t('menu.medicalServices.title')}{' '}
                                            <i className="fas fa-chevron-down"></i>
                                        </Link>
                                        <ul className="submenu">
                                            <li>
                                                <Link to={PATHS.SPECIALTIES.ROOT}>
                                                    {t('menu.medicalServices.specialty')}
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="#">
                                                    {t('menu.medicalServices.healthPackage')}
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="#">
                                                    {t('menu.medicalServices.onlineConsultation')}
                                                </Link>
                                            </li>
                                        </ul>
                                    </li>
                                    <li className="has-submenu">
                                        <Link to="#">
                                            {t('menu.health.title', 'Sức khỏe của bạn')}{' '}
                                            <i className="fas fa-chevron-down"></i>
                                        </Link>
                                        <ul className="submenu">
                                            <li>
                                                <Link to={PATHS.NUTRITION.ONBOARDING}>
                                                    {t(
                                                        'menu.health.setupProfile',
                                                        'Thiết lập hồ sơ sức khỏe'
                                                    )}
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to={PATHS.NUTRITION.DASHBOARD}>
                                                    {t('menu.health.dashboard', 'Bảng điều khiển')}
                                                </Link>
                                            </li>
                                        </ul>
                                    </li>
                                    <li className="has-submenu">
                                        <Link to="#">
                                            {t('menu.news.title')}{' '}
                                            <i className="fas fa-chevron-down"></i>
                                        </Link>
                                        <ul className="submenu">
                                            <li>
                                                <Link to="#">{t('menu.news.serviceNews')}</Link>
                                            </li>
                                            <li>
                                                <Link to="#">{t('menu.news.healthNews')}</Link>
                                            </li>
                                        </ul>
                                    </li>
                                    <li className="has-submenu">
                                        <Link to={PATHS.CONTACT_US}>{t('menu.contact')}</Link>
                                    </li>
                                    <li className="has-submenu">
                                        <Link to={PATHS.ABOUT_US}>{t('menu.aboutUs')}</Link>
                                    </li>
                                </ul>
                            </div>
                            <ul className="nav header-navbar-rht">
                                <li className="header-theme noti-nav">
                                    <Link
                                        to="#"
                                        id="dark-mode-toggle"
                                        className={`theme-toggle ${isDark ? '' : 'activate'}`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setDarkMode(true);
                                        }}
                                    >
                                        <i className="isax isax-sun-1"></i>
                                    </Link>
                                    <Link
                                        to="#"
                                        id="light-mode-toggle"
                                        className={`theme-toggle ${isDark ? 'activate' : ''}`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setDarkMode(false);
                                        }}
                                    >
                                        <i className="isax isax-moon"></i>
                                    </Link>
                                </li>
                                {isAuthenticated && (
                                    <>
                                        <li
                                            className="nav-item dropdown noti-nav me-3 pe-0"
                                            ref={notificationRef}
                                        >
                                            <Link
                                                to="#"
                                                className="dropdown-toggle nav-link p-0"
                                                data-bs-toggle="dropdown"
                                                style={{ position: 'relative' }}
                                            >
                                                <i className="isax isax-notification-bing"></i>
                                                {unreadCount > 0 && (
                                                    <span
                                                        className="badge badge-pill bg-danger"
                                                        style={{
                                                            position: 'absolute',
                                                            top: '-8px',
                                                            right: '-9px',
                                                            fontSize: '10px',
                                                            padding: '2px 6px',
                                                            minWidth: '12px',
                                                            height: '14px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            borderRadius: '10px',
                                                            fontWeight: '600',
                                                        }}
                                                    >
                                                        {unreadCount > 99 ? '99+' : unreadCount}
                                                    </span>
                                                )}
                                            </Link>
                                            <div className="dropdown-menu notifications dropdown-menu-end">
                                                <div className="topnav-dropdown-header">
                                                    <span className="notification-title">
                                                        {t('notification.title')}
                                                    </span>
                                                    {unreadCount > 0 && (
                                                        <button
                                                            type="button"
                                                            className="clear-noti"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                handleMarkAllAsRead();
                                                            }}
                                                            style={{
                                                                background: 'none',
                                                                border: 'none',
                                                                color: '#0d6efd',
                                                                cursor: 'pointer',
                                                                fontSize: '13px',
                                                                fontWeight: 500,
                                                                padding: 0,
                                                            }}
                                                        >
                                                            {t('notification.markAllRead')}
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="noti-content">
                                                    <ul className="notification-list">
                                                        {notifications.length === 0 ? (
                                                            <li className="notification-message">
                                                                <div className="text-center py-3">
                                                                    <p className="text-muted">
                                                                        {t(
                                                                            'notification.noNotifications'
                                                                        )}
                                                                    </p>
                                                                </div>
                                                            </li>
                                                        ) : (
                                                            notifications.map((notification) => {
                                                                const localizedNotification =
                                                                    getLocalizedNotification(
                                                                        notification,
                                                                        currentLanguage
                                                                    );
                                                                return (
                                                                    <li
                                                                        key={notification.id}
                                                                        className="notification-message"
                                                                    >
                                                                        <Link
                                                                            to="#"
                                                                            onClick={(e) => {
                                                                                e.preventDefault();
                                                                                handleNotificationClick(
                                                                                    notification.id,
                                                                                    notification.actionUrl
                                                                                );
                                                                            }}
                                                                        >
                                                                            <div className="notify-block d-flex">
                                                                                <span
                                                                                    className="avatar"
                                                                                    style={{
                                                                                        width: '40px',
                                                                                        height: '40px',
                                                                                        borderRadius:
                                                                                            '50%',
                                                                                        backgroundColor:
                                                                                            '#e3f2fd',
                                                                                        display:
                                                                                            'flex',
                                                                                        alignItems:
                                                                                            'center',
                                                                                        justifyContent:
                                                                                            'center',
                                                                                        flexShrink: 0,
                                                                                    }}
                                                                                >
                                                                                    <i
                                                                                        className={
                                                                                            notification.icon ||
                                                                                            'isax isax-notification'
                                                                                        }
                                                                                        style={{
                                                                                            fontSize:
                                                                                                '20px',
                                                                                            color: '#1976d2',
                                                                                        }}
                                                                                    ></i>
                                                                                </span>
                                                                                <div className="media-body">
                                                                                    <div
                                                                                        style={{
                                                                                            display:
                                                                                                'flex',
                                                                                            justifyContent:
                                                                                                'space-between',
                                                                                            alignItems:
                                                                                                'flex-start',
                                                                                            marginBottom:
                                                                                                '4px',
                                                                                        }}
                                                                                    >
                                                                                        <h6
                                                                                            style={{
                                                                                                marginBottom: 0,
                                                                                            }}
                                                                                        >
                                                                                            {
                                                                                                localizedNotification.title
                                                                                            }
                                                                                        </h6>
                                                                                        {!notification.isRead && (
                                                                                            <span
                                                                                                className="badge bg-danger"
                                                                                                style={{
                                                                                                    fontSize:
                                                                                                        '10px',
                                                                                                    padding:
                                                                                                        '2px 8px',
                                                                                                    marginLeft:
                                                                                                        '8px',
                                                                                                }}
                                                                                            >
                                                                                                {t(
                                                                                                    'notification.new'
                                                                                                )}
                                                                                            </span>
                                                                                        )}
                                                                                    </div>
                                                                                    <p className="noti-details">
                                                                                        {
                                                                                            localizedNotification.content
                                                                                        }
                                                                                    </p>
                                                                                    <span
                                                                                        className="notification-time"
                                                                                        style={{
                                                                                            display:
                                                                                                'flex',
                                                                                            alignItems:
                                                                                                'center',
                                                                                            gap: '4px',
                                                                                            fontSize:
                                                                                                '12px',
                                                                                            color: '#6c757d',
                                                                                        }}
                                                                                    >
                                                                                        <i
                                                                                            className="isax isax-clock"
                                                                                            style={{
                                                                                                fontSize:
                                                                                                    '14px',
                                                                                            }}
                                                                                        ></i>
                                                                                        {formatNotificationTime(
                                                                                            notification.createdAt
                                                                                        )}
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                        </Link>
                                                                    </li>
                                                                );
                                                            })
                                                        )}
                                                    </ul>
                                                </div>
                                                <div
                                                    className="topnav-dropdown-footer"
                                                    style={{
                                                        borderTop: '1px solid #e9ecef',
                                                        padding: '5px 0',
                                                        textAlign: 'center',
                                                        backgroundColor: '#f8f9fa',
                                                    }}
                                                >
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            // Close dropdown
                                                            if (notificationRef.current) {
                                                                const dropdownElement =
                                                                    notificationRef.current.querySelector(
                                                                        '.dropdown-menu'
                                                                    );
                                                                if (dropdownElement) {
                                                                    dropdownElement.classList.remove(
                                                                        'show'
                                                                    );
                                                                }
                                                            }
                                                            // Navigate to notifications page
                                                            navigate(
                                                                `${PATHS.USER.ROOT}/${PATHS.USER.PROFILE}?tab=notifications`
                                                            );
                                                        }}
                                                        style={{
                                                            background: 'none',
                                                            border: 'none',
                                                            color: '#0d6efd',
                                                            fontWeight: 500,
                                                            fontSize: '14px',
                                                            cursor: 'pointer',
                                                            padding: '8px 16px',
                                                            width: '100%',
                                                            transition: 'color 0.2s ease',
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            e.currentTarget.style.color = '#0a58ca';
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.color = '#0d6efd';
                                                        }}
                                                    >
                                                        {t('notification.viewAll')}
                                                    </button>
                                                </div>
                                            </div>
                                        </li>
                                        <li className="nav-item noti-nav me-3 pe-0">
                                            <Link
                                                to={PATHS.CHAT}
                                                className="nav-link p-0"
                                                style={{ position: 'relative' }}
                                            >
                                                <i className="isax isax-message-2"></i>
                                                {unreadMessageCount > 0 && (
                                                    <span
                                                        className="badge badge-pill bg-success"
                                                        style={{
                                                            position: 'absolute',
                                                            top: '-8px',
                                                            right: '-9px',
                                                            fontSize: '10px',
                                                            padding: '2px 6px',
                                                            minWidth: '12px',
                                                            height: '14px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            borderRadius: '10px',
                                                            fontWeight: '600',
                                                        }}
                                                    >
                                                        {unreadMessageCount > 99
                                                            ? '99+'
                                                            : unreadMessageCount}
                                                    </span>
                                                )}
                                            </Link>
                                        </li>
                                    </>
                                )}
                                <li className="nav-item">
                                    <LanguageSwitcher />
                                </li>
                                {isAuthenticated ? (
                                    <li className="nav-item dropdown has-arrow logged-item">
                                        <Link
                                            to={
                                                PATHS.USER.ROOT +
                                                '/' +
                                                PATHS.USER.PROFILE +
                                                '?tab=dashboard'
                                            }
                                            className="nav-link ps-0"
                                            data-bs-toggle="dropdown"
                                        >
                                            <span
                                                className="user-img"
                                                style={{
                                                    width: '31px',
                                                    height: '31px',
                                                    display: 'inline-block',
                                                    overflow: 'hidden',
                                                    borderRadius: '50%',
                                                }}
                                            >
                                                <img
                                                    className="rounded-circle"
                                                    src={profile?.avatarUrl || profile06}
                                                    width="31"
                                                    height="31"
                                                    style={{
                                                        objectFit: 'cover',
                                                        width: '100%',
                                                        height: '100%',
                                                        display: 'block',
                                                    }}
                                                    alt={profile?.fullName || 'User Avatar'}
                                                />
                                            </span>
                                        </Link>
                                        <div className="dropdown-menu dropdown-menu-end">
                                            <div className="user-header">
                                                <div
                                                    className="avatar avatar-sm"
                                                    style={{
                                                        overflow: 'hidden',
                                                        borderRadius: '50%',
                                                    }}
                                                >
                                                    <img
                                                        src={profile?.avatarUrl || profile06}
                                                        alt={`${profile?.fullName || 'User'} avatar`}
                                                        className="avatar-img rounded-circle"
                                                        style={{
                                                            objectFit: 'cover',
                                                            width: '100%',
                                                            height: '100%',
                                                            display: 'block',
                                                        }}
                                                    />
                                                </div>
                                                <div className="user-text">
                                                    <h6>{profile?.fullName}</h6>
                                                    <p className="text-muted mb-0">
                                                        {t('user.patient')}
                                                    </p>
                                                </div>
                                            </div>
                                            <Link
                                                className="dropdown-item"
                                                to={
                                                    PATHS.USER.ROOT +
                                                    '/' +
                                                    PATHS.USER.PROFILE +
                                                    '?tab=appointments'
                                                }
                                            >
                                                {t('user.appointments')}
                                            </Link>
                                            <Link
                                                className="dropdown-item"
                                                to={
                                                    PATHS.USER.ROOT +
                                                    '/' +
                                                    PATHS.USER.PROFILE +
                                                    '?tab=settings'
                                                }
                                            >
                                                {t('user.profile')}
                                            </Link>
                                            <Link
                                                to="#"
                                                className="dropdown-item"
                                                onClick={handleLogout}
                                            >
                                                {t('auth.logout')}
                                            </Link>
                                        </div>
                                    </li>
                                ) : (
                                    <>
                                        <li>
                                            <Link
                                                to={PATHS.LOGIN}
                                                className="btn btn-md btn-primary-gradient d-inline-flex align-items-center rounded-pill"
                                            >
                                                <i className="isax isax-lock-1 me-1"></i>
                                                {t('auth.login')}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to={PATHS.REGISTER}
                                                className="btn btn-md btn-dark d-inline-flex align-items-center rounded-pill"
                                            >
                                                <i className="isax isax-user-tick me-1"></i>
                                                {t('auth.register')}
                                            </Link>
                                        </li>
                                    </>
                                )}
                                {/* Quick Booking CTA Button - Animated border light effect */}
                                <li className="nav-item quick-booking-btn">
                                    <Link to={PATHS.HOSPITAL.ROOT} className="quick-booking-link">
                                        <span className="light-span"></span>
                                        <span className="light-span"></span>
                                        <span className="light-span"></span>
                                        <span className="light-span"></span>
                                        <i className="isax isax-calendar-tick me-1"></i>
                                        <span>{t('menu.quickBooking', 'Đặt khám nhanh')}</span>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default MainHeader;
