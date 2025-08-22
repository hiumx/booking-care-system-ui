import { useState } from 'react';
import Setting from '../Setting';
import Profile from '../Profile';
import ChangePassword from '../ChangePassword';

type TabType = 'profile' | 'password';

const SettingsContainer = () => {
    const [activeTab, setActiveTab] = useState<TabType>('profile');

    const handleTabClick = (tab: TabType) => {
        setActiveTab(tab);
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return <Profile />;
            case 'password':
                return <ChangePassword />;
            default:
                return <Profile />;
        }
    };

    const getTitle = () => {
        switch (activeTab) {
            case 'profile':
                return 'Thiết lập hồ sơ';
            case 'password':
                return 'Thay đổi mật khẩu';
            default:
                return 'Thiết lập hồ sơ';
        }
    };

    return (
        <Setting title={getTitle()} activeTab={activeTab} onTabClick={handleTabClick}>
            {renderContent()}
        </Setting>
    );
};

export default SettingsContainer;
