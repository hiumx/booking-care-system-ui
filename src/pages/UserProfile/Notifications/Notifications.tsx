import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { formatDistanceToNow } from 'date-fns';
import { vi, enUS } from 'date-fns/locale';
import clsx from 'clsx';
import { AppDispatch, RootState } from '@/store';
import {
    fetchNotificationCountsByType,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    deleteAllNotifications,
} from '@/store/slices/notificationSlice';
import {
    NotificationType,
    NotificationCategory,
    getTypesByCategory,
} from '@/enums/notification.enums';
import { NotificationService } from '@/services/notification.service';
import { Notification, getLocalizedNotification } from '@/types/notification.types';
import Pagination from '@/components/Pagination/Pagination';
import NotificationSkeleton from './NotificationSkeleton';

const Notifications = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation('userProfile');
    const currentLanguage = (i18n.language || 'vi') as 'vi' | 'en';
    const { countsByType } = useSelector((state: RootState) => state.notification);

    // Local state for notifications (không dùng Redux để không ảnh hưởng MainHeader)
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const [activeCategory, setActiveCategory] = useState<NotificationCategory>(
        NotificationCategory.Appointment
    );
    const [currentPage, setCurrentPage] = useState(1);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const settingsRef = useRef<HTMLDivElement>(null);

    const itemsPerPage = 5;

    // Load notifications when category changes
    useEffect(() => {
        setCurrentPage(1); // Reset to first page
        loadNotifications();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeCategory]);

    // Load unread counts on mount
    useEffect(() => {
        dispatch(fetchNotificationCountsByType(false)); // false = only unread notifications
    }, [dispatch]);

    // Close settings dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
                setIsSettingsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const loadNotifications = async () => {
        const types = getTypesByCategory(activeCategory);

        if (types.length === 0) return;

        setIsLoading(true);

        try {
            // Call API directly for each type in category
            const promises = types.map((type) =>
                NotificationService.getNotifications(1, itemsPerPage, undefined, type)
            );

            const responses = await Promise.all(promises);

            // Merge all notifications from different types
            const allNotifications = responses.flatMap((response) => response.data || []);

            // Remove duplicates by id
            const uniqueNotifications = Array.from(
                new Map(allNotifications.map((n) => [n.id, n])).values()
            );

            // Sort by date (newest first)
            uniqueNotifications.sort(
                (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );

            // Update local state (không ảnh hưởng Redux)
            setNotifications(uniqueNotifications);
        } catch (error) {
            console.error('[Notifications] Failed to load notifications:', error);
            toast.error(t('notifications.toast.loadError'));
            setNotifications([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleMarkAsRead = async (id: string) => {
        try {
            await dispatch(markNotificationAsRead(id)).unwrap();

            // Update local state
            setNotifications((prev) =>
                prev.map((n) =>
                    n.id === id ? { ...n, isRead: true, readAt: new Date().toISOString() } : n
                )
            );

            toast.success(t('notifications.toast.markedAsRead'));
        } catch {
            toast.error(t('notifications.toast.markAsReadError'));
        }
    };

    const handleNotificationClick = async (notification: Notification) => {
        // Mark as read if not already
        if (!notification.isRead) {
            try {
                await dispatch(markNotificationAsRead(notification.id)).unwrap();

                // Update local state
                setNotifications((prev) =>
                    prev.map((n) =>
                        n.id === notification.id
                            ? { ...n, isRead: true, readAt: new Date().toISOString() }
                            : n
                    )
                );
            } catch (error) {
                console.error('Failed to mark notification as read:', error);
            }
        }

        // Navigate if actionUrl exists
        if (notification.actionUrl) {
            navigate(notification.actionUrl);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await dispatch(markAllNotificationsAsRead()).unwrap();

            // Update local state
            setNotifications((prev) =>
                prev.map((n) => ({
                    ...n,
                    isRead: true,
                    readAt: n.readAt || new Date().toISOString(),
                }))
            );

            toast.success(t('notifications.toast.allMarkedAsRead'));
            setIsSettingsOpen(false);
            dispatch(fetchNotificationCountsByType(false));
        } catch {
            toast.error(t('notifications.toast.markAllError'));
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await dispatch(deleteNotification(id)).unwrap();

            // Update local state
            setNotifications((prev) => prev.filter((n) => n.id !== id));

            toast.success(t('notifications.toast.deleted'));
            dispatch(fetchNotificationCountsByType(false));
        } catch {
            toast.error(t('notifications.toast.deleteError'));
        }
    };

    const handleDeleteAll = async () => {
        if (!globalThis.confirm(t('notifications.confirmDeleteAll'))) {
            return;
        }

        try {
            await dispatch(deleteAllNotifications()).unwrap();

            // Update local state
            setNotifications([]);

            toast.success(t('notifications.toast.allDeleted'));
            setIsSettingsOpen(false);
            dispatch(fetchNotificationCountsByType(false));
        } catch {
            toast.error(t('notifications.toast.deleteAllError'));
        }
    };

    const formatTime = (createdAt: string) => {
        const locale = currentLanguage === 'en' ? enUS : vi;
        const formatted = formatDistanceToNow(new Date(createdAt), {
            addSuffix: true,
            locale,
        });
        // Remove "about" prefix for Vietnamese
        return currentLanguage === 'vi'
            ? formatted.replace('khoảng ', '')
            : formatted.replace('about ', '');
    };

    // Notifications are already filtered by category via fetchNotificationsByCategory
    // No need for additional client-side filtering
    const filteredNotifications = notifications;

    // Calculate counts for tabs (backend returns string enum names as keys)
    const appointmentCount = Object.entries(countsByType)
        .filter(([type]) =>
            getTypesByCategory(NotificationCategory.Appointment).includes(type as NotificationType)
        )
        .reduce((sum, [, count]) => sum + count, 0);

    const newsCount = Object.entries(countsByType)
        .filter(([type]) =>
            getTypesByCategory(NotificationCategory.News).includes(type as NotificationType)
        )
        .reduce((sum, [, count]) => sum + count, 0);

    const systemCount = Object.entries(countsByType)
        .filter(([type]) =>
            getTypesByCategory(NotificationCategory.System).includes(type as NotificationType)
        )
        .reduce((sum, [, count]) => sum + count, 0);

    // Pagination
    const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedNotifications = filteredNotifications.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Helper function to render notification content based on loading/empty state
    const renderNotificationContent = () => {
        if (isLoading) {
            return (
                <div className="notification-list-page">
                    {Array.from({ length: itemsPerPage }, (_, index) => (
                        <NotificationSkeleton key={`skeleton-${index}`} />
                    ))}
                </div>
            );
        }

        if (paginatedNotifications.length === 0) {
            return (
                <div className="text-center py-5">
                    <i className="isax isax-notification-bing fs-1 text-muted"></i>
                    <p className="text-muted mt-3">{t('notifications.empty')}</p>
                </div>
            );
        }

        return (
            <>
                <div className="notification-list-page">
                    {paginatedNotifications.map((notification) => {
                        const localizedNotification = getLocalizedNotification(
                            notification,
                            currentLanguage
                        );

                        // Extract complex logic to improve readability
                        const backgroundColor = notification.isRead ? 'transparent' : '#f8f9fa';
                        const cursorStyle =
                            notification.actionUrl || notification.isRead ? 'pointer' : 'default';

                        return (
                            <div
                                key={notification.id}
                                className={clsx('notification-item', {
                                    unread: !notification.isRead,
                                })}
                                style={{
                                    padding: '16px',
                                    borderBottom: '1px solid #e0e0e0',
                                    backgroundColor,
                                    cursor: cursorStyle,
                                    transition: 'background-color 0.2s ease',
                                }}
                                {...(notification.actionUrl && {
                                    role: 'button',
                                    tabIndex: 0,
                                    onClick: () => {
                                        void handleNotificationClick(notification);
                                    },
                                    onKeyDown: (e: React.KeyboardEvent) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            void handleNotificationClick(notification);
                                        }
                                    },
                                })}
                                onMouseEnter={(e) => {
                                    if (notification.isRead || notification.actionUrl) {
                                        e.currentTarget.style.backgroundColor = '#f8f9fa';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (notification.isRead) {
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                    } else if (notification.actionUrl && !notification.isRead) {
                                        e.currentTarget.style.backgroundColor = '#f8f9fa';
                                    }
                                }}
                            >
                                <div className="d-flex gap-3">
                                    <div
                                        className="notification-icon"
                                        style={{
                                            width: '48px',
                                            height: '48px',
                                            borderRadius: '50%',
                                            backgroundColor: '#e3f2fd',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0,
                                        }}
                                    >
                                        <i
                                            className={
                                                notification.icon || 'isax isax-notification'
                                            }
                                            style={{
                                                fontSize: '24px',
                                                color: '#1976d2',
                                            }}
                                        ></i>
                                    </div>
                                    <div className="flex-grow-1" style={{ minWidth: 0 }}>
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <h6 className="mb-0" style={{ fontWeight: 600 }}>
                                                {localizedNotification.title}
                                            </h6>
                                            <span
                                                className="text-muted"
                                                style={{
                                                    fontSize: '12px',
                                                    whiteSpace: 'nowrap',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '4px',
                                                }}
                                            >
                                                <i
                                                    className="isax isax-clock"
                                                    style={{ fontSize: '14px' }}
                                                ></i>
                                                {formatTime(notification.createdAt)}
                                            </span>
                                        </div>
                                        <p className="text-muted mb-2" style={{ fontSize: '14px' }}>
                                            {localizedNotification.content}
                                        </p>
                                        <div className="d-flex gap-2 align-items-center">
                                            {!notification.isRead && (
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-primary"
                                                    onClick={() =>
                                                        handleMarkAsRead(notification.id)
                                                    }
                                                >
                                                    <i className="isax isax-tick-circle me-1"></i>{' '}
                                                    {t('notifications.markAsRead')}
                                                </button>
                                            )}
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => handleDelete(notification.id)}
                                            >
                                                <i className="isax isax-trash me-1"></i>{' '}
                                                {t('notifications.delete')}
                                            </button>
                                            {!notification.isRead && (
                                                <span
                                                    className="badge bg-primary"
                                                    style={{ marginLeft: 'auto' }}
                                                >
                                                    {t('notifications.new')}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-4">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                            showPrevNext={true}
                            maxVisiblePages={5}
                        />
                    </div>
                )}
            </>
        );
    };

    return (
        <>
            <div className="dashboard-header">
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <h3>{t('notifications.title')}</h3>
                </div>
            </div>

            {/* Notification Tabs - Same structure as Appointments */}
            <div className="appointment-tab-head">
                <div className="appointment-tabs">
                    <ul className="nav nav-pills inner-tab" id="pills-tab">
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeCategory === NotificationCategory.Appointment ? 'active' : ''}`}
                                type="button"
                                onClick={() => setActiveCategory(NotificationCategory.Appointment)}
                            >
                                {t('notifications.tabs.appointment')}
                                <span
                                    style={
                                        appointmentCount > 0
                                            ? {
                                                  backgroundColor: '#dc3545',
                                                  color: '#ffffff',
                                              }
                                            : undefined
                                    }
                                >
                                    {appointmentCount}
                                </span>
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeCategory === NotificationCategory.News ? 'active' : ''}`}
                                type="button"
                                onClick={() => setActiveCategory(NotificationCategory.News)}
                            >
                                {t('notifications.tabs.news')}
                                <span
                                    style={
                                        newsCount > 0
                                            ? {
                                                  backgroundColor: '#dc3545',
                                                  color: '#ffffff',
                                              }
                                            : undefined
                                    }
                                >
                                    {newsCount}
                                </span>
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeCategory === NotificationCategory.System ? 'active' : ''}`}
                                type="button"
                                onClick={() => setActiveCategory(NotificationCategory.System)}
                            >
                                {t('notifications.tabs.system')}
                                <span
                                    style={
                                        systemCount > 0
                                            ? {
                                                  backgroundColor: '#dc3545',
                                                  color: '#ffffff',
                                              }
                                            : undefined
                                    }
                                >
                                    {systemCount}
                                </span>
                            </button>
                        </li>
                    </ul>
                </div>
                {/* Settings Dropdown */}
                <div className="dropdown" ref={settingsRef} style={{ position: 'relative' }}>
                    <button
                        type="button"
                        className="btn btn-sm btn-light"
                        onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            border: '1px solid #e0e0e0',
                        }}
                    >
                        <i className="isax isax-setting-2"></i> {t('notifications.options')}
                    </button>

                    {isSettingsOpen && (
                        <div
                            className="dropdown-menu show"
                            style={{
                                position: 'absolute',
                                right: 0,
                                top: '100%',
                                marginTop: '4px',
                                minWidth: '200px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                zIndex: 1000,
                            }}
                        >
                            <button
                                type="button"
                                className="dropdown-item"
                                onClick={handleMarkAllAsRead}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '8px 16px',
                                }}
                            >
                                <i className="isax isax-tick-circle"></i>{' '}
                                {t('notifications.markAllAsRead')}
                            </button>
                            <div className="dropdown-divider"></div>
                            <button
                                type="button"
                                className="dropdown-item text-danger"
                                onClick={handleDeleteAll}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '8px 16px',
                                }}
                            >
                                <i className="isax isax-trash"></i> {t('notifications.deleteAll')}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Notification Content */}
            <div className="tab-content appointment-tab-content">
                <div className="tab-pane fade show active">
                    {/* Notifications List */}
                    {renderNotificationContent()}
                </div>
            </div>
        </>
    );
};

export default Notifications;
