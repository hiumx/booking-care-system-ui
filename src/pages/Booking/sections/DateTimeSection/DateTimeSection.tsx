import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
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
    fetchSpecialtyAvailableSlots,
    toggleSlotSelection,
} from '@/store/slices/schedule.slice';
import {
    selectScheduleCategories,
    selectAvailableSlotsLoading,
    selectScheduleError,
    selectSelectedDate,
    selectSelectedDoctorId,
    selectSelectedMedicalServiceId,
    selectSelectedSlots,
} from '@/store/selectors/schedule.selectors';
import { getDoctorByIdAsync } from '@/store/slices/doctorSlice';
import { getServiceWithHospitalByIdAsync } from '@/store/slices/medicalServiceSlice';
import { ScheduleService } from '@/services/schedule.service';
import { HoldSlotService } from '@/services/holdSlot.service';
import { useHoldSlot } from '@/hooks/useHoldSlot';
import { useSpecialtyHoldSlot } from '@/hooks/useSpecialtyHoldSlot';
import { HoldSlotTargetType } from '@/types/holdSlot.types';
import { createAppointmentTimeId } from '@/utils/appointment-utils';
import { useDoctorInfo } from '../../hooks/useDoctorInfo';
import { useServiceMedicalInfo } from '../../hooks/useServiceMedicalInfo';
import { useHospitalBookingInfo } from '../../hooks/useHospitalBookingInfo';
import { toast } from 'react-toastify';
import { AppointmentType } from '@/enums/appointment.enums';

interface DateTimeSectionProps {
    nextStep: () => void;
    prevStep: () => void;
    doctorId?: string;
    serviceMedicalId?: string;
    medicalServiceId?: string;
    hospitalId?: string; // For hospital booking flow
    isRescheduleMode?: boolean;
    hidePrev?: boolean;
}

