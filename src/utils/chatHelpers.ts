/**
 * Chat helper utilities
 */

/**
 * Normalize userId to UPPERCASE for case-insensitive comparison
 * Backend normalizes all userIds to UPPERCASE, so frontend must match
 */
export const normalizeUserId = (userId: string | undefined | null): string => {
    if (!userId) return '';
    return userId.toUpperCase();
};

/**
 * Check if user is online (case-insensitive)
 * @param userId - User ID to check (can be any case)
 * @param onlineUsers - Set of online user IDs (should be normalized to UPPERCASE)
 */
export const isUserOnline = (
    userId: string | undefined | null,
    onlineUsers: Set<string>
): boolean => {
    if (!userId) return false;
    const normalizedId = normalizeUserId(userId);
    return onlineUsers.has(normalizedId);
};
