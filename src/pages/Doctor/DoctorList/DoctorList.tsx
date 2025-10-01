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
    const [hospitalFilter, setHospitalFilter] = useState('');
    const [positionFilter, setPositionFilter] = useState('');
    const [positionFilters, setPositionFilters] = useState<string[]>([]);
    const [languageFilter, setLanguageFilter] = useState('');
    const [languageFilters, setLanguageFilters] = useState<string[]>([]);
    const [serviceTypeFilter, setServiceTypeFilter] = useState('');
    const [serviceTypeFilters, setServiceTypeFilters] = useState<string[]>([]);
    const [ratingFilter, setRatingFilter] = useState<number | undefined>(undefined);
    const [ratingFilters, setRatingFilters] = useState<number[]>([]);
    const [experienceFilter, setExperienceFilter] = useState('');
    const [experienceFilters, setExperienceFilters] = useState<
        { MinYears: number; MaxYears: number }[]
    >([]);
    const [availabilityFilter, setAvailabilityFilter] = useState('');
    const [consultationTypeFilter, setConsultationTypeFilter] = useState('');
    const [genderFilter, setGenderFilter] = useState<Gender | undefined>(undefined);
    const [genderFilters, setGenderFilters] = useState<string[]>([]);
    const [priceFilter, setPriceFilter] = useState<{ min: number; max: number } | undefined>(
        undefined
    );

    const doctorsPerPage = 10;
    const patientId = '2FC80E8F-D296-42BC-ADDF-EAA6281BF244'; // Valid GUID format
    const skeletonKeys = Array.from({ length: 10 }, (_, i) => `skeleton-${i}`);

    const sortOptions = [
        { label: 'Giá từ thấp đến cao', value: 'low-to-high' },
        { label: 'Giá từ cao đến thấp', value: 'high-to-low' },
    ];

    // Load doctors on component mount and when filters change
    useEffect(() => {
        const params = {
            pageNumber: currentPage,
            pageSize: doctorsPerPage,
            searchTerm: searchTerm && searchTerm.trim() ? searchTerm : undefined,
            specialtyFilter:
                specialtyFilter && specialtyFilter.trim() ? specialtyFilter : undefined,
            hospitalFilter: hospitalFilter && hospitalFilter.trim() ? hospitalFilter : undefined,
            positionFilter: positionFilter && positionFilter.trim() ? positionFilter : undefined,
            positionFilters: positionFilters.length > 0 ? positionFilters : undefined,
            languageFilter: languageFilter && languageFilter.trim() ? languageFilter : undefined,
            languageFilters: languageFilters.length > 0 ? languageFilters : undefined,
            serviceTypeFilter:
                serviceTypeFilter && serviceTypeFilter.trim() ? serviceTypeFilter : undefined,
            serviceTypeFilters: serviceTypeFilters.length > 0 ? serviceTypeFilters : undefined,
            ratingFilter: ratingFilter,
            ratingFilters: ratingFilters.length > 0 ? ratingFilters : undefined,
            experienceFilter:
                experienceFilter && experienceFilter.trim() ? experienceFilter : undefined,
            experienceFilters: experienceFilters.length > 0 ? experienceFilters : undefined,
            availabilityFilter:
                availabilityFilter && availabilityFilter.trim() ? availabilityFilter : undefined,
            consultationTypeFilter:
                consultationTypeFilter && consultationTypeFilter.trim()
                    ? consultationTypeFilter
                    : undefined,
            genderFilter: genderFilter,
            genderFilters: genderFilters.length > 0 ? genderFilters : undefined,
            priceRange: priceFilter,
            patientId,
        };

        console.log('DoctorList: useEffect triggered with params:', params);

        // Use filterDoctorsAsync for advanced filtering with multiple criteria
        if (
            positionFilters.length > 0 ||
            languageFilters.length > 0 ||
            serviceTypeFilters.length > 0 ||
            ratingFilters.length > 0 ||
            experienceFilters.length > 0 ||
            genderFilters.length > 0
        ) {
            dispatch(filterDoctorsAsync(params));
        } else {
            // Use searchDoctorsAsync for basic filtering
            dispatch(searchDoctorsAsync(params));
        }
    }, [
        dispatch,
        currentPage,
        searchTerm,
        specialtyFilter,
        hospitalFilter,
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
    ]);

    // Filter and sort doctors locally (backend should handle this in production)
    const filteredAndSortedDoctors = [...doctors]
        .filter((doctor) => {
            // Experience filter
            if (experienceFilter) {
                const experience = doctor.yearsOfExperience;
                switch (experienceFilter) {
                    case 'checkebox-sm22': // Dưới 2 năm (0-1 năm)
                        if (experience >= 2) return false;
                        break;
                    case 'checkebox-sm23': // Từ 2 – 5 năm (2-4 năm)
                        if (experience < 2 || experience >= 5) return false;
                        break;
                    case 'checkebox-sm24': // Từ 5 – 10 năm (5-9 năm)
                        if (experience < 5 || experience >= 10) return false;
                        break;
                    case 'checkebox-sm25': // Từ 10 – 20 năm (10-19 năm)
                        if (experience < 10 || experience >= 20) return false;
                        break;
                    case 'checkebox-sm26': // Trên 20 năm (20+ năm)
                        if (experience < 20) return false;
                        break;
                    default:
                        // If no valid experience filter, don't filter
                        break;
                }
            }

            // Availability filter (simplified - check if doctor is active)
            if (availabilityFilter) {
                if (doctor.status !== Status.ACTIVE) return false;
            }

            // Consultation type filter (simplified - check if doctor has prices)
            if (consultationTypeFilter) {
                if (!doctor.prices || doctor.prices.length === 0) return false;
            }

            // Price filter
            if (priceFilter) {
                const doctorPrice = doctor.prices?.[0]?.amount || 0;
                if (doctorPrice < priceFilter.min || doctorPrice > priceFilter.max) return false;
            }

            return true;
        })
        .sort((a, b) => {
            if (sortOption === 'low-to-high') {
                const priceA = a.prices?.[0]?.amount || 0;
                const priceB = b.prices?.[0]?.amount || 0;
                // Doctors without prices go to the end
                if (priceA === 0 && priceB > 0) return 1;
                if (priceB === 0 && priceA > 0) return -1;
                return priceA - priceB;
            } else if (sortOption === 'high-to-low') {
                const priceA = a.prices?.[0]?.amount || 0;
                const priceB = b.prices?.[0]?.amount || 0;
                // Doctors without prices go to the end
                if (priceA === 0 && priceB > 0) return 1;
                if (priceB === 0 && priceA > 0) return -1;
                return priceB - priceA;
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
        console.log('DoctorList: handleSearchChange called with:', term);
        setSearchTerm(term);
        setCurrentPage(1); // Reset to first page when searching
    };

    const handleSpecialtyFilter = (specialtyId: string) => {
        console.log('DoctorList: handleSpecialtyFilter called with:', specialtyId);
        setSpecialtyFilter(specialtyId);
        setCurrentPage(1);
    };

    const handlePositionFilter = (positionId: string) => {
        console.log('DoctorList: handlePositionFilter called with:', positionId);
        setPositionFilter(positionId);
        setCurrentPage(1);
    };

    const handleLanguageFilter = (languageId: string) => {
        console.log('DoctorList: handleLanguageFilter called with:', languageId);
        setLanguageFilter(languageId);
        setCurrentPage(1);
    };

    const handleServiceTypeFilter = (serviceTypeId: string) => {
        console.log('DoctorList: handleServiceTypeFilter called with:', serviceTypeId);
        setServiceTypeFilter(serviceTypeId);
        setCurrentPage(1);
    };

    const handleHospitalFilter = (hospitalId: string) => {
        console.log('DoctorList: handleHospitalFilter called with:', hospitalId);
        setHospitalFilter(hospitalId);
        setSpecialtyFilter(''); // Clear specialty filter when hospital is selected
        setCurrentPage(1);
    };

    const handleRatingFilter = (rating: string) => {
        console.log('DoctorList: handleRatingFilter called with:', rating);
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

    const handleExperienceFilter = (experience: string) => {
        console.log('DoctorList: handleExperienceFilter called with:', experience);
        setExperienceFilter(experience);
        setCurrentPage(1);
    };

    const handleAvailabilityFilter = (availability: string) => {
        console.log('DoctorList: handleAvailabilityFilter called with:', availability);
        setAvailabilityFilter(availability);
        setCurrentPage(1);
    };

    const handleConsultationTypeFilter = (consultationType: string) => {
        console.log('DoctorList: handleConsultationTypeFilter called with:', consultationType);
        setConsultationTypeFilter(consultationType);
        setCurrentPage(1);
    };

    const handleGenderFilter = (gender: string) => {
        console.log('DoctorList: handleGenderFilter called with:', gender);
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
        console.log('DoctorList: handlePriceFilter called with:', priceRange);
        setPriceFilter(priceRange);
        setCurrentPage(1);
    };

    // Multi-filter callback functions
    const handlePositionFilters = (positionIds: string[]) => {
        console.log('DoctorList: handlePositionFilters called with:', positionIds);
        setPositionFilters(positionIds);
        setCurrentPage(1);
    };

    const handleLanguageFilters = (languageIds: string[]) => {
        console.log('DoctorList: handleLanguageFilters called with:', languageIds);
        // Convert language IDs to names using Redux store
        const languageNames = languageIds.map((id) => {
            const language = languages.find((lang) => lang.id === id);
            return language ? language.name : id;
        });
        setLanguageFilters(languageNames);
        setCurrentPage(1);
    };

    const handleServiceTypeFilters = (serviceTypeIds: string[]) => {
        console.log('DoctorList: handleServiceTypeFilters called with:', serviceTypeIds);
        // Convert service type IDs to names using Redux store
        const serviceTypeNames = serviceTypeIds.map((id) => {
            const serviceType = serviceTypes.find((st) => st.id === id);
            return serviceType ? serviceType.name : id;
        });
        setServiceTypeFilters(serviceTypeNames);
        setCurrentPage(1);
    };

    const handleRatingFilters = (ratings: string[]) => {
        console.log('DoctorList: handleRatingFilters called with:', ratings);
        if (ratings.length > 0) {
            // Convert rating strings to numbers
            setRatingFilters(
                ratings.map((rating) => parseInt(rating)).filter((rating) => !isNaN(rating))
            );
        } else {
            setRatingFilters([]);
        }
        setCurrentPage(1);
    };

    const handleExperienceFilters = (experiences: string[]) => {
        console.log('DoctorList: handleExperienceFilters called with:', experiences);
        if (experiences.length > 0) {
            // Parse JSON strings to experience ranges
            const parsedExperiences = experiences
                .map((exp) => {
                    try {
                        const parsed = JSON.parse(exp);
                        console.log('DoctorList: parsed experience:', parsed);
                        // Validate the parsed object
                        if (
                            typeof parsed.MinYears !== 'number' ||
                            typeof parsed.MaxYears !== 'number'
                        ) {
                            console.error(
                                'DoctorList: invalid experience range structure:',
                                parsed
                            );
                            return null;
                        }
                        return parsed;
                    } catch (error) {
                        console.error('DoctorList: error parsing experience:', exp, error);
                        return null;
                    }
                })
                .filter(Boolean);
            console.log('DoctorList: final experience filters:', parsedExperiences);
            setExperienceFilters(parsedExperiences);
        } else {
            setExperienceFilters([]);
        }
        setCurrentPage(1);
    };

    const handleGenderFilters = (genders: string[]) => {
        console.log('DoctorList: handleGenderFilters called with:', genders);
        if (genders.length > 0) {
            // Keep gender strings as they are (MALE, FEMALE, OTHER)
            // Backend expects string values, not enum
            console.log('DoctorList: gender strings:', genders);
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
                    onHospitalFilter={handleHospitalFilter}
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
                                                    onClick={() => window.location.reload()}
                                                >
                                                    <i className="fas fa-redo-alt me-2"></i>
                                                    Thử lại
                                                </button>
                                                <button
                                                    className="btn btn-outline-secondary btn-sm px-3 py-2 rounded-pill fw-semibold"
                                                    onClick={() => window.history.back()}
                                                >
                                                    <i className="fas fa-arrow-left me-2"></i>
                                                    Quay lại
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : isLoading ? (
                                    skeletonKeys.map((key) => (
                                        <div className="col-md-12 mb-4" key={key}>
                                            <DoctorAppointmentBookingCardSkeleton />
                                        </div>
                                    ))
                                ) : filteredAndSortedDoctors.length === 0 ? (
                                    <div className="col-md-12 mb-4">
                                        <div className="text-center py-5">
                                            <h4>Không tìm thấy bác sĩ nào</h4>
                                            <p>
                                                Vui lòng thử lại với từ khóa khác hoặc bộ lọc khác.
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    filteredAndSortedDoctors.map((doctor) => (
                                        <DoctorAppointmentBookingCard
                                            key={doctor.id}
                                            doctorId={doctor.id}
                                            patientId={patientId}
                                            name={`${doctor.firstName} ${doctor.lastName}`}
                                            specialty={doctor.specialty?.name || 'Chưa cập nhật'}
                                            position={doctor.position?.name || 'Chưa cập nhật'}
                                            bookCounts={doctor.reviewStatistics?.totalReviews || 0}
                                            rating={doctor.reviewStatistics?.averageRating || 0}
                                            location={
                                                doctor.hospital?.name ||
                                                doctor.address ||
                                                'Chưa cập nhật'
                                            }
                                            yearsOfExperience={doctor.yearsOfExperience}
                                            fees={doctor.prices?.[0]?.amount || 0}
                                            isFavorite={doctor.isFavorited}
                                            languages={doctor.languages || []}
                                            nextAvailableTime={
                                                doctor.status === Status.ACTIVE
                                                    ? 'Có lịch trống'
                                                    : 'Không có lịch'
                                            }
                                            image={doctor.avatarUrl || docProfile01}
                                        />
                                    ))
                                )}
                                <div className="col-md-12">
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={pagination.totalPages}
                                        onPageChange={handlePageChange}
                                        showPrevNext={true}
                                        maxVisiblePages={5}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default DoctorList;
