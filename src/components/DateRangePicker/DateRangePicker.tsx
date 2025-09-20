import React, { useState, useRef, useEffect } from 'react';
import { DateRangePicker as ReactDateRangePicker, Range, RangeKeyDict } from 'react-date-range';
import { vi } from 'date-fns/locale';
import clsx from 'clsx';

import styles from './DateRangePicker.module.scss';

// Import required styles
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import Button from '@/components/Button';

export interface DateRangePickerProps {
    /** Initial date range selection */
    ranges?: Range[];
    /** Callback when date range changes */
    onChange?: (ranges: RangeKeyDict) => void;
    /** Show/hide the date range picker */
    isOpen?: boolean;
    /** Callback when picker is opened/closed */
    onToggle?: (isOpen: boolean) => void;
    /** Placeholder text for the trigger input */
    placeholder?: string;
    /** Additional CSS classes */
    className?: string;
    /** Additional CSS classes for dropdown */
    classNameForDropDown?: string;
    /** Disable the date range picker */
    disabled?: boolean;
    /** Show month and year pickers */
    showMonthAndYearPickers?: boolean;
    /** Number of months to display */
    months?: number;
    /** Direction of calendar display */
    direction?: 'vertical' | 'horizontal';
    /** Minimum selectable date */
    minDate?: Date;
    /** Maximum selectable date */
    maxDate?: Date;
    /** Color for selected date range */
    rangeColors?: string[];
    /** Show date display row */
    showDateDisplay?: boolean;
    /** Locale for date formatting */
    locale?: any;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
    ranges = [
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection',
        },
    ],
    onChange,
    isOpen = false,
    onToggle,
    placeholder = 'Chọn khoảng thời gian',
    className,
    classNameForDropDown,
    disabled = false,
    showMonthAndYearPickers = true,
    months = 2,
    direction = 'horizontal',
    minDate,
    maxDate,
    rangeColors = ['#3d91ff'],
    showDateDisplay = true,
    locale = vi,
}) => {
    const [internalOpen, setInternalOpen] = useState(isOpen);
    const pickerRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);

    const isControlled = onToggle !== undefined;
    const open = isControlled ? isOpen : internalOpen;

    useEffect(() => {
        if (!isControlled) {
            setInternalOpen(isOpen);
        }
    }, [isOpen, isControlled]);

    // Handle click outside to close picker
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                pickerRef.current &&
                triggerRef.current &&
                !pickerRef.current.contains(event.target as Node) &&
                !triggerRef.current.contains(event.target as Node)
            ) {
                if (isControlled) {
                    onToggle?.(false);
                } else {
                    setInternalOpen(false);
                }
            }
        };

        if (open) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [open, isControlled, onToggle]);

    const handleToggle = () => {
        if (disabled) return;

        const newOpen = !open;
        if (isControlled) {
            onToggle?.(newOpen);
        } else {
            setInternalOpen(newOpen);
        }
    };

    const handleRangeChange = (rangesByKey: RangeKeyDict) => {
        onChange?.(rangesByKey);
    };

    const formatDateRange = () => {
        const selection = ranges[0];
        if (!selection?.startDate || !selection?.endDate) {
            return placeholder;
        }

        const formatDate = (date: Date) => {
            return date.toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            });
        };

        if (selection.startDate.toDateString() === selection.endDate.toDateString()) {
            return formatDate(selection.startDate);
        }

        return `${formatDate(selection.startDate)} - ${formatDate(selection.endDate)}`;
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        const clearedRanges = ranges.map((range) => ({
            ...range,
            startDate: new Date(),
            endDate: new Date(),
        }));
        onChange?.({ [ranges[0]?.key || 'selection']: clearedRanges[0] });
    };

    const handleApply = () => {
        if (isControlled) {
            onToggle?.(false);
        } else {
            setInternalOpen(false);
        }
    };

    return (
        <div className={clsx(styles.dateRangePicker, className)}>
            {/* Trigger Input */}
            <button
                ref={triggerRef}
                type="button"
                className={clsx(styles.trigger, {
                    [styles.disabled]: disabled,
                    [styles.active]: open,
                })}
                onClick={handleToggle}
                disabled={disabled}
                aria-expanded={open}
                aria-haspopup="dialog"
                aria-label="Mở bộ chọn khoảng thời gian"
            >
                <div className={styles.triggerContent}>
                    <span className={styles.dateText}>{formatDateRange()}</span>
                    <div className={styles.actions}>
                        {ranges[0]?.startDate && ranges[0]?.endDate && (
                            <button
                                type="button"
                                className={styles.clearButton}
                                onClick={handleClear}
                                title="Xóa lựa chọn"
                            >
                                ×
                            </button>
                        )}
                        <div className={clsx(styles.chevron, { [styles.open]: open })}>
                            <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                                <path
                                    d="M1 1.5L6 6.5L11 1.5"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>
                    </div>
                </div>
            </button>

            {/* Date Range Picker Dropdown */}
            {open && (
                <div ref={pickerRef} className={clsx(styles.dropdown, classNameForDropDown)}>
                    <div className={styles.pickerContainer}>
                        <ReactDateRangePicker
                            ranges={ranges}
                            onChange={handleRangeChange}
                            showMonthAndYearPickers={showMonthAndYearPickers}
                            months={months}
                            direction={direction}
                            minDate={minDate}
                            maxDate={maxDate}
                            rangeColors={rangeColors}
                            showDateDisplay={showDateDisplay}
                            staticRanges={[]}
                            inputRanges={[]}
                            moveRangeOnFirstSelection={false}
                            retainEndDateOnFirstSelection={false}
                            locale={locale}
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className={styles.actions}>
                        <button
                            type="button"
                            onClick={handleClear}
                            className={clsx(styles.actionButton, styles.clearBtn)}
                        >
                            Xóa
                        </button>
                        <Button
                            text="Áp dụng"
                            type="button"
                            className={clsx(styles.actionButton, styles.applyBtn)}
                            onClick={handleApply}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default DateRangePicker;
