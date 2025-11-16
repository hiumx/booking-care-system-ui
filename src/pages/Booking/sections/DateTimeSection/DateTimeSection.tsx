import React, { useState, useEffect, useCallback } from 'react';
import Calendar from '@/components/Calendar';
import SlotCategory from './components/SlotCategory';
import styles from './DateTimeSection.module.scss';
import clsx from 'clsx';
import BookingSectionWrapper from '../../components/BookingSectionWrapper';
import { mockAppointmentInfo } from '../../constants/mockData';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
    setSelectedDate,
    setSelectedDoctor,
    fetchDoctorAvailableSlots,
    toggleSlotSelection,
} from '@/store/slices/schedule.slice';
import {
    selectScheduleCategories,
    selectAvailableSlotsLoading,
    selectScheduleError,
    selectSelectedDate,
    selectSelectedDoctorId,
    selectSelectedSlots,
} from '@/store/selectors/schedule.selectors';
import { getDoctorByIdAsync } from '@/store/slices/doctorSlice';
import { ScheduleService } from '@/services/schedule.service';
import { useDoctorInfo } from '../../hooks/useDoctorInfo';

interface DateTimeSectionProps {
    nextStep: () => void;
    prevStep: () => void;
    doctorId?: string;
    medicalServiceId?: string;
    isRescheduleMode?: boolean;
    hidePrev?: boolean;
}

const DateTimeSection: React.FC<DateTimeSectionProps> = ({
    nextStep,
    prevStep,
    doctorId,
    medicalServiceId,
    isRescheduleMode = false,
    hidePrev = false,
}) => {
    const dispatch = useAppDispatch();

    // Redux state - Schedule
    const scheduleCategories = useAppSelector(selectScheduleCategories);
    const isLoadingSlots = useAppSelector(selectAvailableSlotsLoading);
    const scheduleError = useAppSelector(selectScheduleError);
    const selectedDate = useAppSelector(selectSelectedDate);
    const selectedDoctorId = useAppSelector(selectSelectedDoctorId);
    const selectedSlots = useAppSelector(selectSelectedSlots); // Get selected slots array

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
                    await dispatch(
                        fetchDoctorAvailableSlots({
                            doctorId,
                            date: formattedDate,
                            ...(medicalServiceId && { medicalServiceId }),
                        })
                    ).unwrap();
                } catch (error) {
                    console.error('Failed to fetch available slots:', error);
                }
            }
        },
        [doctorId, medicalServiceId, dispatch]
    );

    // Handle slot click - single slot selection only (patient can book only 1 slot per booking)
    const handleClickSlot = useCallback(
        (slotIndex: number) => {
            // Toggle slot selection in local state (for UI highlighting)
            // Single selection mode: replace current selection or clear if clicking same slot
            if (slotChecked.includes(slotIndex)) {
                setSlotChecked([]); // Unselect if clicking same slot
            } else {
                setSlotChecked([slotIndex]); // Replace with new slot (only 1 allowed)
            }

            // Find the corresponding slot data
            // Create a flat array with correct globalIndex for each slot
            let globalIdx = 0;
            const allSlots = scheduleCategories.flatMap((category, catIdx) =>
                category.timeSlots.map((slot, slotIdx) => {
                    const slotData = {
                        ...slot,
                        categoryIndex: catIdx,
                        slotIndex: slotIdx,
                        globalIndex: globalIdx++, // ✅ Increment for each slot
                    };
                    return slotData;
                })
            );

            const selectedSlotData = allSlots.find((slot) => slot.globalIndex === slotIndex);

            if (selectedSlotData) {
                const slotPayload = {
                    startTime: selectedSlotData.startTime,
                    endTime: selectedSlotData.endTime,
                    isAvailable: true,
                    isBlocked: false,
                };

                // Toggle slot in Redux (replace or remove)
                dispatch(toggleSlotSelection(slotPayload));
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

    // Sync local slotChecked state with Redux selectedSlots for UI highlighting
    useEffect(() => {
        if (selectedSlots.length > 0 && scheduleCategories.length > 0) {
            const allSlots = scheduleCategories.flatMap((category) => category.timeSlots);
            const checkedIndices = selectedSlots
                .map((selectedSlot) =>
                    allSlots.findIndex(
                        (slot) =>
                            slot.startTime === selectedSlot.startTime &&
                            slot.endTime === selectedSlot.endTime
                    )
                )
                .filter((index) => index !== -1);
            setSlotChecked(checkedIndices);
        } else {
            setSlotChecked([]);
        }
    }, [selectedSlots, scheduleCategories]);

    return (
        <BookingSectionWrapper
            doctor={doctorInfo}
            appointment={mockAppointmentInfo}
            nextStepTitle={isRescheduleMode ? 'Xác nhận đổi lịch' : 'Thêm thông tin cơ bản'}
            nextStep={nextStep}
            prevStep={prevStep}
            showPrev={!hidePrev}
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
                                                {scheduleCategories.map((category, categoryIdx) => {
                                                    // Calculate checked slot IDs for this category
                                                    const categoryStartIndex = scheduleCategories
                                                        .slice(0, categoryIdx)
                                                        .reduce(
                                                            (acc, cat) =>
                                                                acc + cat.timeSlots.length,
                                                            0
                                                        );
                                                    const checkedSlotIds = slotChecked
                                                        .filter(
                                                            (checkedIdx) =>
                                                                checkedIdx >= categoryStartIndex &&
                                                                checkedIdx <
                                                                    categoryStartIndex +
                                                                        category.timeSlots.length
                                                        )
                                                        .map(
                                                            (checkedIdx) =>
                                                                checkedIdx - categoryStartIndex + 1
                                                        );

                                                    return (
                                                        <SlotCategory
                                                            key={category.title}
                                                            title={category.title}
                                                            timeSlots={category.timeSlots.map(
                                                                (slot, slotIdx) => ({
                                                                    id: slotIdx + 1, // 1-based ID for display
                                                                    time: `${slot.startTime} - ${slot.endTime}`,
                                                                })
                                                            )}
                                                            handleClickSlot={(slotId) => {
                                                                // slotId is 1-based, convert to global 0-based index
                                                                // slotId - 1 converts to 0-based index within category
                                                                // categoryStartIndex is the global offset
                                                                const globalIndex =
                                                                    categoryStartIndex +
                                                                    (slotId - 1);
                                                                handleClickSlot(globalIndex);
                                                            }}
                                                            checkedSlots={checkedSlotIds}
                                                        />
                                                    );
                                                })}
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
