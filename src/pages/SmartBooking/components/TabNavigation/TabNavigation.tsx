import React from 'react';
import { TabType } from '../types/booking';
import { User, Building2, Stethoscope } from 'lucide-react';

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
        <div className="container-fluid">
            <div className="row justify-content-center mb-4">
                <div className="col-12 col-lg-8">
                    <div className="bg-white rounded-pill p-2 shadow border">
                        <div className="d-flex position-relative">
                            {/* Active tab indicator */}
                            <div
                                className="position-absolute bg-primary rounded-pill shadow"
                                style={{
                                    top: '8px',
                                    bottom: '8px',
                                    width: '33.333%',
                                    left: `${tabs.findIndex((tab) => tab.id === activeTab) * 33.333}%`,
                                    transition: 'all 0.3s ease-out',
                                    zIndex: 1,
                                }}
                            />

                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;

                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => onTabChange(tab.id)}
                                        className={`flex-fill position-relative px-4 py-3 rounded-pill fw-semibold border-0 d-flex align-items-center justify-content-center ${
                                            isActive ? 'text-white' : 'text-muted bg-transparent'
                                        }`}
                                        style={{
                                            transition: 'all 0.3s ease',
                                            zIndex: 2,
                                            backgroundColor: isActive
                                                ? 'transparent'
                                                : 'transparent',
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!isActive) {
                                                e.currentTarget.style.color = '#0d6efd';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!isActive) {
                                                e.currentTarget.style.color = '#6c757d';
                                            }
                                        }}
                                    >
                                        <Icon size={20} className="me-2" />
                                        <span>{tab.label}</span>
                                        {tab.count > 0 && (
                                            <span
                                                className={`ms-2 px-2 py-1 rounded-pill small ${
                                                    isActive
                                                        ? 'bg-light bg-opacity-25 text-white'
                                                        : 'bg-primary bg-opacity-10 text-primary'
                                                }`}
                                            >
                                                {tab.count}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TabNavigation;
