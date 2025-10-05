/**
 * Validation utility functions
 */

/**
 * Check if user is at least 18 years old
 * @param dateOfBirth Date of birth in string format (YYYY-MM-DD)
 * @returns true if age >= 18, false otherwise
 */
export const validateAge = (dateOfBirth: string): boolean => {
    if (!dateOfBirth) return false;
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        return age - 1 >= 18;
    }
    return age >= 18;
};
