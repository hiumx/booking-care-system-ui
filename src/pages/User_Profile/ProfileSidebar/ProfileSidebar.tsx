import { Link } from 'react-router-dom';
import styles from './ProfileSidebar.module.scss';
interface UserData {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    avatarUrl: string;
    gender: string;
    age: string;
    role: 'Bệnh nhân' | 'Bác sĩ' | 'admin';
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

interface ProfileSidebarProps {
    userData: UserData;
    activeTab: string;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ userData, activeTab }) => {
    const isActive = (tab: string) => activeTab === tab;

    return (
        <div className="profile-sidebar patient-sidebar profile-sidebar-new">
            <div className="widget-profile pro-widget-content">
                <div className="profile-info-widget">
                    <Link to="/profile-settings" className="booking-doc-img">
                        <img src={userData.avatarUrl} alt="User Image" />
                    </Link>
                    <div className="profile-det-info">
                        <h3>
                            <Link to="/profile-settings" className={styles.textFullName}>
                                {userData.fullName}
                            </Link>
                        </h3>
                        <div className="patient-details">
                            <h5 className="mb-0">Vai trò : {userData.role}</h5>
                        </div>
                        <span>
                            Giới tính: {userData.gender} <i className="fa-solid fa-circle"></i>Ngày
                            sinh: {userData.age}
                        </span>
                    </div>
                </div>
            </div>
            <div className="dashboard-widget">
                <nav className="dashboard-menu">
                    <ul>
                        <li className={isActive('dashboard') ? 'active' : ''}>
                            <Link to="/user-profile?tab=dashboard">
                                <i className="isax isax-category-2"></i>
                                <span>Thông Tin Cá Nhân</span>
                            </Link>
                        </li>
                        <li className={isActive('appointments') ? 'active' : ''}>
                            <Link to="/user-profile?tab=appointments">
                                <i className="isax isax-calendar-1"></i>
                                <span>Lịch Hẹn Của Tôi</span>
                            </Link>
                        </li>
                        <li className={isActive('favourites') ? 'active' : ''}>
                            <Link to="/user-profile?tab=favourites">
                                <i className="isax isax-star-1"></i>
                                <span>Yêu Thích</span>
                            </Link>
                        </li>
                        <li className={isActive('dependent') ? 'active' : ''}>
                            <Link to="/user-profile?tab=dependent">
                                <i className="isax isax-user-octagon"></i>
                                <span>Lịch Sử Khám Bệnh</span>
                            </Link>
                        </li>

                        <li className={isActive('wallet') ? 'active' : ''}>
                            <Link to="/user-profile?tab=wallet">
                                <i className="isax isax-wallet-2"></i>
                                <span>Số dư tài khoản</span>
                            </Link>
                        </li>
                        <li className={isActive('invoices') ? 'active' : ''}>
                            <Link to="/user-profile?tab=invoices">
                                <i className="isax isax-document-text"></i>
                                <span>Hóa đơn</span>
                            </Link>
                        </li>
                        <li className={isActive('chat') ? 'active' : ''}>
                            <Link to="/user-profile?tab=chat">
                                <i className="isax isax-messages-1"></i>
                                <span>Tin nhắn</span>
                                <small className="unread-msg">7</small>
                            </Link>
                        </li>

                        <li className={isActive('settings') ? 'active' : ''}>
                            <Link to="/user-profile?tab=settings">
                                <i className="isax isax-setting-2"></i>
                                <span>Cài đặt</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/login">
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
