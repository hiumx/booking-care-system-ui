# Date & Time Selection Flow

This document explains how the date and time selection in `DateTimeSection` automatically updates the `BookingHeader` component.

## Architecture Overview

The implementation uses Redux for state management and custom hooks for data formatting:

```
┌─────────────────────────────────────────────────────────────┐
│                    DateTimeSection                          │
│  ┌──────────────┐          ┌──────────────────────┐       │
│  │   Calendar   │────────▶ │ dispatch(setDate)    │       │
│  └──────────────┘          └──────────────────────┘       │
│                                       │                     │
│  ┌──────────────┐          ┌──────────────────────┐       │
│  │  Time Slots  │────────▶ │ dispatch(setSlot)    │       │
│  └──────────────┘          └──────────────────────┘       │
└─────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
                        ┌───────────────────────┐
                        │   Redux Store         │
                        │  - selectedDate       │
                        │  - selectedSlot       │
                        └───────────────────────┘
                                    │
                                    ▼
                        ┌───────────────────────┐
                        │ useFormattedDateTime  │
                        │     (Hook)            │
                        └───────────────────────┘
                                    │
                                    ▼
                        ┌───────────────────────┐
                        │ BookingSectionWrapper │
                        │  (Updates appointment)│
                        └───────────────────────┘
                                    │
                                    ▼
                        ┌───────────────────────┐
                        │   BookingHeader       │
                        │  (Displays DateTime)  │
                        └───────────────────────┘
```

## Implementation Details

### 1. Redux State Management

The schedule slice maintains the selected date and time slot:

```typescript
// State structure
{
  selectedDate: string | null,        // "2025-10-15"
  selectedSlot: AvailableSlot | null, // { startTime: "09:00", endTime: "10:00", ... }
}
```

### 2. Custom Hook: useFormattedDateTime

Located at: `src/pages/Booking/hooks/useFormattedDateTime.ts`

This hook:

- Reads `selectedDate` and `selectedSlot` from Redux
- Formats the data for display
- Returns formatted string like "15/10/2025 - 09:00 - 10:00"

```typescript
const formattedDateTime = useFormattedDateTime();
// Returns: "15/10/2025 - 09:00 - 10:00" or "Chưa chọn"
```

### 3. BookingSectionWrapper Integration

The wrapper component automatically injects the formatted date/time:

```typescript
const updatedAppointment = useMemo(
    () => ({
        ...appointment,
        dateTime: formattedDateTime, // ← Automatically updated!
    }),
    [appointment, formattedDateTime]
);
```

## How It Works: Step by Step

### Step 1: User Selects a Date

```typescript
// In DateTimeSection.tsx
const handleDateChange = async (newDate: Date | null) => {
    if (newDate && doctorId) {
        const formattedDate = ScheduleService.formatDateForApi(newDate);

        // ✅ Update Redux state
        dispatch(setSelectedDate(formattedDate));

        // Fetch available slots for this date
        await dispatch(
            fetchDoctorAvailableSlots({
                doctorId,
                date: formattedDate,
            })
        );
    }
};
```

### Step 2: User Selects a Time Slot

```typescript
// In DateTimeSection.tsx
const handleClickSlot = (slotIndex: number) => {
    // Find the selected slot data
    const selectedSlotData = allSlots.find((slot) => slot.globalIndex === slotIndex);

    if (selectedSlotData) {
        // ✅ Update Redux state with selected slot
        dispatch(
            setSelectedSlot({
                startTime: selectedSlotData.startTime,
                endTime: selectedSlotData.endTime,
                isAvailable: true,
                isBlocked: false,
            })
        );
    }
};
```

### Step 3: BookingHeader Auto-Updates

```typescript
// In BookingSectionWrapper.tsx
const formattedDateTime = useFormattedDateTime(); // ← Reads from Redux

// Automatically merges with appointment data
const updatedAppointment = useMemo(
    () => ({
        ...appointment,
        dateTime: formattedDateTime, // ← Updates BookingHeader
    }),
    [appointment, formattedDateTime]
);

// Pass to BookingHeader
<BookingHeader doctor={doctor} appointment={updatedAppointment} />
```

## Format Examples

| State                                 | Display                      |
| ------------------------------------- | ---------------------------- |
| No date selected                      | `Chưa chọn`                  |
| Date only (15/10/2025)                | `15/10/2025`                 |
| Date + Time (15/10/2025, 09:00-10:00) | `15/10/2025 - 09:00 - 10:00` |

## Benefits of This Approach

✅ **Automatic Updates**: BookingHeader updates instantly when user selects date/time  
✅ **Single Source of Truth**: Redux manages the state  
✅ **Reusable**: The hook can be used in other components  
✅ **Type-Safe**: Full TypeScript support  
✅ **Performance**: useMemo prevents unnecessary re-renders  
✅ **Clean Separation**: Business logic separated from UI

## Testing the Integration

### Test Case 1: Select Date Only

1. Open the booking page
2. Select a date from the calendar
3. **Expected**: BookingHeader shows "15/10/2025"

### Test Case 2: Select Date and Time

1. Select a date from the calendar
2. Click on a time slot (e.g., "09:00 - 10:00")
3. **Expected**: BookingHeader shows "15/10/2025 - 09:00 - 10:00"

### Test Case 3: Change Date

1. Select initial date and time
2. Change to a different date
3. **Expected**: BookingHeader updates to new date (time slot may reset)

### Test Case 4: Change Time Slot

1. Select date and initial time slot
2. Click a different time slot
3. **Expected**: BookingHeader updates to new time slot

## Customization

### Changing Date Format

Edit `useFormattedDateTime.ts`:

```typescript
const formattedDate = date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    // Add more options as needed
    // weekday: 'long', // → "Thứ Hai, 15/10/2025"
});
```

### Changing Time Display Format

Edit `useFormattedDateTime.ts`:

```typescript
// Current: "15/10/2025 - 09:00 - 10:00"
return `${formattedDate} - ${selectedSlot.startTime} - ${selectedSlot.endTime}`;

// Alternative 1: "15/10/2025 (09:00 - 10:00)"
return `${formattedDate} (${selectedSlot.startTime} - ${selectedSlot.endTime})`;

// Alternative 2: "15/10/2025 lúc 09:00"
return `${formattedDate} lúc ${selectedSlot.startTime}`;
```

## Troubleshooting

### Problem: BookingHeader not updating

**Check:**

1. Is Redux DevTools showing state updates?
2. Is `useFormattedDateTime` being called in `BookingSectionWrapper`?
3. Are the Redux selectors returning the correct data?

### Problem: Wrong date format

**Solution:** Adjust the `toLocaleDateString` options in `useFormattedDateTime.ts`

### Problem: Time slot not showing

**Check:**

1. Is `selectedSlot` being set in Redux after clicking a slot?
2. Does `selectedSlot` contain `startTime` and `endTime` properties?
3. Check console for any errors in `handleClickSlot`

## Related Files

- `src/pages/Booking/hooks/useFormattedDateTime.ts` - Formatting hook
- `src/pages/Booking/components/BookingSectionWrapper/BookingSectionWrapper.tsx` - Integration point
- `src/pages/Booking/sections/DateTimeSection/DateTimeSection.tsx` - User input
- `src/store/slices/schedule.slice.ts` - Redux state
- `src/store/selectors/schedule.selectors.ts` - Redux selectors

## Future Enhancements

- [ ] Add animation when date/time updates
- [ ] Show loading state while fetching slots
- [ ] Add validation for date/time selection
- [ ] Support multiple time slot selection
- [ ] Add date/time confirmation modal
- [ ] Support timezone selection
