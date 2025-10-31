import React, { useState, useEffect, useMemo } from 'react';
import { RangeKeyDict } from 'react-date-range';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import AppointmentCard from './components/AppointmentCard/AppointmentCard';
import AppointmentCardSkeleton from './components/AppointmentCard/AppointmentCardSkeleton';
import AppointmentFilters from './components/AppointmentFilters/AppointmentFilters';
import Pagination from '@/components/Pagination/Pagination';
import DateRangePicker from '@/components/DateRangePicker';
import ModalCancel from '@/components/ModalCancel';
import {
    AppointmentUITab,
    AppointmentQueryRequest,
    AppointmentCardData,
    mapUITabToStatus,
    transformToCardData,
    isNewAppointment,
} from '@/types/appointment.types';
import { AppointmentService } from '@/services/appointment.service';
import { TargetType } from '@/types/review.types';
import { RootState } from '@/store';
import { useReviewHandlers } from '@/hooks/useReviewHandlers';
import { FilterState } from './components/AppointmentFilters/AppointmentTypes';
import { getRefundInfo } from '@/utils/refund-policy.util';
import { handleRescheduleAction } from '@/utils/reschedule-utils';
import styles from './Appointments.module.scss';
import { Link } from 'react-router-dom';
import AppointmentGridCard from './components/AppointmentGridCard/AppointmentGridCard';
import { AppointmentType, AppointmentStatus } from '@/enums/appointment.enums';

// View mode type
type ViewMode = 'list' | 'grid';

