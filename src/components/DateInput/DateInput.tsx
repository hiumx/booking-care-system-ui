import React, { forwardRef } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { vi } from 'date-fns/locale';
import clsx from 'clsx';
import 'react-datepicker/dist/react-datepicker.css';
import './DateInput.scss';

// Register Vietnamese locale
registerLocale('vi', vi);

interface DateInputProps {
    label?: string;
    value?: string;
    onChange?: (date: string) => void;
    placeholder?: string;
    isRequired?: boolean;
    disabled?: boolean;
    className?: string;
    error?: string;
    maxDate?: Date;
    minDate?: Date;
}

// Custom input component to match our Input design
const CustomInput = forwardRef<HTMLInputElement, any>(
    ({ value, onClick, onChange, placeholder, disabled, className }, ref) => (
        <div className="form-icon">
            <input
                ref={ref}
                type="text"
                className={clsx('form-control', className)}
                value={value}
                onClick={onClick}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                readOnly
                style={{
                    height: '45px',
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb',
                    fontSize: '14px',
                    paddingLeft: '16px',
                    paddingRight: '45px',
                    cursor: 'pointer',
                }}
            />
            <span
                className="icon"
                style={{
                    right: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                    color: '#6b7280',
                }}
            >
                <i className="isax isax-calendar-1"></i>
            </span>
        </div>
    )
);

CustomInput.displayName = 'CustomInput';

const DateInput: React.FC<DateInputProps> = ({
    label,
    value,
    onChange,
    placeholder = 'Chọn ngày',
    isRequired = false,
    disabled = false,
    className,
    error,
    maxDate,
    minDate,
}) => {
    // Convert string to Date object
    const dateValue = value ? new Date(value) : null;

    // Handle date change
    const handleDateChange = (date: Date | null) => {
        if (date && onChange) {
            // Format to YYYY-MM-DD for consistency with backend
            const formattedDate = date.toISOString().split('T')[0];
            onChange(formattedDate);
        } else if (!date && onChange) {
            onChange('');
        }
    };

    return (
        <div className={clsx('date-input-wrapper', className)}>
            {label && (
                <label className="form-label">
                    {label} {isRequired && <span className="text-danger">*</span>}
                </label>
            )}

            <DatePicker
                selected={dateValue}
                onChange={handleDateChange}
                customInput={<CustomInput />}
                locale="vi"
                dateFormat="dd/MM/yyyy"
                placeholderText={placeholder}
                disabled={disabled}
                maxDate={maxDate}
                minDate={minDate}
                showYearDropdown
                showMonthDropdown
                dropdownMode="select"
                yearDropdownItemNumber={100}
                scrollableYearDropdown
                className="custom-datepicker"
                calendarClassName="custom-calendar"
                popperClassName="custom-popper"
                popperPlacement="bottom-start"
                showPopperArrow={false}
                formatWeekDay={() => ''} // Chỉ hiển thị chữ cái đầu
            />

            {error && <div className="invalid-feedback d-block">{error}</div>}
        </div>
    );
};

export default DateInput;
