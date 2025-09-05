import React, { useState, useRef } from 'react';
import Calendar from '@/components/Calendar';
import clsx from 'clsx';
import styles from './SearchInput.module.scss';

const SearchInput: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const dateInputRef = useRef<HTMLInputElement>(null);

    // Handle date selection
    const handleDateChange = (value: Date | null) => {
        if (!value || isNaN(value.getTime())) return; // Ignore invalid dates
        setSelectedDate(value);
        setShowDatePicker(false);
    };

    // Format date for display
    const formatDate = (date: Date | null) => {
        if (!date) return '';
        return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    };

    // Check if today's date is selected
    const today = new Date();
    const isTodaySelected = selectedDate
        ? selectedDate.getDate() === today.getDate() &&
          selectedDate.getMonth() === today.getMonth() &&
          selectedDate.getFullYear() === today.getFullYear()
        : false;

    return (
        <div
            className={clsx(
                'bg-primary-gradient doctors-search-box',
                styles.doctorsSearchBoxCustom,
                styles.roundedPillCustom
            )}
        >
            <div className={clsx('search-box-one', styles.roundedPillCustom)}>
                <form action="#">
                    <div className="search-input search-line">
                        <i className="isax isax-hospital5 bficon"></i>
                        <div className="mb-0">
                            <input
                                type="text"
                                className={clsx('form-control', styles.formControlCustom)}
                                placeholder="Triệu chứng, bác sĩ, chuyên khoa, ..."
                            />
                        </div>
                    </div>
                    <div className="search-input search-map-line">
                        <i className="isax isax-location5"></i>
                        <div className="mb-0">
                            <input
                                type="text"
                                className={clsx('form-control', styles.formControlCustom)}
                                placeholder="Địa điểm"
                            />
                        </div>
                    </div>
                    <div className="search-input search-calendar-line">
                        <i
                            className="isax isax-calendar-tick5"
                            onClick={() => setShowDatePicker(!showDatePicker)}
                        ></i>
                        <div className="mb-0">
                            <input
                                type="text"
                                className="form-control datetimepicker"
                                placeholder="Date"
                                value={formatDate(selectedDate)}
                                onClick={() => setShowDatePicker(!showDatePicker)}
                                ref={dateInputRef}
                                readOnly
                            />
                            <Calendar
                                value={selectedDate}
                                onChange={handleDateChange}
                                minDate={new Date()}
                                maxDate={
                                    new Date(
                                        today.getFullYear(),
                                        today.getMonth(),
                                        today.getDate() + 30
                                    )
                                }
                                anchorEl={dateInputRef.current}
                                open={showDatePicker}
                                onClose={() => setShowDatePicker(false)}
                                isTodaySelected={isTodaySelected}
                            />
                        </div>
                    </div>
                    <div className="form-search-btn">
                        <button
                            className={clsx(
                                'btn btn-primary d-inline-flex align-items-center rounded-pill',
                                styles.btnNoWrap
                            )}
                            type="submit"
                        >
                            <i className="isax isax-search-normal-15 me-2"></i>Tìm kiếm
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SearchInput;