const Appointments: React.FC = () => {
    // Get user profile from Redux
    const userProfile = useSelector((state: RootState) => state.user.profile);

    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<AppointmentUITab>('waiting');
    const [viewMode, setViewMode] = useState<ViewMode>('list');
    const [selectedFilters, setSelectedFilters] = useState({
        appointmentType: [] as AppointmentType[],
        visitType: [] as string[],
        dateRange: { from: '', to: '' },
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const itemsPerPage = 5;

    // Cancel modal states
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [selectedAppointmentToCancel, setSelectedAppointmentToCancel] =
        useState<AppointmentCardData | null>(null);
    const [isCancelling, setIsCancelling] = useState(false);

    // Review modal states
    const [selectedAppointmentForReview, setSelectedAppointmentForReview] =
        useState<AppointmentCardData | null>(null);
    const [reviewRating, setReviewRating] = useState<number>(5);
    const [reviewComment, setReviewComment] = useState<string>('');
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);

    // Refresh trigger để fetch lại data sau khi cancel
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // API data state
    const [appointments, setAppointments] = useState<AppointmentCardData[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [apiError, setApiError] = useState<string | null>(null);

    // Counts for all tabs
    const [tabCounts, setTabCounts] = useState({
        waiting: 0,
        upcoming: 0,
        cancelled: 0,
        completed: 0,
    });

    // Filter states for AppointmentFilters component
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filterState, setFilterState] = useState<FilterState>({
        filterSearchTerm: '',
        appointmentTypeFilters: {
            allType: true,
            telehealth: false,
            directVisit: false,
        },
        visitTypeFilters: {
            allVisit: true,
            general: false,
            consultation: false,
            followUp: false,
            directVisit: false,
        },
    });

    // Helper function to create default date range
    const createDefaultDateRange = () => [
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection',
        },
    ];

    // Date range picker state
    const [dateRanges, setDateRanges] = useState(createDefaultDateRange);

    // Responsive months for date picker
    const [calendarMonths, setCalendarMonths] = useState(2);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 768) {
                setCalendarMonths(1); // Mobile: 1 tháng
            } else {
                setCalendarMonths(2); // Desktop: 2 tháng
            }
        };

        // Initial check
        handleResize();

        // Add event listener
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // No longer need separate useEffect for counts - will get from main API call

    // Fetch appointments from API
    useEffect(() => {
        const fetchAppointments = async () => {
            if (!userProfile?.id) {
                console.warn('User profile not available');
                toast.warning('Vui lòng đăng nhập để xem lịch hẹn');
                return;
            }

            setIsLoading(true);
            setApiError(null);

            try {
                // Build query request
                const query: AppointmentQueryRequest = {
                    patientId: userProfile.id,
                    status: mapUITabToStatus(activeTab),
                    // Don't send searchTerm to API - we'll filter client-side
                    // This allows searching doctor/hospital/service names from gRPC
                    fromDate: selectedFilters.dateRange.from || undefined,
                    toDate: selectedFilters.dateRange.to || undefined,
                    pageNumber: currentPage,
                    pageSize: itemsPerPage,
                    sortBy: 'CreatedAt',
                    sortDescending: true,
                    includeStatusCounts: true, // Always include counts
                };

                // Add appointment type filter if selected
                if (selectedFilters.appointmentType.length > 0) {
                    query.appointmentType = selectedFilters.appointmentType[0];
                }

                // Call API
                const response = await AppointmentService.getAppointmentsByPatient(query);

                if (response.success && response.data) {
                    // Transform API responses to UI-friendly format
                    const transformedAppointments = response.data.appointments.map((apt) => {
                        const cardData = transformToCardData(apt);
                        // Add computed fields
                        cardData.isNew = isNewAppointment(apt.createdAt);
                        return cardData;
                    });

                    setAppointments(transformedAppointments);
                    setTotalCount(response.data.totalCount || 0);

                    // Update counts from statusCounts if available
                    if (response.data.statusCounts) {
                        setTabCounts({
                            waiting: response.data.statusCounts.pending || 0,
                            upcoming: response.data.statusCounts.confirmed || 0,
                            cancelled: response.data.statusCounts.cancelled || 0,
                            completed: response.data.statusCounts.completed || 0,
                        });
                    }
                } else {
                    throw new Error(response.message || 'Không thể tải danh sách lịch hẹn');
                }
            } catch (error: any) {
                console.error('Error fetching appointments:', error);
                const errorMessage = error.message || 'Không thể tải danh sách lịch hẹn';
                setApiError(errorMessage);
                setAppointments([]);
                setTotalCount(0);
                toast.error(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAppointments();
    }, [
        userProfile,
        activeTab,
        // searchTerm and filterSearchTerm removed - using client-side search only
        selectedFilters.dateRange.from,
        selectedFilters.dateRange.to,
        selectedFilters.appointmentType,
        currentPage,
        itemsPerPage,
        refreshTrigger, // Thêm refreshTrigger để fetch lại data sau khi cancel
    ]);

    // Handle date range change
    const handleDateRangeChange = (ranges: RangeKeyDict) => {
        const selection = ranges.selection;
        if (selection?.startDate && selection?.endDate && selection?.key) {
            setDateRanges([
                {
                    startDate: selection.startDate,
                    endDate: selection.endDate,
                    key: selection.key,
                },
            ]);

            // Update selectedFilters to sync with existing filter logic
            setSelectedFilters({
                ...selectedFilters,
                dateRange: {
                    from: selection.startDate.toISOString().split('T')[0],
                    to: selection.endDate.toISOString().split('T')[0],
                },
            });

            // Reset to first page when date range changes
            setCurrentPage(1);
        }
    };

    // Apply client-side search - comprehensive search across all fields
    const filteredAppointments = useMemo(() => {
        if (!searchTerm && !filterState.filterSearchTerm) {
            return appointments;
        }

        const term = (searchTerm || filterState.filterSearchTerm || '').toLowerCase().trim();

        return appointments.filter((apt) => {
            // Search across ALL available fields

            // 1. Appointment ID (full or partial)
            const appointmentId = apt.appointmentId.toLowerCase();

            // 2. Doctor info
            const doctorName =
                apt.doctorInfo?.fullName?.toLowerCase() ||
                `${apt.doctorInfo?.firstName || ''} ${apt.doctorInfo?.lastName || ''}`
                    .toLowerCase()
                    .trim();
            const specialty = apt.doctorInfo?.specialtyName?.toLowerCase() || '';
            const position = apt.doctorInfo?.positionName?.toLowerCase() || '';

            // 3. Hospital info
            const hospitalName = apt.hospitalInfo?.name?.toLowerCase() || '';

            // 4. Service info
            const serviceName = apt.serviceInfo?.name?.toLowerCase() || '';

            // 5. Appointment details
            const reason = apt.reason?.toLowerCase() || '';
            const result = apt.result?.toLowerCase() || '';

            return (
                appointmentId.includes(term) ||
                doctorName.includes(term) ||
                specialty.includes(term) ||
                position.includes(term) ||
                hospitalName.includes(term) ||
                serviceName.includes(term) ||
                reason.includes(term) ||
                result.includes(term)
            );
        });
    }, [appointments, searchTerm, filterState.filterSearchTerm]);

    // Pagination - adjust for client-side filtering
    const actualTotalCount =
        filteredAppointments.length < appointments.length
            ? filteredAppointments.length // Client-side filtered
            : totalCount; // Use API count

    const totalPages = Math.ceil(actualTotalCount / itemsPerPage);

    // Apply client-side pagination if we did client-side filtering
    const currentAppointments =
        filteredAppointments.length < appointments.length
            ? filteredAppointments.slice(
                  (currentPage - 1) * itemsPerPage,
                  currentPage * itemsPerPage
              )
            : filteredAppointments; // Already paginated by API

    // Get appointment counts for tabs - using tabCounts state
    const appointmentCounts = tabCounts;

    const handleTabChange = (tab: AppointmentUITab) => {
        setActiveTab(tab);
        setCurrentPage(1); // Reset to first page when changing tabs
        // Loading state will be handled by useEffect when fetching
    };

    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
        // Reset to first page when searching (client-side filter)
        if (value !== searchTerm) {
            setCurrentPage(1);
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const resetFilters = () => {
        setSelectedFilters({
            appointmentType: [],
            visitType: [],
            dateRange: { from: '', to: '' },
        });
        setDateRanges(createDefaultDateRange());
        setFilterState({
            filterSearchTerm: '',
            appointmentTypeFilters: {
                allType: true,
                telehealth: false,
                directVisit: false,
            },
            visitTypeFilters: {
                allVisit: true,
                general: false,
                consultation: false,
                followUp: false,
                directVisit: false,
            },
        });
        setSearchTerm('');
        setCurrentPage(1);
    };

    // AppointmentFilters handlers
    const handleFilterSearchChange = (value: string) => {
        setFilterState({
            ...filterState,
            filterSearchTerm: value,
        });
        // Reset to first page when filter search changes
        if (value !== filterState.filterSearchTerm) {
            setCurrentPage(1);
        }
    };

    const handleAppointmentTypeChange = (type: string, checked: boolean) => {
        if (type === 'allType') {
            setFilterState({
                ...filterState,
                appointmentTypeFilters: {
                    allType: checked,
                    telehealth: checked ? filterState.appointmentTypeFilters.telehealth : false,
                    directVisit: checked ? filterState.appointmentTypeFilters.directVisit : false,
                },
            });
        } else {
            const newFilters = {
                ...filterState.appointmentTypeFilters,
                [type]: checked,
                allType: false, // Uncheck "all" when selecting individual items
            };
            setFilterState({
                ...filterState,
                appointmentTypeFilters: newFilters,
            });
        }
    };

    const handleVisitTypeChange = (type: string, checked: boolean) => {
        if (type === 'allVisit') {
            setFilterState({
                ...filterState,
                visitTypeFilters: {
                    allVisit: checked,
                    general: checked ? filterState.visitTypeFilters.general : false,
                    consultation: checked ? filterState.visitTypeFilters.consultation : false,
                    followUp: checked ? filterState.visitTypeFilters.followUp : false,
                    directVisit: checked ? filterState.visitTypeFilters.directVisit : false,
                },
            });
        } else {
            const newFilters = {
                ...filterState.visitTypeFilters,
                [type]: checked,
                allVisit: false, // Uncheck "all" when selecting individual items
            };
            setFilterState({
                ...filterState,
                visitTypeFilters: newFilters,
            });
        }
    };

    const handleFilterReset = () => {
        resetFilters();
        setIsFilterOpen(false);
    };

    const handleFilterApply = () => {
        const { appointmentTypes, visitTypes } = convertFilterStateToSelectedFilters();

        setSelectedFilters({
            ...selectedFilters,
            appointmentType: appointmentTypes,
            visitType: visitTypes,
        });

        // Also update search term
        setSearchTerm(filterState.filterSearchTerm);
        setCurrentPage(1);
        setIsFilterOpen(false);
        // Loading state will be handled by useEffect when fetching
    };

    // Handle cancel appointment click
    const handleCancelClick = (appointment: AppointmentCardData) => {
        // Validate status - only allow cancellation for PENDING or CONFIRMED
        if (
            appointment.status !== AppointmentStatus.PENDING &&
            appointment.status !== AppointmentStatus.CONFIRMED
        ) {
            toast.warning('Chỉ có thể hủy lịch hẹn ở trạng thái Chờ xử lý hoặc Sắp tới');
            return;
        }

        setSelectedAppointmentToCancel(appointment);
        setShowCancelModal(true);
    };

    // Handle reschedule click (lazy token generation)
    const handleRescheduleClick = async (
        appointment: AppointmentCardData,
        action: 'SAME_DOCTOR' | 'NEW_DOCTOR'
    ) => {
        if (!userProfile?.id) return;
        await handleRescheduleAction(appointment, action, userProfile.id);
    };

    // Handle cancel appointment confirm
    const handleCancelConfirm = async (cancellationReason: string) => {
        if (!selectedAppointmentToCancel || !userProfile?.id) return;

        setIsCancelling(true);
        try {
            // Call API to cancel appointment
            await AppointmentService.cancelAppointment(
                selectedAppointmentToCancel.appointmentId,
                cancellationReason,
                userProfile.id
            );

            // Calculate refund percentage for success message (patient cancellation)
            const refundInfo = getRefundInfo(
                selectedAppointmentToCancel.appointmentDate,
                undefined,
                false
            );

            // Show success message with refund info
            if (refundInfo.refundPercentage === 100) {
                toast.success('Hủy lịch hẹn thành công. Bạn sẽ được hoàn lại 100% chi phí.');
            } else if (refundInfo.refundPercentage === 50) {
                toast.success('Hủy lịch hẹn thành công. Bạn sẽ được hoàn lại 50% chi phí.');
            } else {
                toast.success(
                    'Hủy lịch hẹn thành công. Do hủy muộn, bạn sẽ không được hoàn lại chi phí.'
                );
            }

            // Close modal and reset state
            setShowCancelModal(false);
            setSelectedAppointmentToCancel(null);

            // Fetch lại data để cập nhật UI với thông tin mới nhất
            // Reset về trang đầu nếu đang ở trang khác
            if (currentPage > 1) {
                setCurrentPage(1);
            }

            // Trigger useEffect để fetch lại data
            setRefreshTrigger((prev) => prev + 1);
        } catch (error: any) {
            console.error('Error cancelling appointment:', error);
            toast.error(error.message || 'Không thể hủy lịch hẹn. Vui lòng thử lại.');
        } finally {
            setIsCancelling(false);
        }
    };

    // Helper function to close review modal
    const closeReviewModal = () => {
        const modalElement = document.getElementById('add_review');
        if (modalElement) {
            try {
                // Try to get existing instance first
                let modal = (window as any).bootstrap?.Modal?.getInstance(modalElement);

                // If no instance exists, create one
                if (!modal) {
                    modal = new (window as any).bootstrap.Modal(modalElement);
                }

                // Hide the modal
                modal.hide();
            } catch (modalError) {
                console.error('Error closing modal:', modalError);
                // Fallback: remove Bootstrap classes manually
                modalElement.classList.remove('show');
                document.body.classList.remove('modal-open');
                const backdrop = document.querySelector('.modal-backdrop');
                if (backdrop) {
                    backdrop.remove();
                }
            }
        }
    };

    // Initialize review handlers hook
    // Note: We use a dummy refetch since Appointments page doesn't display reviews list
    const { handleSubmitReview: submitReviewFromHook } = useReviewHandlers({
        targetType: TargetType.DOCTOR,
        targetId: selectedAppointmentForReview?.doctorInfo?.id,
        currentUserId: userProfile?.id,
        currentAccountId: userProfile?.accountId,
        targetName: selectedAppointmentForReview?.doctorInfo?.fullName || 'Bác sĩ',
        hospitalId: selectedAppointmentForReview?.hospitalInfo?.id,
        refetchReviews: async () => {
            // No-op: Appointments page doesn't display reviews
            // Reviews are shown in doctor profile pages
        },
        refetchStatistics: async () => {
            // No-op: Appointments page doesn't display review statistics
        },
    });

    // Handle open review modal
    const handleOpenReviewModal = (appointment: AppointmentCardData) => {
        setSelectedAppointmentForReview(appointment);
        setReviewRating(5); // Default rating
        setReviewComment(''); // Reset comment
    };

    // Handle review form submission
    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation(); // Prevent event bubbling

        // Prevent double submission
        if (isSubmittingReview) {
            return;
        }

        // Validation
        if (!selectedAppointmentForReview || !userProfile?.id) {
            toast.error('Không tìm thấy thông tin lịch hẹn hoặc người dùng.');
            return;
        }

        if (!reviewRating || reviewRating < 1 || reviewRating > 5) {
            toast.error('Vui lòng chọn đánh giá từ 1 đến 5 sao.');
            return;
        }

        if (!reviewComment.trim() || reviewComment.trim().length < 5) {
            toast.error('Vui lòng nhập nhận xét (tối thiểu 5 ký tự).');
            return;
        }

        if (!selectedAppointmentForReview.doctorInfo?.id) {
            toast.error('Không tìm thấy thông tin bác sĩ để đánh giá.');
            return;
        }

        setIsSubmittingReview(true);

        try {
            // Use hook's handleSubmitReview which handles API call and error handling
            // Toast success is already shown by the hook, but we'll close modal and refresh appointments
            await submitReviewFromHook({
                rating: reviewRating,
                description: reviewComment.trim(),
                termsAccepted: true, // Modal doesn't have terms checkbox, default to true
            });

            // On success: close modal, reset form, and refresh appointments
            try {
                // Reset form state
                setSelectedAppointmentForReview(null);
                setReviewRating(5);
                setReviewComment('');

                // Close modal
                closeReviewModal();

                // Refresh appointments to update hasReview status
                setRefreshTrigger((prev) => prev + 1);
            } catch (successHandlingError) {
                console.error('Error during success handling:', successHandlingError);
                // Modal closing and state reset errors won't affect the review creation
            }
        } catch (error: any) {
            // Error handling is done by the hook, but we still need to handle modal state
            console.error('Error in handleSubmitReview wrapper:', error);
            // Hook already shows error toast, no need to show again
        } finally {
            setIsSubmittingReview(false);
        }
    };

    // Extract complex logic to separate function to reduce cognitive complexity
    const convertFilterStateToSelectedFilters = () => {
        const appointmentTypes: AppointmentType[] = [];
        const visitTypes: string[] = [];

        // Convert appointment type filters - use positive conditions
        const appointmentTypeFilters = filterState.appointmentTypeFilters;
        if (appointmentTypeFilters.allType === false) {
            const appointmentTypeMap = {
                telehealth: AppointmentType.TELEHEALTH,
                directVisit: AppointmentType.IN_PERSON,
            };

            for (const [key, value] of Object.entries(appointmentTypeMap)) {
                if (appointmentTypeFilters[key as keyof typeof appointmentTypeFilters]) {
                    appointmentTypes.push(value);
                }
            }
        }

        // Convert visit type filters - use positive conditions
        const visitTypeFilters = filterState.visitTypeFilters;
        if (visitTypeFilters.allVisit === false) {
            const visitTypeMap = {
                general: 'General Visit',
                consultation: 'Consultation',
                followUp: 'Follow-up',
                directVisit: 'Direct Visit',
            };

            for (const [key, value] of Object.entries(visitTypeMap)) {
                if (visitTypeFilters[key as keyof typeof visitTypeFilters]) {
                    visitTypes.push(value);
                }
            }
        }

        return { appointmentTypes, visitTypes };
    };

    // Extract nested ternary to separate function
    const renderAppointmentContent = () => {
        // Show error state if API call failed
        if (apiError) {
            return (
                <div className="text-center py-5">
                    <div className="mb-4" style={{ fontSize: '4rem', color: 'var(--bs-danger)' }}>
                        <i className="isax isax-close-circle"></i>
                    </div>
                    <h4 className="text-danger">Đã xảy ra lỗi</h4>
                    <p className="text-muted mb-4">{apiError}</p>
                    <button
                        type="button"
                        className="btn btn-primary-gradient rounded-pill"
                        onClick={() => globalThis.location.reload()}
                    >
                        Thử lại
                    </button>
                </div>
            );
        }

        if (isLoading) {
            return (
                <>
                    {/* Skeleton Loading */}
                    {Array.from({ length: itemsPerPage }, (_, index) => (
                        <AppointmentCardSkeleton key={`skeleton-loading-${index}`} />
                    ))}
                </>
            );
        }

        if (currentAppointments.length > 0) {
            return (
                <>
                    {/* Appointment List or Grid */}
                    {viewMode === 'list' ? (
                        <>
                            {currentAppointments.map((appointment) => (
                                <AppointmentCard
                                    key={appointment.appointmentId}
                                    appointment={appointment}
                                    status={activeTab}
                                    onCancel={handleCancelClick}
                                    onReschedule={handleRescheduleClick}
                                    onReview={handleOpenReviewModal}
                                />
                            ))}
                        </>
                    ) : (
                        <div className="row">
                            {currentAppointments.map((appointment) => (
                                <AppointmentGridCard
                                    key={appointment.appointmentId}
                                    appointment={appointment}
                                    status={activeTab}
                                    onCancel={handleCancelClick}
                                    onReschedule={handleRescheduleClick}
                                    onReview={handleOpenReviewModal}
                                />
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                            showPrevNext={true}
                            maxVisiblePages={5}
                        />
                    )}
                </>
            );
        }

        return renderEmptyState();
    };

    // Extract empty state to separate function
    const renderEmptyState = () => {
        const hasActiveFilters =
            searchTerm ||
            selectedFilters.appointmentType.length > 0 ||
            selectedFilters.visitType.length > 0;

        return (
            <div className="text-center py-5">
                <div className="mb-1" style={{ fontSize: '4rem', color: 'var(--bs-gray-400)' }}>
                    <i className="isax isax-calendar-search"></i>
                </div>
                <h4 className="text-muted">Không có lịch hẹn nào</h4>
                <p className="text-muted mb-3">
                    {hasActiveFilters
                        ? 'Không tìm thấy lịch hẹn nào phù hợp với bộ lọc của bạn.'
                        : 'Bạn chưa có lịch hẹn nào trong danh mục này.'}
                </p>
                {hasActiveFilters && (
                    <button
                        type="button"
                        className="btn btn-primary-gradient rounded-pill"
                        onClick={resetFilters}
                    >
                        Xóa Bộ Lọc
                    </button>
                )}
            </div>
        );
    };

    return (
        <>
            {/* Dashboard Header */}
            <div className="dashboard-header">
                <h3>Lịch Hẹn</h3>
                <ul className="header-list-btns">
                    <li>
                        <div className="input-block dash-search-input">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Tìm kiếm"
                                value={searchTerm}
                                onChange={(e) => handleSearchChange(e.target.value)}
                            />
                            <span className="search-icon">
                                <i className="isax isax-search-normal"></i>
                            </span>
                        </div>
                    </li>
                    <li>
                        <div className="view-icons">
                            <a
                                href="#"
                                className={viewMode === 'list' ? 'active' : ''}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setViewMode('list');
                                }}
                            >
                                <i className="isax isax-grid-7"></i>
                            </a>
                        </div>
                    </li>
                    <li>
                        <div className="view-icons">
                            <a
                                href="#"
                                className={viewMode === 'grid' ? 'active' : ''}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setViewMode('grid');
                                }}
                            >
                                <i className="fa-solid fa-th"></i>
                            </a>
                        </div>
                    </li>
                </ul>
            </div>

            {/* Appointment Tabs and Filter */}
            <div className="appointment-tab-head">
                <div className="appointment-tabs">
                    <ul className="nav nav-pills inner-tab" id="pills-tab">
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === 'waiting' ? 'active' : ''}`}
                                type="button"
                                onClick={() => handleTabChange('waiting')}
                            >
                                Chờ Xác Nhận <span>{appointmentCounts.waiting}</span>
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === 'upcoming' ? 'active' : ''}`}
                                type="button"
                                onClick={() => handleTabChange('upcoming')}
                            >
                                Sắp Tới <span>{appointmentCounts.upcoming}</span>
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === 'cancelled' ? 'active' : ''}`}
                                type="button"
                                onClick={() => handleTabChange('cancelled')}
                            >
                                Đã Hủy <span>{appointmentCounts.cancelled}</span>
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === 'completed' ? 'active' : ''}`}
                                type="button"
                                onClick={() => handleTabChange('completed')}
                            >
                                Hoàn Thành <span>{appointmentCounts.completed}</span>
                            </button>
                        </li>
                    </ul>
                </div>

                {/* Filter Component */}
                <div className={clsx(styles.filterHead, 'filter-head')}>
                    <div className={styles.dateRangePickerWrapper}>
                        <DateRangePicker
                            ranges={dateRanges}
                            onChange={handleDateRangeChange}
                            placeholder="Chọn khoảng thời gian"
                            className={styles.appointmentDatePicker}
                            months={calendarMonths}
                            direction="horizontal"
                        />
                    </div>

                    <AppointmentFilters
                        isOpen={isFilterOpen}
                        onToggle={() => setIsFilterOpen(!isFilterOpen)}
                        filterState={filterState}
                        onFilterSearchChange={handleFilterSearchChange}
                        onAppointmentTypeChange={handleAppointmentTypeChange}
                        onVisitTypeChange={handleVisitTypeChange}
                        onReset={handleFilterReset}
                        onApply={handleFilterApply}
                    />
                </div>
            </div>

            {/* Appointment Content */}
            <div
                className={`tab-content appointment-tab-content ${viewMode === 'grid' ? 'appoint-patient' : ''}`}
            >
                <div className="tab-pane fade show active">{renderAppointmentContent()}</div>
            </div>

            {/* Add Review Modal */}
            <div className="modal fade custom-modals" id="add_review">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3 className="modal-title">
                                Đánh giá{' '}
                                {selectedAppointmentForReview?.doctorInfo?.fullName || 'Bác sĩ'}
                            </h3>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            >
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                        <form onSubmit={handleSubmitReview}>
                            <div className="add-dependent">
                                <div className="modal-body pb-0">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="mb-3">
                                                <label
                                                    className="form-label"
                                                    htmlFor="rating-group"
                                                >
                                                    Đánh giá <span className="text-danger">*</span>
                                                </label>
                                                <div className="selection-wrap">
                                                    <div className="d-inline-block">
                                                        <div className="rating-selction">
                                                            <input
                                                                type="radio"
                                                                name="rating"
                                                                value="5"
                                                                id="rating5"
                                                                checked={reviewRating === 5}
                                                                onChange={() => setReviewRating(5)}
                                                            />
                                                            <label htmlFor="rating5">
                                                                <i
                                                                    className="fa-solid fa-star"
                                                                    aria-hidden="true"
                                                                ></i>
                                                                <span className="visually-hidden">
                                                                    5 sao
                                                                </span>
                                                            </label>
                                                            <input
                                                                type="radio"
                                                                name="rating"
                                                                value="4"
                                                                id="rating4"
                                                                checked={reviewRating === 4}
                                                                onChange={() => setReviewRating(4)}
                                                            />
                                                            <label htmlFor="rating4">
                                                                <i
                                                                    className="fa-solid fa-star"
                                                                    aria-hidden="true"
                                                                ></i>
                                                                <span className="visually-hidden">
                                                                    4 sao
                                                                </span>
                                                            </label>
                                                            <input
                                                                type="radio"
                                                                name="rating"
                                                                value="3"
                                                                id="rating3"
                                                                checked={reviewRating === 3}
                                                                onChange={() => setReviewRating(3)}
                                                            />
                                                            <label htmlFor="rating3">
                                                                <i
                                                                    className="fa-solid fa-star"
                                                                    aria-hidden="true"
                                                                ></i>
                                                                <span className="visually-hidden">
                                                                    3 sao
                                                                </span>
                                                            </label>
                                                            <input
                                                                type="radio"
                                                                name="rating"
                                                                value="2"
                                                                id="rating2"
                                                                checked={reviewRating === 2}
                                                                onChange={() => setReviewRating(2)}
                                                            />
                                                            <label htmlFor="rating2">
                                                                <i
                                                                    className="fa-solid fa-star"
                                                                    aria-hidden="true"
                                                                ></i>
                                                                <span className="visually-hidden">
                                                                    2 sao
                                                                </span>
                                                            </label>
                                                            <input
                                                                type="radio"
                                                                name="rating"
                                                                value="1"
                                                                id="rating1"
                                                                checked={reviewRating === 1}
                                                                onChange={() => setReviewRating(1)}
                                                            />
                                                            <label htmlFor="rating1">
                                                                <i
                                                                    className="fa-solid fa-star"
                                                                    aria-hidden="true"
                                                                ></i>
                                                                <span className="visually-hidden">
                                                                    1 sao
                                                                </span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mb-3">
                                                <label
                                                    className="form-label"
                                                    htmlFor="comment-textarea"
                                                >
                                                    Nhận xét <span className="text-danger">*</span>
                                                </label>
                                                <textarea
                                                    id="comment-textarea"
                                                    className="form-control"
                                                    rows={3}
                                                    value={reviewComment}
                                                    onChange={(e) =>
                                                        setReviewComment(e.target.value)
                                                    }
                                                    placeholder="Chia sẻ trải nghiệm của bạn (tối thiểu 5 ký tự)..."
                                                    minLength={5}
                                                    required
                                                ></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <div className="modal-btn text-end">
                                    <Link
                                        to="#"
                                        className="btn btn-md btn-dark rounded-pill"
                                        data-bs-dismiss="modal"
                                        onClick={() => {
                                            setReviewRating(5);
                                            setReviewComment('');
                                        }}
                                    >
                                        Hủy
                                    </Link>
                                    <button
                                        type="submit"
                                        className="btn btn-md btn-primary-gradient rounded-pill"
                                        disabled={isSubmittingReview}
                                    >
                                        {isSubmittingReview ? 'Đang gửi...' : 'Thêm đánh giá'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* View Review Modal */}
            <div className="modal fade custom-modals" id="view_review">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3 className="modal-title">Chi tiết đánh giá</h3>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            >
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                        <form action="#">
                            <div className="modal-body pb-0">
                                <div className="mb-3">
                                    <div className="d-flex justify-content-between flex-wrap gap-3">
                                        <div>
                                            <label
                                                className="form-label text-gray-6"
                                                htmlFor="review-for"
                                            >
                                                Đánh giá cho
                                            </label>
                                            <div
                                                className="d-flex align-items-center"
                                                id="review-for"
                                            >
                                                <span className="user-avatar me-2">
                                                    <img
                                                        src="/src/assets/img/doctors/doctor-thumb-01.jpg"
                                                        alt="Dr Edalin"
                                                    />
                                                </span>
                                                <h6 className="fs-16 fw-medium">Dr Edalin</h6>
                                            </div>
                                        </div>
                                        <div>
                                            <label
                                                className="form-label text-gray-6"
                                                htmlFor="review-by"
                                            >
                                                Đánh giá bởi
                                            </label>
                                            <div
                                                className="d-flex align-items-center"
                                                id="review-by"
                                            >
                                                <span className="user-avatar me-2">
                                                    <img
                                                        src="/src/assets/img/doctors-dashboard/profile-06.jpg"
                                                        alt="Hendrita"
                                                    />
                                                </span>
                                                <h6 className="fs-16 fw-medium">Hendrita</h6>
                                            </div>
                                        </div>
                                        <div>
                                            <label
                                                className="form-label text-gray-6"
                                                htmlFor="review-rating"
                                            >
                                                Đánh giá
                                            </label>
                                            <div
                                                className="d-flex align-items-center rating-list"
                                                id="review-rating"
                                                aria-label="4 out of 5 stars"
                                            >
                                                <i className="fa-solid fa-star selected"></i>
                                                <i className="fa-solid fa-star selected"></i>
                                                <i className="fa-solid fa-star selected"></i>
                                                <i className="fa-solid fa-star selected"></i>
                                                <i className="fa-solid fa-star"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-0">
                                    <div className="review-wrap">
                                        <label
                                            className="form-label text-gray-6"
                                            htmlFor="review-comment"
                                        >
                                            Nhận xét
                                        </label>
                                        <p className="mb-0" id="review-comment">
                                            Bác sĩ Edalin đã chăm sóc rất tốt và dành thời gian lắng
                                            nghe những lo lắng của tôi. Tôi cảm thấy khỏe hơn bao
                                            giờ hết và rất khuyến khích mọi người đến gặp bác sĩ!
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Cancel Appointment Modal */}
            <ModalCancel
                show={showCancelModal}
                onHide={() => {
                    if (!isCancelling) {
                        setShowCancelModal(false);
                        setSelectedAppointmentToCancel(null);
                    }
                }}
                onConfirm={handleCancelConfirm}
                title="Xác Nhận Hủy Lịch Hẹn"
                message="Bạn có chắc chắn muốn hủy lịch hẹn"
                confirmText="Xác nhận hủy"
                cancelText="Đóng"
                loading={isCancelling}
                reasonLabel="Lý do hủy"
                reasonPlaceholder="Vui lòng nhập lý do hủy lịch hẹn (tối thiểu 10 ký tự)..."
                minReasonLength={10}
                refundInfo={
                    selectedAppointmentToCancel
                        ? getRefundInfo(
                              selectedAppointmentToCancel.appointmentDate,
                              undefined,
                              false
                          ) // Patient cancellation
                        : undefined
                }
            />
        </>
    );
};

export default Appointments;
