import React, { useState, useMemo, useEffect } from 'react';
import { RangeKeyDict } from 'react-date-range';
import clsx from 'clsx';
import AppointmentCard from './components/AppointmentCard/AppointmentCard';
import AppointmentCardSkeleton from './components/AppointmentCard/AppointmentCardSkeleton';
import AppointmentFilters from './components/AppointmentFilters/AppointmentFilters';
import Pagination from '@/components/Pagination/Pagination';
import DateRangePicker from '@/components/DateRangePicker';
import { mockAppointmentsData } from './data/mockData';
import { AppointmentStatus, AppointmentType } from './types/appointment.types';
import { FilterState } from './components/AppointmentFilters/AppointmentTypes';
import styles from './Appointments.module.scss';
import { Link } from 'react-router-dom';

const Appointments: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<AppointmentStatus>('upcoming');
    const [selectedFilters, setSelectedFilters] = useState({
        appointmentType: [] as AppointmentType[],
        visitType: [] as string[],
        dateRange: { from: '', to: '' },
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const itemsPerPage = 5;

    // Filter states for AppointmentFilters component
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filterState, setFilterState] = useState<FilterState>({
        filterSearchTerm: '',
        appointmentTypeFilters: {
            allType: true,
            videoCall: false,
            audioCall: false,
            chat: false,
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
        }
    };

    // Filter appointments based on active tab and filters
    const filteredAppointments = useMemo(() => {
        let filtered = mockAppointmentsData.filter(
            (appointment) => appointment.status === activeTab
        );

        // Apply search filter (from header search or filter search)
        const effectiveSearchTerm = searchTerm || filterState.filterSearchTerm || '';
        if (effectiveSearchTerm) {
            filtered = filtered.filter(
                (appointment) =>
                    appointment.doctor.name
                        .toLowerCase()
                        .includes(effectiveSearchTerm.toLowerCase()) ||
                    appointment.appointmentId
                        .toLowerCase()
                        .includes(effectiveSearchTerm.toLowerCase())
            );
        }

        // Apply appointment type filter
        if (selectedFilters.appointmentType.length > 0) {
            filtered = filtered.filter((appointment) =>
                selectedFilters.appointmentType.includes(appointment.appointmentType)
            );
        }

        // Apply visit type filter
        if (selectedFilters.visitType.length > 0) {
            filtered = filtered.filter((appointment) =>
                selectedFilters.visitType.includes(appointment.visitType)
            );
        }

        // Apply date range filter
        if (selectedFilters.dateRange.from && selectedFilters.dateRange.to) {
            const fromDate = new Date(selectedFilters.dateRange.from);
            const toDate = new Date(selectedFilters.dateRange.to);
            filtered = filtered.filter((appointment) => {
                const appointmentDate = new Date(appointment.appointmentDate);
                return appointmentDate >= fromDate && appointmentDate <= toDate;
            });
        }

        return filtered;
    }, [activeTab, searchTerm, selectedFilters, filterState.filterSearchTerm]);

    // Pagination
    const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentAppointments = filteredAppointments.slice(startIndex, startIndex + itemsPerPage);

    // Get appointment counts for tabs
    const appointmentCounts = useMemo(() => {
        const counts = { upcoming: 0, cancelled: 0, completed: 0 };
        for (const appointment of mockAppointmentsData) {
            counts[appointment.status]++;
        }
        return counts;
    }, []);

    const handleTabChange = (tab: AppointmentStatus) => {
        setIsLoading(true);
        setActiveTab(tab);
        setCurrentPage(1); // Reset to first page when changing tabs

        // Simulate loading delay
        setTimeout(() => {
            setIsLoading(false);
        }, 800);
    };

    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
        setCurrentPage(1); // Reset to first page when searching
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
                videoCall: false,
                audioCall: false,
                chat: false,
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
    };

    const handleAppointmentTypeChange = (type: string, checked: boolean) => {
        if (type === 'allType') {
            setFilterState({
                ...filterState,
                appointmentTypeFilters: {
                    allType: checked,
                    videoCall: !checked ? false : filterState.appointmentTypeFilters.videoCall,
                    audioCall: !checked ? false : filterState.appointmentTypeFilters.audioCall,
                    chat: !checked ? false : filterState.appointmentTypeFilters.chat,
                    directVisit: !checked ? false : filterState.appointmentTypeFilters.directVisit,
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
                    general: !checked ? false : filterState.visitTypeFilters.general,
                    consultation: !checked ? false : filterState.visitTypeFilters.consultation,
                    followUp: !checked ? false : filterState.visitTypeFilters.followUp,
                    directVisit: !checked ? false : filterState.visitTypeFilters.directVisit,
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
        setIsLoading(true);

        const { appointmentTypes, visitTypes } = convertFilterStateToSelectedFilters();

        // Simulate loading delay
        setTimeout(() => {
            setSelectedFilters({
                ...selectedFilters,
                appointmentType: appointmentTypes,
                visitType: visitTypes,
            });

            // Also update search term
            setSearchTerm(filterState.filterSearchTerm);
            setCurrentPage(1);
            setIsFilterOpen(false);
            setIsLoading(false);
        }, 600);
    };

    // Extract complex logic to separate function to reduce cognitive complexity
    const convertFilterStateToSelectedFilters = () => {
        const appointmentTypes: AppointmentType[] = [];
        const visitTypes: string[] = [];

        // Convert appointment type filters - use positive conditions
        const appointmentTypeFilters = filterState.appointmentTypeFilters;
        if (appointmentTypeFilters.allType === false) {
            const appointmentTypeMap = {
                videoCall: 'video_call' as AppointmentType,
                audioCall: 'audio_call' as AppointmentType,
                chat: 'chat' as AppointmentType,
                directVisit: 'direct_visit' as AppointmentType,
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
        if (isLoading) {
            return (
                <>
                    {/* Skeleton Loading */}
                    {Array.from({ length: itemsPerPage }).map((_, index) => (
                        <AppointmentCardSkeleton key={`skeleton-${index}`} />
                    ))}
                </>
            );
        }

        if (currentAppointments.length > 0) {
            return (
                <>
                    {/* Appointment List */}
                    {currentAppointments.map((appointment) => (
                        <AppointmentCard
                            key={appointment.appointmentId}
                            appointment={appointment}
                            status={activeTab}
                        />
                    ))}

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
                <div className="mb-4" style={{ fontSize: '4rem', color: 'var(--bs-gray-400)' }}>
                    <i className="isax isax-calendar-search"></i>
                </div>
                <h4 className="text-muted">Không có lịch hẹn nào</h4>
                <p className="text-muted mb-4">
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
                </ul>
            </div>

            {/* Appointment Tabs and Filter */}
            <div className="appointment-tab-head">
                <div className="appointment-tabs">
                    <ul className="nav nav-pills inner-tab" id="pills-tab" role="tablist">
                        <li className="nav-item" role="presentation">
                            <button
                                className={`nav-link ${activeTab === 'upcoming' ? 'active' : ''}`}
                                type="button"
                                onClick={() => handleTabChange('upcoming')}
                            >
                                Sắp Tới
                                <span>{appointmentCounts.upcoming}</span>
                            </button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button
                                className={`nav-link ${activeTab === 'cancelled' ? 'active' : ''}`}
                                type="button"
                                onClick={() => handleTabChange('cancelled')}
                            >
                                Đã Hủy
                                <span>{appointmentCounts.cancelled}</span>
                            </button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button
                                className={`nav-link ${activeTab === 'completed' ? 'active' : ''}`}
                                type="button"
                                onClick={() => handleTabChange('completed')}
                            >
                                Hoàn Thành
                                <span>{appointmentCounts.completed}</span>
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
            <div className="tab-content appointment-tab-content">
                <div className="tab-pane fade show active">{renderAppointmentContent()}</div>
            </div>

            {/* Add Review Modal */}
            <div className="modal fade custom-modals" id="add_review">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3 className="modal-title">Thêm đánh giá</h3>
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
                                                            />
                                                            <label htmlFor="rating5">
                                                                <i className="fa-solid fa-star"></i>
                                                            </label>
                                                            <input
                                                                type="radio"
                                                                name="rating"
                                                                value="4"
                                                                id="rating4"
                                                            />
                                                            <label htmlFor="rating4">
                                                                <i className="fa-solid fa-star"></i>
                                                            </label>
                                                            <input
                                                                type="radio"
                                                                name="rating"
                                                                value="3"
                                                                id="rating3"
                                                            />
                                                            <label htmlFor="rating3">
                                                                <i className="fa-solid fa-star"></i>
                                                            </label>
                                                            <input
                                                                type="radio"
                                                                name="rating"
                                                                value="2"
                                                                id="rating2"
                                                                defaultChecked
                                                            />
                                                            <label htmlFor="rating2">
                                                                <i className="fa-solid fa-star"></i>
                                                            </label>
                                                            <input
                                                                type="radio"
                                                                name="rating"
                                                                value="1"
                                                                id="rating1"
                                                                defaultChecked
                                                            />
                                                            <label htmlFor="rating1">
                                                                <i className="fa-solid fa-star"></i>
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
                                        data-bs-toggle="modal"
                                        data-bs-dismiss="modal"
                                    >
                                        Hủy
                                    </Link>
                                    <button
                                        type="submit"
                                        className="btn btn-md btn-primary-gradient rounded-pill"
                                    >
                                        Thêm đánh giá
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
                                                        alt="Doctor"
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
                                                        alt="Patient"
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
                                                role="img"
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
        </>
    );
};

export default Appointments;
