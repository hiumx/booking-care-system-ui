import { useMemo } from 'react';
import { useAppSelector } from '@/store/hooks';
import { selectSelectedDate, selectSelectedSlots } from '@/store/selectors/schedule.selectors';

/**
 * Custom hook to format selected date and time slots for display in BookingHeader
 * @returns Formatted date and time string (e.g., "15/10/2025 - 09:00 - 10:00, 10:00 - 10:30")
 */
export const useFormattedDateTime = (): string => {
    const selectedDate = useAppSelector(selectSelectedDate);
    const selectedSlots = useAppSelector(selectSelectedSlots);

    const formattedDateTime = useMemo(() => {
        if (!selectedDate) {
            return 'Chưa chọn';
        }

        // Format date to Vietnamese format (DD/MM/YYYY)
        const date = new Date(selectedDate);
        const formattedDate = date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });

        // If no time slots selected, return only the date
        if (!selectedSlots || selectedSlots.length === 0) {
            return formattedDate;
        }

        // Sort slots by start time for better readability
        const sortedSlots = [...selectedSlots].sort((a, b) => {
            return a.startTime.localeCompare(b.startTime);
        });
        const timeSlotStrings = sortedSlots.map((slot) => `${slot.startTime}-${slot.endTime}`);
        const result = `${formattedDate} - ${timeSlotStrings.join(', ')}`;
        return result;
    }, [selectedDate, selectedSlots]);

    return formattedDateTime;
};
