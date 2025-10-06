import Calendar from '@/components/Calendar';
import React, { useState, useEffect, useCallback } from 'react';
import SlotCategory from './components/SlotCategory';
import styles from './DateTimeSection.module.scss';
import clsx from 'clsx';
import BookingSectionWrapper from '../../components/BookingSectionWrapper/BookingSectionWrapper';
import { mockAppointmentInfo } from '../../constants/mockData';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
    setSelectedDate,
    setSelectedDoctor,
    fetchDoctorAvailableSlots,
    setSelectedSlot,
} from '@/store/slices/schedule.slice';
import {
    selectScheduleCategories,
    selectAvailableSlotsLoading,
    selectScheduleError,
    selectSelectedDate,
    selectSelectedDoctorId,
} from '@/store/selectors/schedule.selectors';
import { getDoctorByIdAsync } from '@/store/slices/doctorSlice';
import { ScheduleService } from '@/services/schedule.service';
import { useDoctorInfo } from '../../hooks/useDoctorInfo';

interface DateTimeSectionProps {
    nextStep: () => void;
    prevStep: () => void;
    doctorId?: string; // Pass doctorId as prop or get from URL params
    medicalServiceId?: string; // Pass medicalServiceId as prop or get from context
}

const DateTimeSection: React.FC<DateTimeSectionProps> = ({
    nextStep,
    prevStep,
    doctorId,
    medicalServiceId,
}) => {
    const dispatch = useAppDispatch();

    // Redux state - Schedule
    const scheduleCategories = useAppSelector(selectScheduleCategories);
    const isLoadingSlots = useAppSelector(selectAvailableSlotsLoading);
    const scheduleError = useAppSelector(selectScheduleError);
    const selectedDate = useAppSelector(selectSelectedDate);
    const selectedDoctorId = useAppSelector(selectSelectedDoctorId);

    // Get doctor info using custom hook
    const doctorInfo = useDoctorInfo();

    // Local state
    const [date, setDate] = useState<Date | null>(new Date());
    const [slotChecked, setSlotChecked] = useState<Array<number>>([]);

    // Fetch doctor details when doctorId changes
    useEffect(() => {
        if (doctorId && doctorId !== selectedDoctorId) {
            // Set selected doctor in schedule slice
            dispatch(setSelectedDoctor(doctorId));

            // Fetch doctor details from API and store in doctor slice
            dispatch(getDoctorByIdAsync(doctorId));
        }
    }, [doctorId, selectedDoctorId, dispatch]);

    // Handle date change and fetch available slots
    const handleDateChange = useCallback(
        async (newDate: Date | null) => {
            setDate(newDate);

            if (newDate && doctorId) {
                const formattedDate = ScheduleService.formatDateForApi(newDate);

                // Update Redux state
                dispatch(setSelectedDate(formattedDate));

                // Fetch available slots for the selected date and doctor
                try {
                    const result = await dispatch(
                        fetchDoctorAvailableSlots({
                            doctorId,
                            date: formattedDate,
                            ...(medicalServiceId && { medicalServiceId }),
                        })
                    ).unwrap();
                    console.log('API Response:', result);
                } catch (error) {
                    console.error('Failed to fetch available slots:', error);
                }
            }
        },
        [doctorId, medicalServiceId, dispatch]
    );

    // Handle slot click
    const handleClickSlot = useCallback(
        (slotIndex: number) => {
            // Toggle slot selection
            if (slotChecked.includes(slotIndex)) {
                setSlotChecked((prev) => prev.filter((idx) => idx !== slotIndex));
                // Clear selected slot in Redux if this was the selected one
                // You might want to implement multi-slot selection or single selection
            } else {
                setSlotChecked([slotIndex]); // Single selection mode

                // Find the corresponding slot and update Redux
                const allSlots = scheduleCategories.flatMap((category) =>
                    category.timeSlots.map((slot, idx) => ({
                        ...slot,
                        categoryIndex: scheduleCategories.indexOf(category),
                        slotIndex: idx,
                        globalIndex: slotIndex,
                    }))
                );

                const selectedSlotData = allSlots.find((slot) => slot.globalIndex === slotIndex);
                if (selectedSlotData) {
                    // Create AvailableSlot object for Redux
                    dispatch(
                        setSelectedSlot({
                            startTime: selectedSlotData.startTime,
                            endTime: selectedSlotData.endTime,
                            isAvailable: true,
                            isBlocked: false,
                        })
                    );
                }
            }
        },
        [slotChecked, scheduleCategories, dispatch]
    );

    // Initialize with current date on component mount
    useEffect(() => {
        if (date && doctorId) {
            handleDateChange(date);
        }
    }, [date, doctorId, selectedDate, handleDateChange]);

    return (
        <BookingSectionWrapper
            doctor={doctorInfo}
            appointment={mockAppointmentInfo}
            nextStepTitle="Thêm thông tin cơ bản"
            nextStep={nextStep}
            prevStep={prevStep}
            fieldsetId="first"
        >
            <div className="card mb-0">
                <div className="card-body pb-0">
                    <div className="row">
                        <div className="col-lg-5">
                            <div className={styles.calendarContainer}>
                                <Calendar
                                    value={date}
                                    onChange={handleDateChange}
                                    usePopper={false}
                                    styles={{ width: '100%' }}
                                />
                                {selectedDate && (
                                    <div className="mt-2 text-center">
                                        <small className="text-muted">
                                            Ngày đã chọn:{' '}
                                            {new Date(selectedDate).toLocaleDateString('vi-VN')}
                                        </small>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="col-lg-7">
                            <div
                                className={clsx(styles.slotContainer, 'card booking-wizard-slots')}
                            >
                                <div className={clsx(styles.timeSlot, 'card-body')}>
                                    {isLoadingSlots && (
                                        <div
                                            className={clsx(
                                                styles.loadingContainer,
                                                'text-center py-4'
                                            )}
                                        >
                                            <div className="spinner-border">
                                                <span className="visually-hidden">Đang tải...</span>
                                            </div>
                                            <p className="mt-2 text-muted">Đang tải lịch khám...</p>
                                        </div>
                                    )}

                                    {scheduleError && (
                                        <div className="alert alert-warning" role="alert">
                                            <i className="fas fa-exclamation-triangle me-2"></i>
                                            {scheduleError}
                                        </div>
                                    )}

                                    {!isLoadingSlots &&
                                        !scheduleError &&
                                        scheduleCategories.length === 0 &&
                                        selectedDate && (
                                            <div
                                                className={clsx(
                                                    styles.noSlotsContainer,
                                                    'text-center py-4'
                                                )}
                                            >
                                                <i className="fas fa-calendar-times fs-1 text-muted mb-3"></i>
                                                <p className="text-muted">
                                                    Không có lịch khám cho ngày đã chọn
                                                </p>
                                                <small className="text-muted">
                                                    Vui lòng chọn ngày khác
                                                </small>
                                            </div>
                                        )}

                                    {!isLoadingSlots &&
                                        !scheduleError &&
                                        scheduleCategories.length > 0 && (
                                            <>
                                                {scheduleCategories.map((category, idx) => (
                                                    <SlotCategory
                                                        key={idx}
                                                        title={category.title}
                                                        timeSlots={category.timeSlots.map(
                                                            (slot, slotIdx) => ({
                                                                id:
                                                                    scheduleCategories
                                                                        .slice(0, idx)
                                                                        .reduce(
                                                                            (acc, cat) =>
                                                                                acc +
                                                                                cat.timeSlots
                                                                                    .length,
                                                                            0
                                                                        ) +
                                                                    slotIdx +
                                                                    1,
                                                                time: `${slot.startTime} - ${slot.endTime}`,
                                                            })
                                                        )}
                                                        handleClickSlot={(slotIdx) => {
                                                            // Calculate global index based on previous categories
                                                            const globalIndex =
                                                                scheduleCategories
                                                                    .slice(0, idx)
                                                                    .reduce(
                                                                        (acc, cat) =>
                                                                            acc +
                                                                            cat.timeSlots.length,
                                                                        0
                                                                    ) + slotIdx;
                                                            handleClickSlot(globalIndex);
                                                        }}
                                                    />
                                                ))}
                                            </>
                                        )}

                                    {!selectedDate && (
                                        <div className="text-center py-4">
                                            <i className="fas fa-calendar-alt fs-1 text-muted mb-3"></i>
                                            <p className="text-muted">Vui lòng chọn ngày khám</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </BookingSectionWrapper>
    );
};

export default DateTimeSection;
