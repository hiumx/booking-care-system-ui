export interface FilterState {
    filterSearchTerm: string;
    appointmentTypeFilters: {
        allType: boolean;
        telehealth: boolean;
        directVisit: boolean;
    };
    bookingForFilters: {
        all: boolean;
        self: boolean;
        relative: boolean;
    };
}
