import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { Popper } from '@mui/material';
import styles from '../DoctorProfile.module.scss';

interface AppointmentTime {
    id: number;
    start_time: string;
    end_time: string;
}

interface DoctorScheduleTime {
    doctor_schedule_time_id: number;
    doctor_id: number;
    appointment_time_id: number;
    appointment_date: string;
    is_available: boolean;
}

const DoctorAvailability: React.FC = () => {
    // Lấy ngày hiện tại (08:11 AM +07, Wednesday, August 20, 2025)
    const today = new Date();
    const [activeTab, setActiveTab] = useState('day1'); // Mặc định bắt đầu từ ngày mai
    const [startDate, setStartDate] = useState(
        new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
    ); // Ngày bắt đầu cho 7 ngày
    const [showDatePicker, setShowDatePicker] = useState(false);
    const anchorRef = useRef<HTMLLIElement>(null); // Ref cho icon lịch

    // Tạo danh sách 7 ngày từ startDate
    const generateNext7Days = (start: Date) => {
        const days = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(start);
            date.setDate(start.getDate() + i);
            days.push({
                id: `day${i + 1}`,
                date: date,
                dayName: date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase(),
            });
        }
        return days;
    };

    const next7Days = generateNext7Days(startDate);

    // Mock data for appointment times
    const mockAppointmentTimes: AppointmentTime[] = [
        { id: 1, start_time: '09:00', end_time: '09:30' },
        { id: 2, start_time: '09:30', end_time: '10:00' },
        { id: 3, start_time: '10:00', end_time: '10:30' },
        { id: 4, start_time: '10:30', end_time: '11:00' },
        { id: 5, start_time: '11:00', end_time: '11:30' },
    ];

    // Mock data for doctor schedule times (mở rộng cho 30 ngày)
    const mockScheduleTimes: DoctorScheduleTime[] = [
        // 20/08/2025
        {
            doctor_schedule_time_id: 1,
            doctor_id: 1,
            appointment_time_id: 1,
            appointment_date: '2025-08-20',
            is_available: true,
        },
        {
            doctor_schedule_time_id: 2,
            doctor_id: 1,
            appointment_time_id: 2,
            appointment_date: '2025-08-20',
            is_available: true,
        },
        {
            doctor_schedule_time_id: 3,
            doctor_id: 1,
            appointment_time_id: 3,
            appointment_date: '2025-08-20',
            is_available: false,
        },
        // 21/08/2025
        {
            doctor_schedule_time_id: 4,
            doctor_id: 1,
            appointment_time_id: 2,
            appointment_date: '2025-08-21',
            is_available: true,
        },
        {
            doctor_schedule_time_id: 5,
            doctor_id: 1,
            appointment_time_id: 4,
            appointment_date: '2025-08-21',
            is_available: true,
        },
        // 22/08/2025
        {
            doctor_schedule_time_id: 6,
            doctor_id: 1,
            appointment_time_id: 3,
            appointment_date: '2025-08-22',
            is_available: true,
        },
        {
            doctor_schedule_time_id: 7,
            doctor_id: 1,
            appointment_time_id: 5,
            appointment_date: '2025-08-22',
            is_available: true,
        },
        // 25/08/2025
        {
            doctor_schedule_time_id: 8,
            doctor_id: 1,
            appointment_time_id: 1,
            appointment_date: '2025-08-25',
            is_available: true,
        },
        {
            doctor_schedule_time_id: 9,
            doctor_id: 1,
            appointment_time_id: 3,
            appointment_date: '2025-08-25',
            is_available: true,
        },
        // 28/08/2025
        {
            doctor_schedule_time_id: 10,
            doctor_id: 1,
            appointment_time_id: 2,
            appointment_date: '2025-08-28',
            is_available: true,
        },
        {
            doctor_schedule_time_id: 11,
            doctor_id: 1,
            appointment_time_id: 4,
            appointment_date: '2025-08-28',
            is_available: true,
        },
        // 30/08/2025
        {
            doctor_schedule_time_id: 12,
            doctor_id: 1,
            appointment_time_id: 1,
            appointment_date: '2025-08-30',
            is_available: true,
        },
        {
            doctor_schedule_time_id: 13,
            doctor_id: 1,
            appointment_time_id: 5,
            appointment_date: '2025-08-30',
            is_available: true,
        },
        // 01/09/2025
        {
            doctor_schedule_time_id: 14,
            doctor_id: 1,
            appointment_time_id: 1,
            appointment_date: '2025-09-01',
            is_available: true,
        },
        {
            doctor_schedule_time_id: 15,
            doctor_id: 1,
            appointment_time_id: 3,
            appointment_date: '2025-09-01',
            is_available: true,
        },
        // 03/09/2025
        {
            doctor_schedule_time_id: 16,
            doctor_id: 1,
            appointment_time_id: 2,
            appointment_date: '2025-09-03',
            is_available: true,
        },
        {
            doctor_schedule_time_id: 17,
            doctor_id: 1,
            appointment_time_id: 4,
            appointment_date: '2025-09-03',
            is_available: true,
        },
        // 05/09/2025
        {
            doctor_schedule_time_id: 18,
            doctor_id: 1,
            appointment_time_id: 1,
            appointment_date: '2025-09-05',
            is_available: true,
        },
        {
            doctor_schedule_time_id: 19,
            doctor_id: 1,
            appointment_time_id: 5,
            appointment_date: '2025-09-05',
            is_available: true,
        },
        // 08/09/2025
        {
            doctor_schedule_time_id: 20,
            doctor_id: 1,
            appointment_time_id: 2,
            appointment_date: '2025-09-08',
            is_available: true,
        },
        {
            doctor_schedule_time_id: 21,
            doctor_id: 1,
            appointment_time_id: 3,
            appointment_date: '2025-09-08',
            is_available: true,
        },
        // 10/09/2025
        {
            doctor_schedule_time_id: 22,
            doctor_id: 1,
            appointment_time_id: 1,
            appointment_date: '2025-09-10',
            is_available: true,
        },
        {
            doctor_schedule_time_id: 23,
            doctor_id: 1,
            appointment_time_id: 4,
            appointment_date: '2025-09-10',
            is_available: true,
        },
        // 12/09/2025
        {
            doctor_schedule_time_id: 24,
            doctor_id: 1,
            appointment_time_id: 3,
            appointment_date: '2025-09-12',
            is_available: true,
        },
        {
            doctor_schedule_time_id: 25,
            doctor_id: 1,
            appointment_time_id: 5,
            appointment_date: '2025-09-12',
            is_available: true,
        },
        // 15/09/2025
        {
            doctor_schedule_time_id: 26,
            doctor_id: 1,
            appointment_time_id: 2,
            appointment_date: '2025-09-15',
            is_available: true,
        },
        {
            doctor_schedule_time_id: 27,
            doctor_id: 1,
            appointment_time_id: 4,
            appointment_date: '2025-09-15',
            is_available: true,
        },
        // 18/09/2025
        {
            doctor_schedule_time_id: 28,
            doctor_id: 1,
            appointment_time_id: 1,
            appointment_date: '2025-09-18',
            is_available: true,
        },
        {
            doctor_schedule_time_id: 29,
            doctor_id: 1,
            appointment_time_id: 5,
            appointment_date: '2025-09-18',
            is_available: true,
        },
    ];

    // Chuyển đổi ngày sang định dạng tiếng Việt
    const getVietnameseDay = (date: Date) => {
        const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
        return days[date.getDay()];
    };

    // Lọc các khung giờ cho ngày được chọn
    const getSlotsForDate = (date: Date) => {
        const dateStr = date.toISOString().split('T')[0];
        const daySchedules = mockScheduleTimes.filter(
            (schedule) => schedule.appointment_date === dateStr && schedule.is_available
        );
        const slotIds = daySchedules.map((schedule) => schedule.appointment_time_id);
        return mockAppointmentTimes
            .filter((time) => slotIds.includes(time.id))
            .map((time) => `${time.start_time} - ${time.end_time}`);
    };

    const activeDay = next7Days.find((day) => day.id === activeTab)?.date || startDate;

    // Xử lý chọn ngày từ DateCalendar
    const handleDateChange = (value: Date | null) => {
        if (!value || !(value instanceof Date) || isNaN(value.getTime())) return; // Bỏ qua nếu không phải Date hợp lệ
        const oneMonthLater = new Date(today);
        oneMonthLater.setDate(today.getDate() + 30);
        if (
            value >= new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1) &&
            value <= oneMonthLater
        ) {
            const selectedDayIndex = Math.floor(
                (value.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
            );
            if (selectedDayIndex >= 0 && selectedDayIndex < 7) {
                setActiveTab(`day${selectedDayIndex + 1}`);
            } else {
                setStartDate(value);
                setActiveTab('day1');
            }
            setShowDatePicker(false);
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <div
                className={clsx(styles['tab-pane'], 'fade', 'show', 'active')}
                id="general-availability"
            >
                <div className={clsx(styles['custom-card'], 'custom-card')}>
                    <div className={clsx(styles['card-body'], 'card-body')}>
                        <div
                            className={clsx(
                                styles['card-header'],
                                'card-header',
                                'd-flex',
                                'justify-content-between',
                                'align-items-center'
                            )}
                        >
                            <h3 className={clsx(styles['header-title'], 'header-title')}>
                                Chọn Khung Giờ Có Sẵn
                            </h3>
                            <div className={styles['date-picker']}>
                                <i
                                    className={clsx(
                                        'isax',
                                        'isax-calendar-tick',
                                        styles['calendar-icon']
                                    )}
                                    onClick={() => setShowDatePicker(!showDatePicker)}
                                    ref={anchorRef}
                                />
                                <Popper
                                    open={showDatePicker}
                                    anchorEl={anchorRef.current}
                                    placement="bottom-end"
                                    sx={{
                                        zIndex: 10000,
                                    }}
                                >
                                    <DateCalendar
                                        value={activeDay}
                                        onChange={handleDateChange}
                                        minDate={
                                            new Date(
                                                today.getFullYear(),
                                                today.getMonth(),
                                                today.getDate() + 1
                                            )
                                        }
                                        maxDate={
                                            new Date(
                                                today.getFullYear(),
                                                today.getMonth(),
                                                today.getDate() + 30
                                            )
                                        }
                                        sx={{
                                            background: '#ffffff',
                                            border: '1px solid #e0e0e0',
                                            borderRadius: '8px',
                                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                            padding: '10px',
                                            width: '300px',
                                            fontFamily: "'Inter', sans-serif",
                                            '& .MuiTypography-root': {
                                                fontFamily: "'Inter', sans-serif",
                                                fontSize: '16px',
                                                fontWeight: 500,
                                                color: '#333',
                                            },
                                            '& .MuiPickersCalendarHeader-root': {
                                                background: '#f1f3f5',
                                                padding: '10px',
                                            },
                                            '& .MuiPickersArrowSwitcher-button': {
                                                background: 'none',
                                                border: 'none',
                                                padding: '8px',
                                                borderRadius: '4px',
                                                '&:hover': {
                                                    background: '#e9ecef',
                                                },
                                                '&.Mui-disabled': {
                                                    color: '#ccc',
                                                },
                                            },
                                            '& .MuiDayCalendar-weekDayLabel': {
                                                fontSize: '12px',
                                                fontWeight: 500,
                                                color: '#666',
                                                textTransform: 'uppercase',
                                            },
                                            '& .MuiPickersDay-root': {
                                                fontFamily: "'Inter', sans-serif",
                                                fontSize: '14px',
                                                color: '#333',
                                                borderRadius: '4px',
                                                '&:hover': {
                                                    background: '#e9ecef',
                                                },
                                                '&.Mui-selected': {
                                                    background: '#007bff !important',
                                                    color: '#ffffff',
                                                },
                                                '&.MuiPickersDay-today': {
                                                    background: '#e6f0fa',
                                                    color: '#007bff',
                                                },
                                                '&.Mui-disabled': {
                                                    color: '#ccc',
                                                },
                                            },
                                        }}
                                    />
                                </Popper>
                            </div>
                        </div>

                        <div className={clsx(styles['available-tab'], 'available-tab')}>
                            <label className={clsx(styles['form-label'], 'form-label')}>
                                Chọn ngày có sẵn
                            </label>
                            <ul className={clsx(styles.nav, 'nav')}>
                                {next7Days.map((day) => (
                                    <li key={day.id}>
                                        <Link
                                            to="#"
                                            className={clsx(styles['nav-link'], 'nav-link', {
                                                [styles.active]: activeTab === day.id,
                                            })}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setActiveTab(day.id);
                                            }}
                                            data-bs-toggle="tab"
                                            data-bs-target={`#${day.id}`}
                                        >
                                            {getVietnameseDay(day.date)}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className={clsx(styles['tab-content'], 'tab-content', 'pt-0')}>
                            {next7Days.map((day) => (
                                <div
                                    key={day.id}
                                    className={clsx(styles['tab-pane'], 'tab-pane', {
                                        'active show': activeTab === day.id,
                                        fade: activeTab !== day.id,
                                    })}
                                    id={day.id}
                                >
                                    <div className={clsx(styles['slot-box'], 'slot-box')}>
                                        <div className={clsx(styles['slot-header'], 'slot-header')}>
                                            <h5>
                                                {getVietnameseDay(day.date)}, {day.date.getDate()}/
                                                {day.date.getMonth() + 1}
                                            </h5>
                                        </div>
                                        <div className={clsx(styles['slot-body'], 'slot-body')}>
                                            <ul
                                                className={clsx(styles['time-slots'], 'time-slots')}
                                            >
                                                {getSlotsForDate(day.date).length > 0 ? (
                                                    getSlotsForDate(day.date).map((slot, index) => (
                                                        <li key={index}>
                                                            <i
                                                                className={clsx(
                                                                    'isax',
                                                                    'isax-clock'
                                                                )}
                                                            />{' '}
                                                            {slot}
                                                        </li>
                                                    ))
                                                ) : (
                                                    <p>Không có lịch trống!</p>
                                                )}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </LocalizationProvider>
    );
};

export default DoctorAvailability;
