export interface FilterState {
    filterSearchTerm: string;
    appointmentTypeFilters: {
        allType: boolean;
        videoCall: boolean;
        audioCall: boolean;
        chat: boolean;
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
