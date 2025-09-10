import React, { useState } from 'react';
import clsx from 'clsx';

import Pagination from '@/components/Pagination';
import Button from '@/components/Button';

import styles from './PatientAppointments.module.scss';

// Types
type AppointmentStatus = 'upcoming' | 'cancelled' | 'completed';

interface Appointment {
    id: string;
    appointmentNumber: string;
    doctorName: string;
    doctorImage: string;
    dateTime: string;
    visitType: string;
    callType: string;
    email: string;
    phone: string;
    status: AppointmentStatus;
}

// Mock data
const mockAppointments: Appointment[] = [
    {
        id: '1',
        appointmentNumber: '#Apt0001',
        doctorName: 'Dr Edalin',
        doctorImage: '/src/assets/img/doctors/doctor-thumb-21.jpg',
        dateTime: '11 Nov 2024 10.45 AM',
        visitType: 'General Visit',
        callType: 'Video Call',
        email: 'doctor@example.com',
        phone: '+1 504 368 6874',
        status: 'upcoming',
    },
    {
        id: '2',
        appointmentNumber: '#Apt0002',
        doctorName: 'Dr Smith',
        doctorImage: '/src/assets/img/doctors/doctor-thumb-13.jpg',
        dateTime: '05 Nov 2024 11.50 AM',
        visitType: 'General Visit',
        callType: 'Audio Call',
        email: 'smith@example.com',
        phone: '+1 832 891 8403',
        status: 'upcoming',
    },
    {
        id: '3',
        appointmentNumber: '#Apt00011',
        doctorName: 'Dr Edalin',
        doctorImage: '/src/assets/img/doctors/doctor-thumb-21.jpg',
        dateTime: '11 Nov 2024 10.45 AM',
        visitType: 'General Visit',
        callType: 'Video Call',
        email: 'doctor@example.com',
        phone: '+1 504 368 6874',
        status: 'cancelled',
    },
    {
        id: '4',
        appointmentNumber: '#Apt0004',
        doctorName: 'Dr Johnson',
        doctorImage: '/src/assets/img/doctors/doctor-thumb-13.jpg',
        dateTime: '05 Nov 2024 11.50 AM',
        visitType: 'General Visit',
        callType: 'Audio Call',
        email: 'johnson@example.com',
        phone: '+1 832 891 8403',
        status: 'cancelled',
    },
    {
        id: '5',
        appointmentNumber: '#Apt0005',
        doctorName: 'Dr Brown',
        doctorImage: '/src/assets/img/doctors/doctor-thumb-21.jpg',
        dateTime: '11 Nov 2024 10.45 AM',
        visitType: 'General Visit',
        callType: 'Video Call',
        email: 'brown@example.com',
        phone: '+1 504 368 6874',
        status: 'completed',
    },
    {
        id: '6',
        appointmentNumber: '#Apt0006',
        doctorName: 'Dr Wilson',
        doctorImage: '/src/assets/img/doctors/doctor-thumb-13.jpg',
        dateTime: '05 Nov 2024 11.50 AM',
        visitType: 'General Visit',
        callType: 'Audio Call',
        email: 'wilson@example.com',
        phone: '+1 832 891 8403',
        status: 'completed',
    },
];

