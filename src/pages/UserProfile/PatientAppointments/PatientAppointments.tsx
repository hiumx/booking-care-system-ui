import React, { useState, useEffect } from 'react';
import { RangeKeyDict } from 'react-date-range';
import clsx from 'clsx';

import Pagination from '@/components/Pagination';
import DateRangePicker from '@/components/DateRangePicker';
import AppointmentHeader from './components/AppointmentHeader';
import AppointmentTabs from './components/AppointmentTabs';
import AppointmentFilters from './components/AppointmentFilters';
import AppointmentCard from './components/AppointmentCard';
import AddReviewModal from './components/AddReviewModal';
import AppointmentDetail from './components/AppointmentDetail';
import { Appointment, AppointmentStatus, FilterState } from './components/AppointmentTypes';
import styles from './PatientAppointments.module.scss';

// Mock data
// Factory function để tạo appointment
const createAppointment = ({
    id,
    number,
    doctorName,
    doctorImage,
    dateTime,
    callType,
    email,
    phone,
    status,
    consultationFees,
    clinicLocation,
    location,
    cancelReason,
}: {
    id: string;
    number: string;
    doctorName: string;
    doctorImage: string;
    dateTime: string;
    callType: string;
    email: string;
    phone: string;
    status: AppointmentStatus;
    consultationFees?: number;
    clinicLocation?: string;
    location?: string;
    cancelReason?: string;
}): Appointment => ({
    id,
    appointmentNumber: number,
    doctorName,
    doctorImage,
    dateTime,
    visitType: 'Khám tổng quát', // luôn cố định
    callType,
    email,
    phone,
    status,
    consultationFees,
    clinicLocation,
    location,
    cancelReason,
});

// Mock data
const mockAppointments: Appointment[] = [
    createAppointment({
        id: '1',
        number: '#Apt0001',
        doctorName: 'Bác sĩ Edalin',
        doctorImage: '/src/assets/img/doctors/doctor-thumb-21.jpg',
        dateTime: '11/11/2024 10:45',
        callType: 'Cuộc gọi video',
        email: 'doctor@example.com',
        phone: '+84 504 368 6874',
        status: 'upcoming',
        consultationFees: 200,
        clinicLocation: 'Phòng khám Nha khoa Adrian',
        location: 'Hà Nội, Việt Nam',
    }),
    createAppointment({
        id: '2',
        number: '#Apt0002',
        doctorName: 'Bác sĩ Smith',
        doctorImage: '/src/assets/img/doctors/doctor-thumb-13.jpg',
        dateTime: '05/11/2024 11:50',
        callType: 'Cuộc gọi âm thanh',
        email: 'smith@example.com',
        phone: '+84 832 891 8403',
        status: 'upcoming',
        consultationFees: 150,
        clinicLocation: 'Phòng khám Tim mạch',
        location: 'TP.HCM, Việt Nam',
    }),
    createAppointment({
        id: '3',
        number: '#Apt00011',
        doctorName: 'Bác sĩ Edalin',
        doctorImage: '/src/assets/img/doctors/doctor-thumb-21.jpg',
        dateTime: '11/11/2024 10:45',
        callType: 'Cuộc gọi video',
        email: 'doctor@example.com',
        phone: '+84 504 368 6874',
        status: 'cancelled',
        consultationFees: 200,
        clinicLocation: 'Phòng khám Nha khoa Adrian',
        location: 'Hà Nội, Việt Nam',
        cancelReason:
            'Bệnh nhân không thể tham gia cuộc hẹn do có việc đột xuất. Đã liên hệ để sắp xếp lại lịch hẹn mới.',
    }),
    createAppointment({
        id: '4',
        number: '#Apt0004',
        doctorName: 'Bác sĩ Johnson',
        doctorImage: '/src/assets/img/doctors/doctor-thumb-13.jpg',
        dateTime: '05/11/2024 11:50',
        callType: 'Cuộc gọi âm thanh',
        email: 'johnson@example.com',
        phone: '+84 832 891 8403',
        status: 'cancelled',
        consultationFees: 150,
        clinicLocation: 'Phòng khám Tim mạch',
        location: 'TP.HCM, Việt Nam',
        cancelReason:
            'Bác sĩ phải hủy lịch hẹn do có ca cấp cứu khẩn cấp. Bệnh nhân sẽ được liên hệ để sắp xếp lịch hẹn mới trong thời gian sớm nhất.',
    }),
    createAppointment({
        id: '5',
        number: '#Apt0005',
        doctorName: 'Bác sĩ Brown',
        doctorImage: '/src/assets/img/doctors/doctor-thumb-21.jpg',
        dateTime: '11/11/2024 10:45',
        callType: 'Cuộc gọi video',
        email: 'brown@example.com',
        phone: '+84 504 368 6874',
        status: 'completed',
        consultationFees: 180,
        clinicLocation: 'Phòng khám Da liễu',
        location: 'Đà Nẵng, Việt Nam',
    }),
    createAppointment({
        id: '6',
        number: '#Apt0006',
        doctorName: 'Bác sĩ Wilson',
        doctorImage: '/src/assets/img/doctors/doctor-thumb-13.jpg',
        dateTime: '05/11/2024 11:50',
        callType: 'Cuộc gọi âm thanh',
        email: 'wilson@example.com',
        phone: '+84 832 891 8403',
        status: 'completed',
        consultationFees: 120,
        clinicLocation: 'Phòng khám Nhi khoa',
        location: 'Cần Thơ, Việt Nam',
    }),
];

