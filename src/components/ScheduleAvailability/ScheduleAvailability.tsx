import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import Calendar from '@/components/Calendar';
import styles from './ScheduleAvailability.module.scss';
import { PATHS, replacePathParams } from '@/routes/paths';

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

const ScheduleAvailability: React.FC = () => {
    // Lấy ngày hiện tại
    const today = new Date();
    const [activeTab, setActiveTab] = useState('day1'); // Mặc định bắt đầu từ ngày mai
    const [startDate, setStartDate] = useState(
        new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
    ); // Ngày bắt đầu cho 7 ngày
    const [showDatePicker, setShowDatePicker] = useState(false);
    const anchorRef = useRef<HTMLButtonElement>(null); // Ref cho button lịch

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

    console.log('Next7Days: ', next7Days);

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
            appointment_date: '2025-09-21',
            is_available: true,
        },
        {
            doctor_schedule_time_id: 29,
            doctor_id: 1,
            appointment_time_id: 5,
            appointment_date: '2025-09-23',
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
        const slotIds = new Set(daySchedules.map((schedule) => schedule.appointment_time_id));
        return mockAppointmentTimes
            .filter((time) => slotIds.has(time.id))
            .map((time) => `${time.start_time} - ${time.end_time}`);
    };

    const activeDay = next7Days.find((day) => day.id === activeTab)?.date || startDate;

    // Xử lý chọn ngày từ DateCalendar
    const handleDateChange = (value: Date | null) => {
        if (!value || !(value instanceof Date) || Number.isNaN(value.getTime())) return; // Bỏ qua nếu không phải Date hợp lệ
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

    // Check if today's date is selected
    const isTodaySelected = activeDay
        ? activeDay.getDate() === today.getDate() &&
          activeDay.getMonth() === today.getMonth() &&
          activeDay.getFullYear() === today.getFullYear()
        : false;

    return (
        <div className="tab-pane fade show active" id="general-availability">
            <div className="custom-card">
                <div className="card-body">
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <h3 className="header-title">Chọn Khung Giờ Có Sẵn</h3>
                        <div className="date-picker">
                            <button
                                type="button"
                                className="isax isax-calendar-tick calendar-icon"
                                onClick={() => setShowDatePicker(!showDatePicker)}
                                ref={anchorRef}
                                aria-label="Chọn ngày"
                                style={{ background: 'none', border: 'none', padding: 0 }}
                            />
                            <Calendar
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
                                anchorEl={anchorRef.current}
                                open={showDatePicker}
                                onClose={() => setShowDatePicker(false)}
                                isTodaySelected={isTodaySelected} // Pass the isTodaySelected prop
                            />
                        </div>
                    </div>

                    <div className="available-tab">
                        <label className="form-label" htmlFor="date-selector">
                            Chọn ngày có sẵn
                        </label>
                        <ul className="nav" id="date-selector">
                            {next7Days.map((day) => (
                                <li key={day.id}>
                                    <Link
                                        to="#"
                                        className={clsx(styles.navLink, {
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

                    <div className="tab-content pt-0">
                        {next7Days.map((day) => (
                            <div
                                key={day.id}
                                className={clsx('tab-pane', {
                                    'active show': activeTab === day.id,
                                    fade: activeTab !== day.id,
                                })}
                                id={day.id}
                            >
                                <div className="slot-box">
                                    <div className="slot-header">
                                        <h5>
                                            {getVietnameseDay(day.date)}, {day.date.getDate()}/
                                            {day.date.getMonth() + 1}
                                        </h5>
                                    </div>
                                    <div className="slot-body">
                                        <ul className={clsx(styles.paddingLeftZero, 'time-slots')}>
                                            {getSlotsForDate(day.date).length > 0 ? (
                                                getSlotsForDate(day.date).map((slot) => (
                                                    <li
                                                        key={slot}
                                                        className={styles.slotsAvailable}
                                                    >
                                                        <Link
                                                            className={clsx(styles.slotLink)}
                                                            to={replacePathParams(
                                                                PATHS.BOOKING.ROOT,
                                                                {
                                                                    doctorId: '1',
                                                                }
                                                            )}
                                                        >
                                                            <i
                                                                className={clsx(
                                                                    'isax',
                                                                    'isax-clock'
                                                                )}
                                                            />{' '}
                                                            {slot}
                                                        </Link>
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
    );
};

export default ScheduleAvailability;
