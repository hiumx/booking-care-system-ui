import React, { useState, useEffect, useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { Skeleton } from '@mui/material';
import { setAppointmentType, setSelectedDoctorId } from '@/store/slices/bookingSlice';
import { getDoctorByIdAsync, clearSelectedDoctor } from '@/store/slices/doctorSlice';
import { resetScheduleState } from '@/store/slices/schedule.slice';
import BookingSectionWrapper from '../../components/BookingSectionWrapper';
import {
    type BookingEntityInfo,
    type AppointmentInfo,
} from '../../components/BookingHeader/BookingHeader';
import { HospitalProfileResponse } from '@/types/hospital.types';
import { AppointmentType } from '@/enums/appointment.enums';
import { DoctorService } from '@/services/doctor.service';
import Pagination from '@/components/Pagination/Pagination';
import Select from '@/components/Select/Select';
import clsx from 'clsx';
import styles from './AppointmentTypeSection.module.scss';

const DOCTORS_PAGE_SIZE = 6;

// Filter options - these will be sent to API
interface DoctorFilters {
    searchTerm: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    minExperience?: number;
    maxExperience?: number;
    gender?: string;
    language?: string;
}

const defaultFilters: DoctorFilters = {
    searchTerm: '',
};

// Language option type
interface LanguageOption {
    id: string;
    name: string;
}

interface AppointmentTypeSectionProps {
    nextStep: () => void;
    prevStep: () => void;
    hospitalData: HospitalProfileResponse | null;
}

interface DoctorForSelection {
    id: string;
    fullName: string;
    avatarUrl?: string;
    specialtyName?: string;
    positionName?: string;
    yearsOfExperience?: number;
    rating?: number;
    totalReviews?: number;
    consultationFee?: number;
    bio?: string;
    languages?: string[];
    gender?: string;
}

const AppointmentTypeSection: React.FC<AppointmentTypeSectionProps> = ({
    nextStep,
    prevStep,
    hospitalData,
}) => {
    const dispatch = useAppDispatch();
    const bookingState = useAppSelector((state) => state.booking);
    const scheduleState = useAppSelector((state) => state.schedule);

    // Helper to clear schedule data only if it has data (avoid unnecessary dispatches)
    const clearScheduleIfNeeded = () => {
        const hasScheduleData =
            scheduleState.selectedDate ||
            scheduleState.selectedSlots.length > 0 ||
            scheduleState.scheduleCategories.length > 0;
        if (hasScheduleData) {
            dispatch(resetScheduleState());
        }
    };

    const [selectedType, setSelectedType] = useState<AppointmentType>(
        bookingState.appointmentType || AppointmentType.IN_PERSON
    );
    const [doctors, setDoctors] = useState<DoctorForSelection[]>([]);
    const [isLoadingDoctors, setIsLoadingDoctors] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState<string | null>(
        bookingState.selectedDoctorId
    );
    // Doctor selection mode: 'hospital' = let hospital assign, 'self' = choose doctor yourself
    const [doctorSelectionMode, setDoctorSelectionMode] = useState<'hospital' | 'self'>(
        bookingState.selectedDoctorId ? 'self' : 'hospital'
    );
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalDoctors, setTotalDoctors] = useState(0);

    // Filter state
    const [filters, setFilters] = useState<DoctorFilters>(defaultFilters);
    const [debouncedFilters, setDebouncedFilters] = useState<DoctorFilters>(defaultFilters);
    const [showFilters, setShowFilters] = useState(false);
    const [availableLanguages, setAvailableLanguages] = useState<LanguageOption[]>([]);

    // Debounce filters (especially for search term)
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedFilters(filters);
        }, 500);
        return () => clearTimeout(timer);
    }, [filters]);

    // Check if user selected service (not specialty) - service requires IN_PERSON only
    const isServiceSelected = !!bookingState.selectedServiceMedicalId;
    const isSpecialtySelected = !!bookingState.selectedSpecialtyId;

    // Auto-set IN_PERSON for service selection
    useEffect(() => {
        if (isServiceSelected) {
            setSelectedType(AppointmentType.IN_PERSON);
            dispatch(setAppointmentType(AppointmentType.IN_PERSON));
        }
    }, [isServiceSelected, dispatch]);

    // Fetch languages for filter dropdown
    useEffect(() => {
        const fetchLanguages = async () => {
            try {
                const response = await DoctorService.getLanguages();
                if (response.success && response.data) {
                    setAvailableLanguages(response.data);
                }
            } catch (error) {
                console.error('Error fetching languages:', error);
            }
        };
        fetchLanguages();
    }, []);

    // Get service type name based on appointment type
    const getServiceTypeName = useCallback((type: AppointmentType): string => {
        return type === AppointmentType.IN_PERSON ? 'Khám trực tiếp' : 'Tư vấn trực tuyến';
    }, []);

    // Fetch doctors when specialty is selected or filters change
    const fetchDoctors = useCallback(
        async (page: number = 1) => {
            if (!isSpecialtySelected || !bookingState.selectedSpecialtyId || !hospitalData?.id) {
                setDoctors([]);
                setTotalPages(1);
                setTotalDoctors(0);
                return;
            }

            setIsLoadingDoctors(true);
            try {
                // Filter doctors by specialty, hospital, service type, and additional filters
                const serviceTypeName = getServiceTypeName(selectedType);
                const response = await DoctorService.filterDoctors({
                    specialtyFilter: bookingState.selectedSpecialtyId,
                    hospitalFilter: hospitalData.id,
                    serviceTypeFilter: serviceTypeName,
                    pageNumber: page,
                    pageSize: DOCTORS_PAGE_SIZE,
                    // Apply debounced filters to API call
                    searchTerm: debouncedFilters.searchTerm || undefined,
                    priceRange:
                        debouncedFilters.minPrice !== undefined ||
                        debouncedFilters.maxPrice !== undefined
                            ? {
                                  min: debouncedFilters.minPrice || 0,
                                  max: debouncedFilters.maxPrice, // Don't set default max - let backend handle unlimited
                              }
                            : undefined,
                    ratingFilter: debouncedFilters.minRating,
                    experienceRange:
                        debouncedFilters.minExperience !== undefined ||
                        debouncedFilters.maxExperience !== undefined
                            ? {
                                  min: debouncedFilters.minExperience || 0,
                                  max: debouncedFilters.maxExperience || 100,
                              }
                            : undefined,
                    genderFilter: debouncedFilters.gender as any,
                    languageFilter: debouncedFilters.language,
                });

                if (response.success && response.data?.doctors) {
                    const mappedDoctors: DoctorForSelection[] = response.data.doctors.map(
                        (doc: any) => ({
                            id: doc.id,
                            fullName: `${doc.firstName || ''} ${doc.lastName || ''}`.trim(),
                            avatarUrl: doc.avatarUrl,
                            specialtyName: doc.specialty?.name || doc.specialtyName,
                            positionName: doc.position?.name,
                            yearsOfExperience: doc.yearsOfExperience,
                            rating: doc.reviewStatistics?.averageRating || doc.rating,
                            totalReviews: doc.reviewStatistics?.totalReviews,
                            bio: doc.bio,
                            consultationFee: doc.prices?.find(
                                (p: any) => p.serviceTypeName === serviceTypeName
                            )?.amount,
                            languages: doc.languages?.map((l: any) => l.name || l) || [],
                            gender: doc.gender,
                        })
                    );
                    setDoctors(mappedDoctors);
                    setTotalPages(response.data.totalPages || 1);
                    setTotalDoctors(response.data.totalCount || 0);
                    setCurrentPage(page);
                }
            } catch (error) {
                console.error('Error fetching doctors:', error);
                setDoctors([]);
                setTotalPages(1);
                setTotalDoctors(0);
            } finally {
                setIsLoadingDoctors(false);
            }
        },
        [
            isSpecialtySelected,
            bookingState.selectedSpecialtyId,
            hospitalData?.id,
            selectedType,
            getServiceTypeName,
            debouncedFilters,
        ]
    );

    useEffect(() => {
        fetchDoctors(1); // Reset to page 1 when filters change
    }, [fetchDoctors]);

    // Handle page change
    const handlePageChange = useCallback(
        (page: number) => {
            fetchDoctors(page);
        },
        [fetchDoctors]
    );

    // Handle filter change - triggers API call via useEffect
    const handleFilterChange = (key: keyof DoctorFilters, value: string | number | undefined) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    // Helper function to get doctor count text
    const getDoctorCountText = () => {
        if (isLoadingDoctors) return 'Đang tải...';
        if (totalDoctors > 0) return `${totalDoctors} bác sĩ có sẵn`;
        return 'Không có bác sĩ';
    };

    // Reset filters
    const handleResetFilters = () => {
        setFilters(defaultFilters);
    };

    // Check if any filter is active (for UI display)
    const hasActiveFilters =
        filters.searchTerm !== '' ||
        (filters.minPrice !== undefined && filters.minPrice >= 0) ||
        filters.maxPrice !== undefined ||
        filters.minRating !== undefined ||
        (filters.minExperience !== undefined && filters.minExperience >= 0) ||
        filters.maxExperience !== undefined ||
        (filters.gender !== undefined && filters.gender !== '') ||
        (filters.language !== undefined && filters.language !== '');

    // Check if any debounced filter is applied (for logic)
    const hasAppliedFilters =
        debouncedFilters.searchTerm !== '' ||
        (debouncedFilters.minPrice !== undefined && debouncedFilters.minPrice >= 0) ||
        debouncedFilters.maxPrice !== undefined ||
        debouncedFilters.minRating !== undefined ||
        (debouncedFilters.minExperience !== undefined && debouncedFilters.minExperience >= 0) ||
        debouncedFilters.maxExperience !== undefined ||
        (debouncedFilters.gender !== undefined && debouncedFilters.gender !== '') ||
        (debouncedFilters.language !== undefined && debouncedFilters.language !== '');

    const handleTypeSelect = (type: AppointmentType) => {
        if (isServiceSelected) return; // Cannot change type for service
        // Clear schedule data when appointment type changes
        if (selectedType !== type) {
            clearScheduleIfNeeded();
        }
        setSelectedType(type);
        dispatch(setAppointmentType(type));
        // Reset doctor selection when type changes
        setSelectedDoctor(null);
        dispatch(setSelectedDoctorId(null));
        dispatch(clearSelectedDoctor());
        setDoctorSelectionMode('hospital');
    };

    const handleDoctorSelectionModeChange = (mode: 'hospital' | 'self') => {
        setDoctorSelectionMode(mode);
        if (mode === 'hospital') {
            // Clear doctor selection and schedule data when switching to hospital assignment
            clearScheduleIfNeeded();
            setSelectedDoctor(null);
            dispatch(setSelectedDoctorId(null));
            dispatch(clearSelectedDoctor());
        }
    };

    const handleDoctorSelect = (doctorId: string) => {
        // Clear schedule data when switching to a different doctor
        if (selectedDoctor && selectedDoctor !== doctorId) {
            clearScheduleIfNeeded();
        }
        setSelectedDoctor(doctorId);
        dispatch(setSelectedDoctorId(doctorId));
        // Fetch doctor details for display in booking header
        dispatch(getDoctorByIdAsync(doctorId));
    };

    const handleNext = () => {
        dispatch(setAppointmentType(selectedType));
        nextStep();
    };

    // Get selected item name for display
    const getSelectedItemName = (): string => {
        if (isSpecialtySelected && hospitalData) {
            const specialty = hospitalData.specialties?.find(
                (s) => s.id === bookingState.selectedSpecialtyId
            );
            return specialty?.name || 'Chưa chọn';
        }
        if (isServiceSelected && hospitalData) {
            const service = hospitalData.serviceMedicals?.find(
                (s) => s.id === bookingState.selectedServiceMedicalId
            );
            return service?.name || 'Chưa chọn';
        }
        return 'Chưa chọn';
    };

    // Build header info
    const hospitalInfo: BookingEntityInfo = {
        name: hospitalData?.name || 'Đang tải...',
        subtitle: hospitalData?.address || '',
        location: hospitalData?.address || '',
        avatar: hospitalData?.avatarUrl || '/assets/img/hospital-placeholder.png',
        bookingType: 'service',
    };

    const appointmentInfo: AppointmentInfo = {
        service: getSelectedItemName(),
        serviceType: isSpecialtySelected ? 'Chuyên khoa' : 'Dịch vụ',
        dateTime: 'Chưa chọn',
        appointmentType:
            selectedType === AppointmentType.IN_PERSON ? 'Khám trực tiếp' : 'Tư vấn trực tuyến',
    };

    return (
        <BookingSectionWrapper
            doctor={hospitalInfo}
            appointment={appointmentInfo}
            nextStepTitle="Chọn ngày & giờ"
            nextStep={handleNext}
            prevStep={prevStep}
            fieldsetId="appointment-type"
            isShowInfoHeader={false}
        >
            <div className="card mb-0">
                <div className="card-body pb-1">
                    {/* Appointment Type Selection */}
                    <h6 className="mb-3">Chọn loại khám</h6>
                    <div className="row mb-4">
                        <div className="col-xl col-md-6 col-sm-6">
                            <label
                                className={clsx(
                                    'radio-select text-center',
                                    selectedType === AppointmentType.IN_PERSON && 'active',
                                    isServiceSelected && 'selected-locked'
                                )}
                                htmlFor="appointmentTypeInPerson"
                                aria-label="Khám trực tiếp"
                            >
                                <input
                                    id="appointmentTypeInPerson"
                                    className="form-check-input ms-0 mt-0"
                                    type="radio"
                                    name="appointmentType"
                                    checked={selectedType === AppointmentType.IN_PERSON}
                                    onChange={() => handleTypeSelect(AppointmentType.IN_PERSON)}
                                    disabled={isServiceSelected}
                                />
                                <span className="form-check-label">
                                    <i className="isax isax-hospital5" aria-hidden="true"></i>
                                    <span className="service-title d-block">Khám trực tiếp</span>
                                </span>
                            </label>
                        </div>
                        <div className="col-xl col-md-6 col-sm-6">
                            <label
                                className={clsx(
                                    'radio-select text-center',
                                    selectedType === AppointmentType.TELEHEALTH && 'active',
                                    isServiceSelected && styles.disabled
                                )}
                                htmlFor="appointmentTypeTelehealth"
                                aria-label="Tư vấn trực tuyến"
                            >
                                <input
                                    id="appointmentTypeTelehealth"
                                    className="form-check-input ms-0 mt-0"
                                    type="radio"
                                    name="appointmentType"
                                    checked={selectedType === AppointmentType.TELEHEALTH}
                                    onChange={() => handleTypeSelect(AppointmentType.TELEHEALTH)}
                                    disabled={isServiceSelected}
                                />
                                <span className="form-check-label">
                                    <i className="isax isax-video5" aria-hidden="true"></i>
                                    <span className="service-title d-block">Tư vấn trực tuyến</span>
                                </span>
                            </label>
                        </div>
                    </div>

                    {isServiceSelected && (
                        <div className="alert alert-warning mb-4">
                            <i className="isax isax-info-circle me-2"></i>
                            Dịch vụ y tế chỉ hỗ trợ khám trực tiếp tại bệnh viện
                        </div>
                    )}

                    {/* Doctor Selection - Only for specialty */}
                    {isSpecialtySelected && (
                        <div className="mt-4 pt-4 border-top">
                            <h6 className="mb-3">
                                <i className="isax isax-user-octagon me-2"></i>
                                Chọn bác sĩ (không bắt buộc)
                            </h6>
                            <p className="text-muted fs-14 mb-3">
                                Bạn có thể chọn bác sĩ hoặc để bệnh viện phân công bác sĩ phù hợp
                            </p>

                            {/* Doctor Selection Mode */}
                            <div className="row mb-3">
                                {/* Option: Hospital assigns doctor */}
                                <div className="col-md-6 mb-3 mb-md-0">
                                    <label
                                        className={clsx(
                                            styles.doctorItem,
                                            'service-item',
                                            doctorSelectionMode === 'hospital' && 'active'
                                        )}
                                        htmlFor="doctorSelectionModeHospital"
                                        aria-label="Bệnh viện phân công bác sĩ"
                                    >
                                        <input
                                            id="doctorSelectionModeHospital"
                                            className="form-check-input ms-0 mt-0"
                                            type="radio"
                                            name="doctorSelectionMode"
                                            checked={doctorSelectionMode === 'hospital'}
                                            onChange={() =>
                                                handleDoctorSelectionModeChange('hospital')
                                            }
                                        />
                                        <span className="form-check-label ms-2">
                                            <span className="d-flex align-items-center">
                                                <span className="avatar avatar-md me-2 bg-light rounded-circle d-flex align-items-center justify-content-center">
                                                    <i
                                                        className="isax isax-user-tick text-primary"
                                                        aria-hidden="true"
                                                    ></i>
                                                </span>
                                                <span>
                                                    <span className="service-title d-block mb-1">
                                                        Để bệnh viện phân công
                                                    </span>
                                                    <span className="fs-14 text-muted">
                                                        Bác sĩ phù hợp nhất
                                                    </span>
                                                </span>
                                            </span>
                                        </span>
                                    </label>
                                </div>

                                {/* Option: Self select doctor */}
                                <div className="col-md-6">
                                    <label
                                        className={clsx(
                                            styles.doctorItem,
                                            'service-item',
                                            doctorSelectionMode === 'self' && 'active',
                                            totalDoctors === 0 &&
                                                !isLoadingDoctors &&
                                                styles.disabled
                                        )}
                                        htmlFor="doctorSelectionModeSelf"
                                    >
                                        <input
                                            id="doctorSelectionModeSelf"
                                            className="form-check-input ms-0 mt-0"
                                            type="radio"
                                            name="doctorSelectionMode"
                                            checked={doctorSelectionMode === 'self'}
                                            onChange={() => handleDoctorSelectionModeChange('self')}
                                            disabled={totalDoctors === 0 && !isLoadingDoctors}
                                        />
                                        <span className="form-check-label ms-2">
                                            <span className="d-flex align-items-center">
                                                <span className="avatar avatar-md me-2 bg-light rounded-circle d-flex align-items-center justify-content-center">
                                                    <i
                                                        className="isax isax-user-search text-primary"
                                                        aria-hidden="true"
                                                    ></i>
                                                </span>
                                                <span>
                                                    <span className="service-title d-block mb-1">
                                                        Tự chọn bác sĩ
                                                    </span>
                                                    <span className="fs-14 text-muted">
                                                        {getDoctorCountText()}
                                                    </span>
                                                </span>
                                            </span>
                                        </span>
                                    </label>
                                </div>
                            </div>

                            {/* Doctor List - Only show when self select mode is chosen */}
                            {doctorSelectionMode === 'self' && (
                                <>
                                    {isLoadingDoctors ? (
                                        <div className="mt-3 pt-3 border-top">
                                            {/* Doctor List Skeleton */}
                                            <div className="row">
                                                {[1, 2, 3, 4, 5, 6].map((index) => (
                                                    <div
                                                        key={index}
                                                        className="col-md-6 col-lg-4 mb-3"
                                                    >
                                                        <div className="card h-100">
                                                            <div className="card-body p-3">
                                                                <div className="d-flex align-items-start">
                                                                    <Skeleton
                                                                        variant="circular"
                                                                        width={60}
                                                                        height={60}
                                                                    />
                                                                    <div className="ms-3 flex-grow-1">
                                                                        <Skeleton
                                                                            variant="text"
                                                                            width="80%"
                                                                            height={22}
                                                                        />
                                                                        <Skeleton
                                                                            variant="text"
                                                                            width="60%"
                                                                            height={18}
                                                                        />
                                                                        <Skeleton
                                                                            variant="text"
                                                                            width="40%"
                                                                            height={16}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="mt-3">
                                                                    <Skeleton
                                                                        variant="text"
                                                                        width="50%"
                                                                        height={16}
                                                                    />
                                                                    <Skeleton
                                                                        variant="text"
                                                                        width="70%"
                                                                        height={16}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : totalDoctors > 0 || hasAppliedFilters ? (
                                        <div
                                            className={clsx(
                                                styles.doctorListWrapper,
                                                'mt-3 pt-3 border-top'
                                            )}
                                        >
                                            {/* Filter Section */}
                                            <div className="mb-3">
                                                <div className="d-flex align-items-center justify-content-between mb-2">
                                                    <p className="text-muted fs-14 mb-0">
                                                        <i className="isax isax-info-circle me-1"></i>
                                                        {doctors.length > 0
                                                            ? 'Chọn bác sĩ bạn muốn khám'
                                                            : 'Không tìm thấy bác sĩ phù hợp'}
                                                    </p>
                                                    <button
                                                        className="btn btn-sm btn-outline-primary"
                                                        onClick={() => setShowFilters(!showFilters)}
                                                    >
                                                        <i className={`isax isax-filter me-1`}></i>
                                                        Bộ lọc
                                                        {hasActiveFilters && (
                                                            <span className="badge bg-primary ms-1">
                                                                !
                                                            </span>
                                                        )}
                                                    </button>
                                                </div>

                                                {/* Filter Panel */}
                                                {showFilters && (
                                                    <div className="card card-body bg-light mb-3">
                                                        <div className="row g-2">
                                                            {/* Search */}
                                                            <div className="col-md-6">
                                                                <input
                                                                    type="text"
                                                                    className="form-control form-control-sm"
                                                                    placeholder="Tìm theo tên bác sĩ..."
                                                                    value={filters.searchTerm}
                                                                    onChange={(e) =>
                                                                        handleFilterChange(
                                                                            'searchTerm',
                                                                            e.target.value
                                                                        )
                                                                    }
                                                                />
                                                            </div>

                                                            {/* Price Range */}
                                                            <div className="col-md-6">
                                                                <Select
                                                                    title="Tất cả mức giá"
                                                                    value={
                                                                        filters.minPrice === 0 &&
                                                                        filters.maxPrice === 300000
                                                                            ? 'low'
                                                                            : filters.minPrice ===
                                                                                    300000 &&
                                                                                filters.maxPrice ===
                                                                                    500000
                                                                              ? 'medium'
                                                                              : filters.minPrice ===
                                                                                      500000 &&
                                                                                  filters.maxPrice ===
                                                                                      undefined
                                                                                ? 'high'
                                                                                : ''
                                                                    }
                                                                    onChange={(value) => {
                                                                        if (value === '') {
                                                                            handleFilterChange(
                                                                                'minPrice',
                                                                                undefined
                                                                            );
                                                                            handleFilterChange(
                                                                                'maxPrice',
                                                                                undefined
                                                                            );
                                                                        } else if (
                                                                            value === 'low'
                                                                        ) {
                                                                            handleFilterChange(
                                                                                'minPrice',
                                                                                0
                                                                            );
                                                                            handleFilterChange(
                                                                                'maxPrice',
                                                                                300000
                                                                            );
                                                                        } else if (
                                                                            value === 'medium'
                                                                        ) {
                                                                            handleFilterChange(
                                                                                'minPrice',
                                                                                300000
                                                                            );
                                                                            handleFilterChange(
                                                                                'maxPrice',
                                                                                500000
                                                                            );
                                                                        } else if (
                                                                            value === 'high'
                                                                        ) {
                                                                            handleFilterChange(
                                                                                'minPrice',
                                                                                500000
                                                                            );
                                                                            handleFilterChange(
                                                                                'maxPrice',
                                                                                undefined
                                                                            );
                                                                        }
                                                                    }}
                                                                    items={[
                                                                        {
                                                                            label: 'Tất cả mức giá',
                                                                            value: '',
                                                                        },
                                                                        {
                                                                            label: 'Dưới 300K',
                                                                            value: 'low',
                                                                        },
                                                                        {
                                                                            label: '300K - 500K',
                                                                            value: 'medium',
                                                                        },
                                                                        {
                                                                            label: 'Trên 500K',
                                                                            value: 'high',
                                                                        },
                                                                    ]}
                                                                />
                                                            </div>

                                                            {/* Rating */}
                                                            <div className="col-md-6">
                                                                <Select
                                                                    title="Tất cả đánh giá"
                                                                    value={
                                                                        filters.minRating?.toString() ||
                                                                        ''
                                                                    }
                                                                    onChange={(value) =>
                                                                        handleFilterChange(
                                                                            'minRating',
                                                                            value
                                                                                ? Number(value)
                                                                                : undefined
                                                                        )
                                                                    }
                                                                    items={[
                                                                        {
                                                                            label: 'Tất cả đánh giá',
                                                                            value: '',
                                                                        },
                                                                        {
                                                                            label: '4+ sao',
                                                                            value: '4',
                                                                        },
                                                                        {
                                                                            label: '3+ sao',
                                                                            value: '3',
                                                                        },
                                                                        {
                                                                            label: '2+ sao',
                                                                            value: '2',
                                                                        },
                                                                    ]}
                                                                />
                                                            </div>

                                                            {/* Experience */}
                                                            <div className="col-md-6">
                                                                <Select
                                                                    title="Tất cả kinh nghiệm"
                                                                    value={
                                                                        filters.minExperience ===
                                                                            1 &&
                                                                        filters.maxExperience === 3
                                                                            ? '1-3'
                                                                            : filters.minExperience ===
                                                                                    4 &&
                                                                                filters.maxExperience ===
                                                                                    7
                                                                              ? '4-7'
                                                                              : filters.minExperience ===
                                                                                      8 &&
                                                                                  filters.maxExperience ===
                                                                                      undefined
                                                                                ? '8+'
                                                                                : ''
                                                                    }
                                                                    onChange={(value) => {
                                                                        if (value === '') {
                                                                            handleFilterChange(
                                                                                'minExperience',
                                                                                undefined
                                                                            );
                                                                            handleFilterChange(
                                                                                'maxExperience',
                                                                                undefined
                                                                            );
                                                                        } else if (
                                                                            value === '1-3'
                                                                        ) {
                                                                            handleFilterChange(
                                                                                'minExperience',
                                                                                1
                                                                            );
                                                                            handleFilterChange(
                                                                                'maxExperience',
                                                                                3
                                                                            );
                                                                        } else if (
                                                                            value === '4-7'
                                                                        ) {
                                                                            handleFilterChange(
                                                                                'minExperience',
                                                                                4
                                                                            );
                                                                            handleFilterChange(
                                                                                'maxExperience',
                                                                                7
                                                                            );
                                                                        } else if (value === '8+') {
                                                                            handleFilterChange(
                                                                                'minExperience',
                                                                                8
                                                                            );
                                                                            handleFilterChange(
                                                                                'maxExperience',
                                                                                undefined
                                                                            );
                                                                        }
                                                                    }}
                                                                    items={[
                                                                        {
                                                                            label: 'Tất cả kinh nghiệm',
                                                                            value: '',
                                                                        },
                                                                        {
                                                                            label: '1-3 năm',
                                                                            value: '1-3',
                                                                        },
                                                                        {
                                                                            label: '4-7 năm',
                                                                            value: '4-7',
                                                                        },
                                                                        {
                                                                            label: '8+ năm',
                                                                            value: '8+',
                                                                        },
                                                                    ]}
                                                                />
                                                            </div>

                                                            {/* Gender */}
                                                            <div className="col-md-6">
                                                                <Select
                                                                    title="Tất cả giới tính"
                                                                    value={filters.gender || ''}
                                                                    onChange={(value) =>
                                                                        handleFilterChange(
                                                                            'gender',
                                                                            value || undefined
                                                                        )
                                                                    }
                                                                    items={[
                                                                        {
                                                                            label: 'Tất cả giới tính',
                                                                            value: '',
                                                                        },
                                                                        {
                                                                            label: 'Nam',
                                                                            value: 'MALE',
                                                                        },
                                                                        {
                                                                            label: 'Nữ',
                                                                            value: 'FEMALE',
                                                                        },
                                                                    ]}
                                                                />
                                                            </div>

                                                            {/* Language */}
                                                            <div className="col-md-6">
                                                                <Select
                                                                    title="Tất cả ngôn ngữ"
                                                                    value={filters.language || ''}
                                                                    onChange={(value) =>
                                                                        handleFilterChange(
                                                                            'language',
                                                                            value || undefined
                                                                        )
                                                                    }
                                                                    items={[
                                                                        {
                                                                            label: 'Tất cả ngôn ngữ',
                                                                            value: '',
                                                                        },
                                                                        ...availableLanguages.map(
                                                                            (lang) => ({
                                                                                label: lang.name,
                                                                                value: lang.name,
                                                                            })
                                                                        ),
                                                                    ]}
                                                                />
                                                            </div>
                                                        </div>

                                                        {/* Reset button */}
                                                        {hasActiveFilters && (
                                                            <div className="mt-2 text-end">
                                                                <button
                                                                    className="btn btn-sm btn-link text-danger p-0"
                                                                    onClick={handleResetFilters}
                                                                >
                                                                    <i className="isax isax-refresh me-1"></i>
                                                                    Xóa bộ lọc
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Filter result count */}
                                                {hasAppliedFilters && (
                                                    <p className="text-muted fs-13 mb-2">
                                                        Tìm thấy {totalDoctors} bác sĩ phù hợp
                                                    </p>
                                                )}
                                            </div>
                                            <div className="row">
                                                {doctors.map((doctor: DoctorForSelection) => (
                                                    <div
                                                        key={doctor.id}
                                                        className="col-lg-6 col-md-6 mb-3"
                                                    >
                                                        <label
                                                            className={clsx(
                                                                styles.doctorCard,
                                                                'service-item',
                                                                selectedDoctor === doctor.id &&
                                                                    'active'
                                                            )}
                                                            htmlFor={`doctorSelection-${doctor.id}`}
                                                            aria-label={`Chọn bác sĩ ${doctor.fullName}`}
                                                        >
                                                            <input
                                                                id={`doctorSelection-${doctor.id}`}
                                                                className="form-check-input ms-0 mt-0"
                                                                type="radio"
                                                                name="doctorSelection"
                                                                checked={
                                                                    selectedDoctor === doctor.id
                                                                }
                                                                onChange={() =>
                                                                    handleDoctorSelect(doctor.id)
                                                                }
                                                            />
                                                            <span className="form-check-label ms-2 flex-grow-1">
                                                                <div className="d-flex">
                                                                    {/* Avatar */}
                                                                    <div
                                                                        className={
                                                                            styles.doctorAvatar
                                                                        }
                                                                    >
                                                                        <img
                                                                            src={
                                                                                doctor.avatarUrl ||
                                                                                '/assets/img/doctor-placeholder.png'
                                                                            }
                                                                            alt={doctor.fullName}
                                                                            className="rounded-circle"
                                                                        />
                                                                    </div>

                                                                    {/* Info */}
                                                                    <div
                                                                        className={
                                                                            styles.doctorInfo
                                                                        }
                                                                    >
                                                                        {/* Line 1: Name + Rating */}
                                                                        <div className="d-flex align-items-center gap-2 mb-1">
                                                                            <span
                                                                                className={
                                                                                    styles.doctorName
                                                                                }
                                                                            >
                                                                                BS.{' '}
                                                                                {doctor.fullName}
                                                                            </span>
                                                                            <span className="text-warning fs-13">
                                                                                <i className="fa-solid fa-star me-1"></i>
                                                                                {doctor.rating !==
                                                                                    undefined &&
                                                                                doctor.rating > 0
                                                                                    ? doctor.rating.toFixed(
                                                                                          1
                                                                                      )
                                                                                    : '0'}
                                                                                <span className="text-muted ms-1">
                                                                                    (
                                                                                    {doctor.totalReviews ??
                                                                                        0}
                                                                                    )
                                                                                </span>
                                                                            </span>
                                                                        </div>

                                                                        {/* Line 2: Position + Specialty */}
                                                                        <div className="text-muted fs-13 mb-1">
                                                                            <i className="isax isax-health me-1"></i>
                                                                            {[
                                                                                doctor.positionName,
                                                                                doctor.specialtyName,
                                                                            ]
                                                                                .filter(Boolean)
                                                                                .join(' - ') ||
                                                                                'Chưa cập nhật'}
                                                                        </div>

                                                                        {/* Line 3: Languages */}
                                                                        {doctor.languages &&
                                                                            doctor.languages
                                                                                .length > 0 && (
                                                                                <div className="text-muted fs-13 mb-1">
                                                                                    <i className="isax isax-translate me-1"></i>
                                                                                    {doctor.languages.join(
                                                                                        ', '
                                                                                    )}
                                                                                </div>
                                                                            )}

                                                                        {/* Line 4: Experience */}
                                                                        {doctor.yearsOfExperience !==
                                                                            undefined &&
                                                                            doctor.yearsOfExperience >
                                                                                0 && (
                                                                                <div className="text-muted fs-13 mb-1">
                                                                                    <i className="isax isax-briefcase me-1"></i>
                                                                                    {
                                                                                        doctor.yearsOfExperience
                                                                                    }{' '}
                                                                                    năm kinh nghiệm
                                                                                </div>
                                                                            )}

                                                                        {/* Line 5: Price */}
                                                                        {doctor.consultationFee !==
                                                                            undefined &&
                                                                            doctor.consultationFee >
                                                                                0 && (
                                                                                <div className="text-success fw-medium fs-13">
                                                                                    <i className="isax isax-money me-1"></i>
                                                                                    {doctor.consultationFee.toLocaleString(
                                                                                        'vi-VN'
                                                                                    )}
                                                                                    đ
                                                                                </div>
                                                                            )}
                                                                    </div>
                                                                </div>
                                                            </span>
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* No results after filtering */}
                                            {doctors.length === 0 && hasAppliedFilters && (
                                                <div className="alert alert-info mb-3">
                                                    <i className="isax isax-info-circle me-2"></i>
                                                    Không tìm thấy bác sĩ phù hợp với bộ lọc. Hãy
                                                    thử điều chỉnh bộ lọc hoặc{' '}
                                                    <button
                                                        className="btn btn-link p-0 text-primary"
                                                        onClick={handleResetFilters}
                                                    >
                                                        xóa bộ lọc
                                                    </button>
                                                    .
                                                </div>
                                            )}

                                            {/* Pagination */}
                                            {totalPages > 1 && (
                                                <div className="border-top mb-3">
                                                    <div className="d-flex justify-content-center">
                                                        <Pagination
                                                            currentPage={currentPage}
                                                            totalPages={totalPages}
                                                            onPageChange={handlePageChange}
                                                            maxVisiblePages={5}
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            {/* Hint when no doctor selected yet */}
                                            {!selectedDoctor && doctors.length > 0 && (
                                                <div className="alert alert-warning mb-3 mt-2">
                                                    <i className="isax isax-info-circle me-2"></i>
                                                    Vui lòng chọn một bác sĩ hoặc quay lại chọn "Để
                                                    bệnh viện phân công"
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="alert alert-info mb-0">
                                            <i className="isax isax-info-circle me-2"></i>
                                            Không tìm thấy bác sĩ phù hợp. Vui lòng chọn "Để bệnh
                                            viện phân công".
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </BookingSectionWrapper>
    );
};

export default AppointmentTypeSection;