const PatientAppointments: React.FC = () => {
    const [activeTab, setActiveTab] = useState<AppointmentStatus>('upcoming');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [selectedAppointmentForReview, setSelectedAppointmentForReview] =
        useState<Appointment | null>(null);
    const [selectedAppointmentForDetail, setSelectedAppointmentForDetail] =
        useState<Appointment | null>(null);
    const [showAppointmentDetail, setShowAppointmentDetail] = useState(false);

    // Date range picker state
    const [dateRanges, setDateRanges] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection',
        },
    ]);

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
        }
    };

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

    // Appointment action handlers
    const handleViewDoctorProfile = (appointment: Appointment) => {
        setSelectedAppointmentForDetail(appointment);
        setShowAppointmentDetail(true);
    };

    const handleView = (appointment: Appointment) => {
        console.log('View appointment:', appointment);
    };

    const handleMessage = (appointment: Appointment) => {
        console.log('Message doctor:', appointment);
    };

    const handleCancel = (appointment: Appointment) => {
        console.log('Cancel appointment:', appointment);
    };

    const handleAttend = (appointment: Appointment) => {
        console.log('Attend appointment:', appointment);
    };

    const handleReschedule = (appointment: Appointment) => {
        console.log('Reschedule appointment:', appointment);
    };

    const handleBookAgain = (appointment: Appointment) => {
        console.log('Book again:', appointment);
    };

    const handleViewDetails = (appointment: Appointment) => {
        setSelectedAppointmentForDetail(appointment);
        setShowAppointmentDetail(true);
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
    };

    const handleGridView = () => {
        console.log('Switch to grid view');
    };

    const handleFilterApply = () => {
        console.log('Apply filters:', filterState);
        setIsFilterOpen(false);
    };

    const handleBackFromDetail = () => {
        setShowAppointmentDetail(false);
        setSelectedAppointmentForDetail(null);
    };

    // If showing appointment detail, render detail view
    if (showAppointmentDetail && selectedAppointmentForDetail) {
        return (
            <AppointmentDetail
                appointment={selectedAppointmentForDetail}
                onBack={handleBackFromDetail}
                onMessage={handleMessage}
                onCancel={handleCancel}
                onViewDoctorProfile={handleViewDoctorProfile}
            />
        );
    }

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
                                {(() => {
                                    let appointmentTypeText = '';
                                    if (activeTab === 'upcoming') {
                                        appointmentTypeText = 'sắp tới';
                                    } else if (activeTab === 'cancelled') {
                                        appointmentTypeText = 'đã huỷ';
                                    } else {
                                        appointmentTypeText = 'đã hoàn thành';
                                    }
                                    return <>Không tìm thấy lịch hẹn {appointmentTypeText}.</>;
                                })()}
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
