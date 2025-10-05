import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { UserProfile, getGenderText } from '@/types/user.types';
import { AppDispatch } from '@/store';
import { logoutAsync } from '@/store/slices/authSlice';
import { clearUserProfile } from '@/store/slices/userSlice';
import { PATHS } from '@/routes/paths';
import styles from './ProfileSidebar.module.scss';

interface ProfileSidebarProps {
    userData: UserProfile | null;
    activeTab: string;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ userData, activeTab }) => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const isActive = (tab: string) => activeTab === tab;

    // Helper function to format date of birth
    const formatDateOfBirth = (dateString: string | undefined) => {
        if (!dateString) return 'Chưa cập nhật';

        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('vi-VN');
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
            toast.success('Đăng xuất thành công');
            navigate(PATHS.HOME); // Redirect to home page
        } catch (error: any) {
            console.error('Logout failed:', error);
            toast.error('Không thể đăng xuất. Vui lòng thử lại');
        }
    };

    // Show loading state if no user data
    if (!userData) {
        return (
            <div className="profile-sidebar patient-sidebar profile-sidebar-new">
                <div className="widget-profile pro-widget-content">
                    <div className="profile-info-widget text-center">
                        <p>Đang tải thông tin...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-sidebar patient-sidebar profile-sidebar-new">
            <div className="widget-profile pro-widget-content">
                <div className="profile-info-widget">
                    <Link to="/profile-settings" className="booking-doc-img">
                        <img
                            src={userData.avatarUrl || '/assets/img/default-avatar-male.png'}
                            alt={`${userData.fullName} avatar`}
                        />
                    </Link>
                    <div className="profile-det-info">
                        <h3>
                            <Link to="/profile-settings" className={styles.textFullName}>
                                {userData.fullName}
                            </Link>
                        </h3>
                        <div className="patient-details">
                            <h5 className="mb-0">Vai trò : Bệnh nhân</h5>
                        </div>
                        <span>
                            Giới tính: {getGenderText(userData.gender)}{' '}
                            <i className="fa-solid fa-circle"></i>Ngày sinh:{' '}
                            {formatDateOfBirth(userData.dateOfBirth)}
                        </span>
                    </div>
                </div>
            </div>
            <div className="dashboard-widget">
                <nav className="dashboard-menu">
                    <ul>
                        <li className={isActive('dashboard') ? 'active' : ''}>
                            <Link to="/user/profile?tab=dashboard">
                                <i className="isax isax-category-2"></i>
                                <span>Thông Tin Cá Nhân</span>
                            </Link>
                        </li>
                        <li className={isActive('appointments') ? 'active' : ''}>
                            <Link to="/user/profile?tab=appointments">
                                <i className="isax isax-calendar-1"></i>
                                <span>Lịch Hẹn Của Tôi</span>
                            </Link>
                        </li>
                        <li className={isActive('favourites') ? 'active' : ''}>
                            <Link to="/user/profile?tab=favourites">
                                <i className="isax isax-star-1"></i>
                                <span>Yêu Thích</span>
                            </Link>
                        </li>
                        <li className={isActive('dependent') ? 'active' : ''}>
                            <Link to="/user/profile?tab=dependent">
                                <i className="isax isax-user-octagon"></i>
                                <span>Lịch Sử Khám Bệnh</span>
                            </Link>
                        </li>

                        <li className={isActive('wallet') ? 'active' : ''}>
                            <Link to="/user/profile?tab=wallet">
                                <i className="isax isax-wallet-2"></i>
                                <span>Số dư tài khoản</span>
                            </Link>
                        </li>
                        <li className={isActive('invoices') ? 'active' : ''}>
                            <Link to="/user/profile?tab=invoices">
                                <i className="isax isax-document-text"></i>
                                <span>Hóa đơn</span>
                            </Link>
                        </li>
                        <li className={isActive('chat') ? 'active' : ''}>
                            <Link to="/chat">
                                <i className="isax isax-messages-1"></i>
                                <span>Tin nhắn</span>
                                <small className="unread-msg">7</small>
                            </Link>
                        </li>

                        <li className={isActive('settings') ? 'active' : ''}>
                            <Link to="/user/profile?tab=settings">
                                <i className="isax isax-setting-2"></i>
                                <span>Cài đặt</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="#" onClick={handleLogout}>
                                <i className="isax isax-logout"></i>
                                <span>Đăng xuất</span>
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default ProfileSidebar;
