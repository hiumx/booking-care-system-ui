import React, { useEffect, useState, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
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
import { getServiceTypesAsync } from '@/store/slices/serviceTypeSlice';
import { getLanguagesAsync } from '@/store/slices/languageSlice';
import { Status } from '@/enums/common.enums';
import { DoctorGender } from '@/enums/doctor-gender.enums';

// Import images
import docProfile01 from '@/assets/img/doctor-grid/doctor-grid-01.jpg';

// Mock data removed - using Redux data from backend

const DoctorList: React.FC = () => {
    const { t } = useTranslation('doctor');
    const dispatch = useAppDispatch();

    const breadcrumbData = {
        title: t('list.breadcrumb.title'),
        items: [
            { label: t('list.breadcrumb.home'), path: '/', isActive: false },
            { label: t('list.breadcrumb.title'), isActive: true },
        ],
    };
    const { profile } = useSelector((state: RootState) => state.user);
    const { doctors, isLoading, pagination, error } = useAppSelector((state) => state.doctor);
    const { languages } = useAppSelector((state) => state.language);
    const { serviceTypes } = useAppSelector((state) => state.serviceType);
    const [searchParams, setSearchParams] = useSearchParams();

    // Check if this is a reschedule flow (Option 3: Choose new doctor)
    const isRescheduleFlow = searchParams.get('rescheduleFor') !== null;
    const rescheduleAppointmentId = searchParams.get('rescheduleFor');
    const rescheduleToken = searchParams.get('token');

    // Get appointmentType from URL for reschedule flow (TELEHEALTH or IN_PERSON)
    // This determines which service type to filter doctors by
    const appointmentTypeFromUrl = searchParams.get('appointmentType');

    // Get common params (works for both reschedule and normal search flow)
    const specialtyIdFromUrl = searchParams.get('specialtyId');
    const hospitalIdFromUrl = searchParams.get('hospitalId');
    const searchFromUrl = searchParams.get('search');

    // Get serviceTypeId from URL params for filtering
    const serviceTypeFromUrl = searchParams.get('serviceTypeId');

    // Get other URL params
    const pageNumberFromUrl = searchParams.get('pageNumber');
    const ratingFromUrl = searchParams.get('rating');
    const pageSizeFromUrl = searchParams.get('pageSize');
    const positionIdsFromUrl = searchParams.getAll('positionId');
    const priceMinFromUrl = searchParams.get('priceMin');
    const priceMaxFromUrl = searchParams.get('priceMax');
    const experienceMinFromUrl = searchParams.get('experienceMin');
    const experienceMaxFromUrl = searchParams.get('experienceMax');
    const languageIdsFromUrl = searchParams.getAll('languageId');
    const genderIdsFromUrl = searchParams.getAll('gender');
    const provinceIdFromUrl = searchParams.get('provinceId');
    const districtIdFromUrl = searchParams.get('districtId');
    const provinceNameFromUrl = searchParams.get('provinceName');
    const districtNameFromUrl = searchParams.get('districtName');

    const [sortOption, setSortOption] = useState('');
    const [currentPage, setCurrentPage] = useState(
        pageNumberFromUrl ? Number.parseInt(pageNumberFromUrl, 10) : 1
    );
    const pageSize = pageSizeFromUrl ? Number.parseInt(pageSizeFromUrl, 10) : 10;
    const [searchTerm, setSearchTerm] = useState(searchFromUrl || '');
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
    const [genderFilter, setGenderFilter] = useState<DoctorGender | undefined>(undefined);
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

    const patientId = profile?.id; // Valid GUID format
    const skeletonKeys = Array.from({ length: pageSize }, (_, i) => `skeleton-${i}`);

    // Initialize filters from URL params - ONLY ONCE
    // Use ref to prevent re-initialization on every render
    const hasInitializedUrlFilters = useRef(false);

    // Debounced search term for API calls (to avoid calling API on every keystroke)
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Track if initial data has been fetched (serviceTypes, languages)
    const hasFetchedInitialData = useRef(false);

    // Track if first doctor search has been completed (for URL filter sync)
    const hasCompletedFirstFetch = useRef(false);

    // Track last search params to prevent duplicate API calls
    const lastSearchParamsRef = useRef<string>('');

    // Fetch service types and languages on mount - ONLY ONCE
    useEffect(() => {
        if (!hasFetchedInitialData.current) {
            hasFetchedInitialData.current = true;
            if (serviceTypes.length === 0) {
                dispatch(getServiceTypesAsync());
            }
            if (languages.length === 0) {
                dispatch(getLanguagesAsync());
            }
        }
    }, [dispatch, serviceTypes.length, languages.length]);

    // Debounce searchTerm - only update debouncedSearchTerm after 2 seconds of no typing
    useEffect(() => {
        // Clear existing timeout
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        // Set new timeout to update debouncedSearchTerm after 2 seconds
        searchTimeoutRef.current = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 2000);

        // Cleanup on unmount or when searchTerm changes (before new timeout is set)
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [searchTerm]);

    // Helper functions to initialize filters from URL
    const initializeBasicFilters = () => {
        if (hospitalIdFromUrl) {
            setHospitalFilters([hospitalIdFromUrl]);
        }
        if (specialtyIdFromUrl) {
            setSpecialtyFilters([specialtyIdFromUrl]);
        }
    };

    const initializeServiceTypeFilter = () => {
        // Priority 1: If appointmentType is provided in URL (from reschedule flow)
        // Map TELEHEALTH -> 'Tư vấn trực tuyến', IN_PERSON -> 'Khám trực tiếp'
        if (appointmentTypeFromUrl) {
            const serviceTypeName =
                appointmentTypeFromUrl === 'TELEHEALTH' ? 'Tư vấn trực tuyến' : 'Khám trực tiếp';
            setServiceTypeFilters([serviceTypeName]);
            return;
        }

        // Priority 2: If serviceTypeId is provided in URL
        if (serviceTypeFromUrl && serviceTypes.length > 0) {
            const serviceType = serviceTypes.find((st) => st.id === serviceTypeFromUrl);
            if (serviceType) {
                setServiceTypeFilters([serviceType.name]);
            }
        }
    };

    const initializeRatingFilter = () => {
        if (ratingFromUrl) {
            const rating = Number.parseInt(ratingFromUrl, 10);
            if (!Number.isNaN(rating) && rating >= 1 && rating <= 5) {
                setRatingFilter(rating);
            }
        }
    };

    const initializePriceRangeFilter = () => {
        if (!priceMinFromUrl && !priceMaxFromUrl) return;

        const min = priceMinFromUrl ? Number.parseFloat(priceMinFromUrl) : 0;
        const max = priceMaxFromUrl ? Number.parseFloat(priceMaxFromUrl) : Number.MAX_SAFE_INTEGER;

        if (!Number.isNaN(min) && !Number.isNaN(max)) {
            setPriceFilter({ min, max });
        }
    };

    const initializeExperienceRangeFilter = () => {
        if (!experienceMinFromUrl && !experienceMaxFromUrl) return;

        const min = experienceMinFromUrl ? Number.parseInt(experienceMinFromUrl, 10) : 0;
        const max = experienceMaxFromUrl
            ? Number.parseInt(experienceMaxFromUrl, 10)
            : Number.MAX_SAFE_INTEGER;

        if (!Number.isNaN(min) && !Number.isNaN(max)) {
            setExperienceFilter({ min, max });
        }
    };

    const initializeRangeFilter = () => {
        if (positionIdsFromUrl?.length > 0) {
            setPositionFilters(positionIdsFromUrl);
        }
        initializePriceRangeFilter();
        initializeExperienceRangeFilter();
    };

    const initializeLanguageFilter = () => {
        if (languageIdsFromUrl && languageIdsFromUrl.length > 0) {
            setLanguageFilters(languageIdsFromUrl);
        }
    };

    const initializeGenderFilter = () => {
        if (genderIdsFromUrl && genderIdsFromUrl.length > 0) {
            setGenderFilters(genderIdsFromUrl);
        }
    };

    const initializeAreaFilter = () => {
        if (provinceIdFromUrl || districtIdFromUrl || provinceNameFromUrl || districtNameFromUrl) {
            setAreaFilter({
                provinceId: provinceIdFromUrl || undefined,
                districtId: districtIdFromUrl || undefined,
                provinceName: provinceNameFromUrl || undefined,
                districtName: districtNameFromUrl || undefined,
            });
        }
    };

    // Initialize all filters from URL params - ONLY ONCE
    useEffect(() => {
        if (hasInitializedUrlFilters.current) {
            return;
        }

        // Đợi dữ liệu cần thiết trước khi khởi tạo các bộ lọc phụ thuộc vào API
        const needsServiceTypes = Boolean(serviceTypeFromUrl) && serviceTypes.length === 0;
        const needsLanguages =
            languageIdsFromUrl && languageIdsFromUrl.length > 0 && languages.length === 0;

        if (needsServiceTypes || needsLanguages) {
            return;
        }

        initializeBasicFilters();
        initializeServiceTypeFilter();
        initializeRatingFilter();
        initializeRangeFilter();
        initializeLanguageFilter();
        initializeGenderFilter();
        initializeAreaFilter();
        hasInitializedUrlFilters.current = true;
    }, [
        specialtyIdFromUrl,
        hospitalIdFromUrl,
        serviceTypeFromUrl,
        serviceTypes,
        pageNumberFromUrl,
        ratingFromUrl,
        positionIdsFromUrl,
        priceMinFromUrl,
        priceMaxFromUrl,
        experienceMinFromUrl,
        experienceMaxFromUrl,
        languageIdsFromUrl,
        languages,
        genderIdsFromUrl,
        provinceIdFromUrl,
        districtIdFromUrl,
        provinceNameFromUrl,
        districtNameFromUrl,
    ]);

    const sortOptions = [
        { label: t('list.sort.lowToHigh'), value: 'low-to-high' },
        { label: t('list.sort.highToLow'), value: 'high-to-low' },
    ];

    // Helper function to update URL params
    const updateURLParams = (updates: Record<string, string | number | undefined | null>) => {
        const newParams = new URLSearchParams(searchParams);

        // Always ensure pageNumber and pageSize are present
        const defaultParams = {
            pageNumber: currentPage,
            pageSize: pageSize,
        };

        // Merge defaults with updates
        const allUpdates = { ...defaultParams, ...updates };

        for (const [key, value] of Object.entries(allUpdates)) {
            if (value !== undefined && value !== null && String(value) !== '') {
                newParams.set(key, String(value));
            } else if (key !== 'pageNumber' && key !== 'pageSize') {
                // Don't delete pageNumber and pageSize
                newParams.delete(key);
            }
        }

        setSearchParams(newParams, { replace: true });
    };

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
        pageSize: pageSize,
        searchTerm: getTrimmedString(debouncedSearchTerm),
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

    // Helper function to get default serviceType filter
    const getDefaultServiceTypeFilters = (): string[] | undefined => {
        // If serviceTypeFilters is set, use it
        if (serviceTypeFilters.length > 0) {
            return serviceTypeFilters;
        }
        // Default to "Khám trực tiếp" if no serviceType filter is set
        return ['Khám trực tiếp'];
    };

    // Helper function to build array filter parameters
    const buildArrayFilters = () => ({
        specialtyFilters: getArrayOrUndefined(specialtyFilters),
        hospitalFilters: getArrayOrUndefined(hospitalFilters),
        positionFilters: getArrayOrUndefined(positionFilters),
        languageFilters: getArrayOrUndefined(languageFilters),
        serviceTypeFilters: getDefaultServiceTypeFilters(),
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
    // Note: Default serviceType "Khám trực tiếp" is always applied, so we check if user has set custom filters
    const shouldUseAdvancedFiltering = () => {
        // Check if serviceTypeFilters has custom values (not just default)
        const hasCustomServiceTypeFilter = serviceTypeFilters.length > 0;

        return (
            positionFilters.length > 0 ||
            languageFilters.length > 0 ||
            hasCustomServiceTypeFilter ||
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

    // Helper function to check if we should wait for service types
    const shouldWaitForServiceTypes = () => {
        if (!serviceTypeFromUrl) return false;
        const isServiceTypesLoaded = serviceTypes.length > 0;
        const isServiceTypeFilterSet = serviceTypeFilters.length > 0;
        return !isServiceTypesLoaded || !isServiceTypeFilterSet;
    };

    // Helper function to check if we should wait for languages
    const shouldWaitForLanguages = () => {
        // Only wait if we're still initializing from URL (not when user is changing filters)
        if (hasInitializedUrlFilters.current) return false;

        if (!languageIdsFromUrl || languageIdsFromUrl.length === 0) return false;
        const isLanguagesLoaded = languages.length > 0;
        const isLanguageFilterSet = languageFilters.length > 0;
        return !isLanguagesLoaded || !isLanguageFilterSet;
    };

    // Helper function to check if we should wait for URL filters initialization
    const shouldWaitForUrlFilters = () => {
        // Check if URL has filter params
        const hasUrlParams =
            isRescheduleFlow ||
            serviceTypeFromUrl ||
            (languageIdsFromUrl && languageIdsFromUrl.length > 0) ||
            specialtyIdFromUrl ||
            hospitalIdFromUrl;

        // If no URL params, no need to wait
        if (!hasUrlParams) return false;

        // Wait until initialization flag is set
        if (!hasInitializedUrlFilters.current) return true;

        // After initialization is complete, check if this is the first fetch
        // Only verify state matches URL on initial load, not when user clears filters
        if (hasCompletedFirstFetch.current) {
            // Already fetched once, don't block subsequent fetches
            return false;
        }

        // First fetch after initialization - verify state filters match URL params
        // This ensures we don't fetch before React state update completes
        const specialtyFilterMismatch = specialtyIdFromUrl && specialtyFilters.length === 0;
        const hospitalFilterMismatch = hospitalIdFromUrl && hospitalFilters.length === 0;

        return specialtyFilterMismatch || hospitalFilterMismatch;
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
                        <h4>{t('list.empty.title')}</h4>
                        <p>{t('list.empty.message')}</p>
                        {(searchTerm ||
                            specialtyFilters.length > 0 ||
                            hospitalFilters.length > 0 ||
                            areaFilter ||
                            priceFilter ||
                            ratingFilter ||
                            experienceFilter ||
                            positionFilters.length > 0 ||
                            languageFilters.length > 0 ||
                            serviceTypeFilters.length > 0 ||
                            genderFilters.length > 0) && (
                            <div className="mt-3">
                                <button
                                    className="btn btn-outline-primary"
                                    onClick={handleClearAllFilters}
                                >
                                    {t('list.empty.clearFilters')}
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
                name={`${doctor.lastName} ${doctor.firstName}`}
                specialty={doctor.specialty?.name || t('list.notUpdated')}
                position={doctor.position?.name || t('list.notUpdated')}
                prices={
                    doctor.prices?.map((price) => ({
                        id: price.id,
                        serviceTypeId: price.serviceTypeId,
                        serviceTypeName: price.serviceTypeName,
                        amount: price.amount,
                    })) || []
                }
                rating={doctor.reviewStatistics?.averageRating || 0}
                location={doctor.hospital?.name || doctor.address || t('list.notUpdated')}
                yearsOfExperience={doctor.yearsOfExperience}
                isFavorite={doctor.isFavorited}
                languages={doctor.languages || []}
                image={doctor.avatarUrl || docProfile01}
                serviceTypeFilters={serviceTypeFilters}
                isRescheduleMode={isRescheduleFlow}
                rescheduleParams={
                    isRescheduleFlow
                        ? {
                              appointmentId: rescheduleAppointmentId!,
                              token: rescheduleToken!,
                              rescheduleSpecialtyId: specialtyIdFromUrl!,
                              rescheduleHospitalId: hospitalIdFromUrl!,
                              appointmentType: appointmentTypeFromUrl || undefined,
                          }
                        : undefined
                }
            />
        ));
    };

    // Load doctors on component mount and when filters change
    useEffect(() => {
        // Wait until URL filters are initialized in state before fetching
        // This prevents the initial fetch with empty filters when URL has params
        if (shouldWaitForServiceTypes()) {
            return;
        }

        if (shouldWaitForLanguages()) {
            return;
        }

        if (shouldWaitForUrlFilters()) {
            return;
        }

        const params = buildSearchParams();

        // Prevent duplicate API calls with same params
        const paramsKey = JSON.stringify(params);
        if (paramsKey === lastSearchParamsRef.current) {
            return;
        }
        lastSearchParamsRef.current = paramsKey;

        const useAdvancedFiltering = shouldUseAdvancedFiltering();

        if (useAdvancedFiltering) {
            dispatch(filterDoctorsAsync(params));
        } else {
            dispatch(searchDoctorsAsync(params));
        }

        // Mark first fetch as completed to allow subsequent filter changes
        hasCompletedFirstFetch.current = true;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        dispatch,
        currentPage,
        pageSize,
        debouncedSearchTerm,
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
        isRescheduleFlow,
        // Note: serviceTypes and languages removed from deps to prevent infinite loop
        // They are only used in shouldWaitFor... checks, not in the actual search params
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
    // NOTE: This is now handled by backend API, kept for reference only
    // const passesPriceFilter = (doctor: any) => {
    //     if (!priceFilter) return true;
    //     const doctorPrice = doctor.prices?.[0]?.amount || 0;
    //     return doctorPrice >= priceFilter.min && doctorPrice <= priceFilter.max;
    // };

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
    // Note: Price filter is now handled by backend, so we don't apply it here
    const filteredAndSortedDoctors = [...doctors]
        .filter((doctor) => {
            return (
                passesAvailabilityFilter(doctor) && passesConsultationTypeFilter(doctor)
                // passesPriceFilter removed - backend already handles price filtering
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
        updateURLParams({ pageNumber: page });
    };

    const handleSortChange = (value: string) => {
        setSortOption(value);
    };

    // Callback functions for SearchInput and SideBar
    const handleSearchChange = (term: string) => {
        setSearchTerm(term);
        setCurrentPage(1); // Reset to first page when searching
    };

    // Function to search immediately without waiting for debounce
    const handleSearchNow = () => {
        // Clear existing timeout
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }
        // Set debouncedSearchTerm immediately to trigger search
        setDebouncedSearchTerm(searchTerm);
        setCurrentPage(1);
    };

    const handleSpecialtyFilter = (specialtyId: string) => {
        setSpecialtyFilter(specialtyId);
        setCurrentPage(1);
    };

    const handleSpecialtyFilters = (specialtyIds: string[]) => {
        setSpecialtyFilters(specialtyIds);

        // Update URL with specialtyId param
        const newParams = new URLSearchParams(searchParams);
        if (specialtyIds.length > 0) {
            newParams.set('specialtyId', specialtyIds[0]); // Use first specialty for URL
        } else {
            newParams.delete('specialtyId');
        }
        newParams.set('pageNumber', '1');
        newParams.set('pageSize', String(pageSize));
        setSearchParams(newParams, { replace: true });

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

        // Update URL with hospitalId param
        const newParams = new URLSearchParams(searchParams);
        if (hospitalIds.length > 0) {
            newParams.set('hospitalId', hospitalIds[0]); // Use first hospital for URL
        } else {
            newParams.delete('hospitalId');
        }
        newParams.set('pageNumber', '1');
        newParams.set('pageSize', String(pageSize));
        setSearchParams(newParams, { replace: true });

        setCurrentPage(1);
    };

    const handleAreaFilter = (areaInfo: {
        provinceId?: string;
        districtId?: string;
        provinceName?: string;
        districtName?: string;
    }) => {
        setAreaFilter(areaInfo);

        // Update URL with area params
        const newParams = new URLSearchParams(searchParams);
        if (areaInfo.provinceId) {
            newParams.set('provinceId', areaInfo.provinceId);
        } else {
            newParams.delete('provinceId');
        }
        if (areaInfo.districtId) {
            newParams.set('districtId', areaInfo.districtId);
        } else {
            newParams.delete('districtId');
        }
        if (areaInfo.provinceName) {
            newParams.set('provinceName', areaInfo.provinceName);
        } else {
            newParams.delete('provinceName');
        }
        if (areaInfo.districtName) {
            newParams.set('districtName', areaInfo.districtName);
        } else {
            newParams.delete('districtName');
        }
        newParams.set('pageNumber', '1');
        newParams.set('pageSize', String(pageSize));
        setSearchParams(newParams, { replace: true });

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
            const ratingValue = ratingMap[rating];
            setRatingFilter(ratingValue);
            updateURLParams({ rating: ratingValue, pageNumber: 1 });
        } else {
            setRatingFilter(undefined);
            updateURLParams({ rating: null, pageNumber: 1 });
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
            // Map gender IDs to DoctorGender enum values
            const genderMap: { [key: string]: DoctorGender } = {
                'checkebox-sm14': DoctorGender.MALE,
                'checkebox-sm15': DoctorGender.FEMALE,
                'checkebox-sm16': DoctorGender.OTHER,
            };
            setGenderFilter(genderMap[gender]);
        } else {
            setGenderFilter(undefined);
        }
        updateURLParams({ gender, pageNumber: 1 });
        setCurrentPage(1);
    };

    const handlePriceFilter = (priceRange: { min: number; max: number }) => {
        setPriceFilter(priceRange);
        updateURLParams({
            priceMin: priceRange.min,
            priceMax: priceRange.max,
            pageNumber: 1,
        });
        setCurrentPage(1);
    };

    const handleExperienceFilter = (experienceRange: { min: number; max: number }) => {
        setExperienceFilter(experienceRange);
        updateURLParams({
            experienceMin: experienceRange.min,
            experienceMax: experienceRange.max,
            pageNumber: 1,
        });
        setCurrentPage(1);
    };

    // Multi-filter callback functions
    const handlePositionFilters = (positionIds: string[]) => {
        setPositionFilters(positionIds);

        // Update URL with multiple positionId params
        const newParams = new URLSearchParams(searchParams);
        newParams.delete('positionId'); // Clear all existing
        for (const id of positionIds) {
            newParams.append('positionId', id);
        }
        newParams.set('pageNumber', '1');
        newParams.set('pageSize', String(pageSize));
        setSearchParams(newParams, { replace: true });

        // Reset lastSearchParamsRef to ensure API is called when filter changes
        lastSearchParamsRef.current = '';

        setCurrentPage(1);
    };

    const handleLanguageFilters = (languageIds: string[]) => {
        setLanguageFilters(languageIds);

        // Update URL with multiple languageId params
        const newParams = new URLSearchParams(searchParams);
        newParams.delete('languageId'); // Clear all existing
        for (const id of languageIds) {
            newParams.append('languageId', id);
        }
        newParams.set('pageNumber', '1');
        newParams.set('pageSize', String(pageSize));
        setSearchParams(newParams, { replace: true });

        // Reset lastSearchParamsRef to ensure API is called when filter changes
        lastSearchParamsRef.current = '';

        setCurrentPage(1);
    };

    const handleServiceTypeFilters = (serviceTypeIds: string[]) => {
        // Convert service type IDs to names using Redux store
        const serviceTypeNames = serviceTypeIds.map((id) => {
            const serviceType = serviceTypes.find((st) => st.id === id);
            return serviceType ? serviceType.name : id;
        });
        setServiceTypeFilters(serviceTypeNames);
        updateURLParams({
            serviceTypeId: serviceTypeIds.length > 0 ? serviceTypeIds[0] : null,
            pageNumber: 1,
        });

        // Reset lastSearchParamsRef to ensure API is called when filter changes
        lastSearchParamsRef.current = '';

        setCurrentPage(1);
    };

    const handleRatingFilters = (ratings: string[]) => {
        if (ratings.length > 0) {
            // Convert rating strings to numbers
            const ratingNumbers = ratings
                .map((rating) => Number.parseInt(rating, 10))
                .filter((rating) => !Number.isNaN(rating));

            setRatingFilters(ratingNumbers);

            // Update URL with rating (use first one for simplicity)
            updateURLParams({
                rating: ratingNumbers[0],
                pageNumber: 1,
            });
        } else {
            setRatingFilters([]);
            updateURLParams({
                rating: null,
                pageNumber: 1,
            });
        }

        // Reset lastSearchParamsRef to ensure API is called when filter changes
        lastSearchParamsRef.current = '';

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
        const newParams = new URLSearchParams(searchParams);
        newParams.delete('gender');
        for (const gender of genders) {
            newParams.append('gender', gender);
        }
        newParams.set('pageNumber', '1');
        newParams.set('pageSize', String(pageSize));
        setSearchParams(newParams, { replace: true });

        // Reset lastSearchParamsRef to ensure API is called when filter changes
        lastSearchParamsRef.current = '';

        setCurrentPage(1);
    };

    // Clear all filters handler
    const handleClearAllFilters = () => {
        // Clear all state
        setSearchTerm('');
        setSpecialtyFilter('');
        setSpecialtyFilters([]);
        setHospitalFilter('');
        setHospitalFilters([]);
        setPositionFilter('');
        setPositionFilters([]);
        setLanguageFilter('');
        setLanguageFilters([]);
        setServiceTypeFilter('');
        setServiceTypeFilters([]);
        setRatingFilter(undefined);
        setRatingFilters([]);
        setExperienceFilter(undefined);
        setExperienceFilters([]);
        setAvailabilityFilter('');
        setConsultationTypeFilter('');
        setGenderFilter(undefined);
        setGenderFilters([]);
        setPriceFilter(undefined);
        setAreaFilter(undefined);
        setCurrentPage(1);

        // Clear all URL params except pageNumber and pageSize
        const newParams = new URLSearchParams();
        newParams.set('pageNumber', '1');
        newParams.set('pageSize', String(pageSize));
        setSearchParams(newParams, { replace: true });
    };

    return (
        <MainLayout>
            <Breadcrumb items={breadcrumbData.items} title={breadcrumbData.title} />
            <div className="container">
                <SearchInput
                    onSearchChange={handleSearchChange}
                    onSearchNow={handleSearchNow}
                    onSpecialtyFilter={handleSpecialtyFilter}
                    onSpecialtyFilters={handleSpecialtyFilters}
                    onHospitalFilter={handleHospitalFilter}
                    onHospitalFilters={handleHospitalFilters}
                    onAreaFilter={handleAreaFilter}
                    rescheduleHospitalId={hospitalIdFromUrl}
                    rescheduleSpecialtyId={specialtyIdFromUrl}
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
                            initialServiceTypeFilters={
                                serviceTypeFromUrl ? [serviceTypeFromUrl] : undefined
                            }
                            initialPriceRange={
                                priceMinFromUrl || priceMaxFromUrl
                                    ? {
                                          min: Number.parseFloat(priceMinFromUrl || '0'),
                                          max: Number.parseFloat(priceMaxFromUrl || '10000000'),
                                      }
                                    : undefined
                            }
                            initialRating={
                                ratingFromUrl ? Number.parseInt(ratingFromUrl, 10) : undefined
                            }
                            initialExperienceRange={
                                experienceMinFromUrl || experienceMaxFromUrl
                                    ? {
                                          min: Number.parseInt(experienceMinFromUrl || '1', 10),
                                          max: Number.parseInt(experienceMaxFromUrl || '100', 10),
                                      }
                                    : undefined
                            }
                            initialSearchTerm={searchFromUrl || ''}
                            onClearAllFilters={handleClearAllFilters}
                        />
                        <div className="col-xl-9">
                            <div className="card">
                                <div className="card-body">
                                    <div
                                        className={`${styles.filterContainer} d-flex align-items-center justify-content-between result-wrap`}
                                    >
                                        <h5 className={styles.h5Custom}>
                                            {t('list.results.showing')}{' '}
                                            <span className={styles.spanCustom}>
                                                {pagination.totalCount}
                                            </span>{' '}
                                            {t('list.results.doctorsForYou')}
                                        </h5>
                                        <div className="d-flex align-items-center gap-3">
                                            <Select
                                                title={t('list.sort.title')}
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
                                            className="alert alert-danger border-0 shadow-sm rounded-3 text-center"
                                            role="alert"
                                        >
                                            <div className="d-flex align-items-center justify-content-center mb-3">
                                                <i className="fas fa-exclamation-triangle fs-2 text-danger me-3"></i>
                                                <div>
                                                    <h4 className="alert-heading mb-1 fw-bold">
                                                        {t('list.error.title')}
                                                    </h4>
                                                    <p className="mb-0 text-muted">{error}</p>
                                                </div>
                                            </div>
                                            <hr className="my-3" />
                                            <div className="d-flex gap-2 flex-wrap justify-content-center">
                                                <button
                                                    className="btn btn-primary btn-sm px-3 py-2 rounded-pill fw-semibold"
                                                    onClick={() => globalThis.location.reload()}
                                                >
                                                    <i className="fas fa-redo-alt me-2"></i>
                                                    {t('list.error.retry')}
                                                </button>
                                                <button
                                                    className="btn btn-outline-secondary btn-sm px-3 py-2 rounded-pill fw-semibold"
                                                    onClick={() => globalThis.history.back()}
                                                >
                                                    <i className="fas fa-arrow-left me-2"></i>
                                                    {t('list.error.goBack')}
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
