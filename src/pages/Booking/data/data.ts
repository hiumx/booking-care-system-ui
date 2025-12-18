// Steps for doctor/service booking flow
// Note: titles are translation keys from booking.json
export const BOOKING_STEPS = [
    {
        id: 1,
        titleKey: 'steps.dateTime',
    },
    {
        id: 2,
        titleKey: 'steps.basicInfo',
    },
    {
        id: 3,
        titleKey: 'steps.payment',
    },
    {
        id: 4,
        titleKey: 'steps.confirmation',
    },
];

// Steps for hospital booking flow (5 steps)
export const HOSPITAL_BOOKING_STEPS = [
    {
        id: 1,
        titleKey: 'steps.specialtyService',
    },
    {
        id: 2,
        titleKey: 'steps.appointmentType',
    },
    {
        id: 3,
        titleKey: 'steps.dateTime',
    },
    {
        id: 4,
        titleKey: 'steps.basicInfo',
    },
    {
        id: 5,
        titleKey: 'steps.payment',
    },
];
