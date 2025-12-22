/**
 * Represents the gender of a doctor.
 */
export enum DoctorGender {
    /**
     * Male doctor.
     */
    MALE = 'MALE',

    /**
     * Female doctor.
     */
    FEMALE = 'FEMALE',

    /**
     * Other or unspecified gender.
     */
    OTHER = 'OTHER',
}

/**
 * Helper function to get display text for doctor gender
 */
export const getDoctorGenderDisplayText = (gender: DoctorGender): string => {
    switch (gender) {
        case DoctorGender.MALE:
            return 'Nam';
        case DoctorGender.FEMALE:
            return 'Nữ';
        case DoctorGender.OTHER:
            return 'Khác';
        default:
            return 'Không xác định';
    }
};

/**
 * Helper function to get all doctor gender options for select/dropdown
 */
export const getDoctorGenderOptions = () => [
    { value: DoctorGender.MALE, label: 'Nam' },
    { value: DoctorGender.FEMALE, label: 'Nữ' },
    { value: DoctorGender.OTHER, label: 'Khác' },
];
