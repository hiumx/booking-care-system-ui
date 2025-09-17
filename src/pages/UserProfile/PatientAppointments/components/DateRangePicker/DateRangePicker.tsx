import React, { useRef, useEffect } from 'react';
import clsx from 'clsx';

import Button from '@/components/Button';
import styles from '../../PatientAppointments.module.scss';

interface DateRangePickerProps {
    isOpen: boolean;
    onToggle: () => void;
    fromDate: string;
    toDate: string;
    dateRange: string;
    onDateSelection: (date: string) => void;
    onClear: () => void;
    onApply: () => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
    isOpen,
    onToggle,
    fromDate,
    toDate,
    dateRange,
    onDateSelection,
    onClear,
    onApply,
}) => {
    const calendarRef = useRef<HTMLDivElement>(null);

    // Close calendar when clicking outside
    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
                onToggle();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onToggle]);

    const getDateSelectionLabel = () => {
        if (!fromDate) return 'Nhấn để chọn ngày bắt đầu';
        if (!toDate) return 'Nhấn để chọn ngày kết thúc';
        return 'Đã chọn khoảng ngày';
    };

    const getSelectedRangeText = () => {
        if (fromDate && !toDate) return `Từ ${fromDate} (chọn ngày kết thúc)`;
        if (fromDate && toDate) return `${fromDate} đến ${toDate}`;
        return '';
    };

    return (
        <div
            ref={calendarRef}
            className={clsx(styles.daterangeWraper, 'position-relative daterange-wraper me-2')}
        >
            <div
                className={clsx(
                    styles.inputGroupicon,
                    styles.calenderInput,
                    'input-groupicon calender-input'
                )}
            >
                <input
                    type="text"
                    className={clsx(styles.formControl, 'form-control date-range')}
                    placeholder="Chọn khoảng ngày"
                    value={dateRange}
                    readOnly
                    onClick={onToggle}
                />
            </div>
            <button
                type="button"
                className={clsx(styles.calendarToggle, 'calendar-toggle')}
                onClick={onToggle}
                aria-label="Mở lịch"
            ></button>

            {/* Custom Calendar Popup */}
            {isOpen && (
                <div className={clsx(styles.calendarPopup, 'calendar-popup')}>
                    <div className={clsx(styles.calendarHeader, 'calendar-header')}>
                        <h6>Chọn khoảng ngày</h6>
                    </div>
                    <div className={clsx(styles.calendarBody, 'calendar-body')}>
                        <div className={clsx(styles.singleDateRange, 'single-date-range')}>
                            <label htmlFor="dateRangeInput">{getDateSelectionLabel()}</label>
                            <input
                                id="dateRangeInput"
                                type="date"
                                className={clsx(styles.formControl, 'form-control')}
                                onChange={(e) => onDateSelection(e.target.value)}
                            />
                            {(fromDate || toDate) && (
                                <div className={clsx(styles.selectedRange, 'selected-range')}>
                                    <p>
                                        <strong>Đã chọn:</strong> {getSelectedRangeText()}
                                    </p>
                                </div>
                            )}
                        </div>
                        <div className={clsx(styles.calendarActions, 'calendar-actions')}>
                            <button
                                type="button"
                                className="btn btn-sm btn-light"
                                onClick={onClear}
                            >
                                Xóa
                            </button>
                            <Button
                                text={`Áp dụng${fromDate && !toDate ? ' (Chọn ngày kết thúc)' : ''}`}
                                type="button"
                                className="btn btn-sm btn-primary"
                                onClick={onApply}
                                isDisabled={!!(fromDate && !toDate)}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DateRangePicker;