const DateTimeSection: React.FC<DateTimeSectionProps> = ({
    nextStep,
    prevStep,
    doctorId,
    serviceMedicalId,
    medicalServiceId,
    hospitalId,
    isRescheduleMode = false,
    hidePrev = false,
}) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    // Determine booking type
    const isServiceMedicalBooking = !!serviceMedicalId;
    const isDoctorBooking = !!doctorId;
    const isHospitalBooking = !!hospitalId;

    // Redux state - Schedule
    const scheduleCategories = useAppSelector(selectScheduleCategories);
    const isLoadingSlots = useAppSelector(selectAvailableSlotsLoading);
    const scheduleError = useAppSelector(selectScheduleError);
    const selectedDate = useAppSelector(selectSelectedDate);
    const selectedDoctorId = useAppSelector(selectSelectedDoctorId);
    const selectedMedicalServiceId = useAppSelector(selectSelectedMedicalServiceId);
    const selectedSlots = useAppSelector(selectSelectedSlots); // Get selected slots array

    // Redux state - Auth
    const authState = useAppSelector((state) => state.auth);

    // Get booking state for hospital booking flow
    const bookingState = useAppSelector((state) => state.booking);

    // For hospital booking: get doctorId or serviceMedicalId from booking state
    const hospitalBookingDoctorId = isHospitalBooking ? bookingState.selectedDoctorId : null;
    const hospitalBookingServiceId = isHospitalBooking
        ? bookingState.selectedServiceMedicalId
        : null;
    const hospitalBookingSpecialtyId = isHospitalBooking ? bookingState.selectedSpecialtyId : null;
    const hospitalBookingAppointmentType =
        bookingState.appointmentType || AppointmentType.IN_PERSON;

    // Determine if this is a specialty booking (hospital assigns doctor mode)
    // Specialty booking: has specialtyId but NO doctorId selected
    const isSpecialtyBooking =
        isHospitalBooking && !!hospitalBookingSpecialtyId && !hospitalBookingDoctorId;

    // Get specialty schedule data from Redux
    const specialtyScheduleCategories = useAppSelector(
        (state) => state.schedule.specialtyScheduleCategories
    );
    const specialtyScheduleInfo = useAppSelector((state) => state.schedule.specialtyScheduleInfo);
    const isLoadingSpecialtySlots = useAppSelector(
        (state) => state.schedule.loading.specialtySlots
    );

    // Use appropriate schedule categories based on booking type
    const rawScheduleCategories = isSpecialtyBooking
        ? specialtyScheduleCategories
        : scheduleCategories;
    const effectiveIsLoadingSlots = isSpecialtyBooking ? isLoadingSpecialtySlots : isLoadingSlots;

    // Minimum hours buffer before appointment (patient needs time to prepare and travel)
    const MIN_HOURS_BUFFER = 2;

    // Filter out past time slots when selected date is today
    // This ensures users can only book slots that are at least MIN_HOURS_BUFFER hours from now
    const effectiveScheduleCategories = useMemo(() => {
        if (!selectedDate) return rawScheduleCategories;

        const today = new Date();
        const selectedDateObj = new Date(selectedDate);

        // Check if selected date is today
        const isToday =
            today.getFullYear() === selectedDateObj.getFullYear() &&
            today.getMonth() === selectedDateObj.getMonth() &&
            today.getDate() === selectedDateObj.getDate();

        // If not today, return all slots
        if (!isToday) return rawScheduleCategories;

        // Calculate minimum allowed time (current time + buffer)
        const minAllowedTime = new Date(today.getTime() + MIN_HOURS_BUFFER * 60 * 60 * 1000);
        const minHours = minAllowedTime.getHours();
        const minMinutes = minAllowedTime.getMinutes();

        // Filter slots that start after minimum allowed time
        return rawScheduleCategories
            .map((category) => ({
                ...category,
                timeSlots: category.timeSlots.filter((slot) => {
                    // Parse slot start time (format: "HH:mm")
                    const [slotHours, slotMinutes] = slot.startTime.split(':').map(Number);

                    // Compare with minimum allowed time
                    if (slotHours > minHours) return true;
                    if (slotHours === minHours && slotMinutes >= minMinutes) return true;
                    return false;
                }),
            }))
            .filter((category) => category.timeSlots.length > 0); // Remove empty categories
    }, [rawScheduleCategories, selectedDate]);

    // Get info using custom hooks based on booking type
    const doctorInfo = useDoctorInfo();
    const serviceMedicalInfo = useServiceMedicalInfo();
    const hospitalBookingInfo = useHospitalBookingInfo();

    // Use appropriate info based on booking type
    const bookingInfo = isHospitalBooking
        ? hospitalBookingInfo
        : isServiceMedicalBooking
          ? serviceMedicalInfo
          : doctorInfo;

    // Determine target ID and type for hold slot
    // For hospital booking: use selected doctor or service from booking state
    const effectiveDoctorId = isDoctorBooking ? doctorId : hospitalBookingDoctorId;
    const effectiveServiceId = isServiceMedicalBooking
        ? serviceMedicalId
        : hospitalBookingServiceId;

    const holdSlotTargetId = effectiveDoctorId || effectiveServiceId || undefined;
    const holdSlotTargetType = effectiveDoctorId
        ? HoldSlotTargetType.Doctor
        : HoldSlotTargetType.ServiceMedical;

    // Hold slot hook for doctor/service booking
    const {
        isHeld: isDoctorServiceHeld,
        remainingSeconds: doctorServiceRemainingSeconds,
        isLoading: isDoctorServiceHoldingSlot,
        currentHeldSlot: doctorServiceCurrentHeldSlot,
        holdSlot: holdDoctorServiceSlot,
        releaseSlot: releaseDoctorServiceSlot,
        restoreHeldSlot: restoreDoctorServiceHeldSlot,
    } = useHoldSlot({
        targetId: holdSlotTargetId,
        targetType: holdSlotTargetType,
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

    // Hold slot hook for specialty booking (hospital assigns doctor mode)
    const {
        isHeld: isSpecialtyHeld,
        remainingSeconds: specialtyRemainingSeconds,
        isLoading: isSpecialtyHoldingSlot,
        currentHeldSlot: specialtyCurrentHeldSlot,
        holdSlot: holdSpecialtySlot,
        releaseSlot: releaseSpecialtySlot,
        restoreHeldSlot: restoreSpecialtyHeldSlot,
    } = useSpecialtyHoldSlot({
        hospitalId: hospitalId,
        specialtyId: hospitalBookingSpecialtyId || undefined,
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

    // Use appropriate hold slot state based on booking type
    const isHeld = isSpecialtyBooking ? isSpecialtyHeld : isDoctorServiceHeld;
    const remainingSeconds = isSpecialtyBooking
        ? specialtyRemainingSeconds
        : doctorServiceRemainingSeconds;
    const isHoldingSlot = isSpecialtyBooking ? isSpecialtyHoldingSlot : isDoctorServiceHoldingSlot;
    const releaseSlot = isSpecialtyBooking ? releaseSpecialtySlot : releaseDoctorServiceSlot;

    // Note: holdSlot and restoreHeldSlot have different signatures for specialty vs doctor/service
    // We'll handle them separately in the click handler and restore logic

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

    // Reset hasRestoredRef when component unmounts (for when user navigates back)
    useEffect(() => {
        return () => {
            hasRestoredRef.current = false;
        };
    }, []);

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
    // Only dispatch if the ID actually changed to avoid clearing selectedSlots on remount
    useEffect(() => {
        if (
            isServiceMedicalBooking &&
            serviceMedicalId &&
            serviceMedicalId !== selectedMedicalServiceId
        ) {
            dispatch(setSelectedMedicalService(serviceMedicalId));

            // Fetch service with hospital details for booking header display
            dispatch(getServiceWithHospitalByIdAsync(serviceMedicalId));
        }
    }, [serviceMedicalId, selectedMedicalServiceId, dispatch, isServiceMedicalBooking]);

    // Auto-fetch specialty available slots on mount (for "hospital assigns doctor" mode)
    // This ensures slots are loaded for today's date when entering the step
    useEffect(() => {
        if (isSpecialtyBooking && hospitalId && hospitalBookingSpecialtyId && date) {
            const formattedDate = ScheduleService.formatDateForApi(date);

            // Only update Redux date if it actually changed (to avoid clearing selectedSlots)
            if (formattedDate !== selectedDate) {
                dispatch(setSelectedDate(formattedDate));
            }

            // Fetch specialty available slots
            dispatch(
                fetchSpecialtyAvailableSlots({
                    hospitalId,
                    specialtyId: hospitalBookingSpecialtyId,
                    date: formattedDate,
                    appointmentType: hospitalBookingAppointmentType,
                })
            );
        }
    }, [
        isSpecialtyBooking,
        hospitalId,
        hospitalBookingSpecialtyId,
        hospitalBookingAppointmentType,
        selectedDate,
        dispatch,
    ]); // Note: 'date' is intentionally excluded to only run on mount/booking type change

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
                    // Direct doctor booking
                    if (isDoctorBooking && doctorId) {
                        await dispatch(
                            fetchDoctorAvailableSlots({
                                doctorId,
                                date: formattedDate,
                                ...(medicalServiceId && { medicalServiceId }),
                            })
                        ).unwrap();
                    }
                    // Direct service medical booking
                    else if (isServiceMedicalBooking && serviceMedicalId) {
                        await dispatch(
                            fetchServiceMedicalAvailableSlots({
                                serviceMedicalId,
                                date: formattedDate,
                            })
                        ).unwrap();
                    }
                    // Hospital booking flow - fetch based on selected doctor, service, or specialty
                    else if (isHospitalBooking) {
                        if (hospitalBookingDoctorId) {
                            // Hospital booking with selected doctor
                            await dispatch(
                                fetchDoctorAvailableSlots({
                                    doctorId: hospitalBookingDoctorId,
                                    date: formattedDate,
                                    ...(hospitalBookingServiceId && {
                                        medicalServiceId: hospitalBookingServiceId,
                                    }),
                                })
                            ).unwrap();
                        } else if (hospitalBookingServiceId) {
                            // Hospital booking with selected service (no specific doctor)
                            await dispatch(
                                fetchServiceMedicalAvailableSlots({
                                    serviceMedicalId: hospitalBookingServiceId,
                                    date: formattedDate,
                                })
                            ).unwrap();
                        } else if (hospitalBookingSpecialtyId && hospitalId) {
                            // Specialty booking (hospital assigns doctor mode)
                            await dispatch(
                                fetchSpecialtyAvailableSlots({
                                    hospitalId,
                                    specialtyId: hospitalBookingSpecialtyId,
                                    date: formattedDate,
                                    appointmentType: hospitalBookingAppointmentType,
                                })
                            ).unwrap();
                        }
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
            isHospitalBooking,
            hospitalBookingDoctorId,
            hospitalBookingServiceId,
            hospitalBookingSpecialtyId,
            hospitalId,
            hospitalBookingAppointmentType,
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
            // Use effectiveScheduleCategories to support both doctor/service and specialty booking
            let globalIdx = 0;
            const allSlots = effectiveScheduleCategories.flatMap((category, catIdx) =>
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

            // Validate based on booking type
            const hasValidBookingTarget = isDoctorBooking
                ? !!doctorId
                : isServiceMedicalBooking
                  ? !!serviceMedicalId
                  : isHospitalBooking
                    ? !!(
                          hospitalBookingDoctorId ||
                          hospitalBookingServiceId ||
                          hospitalBookingSpecialtyId
                      )
                    : false;

            if (!selectedSlotData || !hasValidBookingTarget || !selectedDate) {
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

            // Hold slot based on booking type
            let result = false;

            if (isSpecialtyBooking && hospitalId && hospitalBookingSpecialtyId) {
                // Specialty booking (hospital assigns doctor mode)
                // Get maxCapacity from specialty schedule info
                const maxCapacity =
                    specialtyScheduleInfo?.availableSlots?.find(
                        (s) => s.startTime === selectedSlotData.startTime
                    )?.availableDoctorCount || 1;

                result = await holdSpecialtySlot(
                    hospitalId,
                    hospitalBookingSpecialtyId,
                    selectedDate,
                    appointmentTimeId,
                    maxCapacity
                );
            } else {
                // Doctor or service booking
                const holdTargetId = effectiveDoctorId || effectiveServiceId;
                if (!holdTargetId) {
                    toast.error('Không thể giữ chỗ - thiếu thông tin bác sĩ hoặc dịch vụ');
                    return;
                }
                const holdTargetType = effectiveDoctorId
                    ? HoldSlotTargetType.Doctor
                    : HoldSlotTargetType.ServiceMedical;
                result = await holdDoctorServiceSlot(
                    holdTargetId,
                    holdTargetType,
                    selectedDate,
                    appointmentTimeId
                );
            }

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
            } else if (selectedDate) {
                // Hold failed (slot already held by another user)
                // Refresh available slots to update UI based on booking type
                if (isSpecialtyBooking && hospitalId && hospitalBookingSpecialtyId) {
                    dispatch(
                        fetchSpecialtyAvailableSlots({
                            hospitalId,
                            specialtyId: hospitalBookingSpecialtyId,
                            date: selectedDate,
                            appointmentType: hospitalBookingAppointmentType,
                        })
                    );
                } else if (isDoctorBooking && doctorId) {
                    dispatch(
                        fetchDoctorAvailableSlots({
                            doctorId,
                            date: selectedDate,
                            medicalServiceId: medicalServiceId,
                        })
                    );
                } else if (isServiceMedicalBooking && serviceMedicalId) {
                    dispatch(
                        fetchServiceMedicalAvailableSlots({
                            serviceMedicalId,
                            date: selectedDate,
                        })
                    );
                }
            }
        },
        [
            slotChecked,
            effectiveScheduleCategories,
            dispatch,
            doctorId,
            serviceMedicalId,
            selectedDate,
            medicalServiceId,
            isHoldingSlot,
            holdDoctorServiceSlot,
            holdSpecialtySlot,
            releaseSlot,
            authState.isAuthenticated,
            navigate,
            isDoctorBooking,
            isServiceMedicalBooking,
            isHospitalBooking,
            isSpecialtyBooking,
            hospitalId,
            hospitalBookingDoctorId,
            hospitalBookingServiceId,
            hospitalBookingSpecialtyId,
            hospitalBookingAppointmentType,
            effectiveDoctorId,
            effectiveServiceId,
            specialtyScheduleInfo,
        ]
    );

    // Track if we've initialized and what date we last fetched
    const hasInitializedRef = useRef(false);
    const lastFetchedDateRef = useRef<string | null>(null);

    // Initialize with current date on component mount
    useEffect(() => {
        const fetchSlotsForDate = async (fetchDate: Date) => {
            const formattedDate = ScheduleService.formatDateForApi(fetchDate);

            // Only update Redux date if it actually changed (to avoid clearing selectedSlots)
            if (formattedDate !== selectedDate) {
                dispatch(setSelectedDate(formattedDate));
            }

            // Fetch available slots based on booking type
            try {
                // Direct doctor booking
                if (isDoctorBooking && doctorId) {
                    await dispatch(
                        fetchDoctorAvailableSlots({
                            doctorId,
                            date: formattedDate,
                            ...(medicalServiceId && { medicalServiceId }),
                        })
                    ).unwrap();
                }
                // Direct service medical booking
                else if (isServiceMedicalBooking && serviceMedicalId) {
                    await dispatch(
                        fetchServiceMedicalAvailableSlots({
                            serviceMedicalId,
                            date: formattedDate,
                        })
                    ).unwrap();
                }
                // Hospital booking flow
                else if (isHospitalBooking) {
                    if (hospitalBookingDoctorId) {
                        await dispatch(
                            fetchDoctorAvailableSlots({
                                doctorId: hospitalBookingDoctorId,
                                date: formattedDate,
                                ...(hospitalBookingServiceId && {
                                    medicalServiceId: hospitalBookingServiceId,
                                }),
                            })
                        ).unwrap();
                    } else if (hospitalBookingServiceId) {
                        await dispatch(
                            fetchServiceMedicalAvailableSlots({
                                serviceMedicalId: hospitalBookingServiceId,
                                date: formattedDate,
                            })
                        ).unwrap();
                    } else if (hospitalBookingSpecialtyId && hospitalId) {
                        // Specialty booking (hospital assigns doctor mode)
                        await dispatch(
                            fetchSpecialtyAvailableSlots({
                                hospitalId,
                                specialtyId: hospitalBookingSpecialtyId,
                                date: formattedDate,
                                appointmentType: hospitalBookingAppointmentType,
                            })
                        ).unwrap();
                    }
                }
            } catch (error) {
                console.error('Failed to fetch available slots:', error);
            }
        };

        const shouldFetchSlots = () => {
            // Check if we have a valid booking target
            const hasValidTarget = isDoctorBooking
                ? !!doctorId
                : isServiceMedicalBooking
                  ? !!serviceMedicalId
                  : isHospitalBooking
                    ? !!(
                          hospitalBookingDoctorId ||
                          hospitalBookingServiceId ||
                          hospitalBookingSpecialtyId
                      )
                    : false;

            if (!hasValidTarget) return false;

            // Don't fetch if no date available
            if (!date) return false;

            const formattedDate = ScheduleService.formatDateForApi(date);

            // Fetch if this is a new date we haven't fetched yet
            if (lastFetchedDateRef.current !== formattedDate) {
                return true;
            }

            // Fetch if we haven't initialized yet and don't have a selected date
            if (!hasInitializedRef.current && !selectedDate) {
                return true;
            }

            return false;
        };

        if (shouldFetchSlots() && date) {
            const formattedDate = ScheduleService.formatDateForApi(date);
            lastFetchedDateRef.current = formattedDate;
            hasInitializedRef.current = true;
            setDate(date); // Update local state
            fetchSlotsForDate(date);
        }
    }, [
        date,
        isDoctorBooking,
        isServiceMedicalBooking,
        isHospitalBooking,
        selectedDate,
        doctorId,
        serviceMedicalId,
        medicalServiceId,
        hospitalBookingDoctorId,
        hospitalBookingServiceId,
        hospitalBookingSpecialtyId,
        hospitalId,
        hospitalBookingAppointmentType,
        dispatch,
    ]);

    // Restore held slot state when component mounts
    // Supports both doctor/service booking and specialty booking
    useEffect(() => {
        const checkAndRestoreHeldSlot = async () => {
            // Prevent double execution within same mount cycle
            if (hasRestoredRef.current) return;

            // Only restore if we have valid data and no active hold
            // Note: We don't check slotChecked here because sync effect may have set it
            // The !isHeld and !isSpecialtyHeld conditions below handle the "already holding" case
            if (
                selectedDate &&
                selectedSlots.length > 0 &&
                effectiveScheduleCategories.length > 0
            ) {
                const selectedSlot = selectedSlots[0];
                const appointmentTimeId = createAppointmentTimeId({
                    startTime: selectedSlot.startTime,
                    endTime: selectedSlot.endTime,
                });

                // Handle specialty booking restore
                if (
                    isSpecialtyBooking &&
                    hospitalId &&
                    hospitalBookingSpecialtyId &&
                    !isSpecialtyHeld
                ) {
                    hasRestoredRef.current = true;

                    try {
                        const remainingTime = await HoldSlotService.getSpecialtyRemainingTime(
                            hospitalId,
                            hospitalBookingSpecialtyId,
                            selectedDate,
                            appointmentTimeId
                        );

                        if (remainingTime > 0) {
                            // Get maxCapacity from specialty schedule info
                            const maxCapacity =
                                specialtyScheduleInfo?.availableSlots?.find(
                                    (s) => s.startTime === selectedSlot.startTime
                                )?.availableDoctorCount || 1;

                            // Restore specialty held slot
                            restoreSpecialtyHeldSlot(
                                hospitalId,
                                hospitalBookingSpecialtyId,
                                selectedDate,
                                appointmentTimeId,
                                maxCapacity,
                                remainingTime
                            );

                            // Set slotChecked based on selectedSlot
                            const allSlots = effectiveScheduleCategories.flatMap(
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
                            // Slot expired, clear Redux selection
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
                        console.error('Failed to restore specialty held slot:', error);
                        hasRestoredRef.current = false;
                    }
                }
                // Handle doctor/service booking restore
                else if (!isSpecialtyBooking && !isHeld) {
                    const restoreTargetId = effectiveDoctorId || effectiveServiceId;
                    const restoreTargetType = effectiveDoctorId
                        ? HoldSlotTargetType.Doctor
                        : HoldSlotTargetType.ServiceMedical;

                    if (restoreTargetId) {
                        hasRestoredRef.current = true;

                        try {
                            const remainingTime = await HoldSlotService.getRemainingTime(
                                restoreTargetId,
                                restoreTargetType,
                                selectedDate,
                                appointmentTimeId
                            );

                            if (remainingTime > 0) {
                                // Slot is still held, restore countdown timer
                                restoreDoctorServiceHeldSlot(
                                    restoreTargetId,
                                    restoreTargetType,
                                    selectedDate,
                                    appointmentTimeId,
                                    remainingTime
                                );

                                // Set slotChecked based on selectedSlot
                                const allSlots = effectiveScheduleCategories.flatMap(
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
                                // Slot expired, clear Redux selection
                                dispatch(
                                    toggleSlotSelection({
                                        startTime: selectedSlot.startTime,
                                        endTime: selectedSlot.endTime,
                                        isAvailable: true,
                                        isBlocked: false,
                                    })
                                );
                                setSlotChecked([]);
                                toast.warning(
                                    'Thời gian giữ chỗ đã hết. Vui lòng chọn lại khung giờ.'
                                );
                            }
                        } catch (error) {
                            console.error('Failed to restore held slot:', error);
                            hasRestoredRef.current = false;
                        }
                    }
                }
            }
        };

        checkAndRestoreHeldSlot();
    }, [
        effectiveDoctorId,
        effectiveServiceId,
        selectedDate,
        selectedSlots,
        isHeld,
        isSpecialtyHeld,
        isSpecialtyBooking,
        effectiveScheduleCategories,
        hospitalId,
        hospitalBookingSpecialtyId,
        specialtyScheduleInfo,
        restoreDoctorServiceHeldSlot,
        restoreSpecialtyHeldSlot,
        dispatch,
    ]);

    // Sync local slotChecked state with Redux selectedSlots for UI highlighting
    useEffect(() => {
        if (selectedSlots.length > 0 && effectiveScheduleCategories.length > 0) {
            const allSlots = effectiveScheduleCategories.flatMap((category) => category.timeSlots);

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
    }, [selectedSlots, effectiveScheduleCategories]);

    // Note: We DON'T release held slots on unmount anymore
    // This allows users to navigate back and forth between steps
    // Slots will auto-expire after 5 minutes or be released when booking is completed/cancelled

    // Release held slots when target or date changes
    useEffect(() => {
        // For doctor/service booking
        if (!isSpecialtyBooking && isDoctorServiceHeld && doctorServiceCurrentHeldSlot) {
            // Determine current target based on booking type (including hospital booking)
            const currentTargetId = effectiveDoctorId || effectiveServiceId;

            // If target or date changed, release current held slot
            const isDifferentTarget =
                currentTargetId && doctorServiceCurrentHeldSlot.targetId !== currentTargetId;
            const isDifferentDate = doctorServiceCurrentHeldSlot.date !== selectedDate;

            if (isDifferentTarget || isDifferentDate) {
                releaseDoctorServiceSlot().catch(console.error);
                setSlotChecked([]);
            }
        }

        // For specialty booking
        if (isSpecialtyBooking && isSpecialtyHeld && specialtyCurrentHeldSlot) {
            // If date changed, release current held slot
            const isDifferentDate = specialtyCurrentHeldSlot.date !== selectedDate;

            if (isDifferentDate) {
                releaseSpecialtySlot().catch(console.error);
                setSlotChecked([]);
            }
        }
    }, [
        effectiveDoctorId,
        effectiveServiceId,
        selectedDate,
        isSpecialtyBooking,
        isDoctorServiceHeld,
        doctorServiceCurrentHeldSlot,
        releaseDoctorServiceSlot,
        isSpecialtyHeld,
        specialtyCurrentHeldSlot,
        releaseSpecialtySlot,
    ]);

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
                                    minDate={new Date()}
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
                                    {effectiveIsLoadingSlots && (
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

                                    {!effectiveIsLoadingSlots &&
                                        !scheduleError &&
                                        effectiveScheduleCategories.length === 0 &&
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

                                    {!effectiveIsLoadingSlots &&
                                        !scheduleError &&
                                        effectiveScheduleCategories.length > 0 && (
                                            <>
                                                {effectiveScheduleCategories.map(
                                                    (category, categoryIdx) => {
                                                        // Calculate checked slot IDs for this category
                                                        const categoryStartIndex =
                                                            effectiveScheduleCategories
                                                                .slice(0, categoryIdx)
                                                                .reduce(
                                                                    (acc, cat) =>
                                                                        acc + cat.timeSlots.length,
                                                                    0
                                                                );

                                                        const checkedSlotIds = slotChecked
                                                            .filter(
                                                                (checkedIdx) =>
                                                                    checkedIdx >=
                                                                        categoryStartIndex &&
                                                                    checkedIdx <
                                                                        categoryStartIndex +
                                                                            category.timeSlots
                                                                                .length
                                                            )
                                                            .map(
                                                                (checkedIdx) =>
                                                                    checkedIdx -
                                                                    categoryStartIndex +
                                                                    1
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
                                                    }
                                                )}
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
