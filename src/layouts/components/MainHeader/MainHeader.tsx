import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { PATHS } from '@/routes/paths';
import { AppDispatch, RootState } from '@/store';
import { logoutAsync } from '@/store/slices/authSlice';
import { fetchUserProfile, clearUserProfile } from '@/store/slices/userSlice';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import useTheme from '@/hooks/useTheme';
interface HeaderProps {
    isHeaderMenu?: boolean;
}

const MainHeader: React.FC<HeaderProps> = ({ isHeaderMenu = true }) => {
    const { t } = useTranslation('header');
    const { isDark, setDarkMode } = useTheme();
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    const { profile } = useSelector((state: RootState) => state.user);

    // Fetch user profile when authenticated and not attempted yet
    useEffect(() => {
        if (isAuthenticated && profile === null) {
            dispatch(fetchUserProfile())
                .unwrap()
                .catch((error) => {
                    console.error('Failed to fetch user profile:', error);
                    toast.error('Không thể tải thông tin người dùng');
                });
        }
    }, [isAuthenticated, profile]);

    const handleLogout = async () => {
        try {
            await dispatch(logoutAsync()).unwrap();
            dispatch(clearUserProfile()); // Clear user profile from state
            toast.success('Đăng xuất thành công');
            navigate(PATHS.HOME); // Redirect to home page
        } catch (error: any) {
            console.error('Logout failed:', error);
            toast.error('Không thể đăng xuất. Vui lòng thử lại');
        }
    };

    return (
        <header className="header header-custom header-fixed inner-header relative">
            <div className="container">
                <nav className="navbar navbar-expand-lg header-nav">
                    <div className="navbar-header">
                        <Link to={PATHS.HOME} className="navbar-brand logo">
                            <img src="/src/assets/img/logo.svg" className="img-fluid" alt="Logo" />
                        </Link>
                    </div>
                    {isHeaderMenu && (
                        <div className="header-menu">
                            <div className="main-menu-wrapper">
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
                                </ul>
                            </div>
                            <ul className="nav header-navbar-rht">
                                <li className="header-theme noti-nav">
                                    <Link
                                        to="#"
                                        id="dark-mode-toggle"
                                        className={`theme-toggle ${!isDark ? 'activate' : ''}`}
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
                                                    src={
                                                        profile?.avatarUrl ||
                                                        '/src/assets/img/doctors-dashboard/profile-06.jpg'
                                                    }
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
                                                        src={
                                                            profile?.avatarUrl ||
                                                            '/src/assets/img/doctors-dashboard/profile-06.jpg'
                                                        }
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
                            </ul>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default MainHeader;
