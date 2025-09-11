import React, { useState, useEffect } from 'react';
import clsx from 'clsx';

import Pagination from '@/components/Pagination';
import AppointmentHeader from './components/AppointmentHeader';
import AppointmentTabs from './components/AppointmentTabs';
import DateRangePicker from './components/DateRangePicker';
import AppointmentFilters from './components/AppointmentFilters';
import AppointmentCard from './components/AppointmentCard';
import AddReviewModal from './components/AddReviewModal';
import { Appointment, AppointmentStatus, FilterState } from './components/AppointmentTypes';
import styles from './PatientAppointments.module.scss';

// Mock data
const mockAppointments: Appointment[] = [
    {
        id: '1',
        appointmentNumber: '#Apt0001',
        doctorName: 'Bác sĩ Edalin',
        doctorImage: '/src/assets/img/doctors/doctor-thumb-21.jpg',
        dateTime: '11/11/2024 10:45',
        visitType: 'Khám tổng quát',
        callType: 'Cuộc gọi video',
        email: 'doctor@example.com',
        phone: '+84 504 368 6874',
        status: 'upcoming',
    },
    {
        id: '2',
        appointmentNumber: '#Apt0002',
        doctorName: 'Bác sĩ Smith',
        doctorImage: '/src/assets/img/doctors/doctor-thumb-13.jpg',
        dateTime: '05/11/2024 11:50',
        visitType: 'Khám tổng quát',
        callType: 'Cuộc gọi âm thanh',
        email: 'smith@example.com',
        phone: '+84 832 891 8403',
        status: 'upcoming',
    },
    {
        id: '3',
        appointmentNumber: '#Apt00011',
        doctorName: 'Bác sĩ Edalin',
        doctorImage: '/src/assets/img/doctors/doctor-thumb-21.jpg',
        dateTime: '11/11/2024 10:45',
        visitType: 'Khám tổng quát',
        callType: 'Cuộc gọi video',
        email: 'doctor@example.com',
        phone: '+84 504 368 6874',
        status: 'cancelled',
    },
    {
        id: '4',
        appointmentNumber: '#Apt0004',
        doctorName: 'Bác sĩ Johnson',
        doctorImage: '/src/assets/img/doctors/doctor-thumb-13.jpg',
        dateTime: '05/11/2024 11:50',
        visitType: 'Khám tổng quát',
        callType: 'Cuộc gọi âm thanh',
        email: 'johnson@example.com',
        phone: '+84 832 891 8403',
        status: 'cancelled',
    },
    {
        id: '5',
        appointmentNumber: '#Apt0005',
        doctorName: 'Bác sĩ Brown',
        doctorImage: '/src/assets/img/doctors/doctor-thumb-21.jpg',
        dateTime: '11/11/2024 10:45',
        visitType: 'Khám tổng quát',
        callType: 'Cuộc gọi video',
        email: 'brown@example.com',
        phone: '+84 504 368 6874',
        status: 'completed',
    },
    {
        id: '6',
        appointmentNumber: '#Apt0006',
        doctorName: 'Bác sĩ Wilson',
        doctorImage: '/src/assets/img/doctors/doctor-thumb-13.jpg',
        dateTime: '05/11/2024 11:50',
        visitType: 'Khám tổng quát',
        callType: 'Cuộc gọi âm thanh',
        email: 'wilson@example.com',
        phone: '+84 832 891 8403',
        status: 'completed',
    },
];

