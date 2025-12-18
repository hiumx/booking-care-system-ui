const mockTimeSlots = {
    morning: [
        { id: 1, time: '08:00' },
        { id: 2, time: '08:30' },
        { id: 3, time: '09:00' },
        { id: 4, time: '09:30' },
        { id: 5, time: '10:00' },
        { id: 6, time: '10:30' },
        { id: 7, time: '11:00' },
        { id: 8, time: '11:30' },
    ],
    afternoon: [
        { id: 9, time: '12:00' },
        { id: 10, time: '12:30' },
        { id: 11, time: '13:00' },
        { id: 12, time: '13:30' },
        { id: 13, time: '14:00' },
        { id: 14, time: '14:30' },
        { id: 15, time: '15:00' },
        { id: 16, time: '15:30' },
        { id: 17, time: '16:00' },
        { id: 18, time: '16:30' },
    ],
    evening: [
        { id: 19, time: '17:00' },
        { id: 20, time: '17:30' },
        { id: 21, time: '18:00' },
        { id: 22, time: '18:30' },
        { id: 23, time: '19:00' },
        { id: 24, time: '19:30' },
        { id: 25, time: '20:00' },
        { id: 26, time: '20:30' },
    ],
};

// Note: title uses translation keys that will be translated in SlotCategory component
export const mockSlotCategories = [
    { title: 'morning', timeSlots: mockTimeSlots.morning },
    { title: 'afternoon', timeSlots: mockTimeSlots.afternoon },
    { title: 'evening', timeSlots: mockTimeSlots.evening },
];
