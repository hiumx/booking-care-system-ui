/**
 * Types of notifications in the system (string-based to match backend)
 */
export enum NotificationType {
    General = 'General',
    BookingConfirmation = 'BookingConfirmation',
    PaymentReminder = 'PaymentReminder',
    Refund = 'Refund',
    AccountUpdate = 'AccountUpdate',
    SystemAlert = 'SystemAlert',
    PaymentSuccess = 'PaymentSuccess',
    PaymentFailed = 'PaymentFailed',
    RefundProcessed = 'RefundProcessed',
    SystemAnnouncement = 'SystemAnnouncement',
}

/**
 * Vietnamese labels for notification types
 */
export const NotificationTypeLabels: Record<NotificationType, string> = {
    [NotificationType.General]: 'Tin tức',
    [NotificationType.BookingConfirmation]: 'Phiếu khám',
    [NotificationType.PaymentReminder]: 'Thông báo',
    [NotificationType.Refund]: 'Thông báo',
    [NotificationType.AccountUpdate]: 'Thông báo',
    [NotificationType.SystemAlert]: 'Tin tức',
    [NotificationType.PaymentSuccess]: 'Thanh toán',
    [NotificationType.PaymentFailed]: 'Thanh toán',
    [NotificationType.RefundProcessed]: 'Hoàn tiền',
    [NotificationType.SystemAnnouncement]: 'Tin tức',
};

/**
 * Grouped notification categories for tabs
 */
export enum NotificationCategory {
    Appointment = 'appointment', // Phiếu khám
    News = 'news', // Tin tức
    System = 'system', // Thông báo
}

/**
 * Vietnamese labels for notification categories
 */
export const NotificationCategoryLabels: Record<NotificationCategory, string> = {
    [NotificationCategory.Appointment]: 'Phiếu khám',
    [NotificationCategory.News]: 'Tin tức',
    [NotificationCategory.System]: 'Thông báo',
};

/**
 * Map notification types to categories
 */
export const getNotificationCategory = (type: NotificationType): NotificationCategory => {
    switch (type) {
        case NotificationType.BookingConfirmation:
            return NotificationCategory.Appointment;
        case NotificationType.General:
        case NotificationType.SystemAlert:
        case NotificationType.SystemAnnouncement:
            return NotificationCategory.News;
        case NotificationType.PaymentReminder:
        case NotificationType.Refund:
        case NotificationType.AccountUpdate:
        case NotificationType.PaymentSuccess:
        case NotificationType.PaymentFailed:
        case NotificationType.RefundProcessed:
            return NotificationCategory.System;
        default:
            return NotificationCategory.System;
    }
};

/**
 * Get notification types by category
 */
export const getTypesByCategory = (category: NotificationCategory): NotificationType[] => {
    switch (category) {
        case NotificationCategory.Appointment:
            return [NotificationType.BookingConfirmation];
        case NotificationCategory.News:
            return [
                NotificationType.General,
                NotificationType.SystemAlert,
                NotificationType.SystemAnnouncement,
            ];
        case NotificationCategory.System:
            return [
                NotificationType.PaymentReminder,
                NotificationType.Refund,
                NotificationType.AccountUpdate,
                NotificationType.PaymentSuccess,
                NotificationType.PaymentFailed,
                NotificationType.RefundProcessed,
            ];
        default:
            return [];
    }
};
