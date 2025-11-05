import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { PATHS } from '@/routes/paths';
import { AppDispatch, RootState } from '@/store';
import { logoutAsync } from '@/store/slices/authSlice';
import { fetchUserProfile, clearUserProfile } from '@/store/slices/userSlice';
import LanguageSwitcher from '@/components/LanguageSwitcher';
interface HeaderProps {
    isHeaderMenu?: boolean;
}

const MainHeader: React.FC<HeaderProps> = ({ isHeaderMenu = true }) => {
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
                            <ul className="nav header-navbar-rht">
                                <li className="header-theme noti-nav">
                                    <a href="#" id="dark-mode-toggle" className="theme-toggle">
                                        <i className="isax isax-sun-1"></i>
                                    </a>
                                    <a
                                        href="#"
                                        id="light-mode-toggle"
                                        className="theme-toggle activate"
                                    >
                                        <i className="isax isax-moon"></i>
                                    </a>
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
                                            <span className="user-img">
                                                <img
                                                    className="rounded-circle"
                                                    src={
                                                        profile?.avatarUrl ||
                                                        '/src/assets/img/doctors-dashboard/profile-06.jpg'
                                                    }
                                                    width="31"
                                                    alt={profile?.fullName || 'User Avatar'}
                                                />
                                            </span>
                                        </Link>
                                        <div className="dropdown-menu dropdown-menu-end">
                                            <div className="user-header">
                                                <div className="avatar avatar-sm">
                                                    <img
                                                        src={
                                                            profile?.avatarUrl ||
                                                            '/src/assets/img/doctors-dashboard/profile-06.jpg'
                                                        }
                                                        alt={`${profile?.fullName || 'User'} avatar`}
                                                        className="avatar-img rounded-circle"
                                                    />
                                                </div>
                                                <div className="user-text">
                                                    <h6>{profile?.fullName}</h6>
                                                    <p className="text-muted mb-0">Bệnh nhân</p>
                                                </div>
                                            </div>
                                            <Link
                                                className="dropdown-item"
                                                to={
                                                    PATHS.USER.ROOT +
                                                    '/' +
                                                    PATHS.USER.PROFILE +
                                                    '?tab=dashboard'
                                                }
                                            >
                                                Dashboard
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
                                                Thông tin cá nhân
                                            </Link>
                                            <Link
                                                to="#"
                                                className="dropdown-item"
                                                onClick={handleLogout}
                                            >
                                                Đăng xuất
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
                                                Đăng nhập
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to={PATHS.REGISTER}
                                                className="btn btn-md btn-dark d-inline-flex align-items-center rounded-pill"
                                            >
                                                <i className="isax isax-user-tick me-1"></i>
                                                Đăng ký
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