const PatientAppointments: React.FC = () => {
    const [activeTab, setActiveTab] = useState<AppointmentStatus>('upcoming');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [selectedAppointmentForReview, setSelectedAppointmentForReview] =
        useState<Appointment | null>(null);
    const [dateRange, setDateRange] = useState('');

    // Filter states
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

    // Handle single date input for range selection
    const handleDateSelection = (selectedDate: string) => {
        if (!fromDate || (fromDate && toDate)) {
            // First selection or reset selection
            setFromDate(selectedDate);
            setToDate('');
        } else if (fromDate && !toDate) {
            // Second selection - complete the range
            if (selectedDate >= fromDate) {
                setToDate(selectedDate);
            } else {
                // If selected date is before fromDate, swap them
                setToDate(fromDate);
                setFromDate(selectedDate);
            }
        }
    };

    // Update dateRange when fromDate or toDate changes
    useEffect(() => {
        if (fromDate && toDate) {
            setDateRange(`${fromDate} đến ${toDate}`);
        } else if (fromDate) {
            setDateRange(`Từ ${fromDate}`);
        } else if (toDate) {
            setDateRange(`Khi ${toDate}`);
        } else {
            setDateRange('');
        }
    }, [fromDate, toDate]);

    // Filter appointments based on active tab
    const filteredAppointments = mockAppointments.filter(
        (appointment) => appointment.status === activeTab
    );

    // Pagination settings
    const itemsPerPage = 10;
    const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentAppointments = filteredAppointments.slice(startIndex, startIndex + itemsPerPage);

    // Tab counts
    const getTabCounts = () => {
        const counts: Record<AppointmentStatus, number> = {
            upcoming: 0,
            cancelled: 0,
            completed: 0,
        };

        mockAppointments.forEach((apt) => {
            counts[apt.status]++;
        });

        return counts;
    };

    const handleTabChange = (tab: AppointmentStatus) => {
        setActiveTab(tab);
        setCurrentPage(1); // Reset pagination when changing tabs
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // Filter handlers
    const handleAppointmentTypeChange = (type: string, checked: boolean) => {
        if (type === 'allType') {
            setFilterState((prev) => ({
                ...prev,
                appointmentTypeFilters: {
                    allType: checked,
                    videoCall: false,
                    audioCall: false,
                    chat: false,
                    directVisit: false,
                },
            }));
        } else {
            setFilterState((prev) => ({
                ...prev,
                appointmentTypeFilters: {
                    ...prev.appointmentTypeFilters,
                    allType: false,
                    [type]: checked,
                },
            }));
        }
    };

    const handleVisitTypeChange = (type: string, checked: boolean) => {
        if (type === 'allVisit') {
            setFilterState((prev) => ({
                ...prev,
                visitTypeFilters: {
                    allVisit: checked,
                    general: false,
                    consultation: false,
                    followUp: false,
                    directVisit: false,
                },
            }));
        } else {
            setFilterState((prev) => ({
                ...prev,
                visitTypeFilters: {
                    ...prev.visitTypeFilters,
                    allVisit: false,
                    [type]: checked,
                },
            }));
        }
    };

    const handleFilterReset = () => {
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
    };

    const handleFilterSearchChange = (value: string) => {
        setFilterState((prev) => ({
            ...prev,
            filterSearchTerm: value,
        }));
    };

    // Date range handlers
    const handleDateRangeClear = () => {
        setFromDate('');
        setToDate('');
    };

    const handleDateRangeApply = () => {
        setIsCalendarOpen(false);
    };

    // Appointment action handlers
    const handleViewDoctorProfile = (appointment: Appointment) => {
        console.log('View doctor profile:', appointment);
        // TODO: Implement navigation to doctor profile
    };

    const handleView = (appointment: Appointment) => {
        console.log('View appointment:', appointment);
        // TODO: Implement view appointment details
    };

    const handleMessage = (appointment: Appointment) => {
        console.log('Message doctor:', appointment);
        // TODO: Implement messaging functionality
    };

    const handleCancel = (appointment: Appointment) => {
        console.log('Cancel appointment:', appointment);
        // TODO: Implement cancel appointment
    };

    const handleAttend = (appointment: Appointment) => {
        console.log('Attend appointment:', appointment);
        // TODO: Implement attend appointment
    };

    const handleReschedule = (appointment: Appointment) => {
        console.log('Reschedule appointment:', appointment);
        // TODO: Implement reschedule appointment
    };

    const handleBookAgain = (appointment: Appointment) => {
        console.log('Book again:', appointment);
        // TODO: Implement book again
    };

    const handleViewDetails = (appointment: Appointment) => {
        console.log('View details:', appointment);
        // TODO: Implement view appointment details
    };

    const handleAddReview = (appointment: Appointment) => {
        setSelectedAppointmentForReview(appointment);
        setIsReviewModalOpen(true);
    };

    const handleCloseReviewModal = () => {
        setIsReviewModalOpen(false);
        setSelectedAppointmentForReview(null);
    };

    const handleSubmitReview = (rating: number, comment: string) => {
        console.log('Add review:', { appointment: selectedAppointmentForReview, rating, comment });
        // TODO: Implement API call to submit review
        // Example API call:
        // reviewService.submitReview({
        //     appointmentId: selectedAppointmentForReview?.id,
        //     doctorId: selectedAppointmentForReview?.doctorId,
        //     rating,
        //     comment
        // });

        // Show success message
        alert(`Review submitted successfully!\nRating: ${rating} stars\nComment: ${comment}`);
    };
    const handleListView = () => {
        console.log('Switch to list view');
        // TODO: Implement list view
    };

    const handleGridView = () => {
        console.log('Switch to grid view');
        // TODO: Implement grid view
    };

    const handleFilterApply = () => {
        console.log('Apply filters:', filterState);
        setIsFilterOpen(false);
        // TODO: Implement filter logic
    };

    return (
        <div className={styles.appointmentsContainer}>
            {/* Dashboard Header */}
            <AppointmentHeader
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onListView={handleListView}
                onGridView={handleGridView}
                isListView={true}
            />

            {/* Appointment Tabs and Filters */}
            <div className={clsx(styles.appointmentTabHead, 'appointment-tab-head')}>
                <AppointmentTabs
                    activeTab={activeTab}
                    onTabChange={handleTabChange}
                    tabCounts={getTabCounts()}
                />

                {/* Filter Section */}
                <div className={clsx(styles.filterHead, 'filter-head')}>
                    <DateRangePicker
                        isOpen={isCalendarOpen}
                        onToggle={() => setIsCalendarOpen(!isCalendarOpen)}
                        fromDate={fromDate}
                        toDate={toDate}
                        dateRange={dateRange}
                        onDateSelection={handleDateSelection}
                        onClear={handleDateRangeClear}
                        onApply={handleDateRangeApply}
                    />

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
                <div className="tab-pane fade show active">
                    {currentAppointments.length > 0 ? (
                        currentAppointments.map((appointment) => (
                            <AppointmentCard
                                key={appointment.id}
                                appointment={appointment}
                                onViewDoctorProfile={handleViewDoctorProfile}
                                onView={handleView}
                                onMessage={handleMessage}
                                onCancel={handleCancel}
                                onAttend={handleAttend}
                                onReschedule={handleReschedule}
                                onBookAgain={handleBookAgain}
                                onViewDetails={handleViewDetails}
                                onAddReview={handleAddReview}
                            />
                        ))
                    ) : (
                        <div className={clsx(styles.noAppointments)}>
                            <p>
                                Không tìm thấy lịch hẹn{' '}
                                {activeTab === 'upcoming'
                                    ? 'sắp tới'
                                    : activeTab === 'cancelled'
                                      ? 'đã huỷ'
                                      : 'đã hoàn thành'}
                                .
                            </p>
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
                </div>
            </div>

            {/* Add Review Modal */}
            <AddReviewModal
                isOpen={isReviewModalOpen}
                onClose={handleCloseReviewModal}
                onSubmit={handleSubmitReview}
            />
        </div>
    );
};

export default PatientAppointments;