const PatientAppointments: React.FC = () => {
    const [activeTab, setActiveTab] = useState<AppointmentStatus>('upcoming');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [dateRange, setDateRange] = useState('');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    // Filter states
    const [filterSearchTerm, setFilterSearchTerm] = useState('');
    const [appointmentTypeFilters, setAppointmentTypeFilters] = useState({
        allType: true,
        videoCall: false,
        audioCall: false,
        chat: false,
        directVisit: false,
    });
    const [visitTypeFilters, setVisitTypeFilters] = useState({
        allVisit: true,
        general: false,
        consultation: false,
        followUp: false,
        directVisit: false,
    });

    // Filter appointments based on active tab
    const filteredAppointments = mockAppointments.filter(
        (appointment) => appointment.status === activeTab
    );

    // Pagination settings
    const itemsPerPage = 10;
    const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentAppointments = filteredAppointments.slice(startIndex, startIndex + itemsPerPage);

    // Tab counts (these would come from API in real app)
    const getTabCount = (status: AppointmentStatus) => {
        return mockAppointments.filter((apt) => apt.status === status).length;
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
            setAppointmentTypeFilters({
                allType: checked,
                videoCall: false,
                audioCall: false,
                chat: false,
                directVisit: false,
            });
        } else {
            setAppointmentTypeFilters((prev) => ({
                ...prev,
                allType: false,
                [type]: checked,
            }));
        }
    };

    const handleVisitTypeChange = (type: string, checked: boolean) => {
        if (type === 'allVisit') {
            setVisitTypeFilters({
                allVisit: checked,
                general: false,
                consultation: false,
                followUp: false,
                directVisit: false,
            });
        } else {
            setVisitTypeFilters((prev) => ({
                ...prev,
                allVisit: false,
                [type]: checked,
            }));
        }
    };

    const handleFilterReset = () => {
        setFilterSearchTerm('');
        setAppointmentTypeFilters({
            allType: true,
            videoCall: false,
            audioCall: false,
            chat: false,
            directVisit: false,
        });
        setVisitTypeFilters({
            allVisit: true,
            general: false,
            consultation: false,
            followUp: false,
            directVisit: false,
        });
    };

    const renderAppointmentActions = (appointment: Appointment) => {
        switch (appointment.status) {
            case 'upcoming':
                return (
                    <>
                        <li className="appointment-action">
                            <ul>
                                <li>
                                    <button
                                        type="button"
                                        className={clsx(styles.btnIcon)}
                                        aria-label="View appointment"
                                        onClick={() => {
                                            /* Handle view */
                                        }}
                                    >
                                        <i className="isax isax-eye4"></i>
                                    </button>
                                </li>
                                <li>
                                    <button
                                        type="button"
                                        className={clsx(styles.btnIcon)}
                                        aria-label="Message doctor"
                                        onClick={() => {
                                            /* Handle message */
                                        }}
                                    >
                                        <i className="isax isax-messages-25"></i>
                                    </button>
                                </li>
                                <li>
                                    <button
                                        type="button"
                                        className={clsx(styles.btnIcon)}
                                        aria-label="Cancel appointment"
                                        onClick={() => {
                                            /* Handle cancel */
                                        }}
                                    >
                                        <i className="isax isax-close-circle5"></i>
                                    </button>
                                </li>
                            </ul>
                        </li>
                        <li className={clsx(styles.appointmentDetailBtn, 'appointment-detail-btn')}>
                            <button
                                type="button"
                                className="btn btn-md btn-primary-gradient"
                                onClick={() => {
                                    /* Handle attend */
                                }}
                            >
                                <i className="isax isax-calendar-tick5 me-1"></i> Attend
                            </button>
                        </li>
                    </>
                );
            case 'cancelled':
                return (
                    <li className={clsx(styles.appointmentDetailBtn, 'appointment-detail-btn')}>
                        <button
                            type="button"
                            className="btn btn-md btn-primary-gradient"
                            onClick={() => {
                                /* Handle reschedule */
                            }}
                        >
                            <i className="isax isax-calendar-tick5 me-1"></i> Reschedule
                        </button>
                    </li>
                );
            case 'completed':
                return (
                    <>
                        <li>
                            <button
                                type="button"
                                className={clsx(styles.btnLink, 'text-decoration-underline')}
                                data-bs-toggle="modal"
                                data-bs-target="#add_review"
                            >
                                Add Review
                            </button>
                        </li>
                        <li
                            className={clsx(
                                styles.appointmentDetailBtn,
                                'appointment-detail-btn d-flex align-items-center gap-3 flex-wrap'
                            )}
                        >
                            <button
                                type="button"
                                className="btn btn-md btn-dark"
                                onClick={() => {
                                    /* Handle book again */
                                }}
                            >
                                Book Again <i className="isax isax-arrow-right-3 ms-1"></i>
                            </button>
                            <button
                                type="button"
                                className="btn btn-md btn-primary-gradient"
                                onClick={() => {
                                    /* Handle view details */
                                }}
                            >
                                View Details <i className="isax isax-arrow-right-3 ms-1"></i>
                            </button>
                        </li>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className={styles.appointmentsContainer}>
            {/* Dashboard Header */}
            <div className={clsx(styles.dashboardHeader, 'dashboard-header')}>
                <h3>Appointments</h3>
                <ul className={clsx(styles.headerListBtns, 'header-list-btns')}>
                    <li>
                        <div className="input-block dash-search-input">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <span className="search-icon">
                                <i className="isax isax-search-normal"></i>
                            </span>
                        </div>
                    </li>
                    <li>
                        <div className="view-icons">
                            <button
                                type="button"
                                className="btn-icon active"
                                aria-label="List view"
                                onClick={() => {
                                    /* Handle list view */
                                }}
                            >
                                <i className="isax isax-grid-7"></i>
                            </button>
                        </div>
                    </li>
                    <li>
                        <div className="view-icons">
                            <button
                                type="button"
                                className="btn-icon"
                                aria-label="Grid view"
                                onClick={() => {
                                    /* Handle grid view */
                                }}
                            >
                                <i className="fa-solid fa-th"></i>
                            </button>
                        </div>
                    </li>
                </ul>
            </div>

            {/* Appointment Tabs and Filters */}
            <div className={clsx(styles.appointmentTabHead, 'appointment-tab-head')}>
                <div className={clsx(styles.appointmentTabs, 'appointment-tabs')}>
                    <ul className={clsx(styles.navPills, 'nav nav-pills inner-tab')}>
                        <li className={clsx(styles.navItem, 'nav-item')}>
                            <button
                                className={clsx(styles.navLink, 'nav-link', {
                                    active: activeTab === 'upcoming',
                                })}
                                type="button"
                                onClick={() => handleTabChange('upcoming')}
                            >
                                Upcoming<span>{getTabCount('upcoming')}</span>
                            </button>
                        </li>
                        <li className={clsx(styles.navItem, 'nav-item')}>
                            <button
                                className={clsx(styles.navLink, 'nav-link', {
                                    active: activeTab === 'cancelled',
                                })}
                                type="button"
                                onClick={() => handleTabChange('cancelled')}
                            >
                                Cancelled<span>{getTabCount('cancelled')}</span>
                            </button>
                        </li>
                        <li className={clsx(styles.navItem, 'nav-item')}>
                            <button
                                className={clsx(styles.navLink, 'nav-link', {
                                    active: activeTab === 'completed',
                                })}
                                type="button"
                                onClick={() => handleTabChange('completed')}
                            >
                                Completed<span>{getTabCount('completed')}</span>
                            </button>
                        </li>
                    </ul>
                </div>

                {/* Filter Section */}
                <div className={clsx(styles.filterHead, 'filter-head')}>
                    <div
                        className={clsx(
                            styles.daterangeWraper,
                            'position-relative daterange-wraper me-2'
                        )}
                    >
                        <div className="input-groupicon calender-input">
                            <input
                                type="text"
                                className="form-control date-range bookingrange"
                                placeholder="From Date - To Date"
                                value={dateRange}
                                onChange={(e) => setDateRange(e.target.value)}
                            />
                        </div>
                        <i className="isax isax-calendar-1"></i>
                    </div>
                    <div
                        className={clsx('form-sorts dropdown', {
                            'table-filter-show': isFilterOpen,
                        })}
                    >
                        <button
                            type="button"
                            className="dropdown-toggle btn"
                            id="table-filter"
                            onClick={() => setIsFilterOpen((prev) => !prev)}
                        >
                            <i className="isax isax-filter me-2"></i>Filter By
                        </button>
                        <div className={clsx(styles.filterDropdownMenu, 'filter-dropdown-menu')}>
                            <div className="filter-set-view">
                                <div className="accordion" id="accordionExample">
                                    {/* Name Filter */}
                                    <div
                                        className={clsx(
                                            styles.filterSetContent,
                                            'filter-set-content'
                                        )}
                                    >
                                        <div
                                            className={clsx(
                                                styles.filterSetContentHead,
                                                'filter-set-content-head'
                                            )}
                                        >
                                            <button
                                                type="button"
                                                className="btn-link"
                                                data-bs-toggle="collapse"
                                                data-bs-target="#collapseTwo"
                                                aria-expanded="false"
                                                aria-controls="collapseTwo"
                                            >
                                                Name<i className="fa-solid fa-chevron-right"></i>
                                            </button>
                                        </div>
                                        <div
                                            className={clsx(
                                                styles.filterSetContents,
                                                'filter-set-contents accordion-collapse collapse show'
                                            )}
                                            id="collapseTwo"
                                            data-bs-parent="#accordionExample"
                                        >
                                            <ul>
                                                <li>
                                                    <div className="input-block dash-search-input w-100">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="Search"
                                                            value={filterSearchTerm}
                                                            onChange={(e) =>
                                                                setFilterSearchTerm(e.target.value)
                                                            }
                                                        />
                                                        <span className="search-icon">
                                                            <i className="fa-solid fa-magnifying-glass"></i>
                                                        </span>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Appointment Type Filter */}
                                    <div className="filter-set-content">
                                        <div className="filter-set-content-head">
                                            <button
                                                type="button"
                                                className="btn-link"
                                                data-bs-toggle="collapse"
                                                data-bs-target="#collapseOne"
                                                aria-expanded="true"
                                                aria-controls="collapseOne"
                                            >
                                                Appointment Type{' '}
                                                <i className="fa-solid fa-chevron-right"></i>
                                            </button>
                                        </div>
                                        <div
                                            className="filter-set-contents accordion-collapse collapse show"
                                            id="collapseOne"
                                            data-bs-parent="#accordionExample"
                                        >
                                            <ul>
                                                <li>
                                                    <div
                                                        className={clsx(
                                                            styles.filterChecks,
                                                            'filter-checks'
                                                        )}
                                                    >
                                                        <label
                                                            className={clsx(
                                                                styles.checkBoxs,
                                                                'checkboxs'
                                                            )}
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={
                                                                    appointmentTypeFilters.allType
                                                                }
                                                                onChange={(e) =>
                                                                    handleAppointmentTypeChange(
                                                                        'allType',
                                                                        e.target.checked
                                                                    )
                                                                }
                                                            />
                                                            <span className="checkmarks"></span>
                                                            <span className="check-title">
                                                                All Type
                                                            </span>
                                                        </label>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div
                                                        className={clsx(
                                                            styles.filterChecks,
                                                            'filter-checks'
                                                        )}
                                                    >
                                                        <label
                                                            className={clsx(
                                                                styles.checkBoxs,
                                                                'checkboxs'
                                                            )}
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={
                                                                    appointmentTypeFilters.videoCall
                                                                }
                                                                onChange={(e) =>
                                                                    handleAppointmentTypeChange(
                                                                        'videoCall',
                                                                        e.target.checked
                                                                    )
                                                                }
                                                            />
                                                            <span className="checkmarks"></span>
                                                            <span className="check-title">
                                                                Video Call
                                                            </span>
                                                        </label>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div
                                                        className={clsx(
                                                            styles.filterChecks,
                                                            'filter-checks'
                                                        )}
                                                    >
                                                        <label
                                                            className={clsx(
                                                                styles.checkBoxs,
                                                                'checkboxs'
                                                            )}
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={
                                                                    appointmentTypeFilters.audioCall
                                                                }
                                                                onChange={(e) =>
                                                                    handleAppointmentTypeChange(
                                                                        'audioCall',
                                                                        e.target.checked
                                                                    )
                                                                }
                                                            />
                                                            <span className="checkmarks"></span>
                                                            <span className="check-title">
                                                                Audio Call
                                                            </span>
                                                        </label>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div
                                                        className={clsx(
                                                            styles.filterChecks,
                                                            'filter-checks'
                                                        )}
                                                    >
                                                        <label
                                                            className={clsx(
                                                                styles.checkBoxs,
                                                                'checkboxs'
                                                            )}
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={
                                                                    appointmentTypeFilters.chat
                                                                }
                                                                onChange={(e) =>
                                                                    handleAppointmentTypeChange(
                                                                        'chat',
                                                                        e.target.checked
                                                                    )
                                                                }
                                                            />
                                                            <span className="checkmarks"></span>
                                                            <span className="check-title">
                                                                Chat
                                                            </span>
                                                        </label>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div
                                                        className={clsx(
                                                            styles.filterChecks,
                                                            'filter-checks'
                                                        )}
                                                    >
                                                        <label
                                                            className={clsx(
                                                                styles.checkBoxs,
                                                                'checkboxs'
                                                            )}
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={
                                                                    appointmentTypeFilters.directVisit
                                                                }
                                                                onChange={(e) =>
                                                                    handleAppointmentTypeChange(
                                                                        'directVisit',
                                                                        e.target.checked
                                                                    )
                                                                }
                                                            />
                                                            <span className="checkmarks"></span>
                                                            <span className="check-title">
                                                                Direct Visit
                                                            </span>
                                                        </label>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Visit Type Filter */}
                                    <div className="filter-set-content">
                                        <div className="filter-set-content-head">
                                            <button
                                                type="button"
                                                className="btn-link"
                                                data-bs-toggle="collapse"
                                                data-bs-target="#collapseThree"
                                                aria-expanded="false"
                                                aria-controls="collapseThree"
                                            >
                                                Visit Type
                                                <i className="fa-solid fa-chevron-right"></i>
                                            </button>
                                        </div>
                                        <div
                                            className="filter-set-contents accordion-collapse collapse show"
                                            id="collapseThree"
                                            data-bs-parent="#accordionExample"
                                        >
                                            <ul>
                                                <li>
                                                    <div className="filter-checks">
                                                        <label className="checkboxs">
                                                            <input
                                                                type="checkbox"
                                                                checked={visitTypeFilters.allVisit}
                                                                onChange={(e) =>
                                                                    handleVisitTypeChange(
                                                                        'allVisit',
                                                                        e.target.checked
                                                                    )
                                                                }
                                                            />
                                                            <span className="checkmarks"></span>
                                                            <span className="check-title">
                                                                All Visit
                                                            </span>
                                                        </label>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="filter-checks">
                                                        <label className="checkboxs">
                                                            <input
                                                                type="checkbox"
                                                                checked={visitTypeFilters.general}
                                                                onChange={(e) =>
                                                                    handleVisitTypeChange(
                                                                        'general',
                                                                        e.target.checked
                                                                    )
                                                                }
                                                            />
                                                            <span className="checkmarks"></span>
                                                            <span className="check-title">
                                                                General
                                                            </span>
                                                        </label>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="filter-checks">
                                                        <label className="checkboxs">
                                                            <input
                                                                type="checkbox"
                                                                checked={
                                                                    visitTypeFilters.consultation
                                                                }
                                                                onChange={(e) =>
                                                                    handleVisitTypeChange(
                                                                        'consultation',
                                                                        e.target.checked
                                                                    )
                                                                }
                                                            />
                                                            <span className="checkmarks"></span>
                                                            <span className="check-title">
                                                                Consultation
                                                            </span>
                                                        </label>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="filter-checks">
                                                        <label className="checkboxs">
                                                            <input
                                                                type="checkbox"
                                                                checked={visitTypeFilters.followUp}
                                                                onChange={(e) =>
                                                                    handleVisitTypeChange(
                                                                        'followUp',
                                                                        e.target.checked
                                                                    )
                                                                }
                                                            />
                                                            <span className="checkmarks"></span>
                                                            <span className="check-title">
                                                                Follow-up
                                                            </span>
                                                        </label>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="filter-checks">
                                                        <label className="checkboxs">
                                                            <input
                                                                type="checkbox"
                                                                checked={
                                                                    visitTypeFilters.directVisit
                                                                }
                                                                onChange={(e) =>
                                                                    handleVisitTypeChange(
                                                                        'directVisit',
                                                                        e.target.checked
                                                                    )
                                                                }
                                                            />
                                                            <span className="checkmarks"></span>
                                                            <span className="check-title">
                                                                Direct Visit
                                                            </span>
                                                        </label>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="filter-reset-btns">
                                    <Button
                                        text="Reset"
                                        type="button"
                                        className="btn-md btn-light rounded-pill"
                                        onClick={handleFilterReset}
                                    />
                                    <Button
                                        text="Filter Now"
                                        type="button"
                                        className="btn-md btn-primary-gradient rounded-pill"
                                        onClick={() => {
                                            /* Handle filter */
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Appointment Content */}
            <div className="tab-content appointment-tab-content">
                <div className="tab-pane fade show active">
                    {currentAppointments.length > 0 ? (
                        currentAppointments.map((appointment) => (
                            <div
                                key={appointment.id}
                                className={clsx(styles.appointmentWrap, 'appointment-wrap')}
                            >
                                <ul>
                                    <li>
                                        <div className="patinet-information">
                                            <button
                                                type="button"
                                                className={clsx(styles.btnLink, 'p-0')}
                                                onClick={() => {
                                                    /* Handle view doctor profile */
                                                }}
                                            >
                                                <img
                                                    src={appointment.doctorImage}
                                                    alt={`${appointment.doctorName} profile`}
                                                />
                                            </button>
                                            <div className="patient-info">
                                                <p>{appointment.appointmentNumber}</p>
                                                <h6>
                                                    <button
                                                        type="button"
                                                        className={clsx(
                                                            styles.btnLink,
                                                            styles.textStart,
                                                            'p-0'
                                                        )}
                                                        onClick={() => {
                                                            /* Handle view doctor profile */
                                                        }}
                                                    >
                                                        {appointment.doctorName}
                                                    </button>
                                                </h6>
                                            </div>
                                        </div>
                                    </li>
                                    <li className="appointment-info">
                                        <p>
                                            <i className="isax isax-clock5"></i>
                                            {appointment.dateTime}
                                        </p>
                                        <ul className="d-flex apponitment-types">
                                            <li>{appointment.visitType}</li>
                                            <li>{appointment.callType}</li>
                                        </ul>
                                    </li>
                                    {appointment.status !== 'completed' && (
                                        <li className="mail-info-patient">
                                            <ul>
                                                <li>
                                                    <i className="isax isax-sms5"></i>
                                                    <a href={`mailto:${appointment.email}`}>
                                                        {appointment.email}
                                                    </a>
                                                </li>
                                                <li>
                                                    <i className="isax isax-call5"></i>
                                                    {appointment.phone}
                                                </li>
                                            </ul>
                                        </li>
                                    )}

                                    {renderAppointmentActions(appointment)}
                                </ul>
                            </div>
                        ))
                    ) : (
                        <div className={clsx(styles.noAppointments)}>
                            <p>No {activeTab} appointments found.</p>
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
        </div>
    );
};

export default PatientAppointments;
