import React, { forwardRef } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { vi, enUS } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import 'react-datepicker/dist/react-datepicker.css';
import './DateInput.scss';

// Register locales
registerLocale('vi', vi);
registerLocale('en', enUS);

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
    const { i18n } = useTranslation();
    const currentLanguage = i18n.language;

    // Get date format based on language
    const getDateFormat = () => {
        return currentLanguage === 'vi' ? 'dd/MM/yyyy' : 'MM/dd/yyyy';
    };

    // Get locale for DatePicker
    const getLocale = () => {
        return currentLanguage === 'vi' ? 'vi' : 'en';
    };

    // Convert string to Date object, handling timezone properly
    const dateValue = value
        ? (() => {
              try {
                  // Parse YYYY-MM-DD format without timezone conversion
                  const parts = value.split('-');
                  if (parts.length === 3) {
                      const year = Number.parseInt(parts[0], 10);
                      const month = Number.parseInt(parts[1], 10) - 1; // Month is 0-indexed
                      const day = Number.parseInt(parts[2], 10);
                      return new Date(year, month, day);
                  }
                  return null;
              } catch {
                  return null;
              }
          })()
        : null;

    // Handle date change
    const handleDateChange = (date: Date | null) => {
        if (date && onChange) {
            // Format to YYYY-MM-DD using local date parts to avoid timezone issues
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const formattedDate = `${year}-${month}-${day}`;
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
                locale={getLocale()}
                dateFormat={getDateFormat()}
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
