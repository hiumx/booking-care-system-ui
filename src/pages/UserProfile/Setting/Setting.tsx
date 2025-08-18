import { ReactNode } from 'react';

interface SettingProps {
    title: string;
    children: ReactNode;
    activeTab?: 'profile' | 'password';
    onTabClick?: (tab: 'profile' | 'password') => void;
}

const Setting: React.FC<SettingProps> = ({
    title,
    children,
    activeTab = 'profile',
    onTabClick,
}) => {
    const handleTabClick = (tab: 'profile' | 'password') => {
        if (onTabClick) {
            onTabClick(tab);
        }
    };

    return (
        <>
            <nav className="settings-tab mb-1">
                <ul className="nav nav-tabs-bottom" role="tablist">
                    <li className="nav-item" role="presentation">
                        <button
                            className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
                            onClick={() => handleTabClick('profile')}
                            type="button"
                        >
                            Thông tin cá nhân
                        </button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button
                            className={`nav-link ${activeTab === 'password' ? 'active' : ''}`}
                            onClick={() => handleTabClick('password')}
                            type="button"
                        >
                            Thay đổi mật khẩu
                        </button>
                    </li>
                </ul>
            </nav>
            <div className="card">
                <div className="card-body">
                    <div className="border-bottom pb-3 mb-3">
                        <h5>{title}</h5>
                    </div>
                    {children}
                </div>
            </div>
        </>
    );
};

export default Setting;
