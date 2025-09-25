import React from 'react';
import { TabType } from '@/types/booking';
import { User, Building2, Stethoscope } from 'lucide-react';
import styles from './TabNavigation.module.scss';

interface TabNavigationProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
    resultCounts: {
        doctors: number;
        hospitals: number;
        services: number;
    };
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange, resultCounts }) => {
    const tabs = [
        { id: 'doctors' as TabType, label: 'Bác sĩ', icon: User, count: resultCounts.doctors },
        {
            id: 'hospitals' as TabType,
            label: 'Bệnh viện',
            icon: Building2,
            count: resultCounts.hospitals,
        },
        {
            id: 'services' as TabType,
            label: 'Dịch vụ',
            icon: Stethoscope,
            count: resultCounts.services,
        },
    ];

    return (
        <div className={styles.tabWrapper}>
            <ul className="nav nav-tabs border-0 d-flex justify-content-around position-relative m-0 p-0">
                {/* Underline indicator */}
                <div
                    className={styles.tabIndicator}
                    style={{
                        width: `${100 / tabs.length}%`,
                        left: `${tabs.findIndex((tab) => tab.id === activeTab) * (100 / tabs.length)}%`,
                    }}
                />
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <li className="nav-item flex-fill text-center" key={tab.id}>
                            <button
                                className={`${styles.tabBtn} btn w-100 py-3 d-flex align-items-center justify-content-center gap-2 fw-semibold ${
                                    isActive ? 'text-primary' : 'text-muted'
                                }`}
                                onClick={() => onTabChange(tab.id)}
                            >
                                <Icon size={18} />
                                <span className={styles.tabLabel}>{tab.label}</span>
                                {tab.count > 0 && (
                                    <span
                                        className={`${styles.tabBadge} badge rounded-pill ${
                                            isActive
                                                ? 'bg-primary text-white'
                                                : 'bg-light text-muted'
                                        }`}
                                    >
                                        {tab.count}
                                    </span>
                                )}
                            </button>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default TabNavigation;
