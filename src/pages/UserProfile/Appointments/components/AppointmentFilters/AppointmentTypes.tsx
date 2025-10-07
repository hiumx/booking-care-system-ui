export interface FilterState {
    filterSearchTerm: string;
    appointmentTypeFilters: {
        allType: boolean;
        telehealth: boolean;
        directVisit: boolean;
    };
    visitTypeFilters: {
        allVisit: boolean;
        general: boolean;
        consultation: boolean;
        followUp: boolean;
        directVisit: boolean;
    };
}
