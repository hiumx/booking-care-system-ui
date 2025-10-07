import React, { useRef, useEffect } from 'react';
import clsx from 'clsx';

import Button from '@/components/Button';
import { FilterState } from './AppointmentTypes';
import styles from './AppointmentFilters.module.scss';

interface AppointmentFiltersProps {
    isOpen: boolean;
    onToggle: () => void;
    filterState: FilterState;
    onFilterSearchChange: (value: string) => void;
    onAppointmentTypeChange: (type: string, checked: boolean) => void;
    onVisitTypeChange: (type: string, checked: boolean) => void;
    onReset: () => void;
    onApply: () => void;
}

const AppointmentFilters: React.FC<AppointmentFiltersProps> = ({
    isOpen,
    onToggle,
    filterState,
    onFilterSearchChange,
    onAppointmentTypeChange,
    onVisitTypeChange,
    onReset,
    onApply,
}) => {
    const filterDropdownRef = useRef<HTMLDivElement>(null);

    // Close filter when clicking outside
    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (
                filterDropdownRef.current &&
                !filterDropdownRef.current.contains(event.target as Node)
            ) {
                onToggle();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onToggle]);

    return (
        <div
            ref={filterDropdownRef}
            className={clsx(styles.formSorts, 'form-sorts dropdown', {
                'table-filter-show': isOpen,
            })}
        >
            <button
                type="button"
                className={clsx(styles.dropdownToggle, 'dropdown-toggle btn')}
                id="table-filter"
                onClick={onToggle}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onToggle();
                    }
                }}
                aria-expanded={isOpen}
                aria-haspopup="true"
            >
                <i className="isax isax-filter me-2"></i>Lọc theo
            </button>
            <div className={clsx(styles.filterDropdownMenu, 'filter-dropdown-menu')}>
                <div className="filter-set-view">
                    <div className="accordion" id="accordionExample">
                        {/* Name Filter */}
                        <div className={clsx(styles.filterSetContent, 'filter-set-content')}>
                            <div
                                className={clsx(
                                    styles.filterSetContentHead,
                                    'filter-set-content-head'
                                )}
                            >
                                <button
                                    type="button"
                                    className="btn-link"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#collapseTwo"
                                    aria-expanded="false"
                                    aria-controls="collapseTwo"
                                >
                                    Tên
                                </button>
                            </div>
                            <div
                                className={clsx(
                                    styles.filterSetContents,
                                    'filter-set-contents accordion-collapse collapse show'
                                )}
                                id="collapseTwo"
                                data-bs-parent="#accordionExample"
                            >
                                <ul>
                                    <li>
                                        <div className="input-block dash-search-input w-100">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Tìm kiếm"
                                                value={filterState.filterSearchTerm}
                                                onChange={(e) =>
                                                    onFilterSearchChange(e.target.value)
                                                }
                                            />
                                            <span className="search-icon">
                                                <i className="isax isax-search-normal"></i>
                                            </span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Appointment Type Filter */}
                        <div className={clsx(styles.filterSetContent, 'filter-set-content')}>
                            <div
                                className={clsx(
                                    styles.filterSetContentHead,
                                    'filter-set-content-head'
                                )}
                            >
                                <button
                                    type="button"
                                    className="btn-link"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#collapseOne"
                                    aria-expanded="true"
                                    aria-controls="collapseOne"
                                >
                                    Loại cuộc hẹn{' '}
                                </button>
                            </div>
                            <div
                                className={clsx(
                                    styles.filterSetContents,
                                    'filter-set-contents accordion-collapse collapse show'
                                )}
                                id="collapseOne"
                                data-bs-parent="#accordionExample"
                            >
                                <ul>
                                    <li>
                                        <div className={clsx(styles.filterChecks, 'filter-checks')}>
                                            <label className={clsx(styles.checkBoxs, 'checkboxs')}>
                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        filterState.appointmentTypeFilters.allType
                                                    }
                                                    onChange={(e) =>
                                                        onAppointmentTypeChange(
                                                            'allType',
                                                            e.target.checked
                                                        )
                                                    }
                                                />
                                                <span className="checkmarks"></span>{' '}
                                                <span className="check-title">Tất cả</span>
                                            </label>
                                        </div>
                                    </li>
                                    <li>
                                        <div className={clsx(styles.filterChecks, 'filter-checks')}>
                                            <label className={clsx(styles.checkBoxs, 'checkboxs')}>
                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        filterState.appointmentTypeFilters
                                                            .telehealth
                                                    }
                                                    onChange={(e) =>
                                                        onAppointmentTypeChange(
                                                            'telehealth',
                                                            e.target.checked
                                                        )
                                                    }
                                                />
                                                <span className="checkmarks"></span>{' '}
                                                <span className="check-title">Trực tuyến</span>
                                            </label>
                                        </div>
                                    </li>
                                    <li>
                                        <div className={clsx(styles.filterChecks, 'filter-checks')}>
                                            <label className={clsx(styles.checkBoxs, 'checkboxs')}>
                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        filterState.appointmentTypeFilters
                                                            .directVisit
                                                    }
                                                    onChange={(e) =>
                                                        onAppointmentTypeChange(
                                                            'directVisit',
                                                            e.target.checked
                                                        )
                                                    }
                                                />
                                                <span className="checkmarks"></span>{' '}
                                                <span className="check-title">Khám trực tiếp</span>
                                            </label>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Visit Type Filter */}
                        <div className={clsx(styles.filterSetContent, 'filter-set-content')}>
                            <div
                                className={clsx(
                                    styles.filterSetContentHead,
                                    'filter-set-content-head'
                                )}
                            >
                                <button
                                    type="button"
                                    className="btn-link"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#collapseThree"
                                    aria-expanded="false"
                                    aria-controls="collapseThree"
                                >
                                    Loại khám
                                </button>
                            </div>
                            <div
                                className={clsx(
                                    styles.filterSetContents,
                                    'filter-set-contents accordion-collapse collapse show'
                                )}
                                id="collapseThree"
                                data-bs-parent="#accordionExample"
                            >
                                <ul>
                                    <li>
                                        <div className={clsx(styles.filterChecks, 'filter-checks')}>
                                            <label className={clsx(styles.checkBoxs, 'checkboxs')}>
                                                <input
                                                    type="checkbox"
                                                    checked={filterState.visitTypeFilters.allVisit}
                                                    onChange={(e) =>
                                                        onVisitTypeChange(
                                                            'allVisit',
                                                            e.target.checked
                                                        )
                                                    }
                                                />
                                                <span className="checkmarks"></span>{' '}
                                                <span className="check-title">Tất cả</span>
                                            </label>
                                        </div>
                                    </li>
                                    <li>
                                        <div className={clsx(styles.filterChecks, 'filter-checks')}>
                                            <label className={clsx(styles.checkBoxs, 'checkboxs')}>
                                                <input
                                                    type="checkbox"
                                                    checked={filterState.visitTypeFilters.general}
                                                    onChange={(e) =>
                                                        onVisitTypeChange(
                                                            'general',
                                                            e.target.checked
                                                        )
                                                    }
                                                />
                                                <span className="checkmarks"></span>{' '}
                                                <span className="check-title">Khám tổng quát</span>
                                            </label>
                                        </div>
                                    </li>
                                    <li>
                                        <div className={clsx(styles.filterChecks, 'filter-checks')}>
                                            <label className={clsx(styles.checkBoxs, 'checkboxs')}>
                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        filterState.visitTypeFilters.consultation
                                                    }
                                                    onChange={(e) =>
                                                        onVisitTypeChange(
                                                            'consultation',
                                                            e.target.checked
                                                        )
                                                    }
                                                />
                                                <span className="checkmarks"></span>{' '}
                                                <span className="check-title">Tư vấn</span>
                                            </label>
                                        </div>
                                    </li>
                                    <li>
                                        <div className={clsx(styles.filterChecks, 'filter-checks')}>
                                            <label className={clsx(styles.checkBoxs, 'checkboxs')}>
                                                <input
                                                    type="checkbox"
                                                    checked={filterState.visitTypeFilters.followUp}
                                                    onChange={(e) =>
                                                        onVisitTypeChange(
                                                            'followUp',
                                                            e.target.checked
                                                        )
                                                    }
                                                />
                                                <span className="checkmarks"></span>{' '}
                                                <span className="check-title">Tái khám</span>
                                            </label>
                                        </div>
                                    </li>
                                    <li>
                                        <div className={clsx(styles.filterChecks, 'filter-checks')}>
                                            <label className={clsx(styles.checkBoxs, 'checkboxs')}>
                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        filterState.visitTypeFilters.directVisit
                                                    }
                                                    onChange={(e) =>
                                                        onVisitTypeChange(
                                                            'directVisit',
                                                            e.target.checked
                                                        )
                                                    }
                                                />
                                                <span className="checkmarks"></span>{' '}
                                                <span className="check-title">Khám trực tiếp</span>
                                            </label>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className={clsx(styles.filterResetBtn, 'filter-reset-btns')}>
                        <Button
                            text="Đặt lại"
                            type="button"
                            className={clsx(styles.btnLight, 'btn-md btn-light rounded-pill')}
                            onClick={onReset}
                        />
                        <Button
                            text="Lọc ngay"
                            type="button"
                            className="btn-md btn-primary-gradient rounded-pill"
                            onClick={onApply}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AppointmentFilters;
