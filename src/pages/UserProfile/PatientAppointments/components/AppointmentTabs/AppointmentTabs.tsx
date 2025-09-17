import React from 'react';
import clsx from 'clsx';

import { AppointmentStatus } from '../AppointmentTypes';
import styles from '../../PatientAppointments.module.scss';

interface AppointmentTabsProps {
    activeTab: AppointmentStatus;
    onTabChange: (tab: AppointmentStatus) => void;
    tabCounts: Record<AppointmentStatus, number>;
}

const AppointmentTabs: React.FC<AppointmentTabsProps> = ({ activeTab, onTabChange, tabCounts }) => {
    return (
        <div className={clsx(styles.appointmentTabs, 'appointment-tabs')}>
            <ul className={clsx(styles.navPills, 'nav nav-pills inner-tab')}>
                <li className={clsx(styles.navItem, 'nav-item')}>
                    <button
                        className={clsx(styles.navLink, 'nav-link', {
                            active: activeTab === 'upcoming',
                        })}
                        type="button"
                        onClick={() => onTabChange('upcoming')}
                    >
                        Sắp tới<span>{tabCounts.upcoming}</span>
                    </button>
                </li>
                <li className={clsx(styles.navItem, 'nav-item')}>
                    <button
                        className={clsx(styles.navLink, 'nav-link', {
                            active: activeTab === 'cancelled',
                        })}
                        type="button"
                        onClick={() => onTabChange('cancelled')}
                    >
                        Đã hủy<span>{tabCounts.cancelled}</span>
                    </button>
                </li>
                <li className={clsx(styles.navItem, 'nav-item')}>
                    <button
                        className={clsx(styles.navLink, 'nav-link', {
                            active: activeTab === 'completed',
                        })}
                        type="button"
                        onClick={() => onTabChange('completed')}
                    >
                        Hoàn thành<span>{tabCounts.completed}</span>
                    </button>
                </li>
            </ul>
        </div>
    );
};

export default AppointmentTabs;
