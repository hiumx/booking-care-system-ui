import React from 'react';
import clsx from 'clsx';

import styles from '../../PatientAppointments.module.scss';

interface AppointmentHeaderProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    onListView?: () => void;
    onGridView?: () => void;
    isListView?: boolean;
}

const AppointmentHeader: React.FC<AppointmentHeaderProps> = ({
    searchTerm,
    onSearchChange,
    onListView,
    onGridView,
    isListView = true,
}) => {
    return (
        <div className={clsx(styles.dashboardHeader, 'dashboard-header')}>
            <h3>Lịch hẹn Của Tôi</h3>
            <ul className={clsx(styles.headerListBtns, 'header-list-btns')}>
                <li>
                    <div className={clsx(styles.dashSearchInput, 'input-block dash-search-input')}>
                        <input
                            type="text"
                            className={clsx(styles.formControl, 'form-control')}
                            placeholder="Tìm kiếm bác sĩ"
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                        />
                        <span className="search-icon">
                            <i className="isax isax-search-normal"></i>
                        </span>
                    </div>
                </li>
                <li>
                    <div className="view-icons">
                        <button
                            type="button"
                            className={clsx('btn-icon', { active: isListView })}
                            aria-label="List view"
                            onClick={onListView}
                        >
                            <i className="isax isax-grid-7"></i>
                        </button>
                    </div>
                </li>
                <li>
                    <div className="view-icons">
                        <button
                            type="button"
                            className={clsx('btn-icon', { active: !isListView })}
                            aria-label="Grid view"
                            onClick={onGridView}
                        >
                            <i className="fa-solid fa-th"></i>
                        </button>
                    </div>
                </li>
            </ul>
        </div>
    );
};

export default AppointmentHeader;
