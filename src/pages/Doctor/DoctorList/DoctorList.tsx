import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SideBar from './components/SideBar';
import {
    DoctorAppointmentBookingCard,
    DoctorAppointmentBookingCardSkeleton,
} from './components/DoctorAppointmentBookingCard';
import Pagination from '@/components/Pagination';
import Select from '@/components/Select';
import styles from './DoctorList.module.scss';
import MainLayout from '@/layouts/MainLayout';
import Breadcrumb from '@/components/Breadcrumb';
import browseCategorie from '@/assets/img/icons/browse-categorie.svg';
import SearchInput from '@/components/SearchInput';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { searchDoctorsAsync, filterDoctorsAsync } from '@/store/slices/doctorSlice';
import { Status, Gender } from '@/enums/common.enums';

// Import images
import docProfile01 from '@/assets/img/doctor-grid/doctor-grid-01.jpg';

// Mock data removed - using Redux data from backend

const breadcrumbData = {
    title: 'Danh sách bác sĩ',
    items: [
        { label: 'Trang chủ', path: '/', isActive: false },
        { label: 'Danh sách bác sĩ', isActive: true },
    ],
};

const DoctorList: React.FC = () => {
    const dispatch = useAppDispatch();
    const { doctors, isLoading, pagination, error } = useAppSelector((state) => state.doctor);
    const { languages } = useAppSelector((state) => state.language);
    const { serviceTypes } = useAppSelector((state) => state.serviceType);

    const [sortOption, setSortOption] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [specialtyFilter, setSpecialtyFilter] = useState('');
    const [specialtyFilters, setSpecialtyFilters] = useState<string[]>([]);
    const [hospitalFilter, setHospitalFilter] = useState('');
    const [hospitalFilters, setHospitalFilters] = useState<string[]>([]);
    const [positionFilter, setPositionFilter] = useState('');
    const [positionFilters, setPositionFilters] = useState<string[]>([]);
    const [languageFilter, setLanguageFilter] = useState('');
    const [languageFilters, setLanguageFilters] = useState<string[]>([]);
    const [serviceTypeFilter, setServiceTypeFilter] = useState('');
    const [serviceTypeFilters, setServiceTypeFilters] = useState<string[]>([]);
    const [ratingFilter, setRatingFilter] = useState<number | undefined>(undefined);
    const [ratingFilters, setRatingFilters] = useState<number[]>([]);
    const [experienceFilter, setExperienceFilter] = useState<
        { min: number; max: number } | undefined
    >(undefined); // Changed to slider format like price
    const [experienceFilters, setExperienceFilters] = useState<
        { MinYears: number; MaxYears: number }[]
    >([]); // Keep for backward compatibility
    const [availabilityFilter, setAvailabilityFilter] = useState('');
    const [consultationTypeFilter, setConsultationTypeFilter] = useState('');
    const [genderFilter, setGenderFilter] = useState<Gender | undefined>(undefined);
    const [genderFilters, setGenderFilters] = useState<string[]>([]);
    const [priceFilter, setPriceFilter] = useState<{ min: number; max: number } | undefined>(
        undefined
    );
    const [areaFilter, setAreaFilter] = useState<
        | {
              provinceId?: string;
              districtId?: string;
              provinceName?: string;
              districtName?: string;
          }
        | undefined
    >(undefined);

    const doctorsPerPage = 10;
    const patientId = '2FC80E8F-D296-42BC-ADDF-EAA6281BF244'; // Valid GUID format
    const skeletonKeys = Array.from({ length: 10 }, (_, i) => `skeleton-${i}`);

    const sortOptions = [
        { label: 'Giá từ thấp đến cao', value: 'low-to-high' },
        { label: 'Giá từ cao đến thấp', value: 'high-to-low' },
    ];

    // Helper function to get trimmed string or undefined
    const getTrimmedString = (value: string | undefined): string | undefined => {
        return value?.trim() || undefined;
    };

    // Helper function to get array or undefined if empty
    const getArrayOrUndefined = (arr: any[]): any[] | undefined => {
        return arr.length > 0 ? arr : undefined;
    };

    // Helper function to build basic filter parameters
    const buildBasicFilters = () => ({
        pageNumber: currentPage,
        pageSize: doctorsPerPage,
        searchTerm: getTrimmedString(searchTerm),
        ratingFilter: ratingFilter,
        genderFilter: genderFilter,
        experienceRange: experienceFilter,
        priceRange: priceFilter,
        areaFilter: areaFilter,
        patientId,
    });

    // Helper function to build string filter parameters
    const buildStringFilters = () => ({
        specialtyFilter: getTrimmedString(specialtyFilter),
        hospitalFilter: getTrimmedString(hospitalFilter),
        positionFilter: getTrimmedString(positionFilter),
        languageFilter: getTrimmedString(languageFilter),
        serviceTypeFilter: getTrimmedString(serviceTypeFilter),
        availabilityFilter: getTrimmedString(availabilityFilter),
        consultationTypeFilter: getTrimmedString(consultationTypeFilter),
    });

    // Helper function to build array filter parameters
    const buildArrayFilters = () => ({
        specialtyFilters: getArrayOrUndefined(specialtyFilters),
        hospitalFilters: getArrayOrUndefined(hospitalFilters),
        positionFilters: getArrayOrUndefined(positionFilters),
        languageFilters: getArrayOrUndefined(languageFilters),
        serviceTypeFilters: getArrayOrUndefined(serviceTypeFilters),
        ratingFilters: getArrayOrUndefined(ratingFilters),
        experienceFilters: getArrayOrUndefined(experienceFilters),
        genderFilters: getArrayOrUndefined(genderFilters),
    });

    // Helper function to build search parameters
    const buildSearchParams = () => {
        return {
            ...buildBasicFilters(),
            ...buildStringFilters(),
            ...buildArrayFilters(),
        };
    };

    // Helper function to check if advanced filtering is needed
    const shouldUseAdvancedFiltering = () => {
        return (
            positionFilters.length > 0 ||
            languageFilters.length > 0 ||
            serviceTypeFilters.length > 0 ||
            ratingFilters.length > 0 ||
            experienceFilters.length > 0 ||
            genderFilters.length > 0 ||
            specialtyFilters.length > 0 ||
            hospitalFilters.length > 0 ||
            experienceFilter ||
            priceFilter ||
            areaFilter
        );
    };

    // Helper function to render doctor list content
    const renderDoctorListContent = () => {
        if (isLoading) {
            return skeletonKeys.map((key) => (
                <div className="col-md-12 mb-4" key={key}>
                    <DoctorAppointmentBookingCardSkeleton />
                </div>
            ));
        }

        if (filteredAndSortedDoctors.length === 0) {
            return (
                <div className="col-md-12 mb-4">
                    <div className="text-center py-5">
                        <h4>Không tìm thấy bác sĩ nào</h4>
                        <p>Vui lòng thử lại với từ khóa khác hoặc bộ lọc khác.</p>
                        {(searchTerm ||
                            specialtyFilters.length > 0 ||
                            hospitalFilters.length > 0 ||
                            areaFilter) && (
                            <div className="mt-3">
                                <button
                                    className="btn btn-outline-primary"
                                    onClick={() => {
                                        setSearchTerm('');
                                        setSpecialtyFilters([]);
                                        setHospitalFilters([]);
                                        setAreaFilter(undefined);
                                        setCurrentPage(1);
                                    }}
                                >
                                    Xóa tất cả bộ lọc
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        return filteredAndSortedDoctors.map((doctor) => (
            <DoctorAppointmentBookingCard
                key={doctor.id}
                doctorId={doctor.id}
                patientId={patientId}
                name={`${doctor.firstName} ${doctor.lastName}`}
                specialty={doctor.specialty?.name || 'Chưa cập nhật'}
                position={doctor.position?.name || 'Chưa cập nhật'}
                prices={
                    doctor.prices?.map((price) => ({
                        id: price.id,
                        serviceTypeId: price.serviceTypeId,
                        serviceTypeName: price.serviceTypeName,
                        amount: price.amount,
                    })) || []
                }
                rating={doctor.reviewStatistics?.averageRating || 0}
                location={doctor.hospital?.name || doctor.address || 'Chưa cập nhật'}
                yearsOfExperience={doctor.yearsOfExperience}
                isFavorite={doctor.isFavorited}
                languages={doctor.languages || []}
                image={doctor.avatarUrl || docProfile01}
                serviceTypeFilters={serviceTypeFilters}
            />
        ));
    };

    // Load doctors on component mount and when filters change
    useEffect(() => {
        const params = buildSearchParams();

        if (shouldUseAdvancedFiltering()) {
            dispatch(filterDoctorsAsync(params));
        } else {
            dispatch(searchDoctorsAsync(params));
        }
    }, [
        dispatch,
        currentPage,
        searchTerm,
        specialtyFilter,
        specialtyFilters,
        hospitalFilter,
        hospitalFilters,
        positionFilter,
        positionFilters,
        languageFilter,
        languageFilters,
        serviceTypeFilter,
        serviceTypeFilters,
        ratingFilter,
        ratingFilters,
        experienceFilter,
        experienceFilters,
        availabilityFilter,
        consultationTypeFilter,
        genderFilter,
        genderFilters,
        priceFilter,
        areaFilter,
    ]);

    // Helper function to check if doctor passes availability filter
    const passesAvailabilityFilter = (doctor: any) => {
        if (!availabilityFilter) return true;
        return doctor.status === Status.ACTIVE;
    };

    // Helper function to check if doctor passes consultation type filter
    const passesConsultationTypeFilter = (doctor: any) => {
        if (!consultationTypeFilter) return true;
        return doctor.prices && doctor.prices.length > 0;
    };

    // Helper function to check if doctor passes price filter
    const passesPriceFilter = (doctor: any) => {
        if (!priceFilter) return true;
        const doctorPrice = doctor.prices?.[0]?.amount || 0;
        return doctorPrice >= priceFilter.min && doctorPrice <= priceFilter.max;
    };

    // Helper function to get doctor price
    const getDoctorPrice = (doctor: any) => {
        return doctor.prices?.[0]?.amount || 0;
    };

    // Helper function to sort doctors by price
    const sortDoctorsByPrice = (a: any, b: any, order: 'low-to-high' | 'high-to-low') => {
        const priceA = getDoctorPrice(a);
        const priceB = getDoctorPrice(b);

        // Doctors without prices go to the end
        if (priceA === 0 && priceB > 0) return 1;
        if (priceB === 0 && priceA > 0) return -1;

        return order === 'low-to-high' ? priceA - priceB : priceB - priceA;
    };

    // Use doctors directly from API - backend handles filtering and pagination
    // Only apply local filters that are not handled by backend
    const filteredAndSortedDoctors = [...doctors]
        .filter((doctor) => {
            return (
                passesAvailabilityFilter(doctor) &&
                passesConsultationTypeFilter(doctor) &&
                passesPriceFilter(doctor)
            );
        })
        .sort((a, b) => {
            if (sortOption === 'low-to-high') {
                return sortDoctorsByPrice(a, b, 'low-to-high');
            } else if (sortOption === 'high-to-low') {
                return sortDoctorsByPrice(a, b, 'high-to-low');
            }
            return 0;
        });

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleSortChange = (value: string) => {
        setSortOption(value);
    };

    // Callback functions for SearchInput and SideBar
    const handleSearchChange = (term: string) => {
        setSearchTerm(term);
        setCurrentPage(1); // Reset to first page when searching
    };

    const handleSpecialtyFilter = (specialtyId: string) => {
        setSpecialtyFilter(specialtyId);
        setCurrentPage(1);
    };

    const handleSpecialtyFilters = (specialtyIds: string[]) => {
        setSpecialtyFilters(specialtyIds);
        setCurrentPage(1);
    };

    const handlePositionFilter = (positionId: string) => {
        setPositionFilter(positionId);
        setCurrentPage(1);
    };

    const handleLanguageFilter = (languageId: string) => {
        setLanguageFilter(languageId);
        setCurrentPage(1);
    };

    const handleServiceTypeFilter = (serviceTypeId: string) => {
        setServiceTypeFilter(serviceTypeId);
        setCurrentPage(1);
    };

    const handleHospitalFilter = (hospitalId: string) => {
        setHospitalFilter(hospitalId);
        setSpecialtyFilter(''); // Clear specialty filter when hospital is selected
        setCurrentPage(1);
    };

    const handleHospitalFilters = (hospitalIds: string[]) => {
        setHospitalFilters(hospitalIds);
        setCurrentPage(1);
    };

    const handleAreaFilter = (areaInfo: {
        provinceId?: string;
        districtId?: string;
        provinceName?: string;
        districtName?: string;
    }) => {
        setAreaFilter(areaInfo);
        setCurrentPage(1);
    };

    const handleRatingFilter = (rating: string) => {
        if (rating) {
            // Map rating IDs to numbers: sm46=5, sm47=4, sm48=3, sm49=2, sm50=1
            const ratingMap: { [key: string]: number } = {
                'checkebox-sm46': 5,
                'checkebox-sm47': 4,
                'checkebox-sm48': 3,
                'checkebox-sm49': 2,
                'checkebox-sm50': 1,
            };
            setRatingFilter(ratingMap[rating]);
        } else {
            setRatingFilter(undefined);
        }
        setCurrentPage(1);
    };

    const handleAvailabilityFilter = (availability: string) => {
        setAvailabilityFilter(availability);
        setCurrentPage(1);
    };

    const handleConsultationTypeFilter = (consultationType: string) => {
        setConsultationTypeFilter(consultationType);
        setCurrentPage(1);
    };

    const handleGenderFilter = (gender: string) => {
        if (gender) {
            // Map gender IDs to Gender enum values
            const genderMap: { [key: string]: Gender } = {
                'checkebox-sm14': Gender.MALE,
                'checkebox-sm15': Gender.FEMALE,
                'checkebox-sm16': Gender.OTHER,
            };
            setGenderFilter(genderMap[gender]);
        } else {
            setGenderFilter(undefined);
        }
        setCurrentPage(1);
    };

    const handlePriceFilter = (priceRange: { min: number; max: number }) => {
        setPriceFilter(priceRange);
        setCurrentPage(1);
    };

    const handleExperienceFilter = (experienceRange: { min: number; max: number }) => {
        setExperienceFilter(experienceRange);
        setCurrentPage(1);
    };

    // Multi-filter callback functions
    const handlePositionFilters = (positionIds: string[]) => {
        setPositionFilters(positionIds);
        setCurrentPage(1);
    };

    const handleLanguageFilters = (languageIds: string[]) => {
        // Convert language IDs to names using Redux store
        const languageNames = languageIds.map((id) => {
            const language = languages.find((lang) => lang.id === id);
            return language ? language.name : id;
        });
        setLanguageFilters(languageNames);
        setCurrentPage(1);
    };

    const handleServiceTypeFilters = (serviceTypeIds: string[]) => {
        // Convert service type IDs to names using Redux store
        const serviceTypeNames = serviceTypeIds.map((id) => {
            const serviceType = serviceTypes.find((st) => st.id === id);
            return serviceType ? serviceType.name : id;
        });
        setServiceTypeFilters(serviceTypeNames);
        setCurrentPage(1);
    };

    const handleRatingFilters = (ratings: string[]) => {
        if (ratings.length > 0) {
            // Convert rating strings to numbers
            setRatingFilters(
                ratings
                    .map((rating) => Number.parseInt(rating))
                    .filter((rating) => !Number.isNaN(rating))
            );
        } else {
            setRatingFilters([]);
        }
        setCurrentPage(1);
    };

    const handleExperienceFilters = (experiences: any[]) => {
        if (experiences.length > 0) {
            // Filter valid experience ranges
            const validExperiences = experiences.filter((exp) => {
                // Check if it's a valid experience range object
                if (
                    typeof exp === 'object' &&
                    exp !== null &&
                    typeof exp.MinYears === 'number' &&
                    typeof exp.MaxYears === 'number'
                ) {
                    return true;
                }
                console.warn('DoctorList: invalid experience range:', exp);
                return false;
            });

            setExperienceFilters(validExperiences);
        } else {
            setExperienceFilters([]);
        }
        setCurrentPage(1);
    };

    const handleGenderFilters = (genders: string[]) => {
        if (genders.length > 0) {
            // Keep gender strings as they are (MALE, FEMALE, OTHER)
            // Backend expects string values, not enum

            setGenderFilters(genders);
        } else {
            setGenderFilters([]);
        }
        setCurrentPage(1);
    };

    return (
        <MainLayout>
            <Breadcrumb items={breadcrumbData.items} title={breadcrumbData.title} />
            <div className="container">
                <SearchInput
                    onSearchChange={handleSearchChange}
                    onSpecialtyFilter={handleSpecialtyFilter}
                    onSpecialtyFilters={handleSpecialtyFilters}
                    onHospitalFilter={handleHospitalFilter}
                    onHospitalFilters={handleHospitalFilters}
                    onAreaFilter={handleAreaFilter}
                />
            </div>
            <div className="content mt-5">
                <div className="container">
                    <div className="row">
                        <SideBar
                            onSearchChange={handleSearchChange}
                            onSpecialtyFilter={handleSpecialtyFilter}
                            onPositionFilter={handlePositionFilter}
                            onPositionFilters={handlePositionFilters}
                            onLanguageFilter={handleLanguageFilter}
                            onLanguageFilters={handleLanguageFilters}
                            onServiceTypeFilter={handleServiceTypeFilter}
                            onServiceTypeFilters={handleServiceTypeFilters}
                            onRatingFilter={handleRatingFilter}
                            onRatingFilters={handleRatingFilters}
                            onExperienceFilter={handleExperienceFilter}
                            onExperienceFilters={handleExperienceFilters}
                            onAvailabilityFilter={handleAvailabilityFilter}
                            onConsultationTypeFilter={handleConsultationTypeFilter}
                            onGenderFilter={handleGenderFilter}
                            onGenderFilters={handleGenderFilters}
                            onPriceFilter={handlePriceFilter}
                        />
                        <div className="col-xl-9">
                            <div className="card">
                                <div className="card-body">
                                    <div
                                        className={`${styles.filterContainer} d-flex align-items-center justify-content-between result-wrap`}
                                    >
                                        <h5 className={styles.h5Custom}>
                                            Hiển thị{' '}
                                            <span className={styles.spanCustom}>
                                                {pagination.totalCount}
                                            </span>{' '}
                                            Bác sĩ Dành Cho Bạn
                                        </h5>
                                        <div className="d-flex align-items-center gap-3">
                                            <Select
                                                title="Sắp xếp theo"
                                                value={sortOption}
                                                onChange={handleSortChange}
                                                items={sortOptions}
                                                image={browseCategorie}
                                            />
                                            <Link
                                                to="/doctor-grid"
                                                className={`${styles.headIcon} ${styles.active}`}
                                            >
                                                <i className="isax isax-grid-7"></i>
                                            </Link>
                                            <Link to="/search-2" className={`${styles.headIcon}`}>
                                                <i className="isax isax-row-vertical"></i>
                                            </Link>
                                            <Link to="/map-list" className={`${styles.headIcon}`}>
                                                <i className="isax isax-location"></i>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                {error ? (
                                    <div className="col-md-12 mb-4">
                                        <div
                                            className="alert alert-danger border-0 shadow-sm rounded-3"
                                            role="alert"
                                        >
                                            <div className="d-flex align-items-center mb-3">
                                                <div className="flex-shrink-0 me-3">
                                                    <i className="fas fa-exclamation-triangle fs-2 text-danger"></i>
                                                </div>
                                                <div className="flex-grow-1">
                                                    <h4 className="alert-heading mb-1 fw-bold">
                                                        Không thể tải dữ liệu
                                                    </h4>
                                                    <p className="mb-0 text-muted">{error}</p>
                                                </div>
                                            </div>
                                            <hr className="my-3" />
                                            <div className="d-flex gap-2 flex-wrap">
                                                <button
                                                    className="btn btn-primary btn-sm px-3 py-2 rounded-pill fw-semibold"
                                                    onClick={() => globalThis.location.reload()}
                                                >
                                                    <i className="fas fa-redo-alt me-2"></i>
                                                    {'Thử lại'}
                                                </button>
                                                <button
                                                    className="btn btn-outline-secondary btn-sm px-3 py-2 rounded-pill fw-semibold"
                                                    onClick={() => globalThis.history.back()}
                                                >
                                                    <i className="fas fa-arrow-left me-2"></i>
                                                    {'Quay lại'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    renderDoctorListContent()
                                )}
                                {pagination.totalCount > pagination.pageSize && (
                                    <div className="col-md-12">
                                        <Pagination
                                            currentPage={currentPage}
                                            totalPages={pagination.totalPages}
                                            onPageChange={handlePageChange}
                                            showPrevNext={true}
                                            maxVisiblePages={5}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default DoctorList;
