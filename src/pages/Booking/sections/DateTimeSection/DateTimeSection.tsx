import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from '@/components/Calendar';
import SlotCategory from './components/SlotCategory';
import CountdownTimer from '@/components/CountdownTimer';
import styles from './DateTimeSection.module.scss';
import clsx from 'clsx';
import BookingSectionWrapper from '../../components/BookingSectionWrapper';
import { mockAppointmentInfo } from '../../constants/mockData';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { PATHS } from '@/routes/paths';
import {
    setSelectedDate,
    setSelectedDoctor,
    setSelectedMedicalService,
    fetchDoctorAvailableSlots,
    fetchServiceMedicalAvailableSlots,
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
import { HoldSlotService } from '@/services/holdSlot.service';
import { useHoldSlot } from '@/hooks/useHoldSlot';
import { createAppointmentTimeId } from '@/utils/appointment-utils';
import { useDoctorInfo } from '../../hooks/useDoctorInfo';
import { useServiceMedicalInfo } from '../../hooks/useServiceMedicalInfo';
import { toast } from 'react-toastify';

interface DateTimeSectionProps {
    nextStep: () => void;
    prevStep: () => void;
    doctorId?: string;
    serviceMedicalId?: string;
    medicalServiceId?: string;
    isRescheduleMode?: boolean;
    hidePrev?: boolean;
}

const DateTimeSection: React.FC<DateTimeSectionProps> = ({
    nextStep,
    prevStep,
    doctorId,
    serviceMedicalId,
    medicalServiceId,
    isRescheduleMode = false,
    hidePrev = false,
}) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    // Determine booking type
    const isServiceMedicalBooking = !!serviceMedicalId;
    const isDoctorBooking = !!doctorId;

    // Redux state - Schedule
    const scheduleCategories = useAppSelector(selectScheduleCategories);
    const isLoadingSlots = useAppSelector(selectAvailableSlotsLoading);
    const scheduleError = useAppSelector(selectScheduleError);
    const selectedDate = useAppSelector(selectSelectedDate);
    const selectedDoctorId = useAppSelector(selectSelectedDoctorId);
    const selectedSlots = useAppSelector(selectSelectedSlots); // Get selected slots array

    // Redux state - Auth
    const authState = useAppSelector((state) => state.auth);

    // Get info using custom hooks based on booking type
    const doctorInfo = useDoctorInfo();
    const serviceMedicalInfo = useServiceMedicalInfo();

    // Use appropriate info based on booking type
    const bookingInfo = isServiceMedicalBooking ? serviceMedicalInfo : doctorInfo;

    // Hold slot hook
    const {
        isHeld,
        remainingSeconds,
        isLoading: isHoldingSlot,
        currentHeldSlot,
        holdSlot,
        releaseSlot,
        restoreHeldSlot,
    } = useHoldSlot({
        doctorId,
        date: selectedDate || undefined,
        onSlotExpired: () => {
            // CRITICAL: Clear local state FIRST to prevent restore
            setSlotChecked([]);

            // Reset restore flag to allow restore on next mount
            hasRestoredRef.current = false;

            // Clear Redux selection to prevent restore loop
            if (selectedSlots.length > 0) {
                const expiredSlot = selectedSlots[0];
                dispatch(
                    toggleSlotSelection({
                        startTime: expiredSlot.startTime,
                        endTime: expiredSlot.endTime,
                        isAvailable: true,
                        isBlocked: false,
                    })
                );
            }

            toast.warning('Thời gian giữ chỗ đã hết. Vui lòng chọn lại khung giờ.');
        },
    });

    // Local state
    const [date, setDate] = useState<Date | null>(() => {
        // Restore date from Redux if available
        if (selectedDate) {
            return new Date(selectedDate);
        }
        return new Date();
    });
    const [slotChecked, setSlotChecked] = useState<Array<number>>([]);
    const hasRestoredRef = useRef(false); // Prevent double restore

    // Fetch doctor details when doctorId changes (for doctor booking)
    useEffect(() => {
        if (isDoctorBooking && doctorId && doctorId !== selectedDoctorId) {
            // Set selected doctor in schedule slice
            dispatch(setSelectedDoctor(doctorId));

            // Fetch doctor details from API and store in doctor slice
            dispatch(getDoctorByIdAsync(doctorId));
        }
    }, [doctorId, selectedDoctorId, dispatch, isDoctorBooking]);

    // Set selected service medical when serviceMedicalId changes (for service medical booking)
    useEffect(() => {
        if (isServiceMedicalBooking && serviceMedicalId) {
            dispatch(setSelectedMedicalService(serviceMedicalId));
        }
    }, [serviceMedicalId, dispatch, isServiceMedicalBooking]);

    // Handle date change and fetch available slots
    const handleDateChange = useCallback(
        async (newDate: Date | null) => {
            setDate(newDate);

            if (newDate) {
                const formattedDate = ScheduleService.formatDateForApi(newDate);

                // Update Redux state
                dispatch(setSelectedDate(formattedDate));

                // Fetch available slots based on booking type
                try {
                    if (isDoctorBooking && doctorId) {
                        // Fetch doctor's available slots
                        await dispatch(
                            fetchDoctorAvailableSlots({
                                doctorId,
                                date: formattedDate,
                                ...(medicalServiceId && { medicalServiceId }),
                            })
                        ).unwrap();
                    } else if (isServiceMedicalBooking && serviceMedicalId) {
                        // Fetch service medical's available slots
                        await dispatch(
                            fetchServiceMedicalAvailableSlots({
                                serviceMedicalId,
                                date: formattedDate,
                            })
                        ).unwrap();
                    }
                } catch (error) {
                    console.error('Failed to fetch available slots:', error);
                }
            }
        },
        [
            doctorId,
            serviceMedicalId,
            medicalServiceId,
            dispatch,
            isDoctorBooking,
            isServiceMedicalBooking,
        ]
    );

    // Handle slot click - single slot selection only (patient can book only 1 slot per booking)
    const handleClickSlot = useCallback(
        async (slotIndex: number) => {
            // Prevent clicking if already holding a slot
            if (isHoldingSlot) {
                toast.info('Đang xử lý giữ chỗ...');
                return;
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

            if (!selectedSlotData || !doctorId || !selectedDate) {
                toast.error('Không thể chọn khung giờ này');
                return;
            }

            // Check if clicking the same slot (to release)
            if (slotChecked.includes(slotIndex)) {
                // Release current held slot
                await releaseSlot();
                setSlotChecked([]);

                // Clear Redux selection
                dispatch(
                    toggleSlotSelection({
                        startTime: selectedSlotData.startTime,
                        endTime: selectedSlotData.endTime,
                        isAvailable: true,
                        isBlocked: false,
                    })
                );
                return;
            }

            // Check authentication before holding slot
            if (!authState.isAuthenticated) {
                toast.warn('Vui lòng đăng nhập để đặt lịch');
                navigate(PATHS.LOGIN);
                return;
            }

            // Try to hold the new slot
            const appointmentTimeId = createAppointmentTimeId({
                startTime: selectedSlotData.startTime,
                endTime: selectedSlotData.endTime,
            });

            const result = await holdSlot(doctorId, selectedDate, appointmentTimeId);

            // Only update UI state if hold was successful
            if (result) {
                setSlotChecked([slotIndex]); // Replace with new slot (only 1 allowed)

                // Update Redux state
                const slotPayload = {
                    startTime: selectedSlotData.startTime,
                    endTime: selectedSlotData.endTime,
                    isAvailable: true,
                    isBlocked: false,
                };
                dispatch(toggleSlotSelection(slotPayload));
            } else if (doctorId && selectedDate) {
                // Hold failed (slot already held by another user)
                // Refresh available slots to update UI
                dispatch(
                    fetchDoctorAvailableSlots({
                        doctorId,
                        date: selectedDate,
                        medicalServiceId: medicalServiceId,
                    })
                );
            }
        },
        [
            slotChecked,
            scheduleCategories,
            dispatch,
            doctorId,
            selectedDate,
            medicalServiceId,
            isHoldingSlot,
            holdSlot,
            releaseSlot,
            authState.isAuthenticated,
            navigate,
        ]
    );

    // Initialize with current date on component mount
    useEffect(() => {
        // Only fetch if we don't have slots yet or date changed
        if (date && (isDoctorBooking || isServiceMedicalBooking) && !selectedDate) {
            handleDateChange(date);
        } else if (selectedDate && doctorId && scheduleCategories.length === 0) {
            // If we have selectedDate but no slots, fetch them
            handleDateChange(new Date(selectedDate));
        }
    }, [date, isDoctorBooking, isServiceMedicalBooking, selectedDate, handleDateChange]);

    // Restore held slot state when component mounts
    useEffect(() => {
        const checkAndRestoreHeldSlot = async () => {
            // Prevent double execution
            if (hasRestoredRef.current) return;

            // Only restore if we have valid data and no active hold
            if (
                doctorId &&
                selectedDate &&
                selectedSlots.length > 0 &&
                !isHeld &&
                scheduleCategories.length > 0 &&
                slotChecked.length === 0 // Only restore if local state is empty
            ) {
                hasRestoredRef.current = true; // Mark as executed

                // User has selected slot but countdown is not running
                // Try to get remaining time from backend
                const selectedSlot = selectedSlots[0];
                const appointmentTimeId = createAppointmentTimeId({
                    startTime: selectedSlot.startTime,
                    endTime: selectedSlot.endTime,
                });

                try {
                    const remainingTime = await HoldSlotService.getRemainingTime(
                        doctorId,
                        selectedDate,
                        appointmentTimeId
                    );

                    if (remainingTime > 0) {
                        // Slot is still held, restore countdown timer without calling API again
                        restoreHeldSlot(doctorId, selectedDate, appointmentTimeId, remainingTime);

                        // Immediately set slotChecked based on selectedSlot (before Redux might clear it)
                        const allSlots = scheduleCategories.flatMap(
                            (category) => category.timeSlots
                        );
                        const slotIndex = allSlots.findIndex(
                            (slot) =>
                                slot.startTime === selectedSlot.startTime &&
                                slot.endTime === selectedSlot.endTime
                        );

                        if (slotIndex !== -1) {
                            setSlotChecked([slotIndex]);
                        }
                    } else {
                        // Slot expired, clear Redux selection to prevent infinite loop
                        dispatch(
                            toggleSlotSelection({
                                startTime: selectedSlot.startTime,
                                endTime: selectedSlot.endTime,
                                isAvailable: true,
                                isBlocked: false,
                            })
                        );
                        setSlotChecked([]);
                        toast.warning('Thời gian giữ chỗ đã hết. Vui lòng chọn lại khung giờ.');
                    }
                } catch (error) {
                    console.error('Failed to restore held slot:', error);
                    hasRestoredRef.current = false; // Reset on error
                }
            }
        };

        checkAndRestoreHeldSlot();
    }, [
        doctorId,
        selectedDate,
        selectedSlots,
        isHeld,
        scheduleCategories,
        slotChecked,
        restoreHeldSlot,
        dispatch,
    ]);

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

    // Note: We DON'T release held slots on unmount anymore
    // This allows users to navigate back and forth between steps
    // Slots will auto-expire after 5 minutes or be released when booking is completed/cancelled

    // Release held slots when doctor or date changes
    useEffect(() => {
        if (isHeld && currentHeldSlot) {
            // If doctor or date changed, release current held slot
            const isDifferentDoctor = currentHeldSlot.doctorId !== doctorId;
            const isDifferentDate = currentHeldSlot.date !== selectedDate;

            if (isDifferentDoctor || isDifferentDate) {
                releaseSlot().catch(console.error);
                setSlotChecked([]);
            }
        }
    }, [doctorId, selectedDate, isHeld, currentHeldSlot, releaseSlot]);

    return (
        <BookingSectionWrapper
            doctor={bookingInfo}
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
                                        {isHeld && remainingSeconds > 0 && (
                                            <div className="mt-2">
                                                <CountdownTimer
                                                    remainingSeconds={remainingSeconds}
                                                    size="small"
                                                />
                                            </div>
                                        )}
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
