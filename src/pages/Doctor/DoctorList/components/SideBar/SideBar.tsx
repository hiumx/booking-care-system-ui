import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import styles from './SideBar.module.scss';
import { Slider, styled } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { getPositionsAsync } from '@/store/slices/positionSlice';
import { getLanguagesAsync } from '@/store/slices/languageSlice';
import { getServiceTypesAsync } from '@/store/slices/serviceTypeSlice';

interface FilterOption {
    id: string;
    label: string;
    count?: number;
    checked?: boolean;
}

interface FilterSection {
    title: string;
    options: FilterOption[];
    hasViewMore?: boolean;
}

interface SideBarProps {
    onSearchChange?: (searchTerm: string) => void;
    onSpecialtyFilter?: (specialtyId: string) => void;
    onPositionFilter?: (positionId: string) => void;
    onPositionFilters?: (positionIds: string[]) => void; // Support multiple position filters
    onLanguageFilter?: (languageId: string) => void;
    onLanguageFilters?: (languageIds: string[]) => void; // Support multiple language filters
    onServiceTypeFilter?: (serviceTypeId: string) => void;
    onServiceTypeFilters?: (serviceTypeIds: string[]) => void; // Support multiple service type filters
    onRatingFilter?: (rating: string) => void;
    onRatingFilters?: (ratings: string[]) => void; // Support multiple rating filters
    onExperienceFilter?: (experience: string) => void;
    onExperienceFilters?: (experiences: string[]) => void; // Support multiple experience filters
    onAvailabilityFilter?: (availability: string) => void;
    onConsultationTypeFilter?: (consultationType: string) => void;
    onGenderFilter?: (gender: string) => void;
    onGenderFilters?: (genders: string[]) => void; // Support multiple gender filters
    onPriceFilter?: (priceRange: { min: number; max: number }) => void;
}

const mockFilterData: FilterSection[] = [
    {
        title: 'Giá cả',
        options: [],
    },
    {
        title: 'Đánh giá',
        options: [
            { id: 'checkebox-sm46', label: '5 Sao' },
            { id: 'checkebox-sm47', label: '4 Sao' },
            { id: 'checkebox-sm48', label: '3 Sao' },
            { id: 'checkebox-sm49', label: '2 Sao' },
            { id: 'checkebox-sm50', label: '1 Sao' },
        ],
    },
    {
        title: 'Học vị',
        options: [], // Will be populated with real data from Redux
        hasViewMore: true,
    },
    {
        title: 'Kinh nghiệm',
        options: [
            { id: 'checkebox-sm22', label: 'Dưới 2 năm' },
            { id: 'checkebox-sm23', label: 'Từ 2 – 5 năm' },
            { id: 'checkebox-sm24', label: 'Từ 5 – 10 năm' },
            { id: 'checkebox-sm25', label: 'Từ 10 – 20 năm' },
            { id: 'checkebox-sm26', label: 'Trên 20 năm' },
        ],
        hasViewMore: true,
    },
    {
        title: 'Lịch trống',
        options: [
            { id: 'checkebox-sm17', label: 'Hôm nay' },
            { id: 'checkebox-sm18', label: 'Ngày mai' },
            { id: 'checkebox-sm19', label: 'Trong 7 ngày tới' },
            { id: 'checkebox-sm20', label: 'Trong 30 ngày tới' },
            { id: 'checkebox-sm21', label: 'Cuối tuần này' },
        ],
        hasViewMore: true,
    },
    {
        title: 'Loại tư vấn',
        options: [
            { id: 'checkebox-sm35', label: 'Gọi thoại' },
            { id: 'checkebox-sm36', label: 'Gọi video' },
            { id: 'checkebox-sm37', label: 'Tư vấn tức thì' },
            { id: 'checkebox-sm38', label: 'Chat' },
            { id: 'checkebox-sm39', label: 'Tư vấn tại chỗ' },
        ],
    },
    {
        title: 'Giới tính',
        options: [
            { id: 'checkebox-sm14', label: 'Nam' },
            { id: 'checkebox-sm15', label: 'Nữ' },
            { id: 'checkebox-sm16', label: 'Khác' },
        ],
    },
    {
        title: 'Ngôn ngữ',
        options: [], // Will be populated with real data from Redux
        hasViewMore: true,
    },
    {
        title: 'Loại hình dịch vụ',
        options: [], // Will be populated with real data from Redux
        hasViewMore: true,
    },
];

const PrettoSlider = styled(Slider)({
    color: '#0E82FD',
    height: 4,
    marginTop: 20,
    '& .MuiSlider-track': {
        border: 'none',
    },
    '& .MuiSlider-thumb': {
        height: 20,
        width: 20,
        backgroundColor: '#fff',
        border: '2px solid currentColor',
        '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
            boxShadow: 'inherit',
        },
        '&::before': {
            display: 'none',
        },
    },
    '& .MuiSlider-valueLabel': {
        lineHeight: 1.2,
        fontSize: 14,
        fontWeight: 500,
        backgroundColor: '#0E82FD',
        color: '#fff',
        padding: '4px 8px',
        borderRadius: '4px',
        top: -10,
        '&:after': {
            content: '""',
            position: 'absolute',
            bottom: -6,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '6px solid transparent',
            borderRight: '6px solid transparent',
            borderTop: '6px solid #0E82FD',
        },
    },
});

const formatVND = (value: number): string => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
    }).format(value);
};

const SideBar: React.FC<SideBarProps> = ({
    onSearchChange,
    onSpecialtyFilter,
    onPositionFilter,
    onPositionFilters,
    onLanguageFilter,
    onLanguageFilters,
    onServiceTypeFilter,
    onServiceTypeFilters,
    onRatingFilter,
    onRatingFilters,
    onExperienceFilter,
    onExperienceFilters,
    onAvailabilityFilter,
    onConsultationTypeFilter,
    onGenderFilter,
    onGenderFilters,
    onPriceFilter,
}) => {
    const dispatch = useAppDispatch();
    const { positions } = useAppSelector((state) => state.position);
    const { languages } = useAppSelector((state) => state.language);
    const { serviceTypes } = useAppSelector((state) => state.serviceType);

    const [searchTerm, setSearchTerm] = useState('');
    const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>(() =>
        mockFilterData.reduce(
            (acc, section) => {
                acc[section.title] = true;
                return acc;
            },
            {} as { [key: string]: boolean }
        )
    );

    // Debounced search function
    const debouncedSearch = useCallback(
        (() => {
            let timeoutId: NodeJS.Timeout;
            return (value: string) => {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    if (onSearchChange) {
                        console.log(
                            'SideBar: debounced search calling onSearchChange with:',
                            value
                        );
                        onSearchChange(value);
                    }
                }, 300); // 300ms delay
            };
        })(),
        [onSearchChange]
    );
    const [viewMoreSections, setViewMoreSections] = useState<{ [key: string]: boolean }>({});
    const [priceRange, setPriceRange] = useState<number[]>([200000, 1000000]);
    const [checkedOptions, setCheckedOptions] = useState<{ [key: string]: boolean }>(() =>
        mockFilterData.reduce(
            (acc, section) => {
                section.options.forEach((option) => {
                    acc[option.id] = false;
                });
                return acc;
            },
            {} as { [key: string]: boolean }
        )
    );

    // Load data on component mount
    useEffect(() => {
        dispatch(getPositionsAsync());
        dispatch(getLanguagesAsync());
        dispatch(getServiceTypesAsync());
    }, [dispatch]);

    // Create dynamic filter data from Redux
    const dynamicFilterData = useMemo(() => {
        const baseData = [...mockFilterData];

        // Update Học vị (Positions) section with real data
        const positionSectionIndex = baseData.findIndex((section) => section.title === 'Học vị');
        if (positionSectionIndex !== -1) {
            baseData[positionSectionIndex] = {
                ...baseData[positionSectionIndex],
                options: positions.map((position) => ({
                    id: `position-${position.id}`,
                    label: position.name,
                    count: position.doctorCount, // Real count from backend
                })),
            };
        }

        // Update Ngôn ngữ (Languages) section with real data
        const languageSectionIndex = baseData.findIndex((section) => section.title === 'Ngôn ngữ');
        if (languageSectionIndex !== -1) {
            baseData[languageSectionIndex] = {
                ...baseData[languageSectionIndex],
                options: languages.map((language) => ({
                    id: `language-${language.id}`,
                    label: language.name,
                })),
            };
        }

        // Update Loại hình dịch vụ (Service Types) section with real data
        const serviceTypeSectionIndex = baseData.findIndex(
            (section) => section.title === 'Loại hình dịch vụ'
        );
        if (serviceTypeSectionIndex !== -1) {
            baseData[serviceTypeSectionIndex] = {
                ...baseData[serviceTypeSectionIndex],
                options: serviceTypes.map((serviceType) => ({
                    id: `serviceType-${serviceType.id}`,
                    label: serviceType.name,
                })),
            };
        }

        return baseData;
    }, [positions, languages, serviceTypes]);

    // Lọc dữ liệu theo từ khóa tìm kiếm và ẩn section không có data
    const filteredSections = useMemo(() => {
        let sections = dynamicFilterData;

        // Ẩn section không có data (trừ các section luôn hiển thị)
        sections = sections.filter((section) => {
            const alwaysShowSections = [
                'Giá cả',
                'Đánh giá',
                'Kinh nghiệm',
                'Lịch trống',
                'Loại tư vấn',
                'Giới tính',
            ];
            if (alwaysShowSections.includes(section.title)) {
                return true;
            }
            return section.options.length > 0;
        });

        // Lọc theo search term
        if (searchTerm) {
            sections = sections
                .map((section) => ({
                    ...section,
                    options: section.options.filter((option) =>
                        option.label.toLowerCase().includes(searchTerm.toLowerCase())
                    ),
                }))
                .filter((section) => section.options.length > 0);
        }

        return sections;
    }, [searchTerm, dynamicFilterData]);

    const toggleSection = (sectionTitle: string): void => {
        setExpandedSections((prev) => ({
            ...prev,
            [sectionTitle]: !prev[sectionTitle],
        }));
    };

    const toggleViewMore = (sectionTitle: string): void => {
        setViewMoreSections((prev) => ({
            ...prev,
            [sectionTitle]: !prev[sectionTitle],
        }));
    };

    const handlePriceChange = (_event: Event, newValue: number | number[]): void => {
        const newRange = newValue as number[];
        setPriceRange(newRange);
        // Call price filter callback
        if (onPriceFilter) {
            console.log('SideBar: calling onPriceFilter with:', {
                min: newRange[0],
                max: newRange[1],
            });
            onPriceFilter({ min: newRange[0], max: newRange[1] });
        }
    };

    const handleCheckboxChange = (id: string, sectionTitle: string): void => {
        const isChecked = !checkedOptions[id];
        console.log('SideBar checkbox changed:', { id, sectionTitle, isChecked });

        // Update checked options state first
        const newCheckedOptions = {
            ...checkedOptions,
            [id]: isChecked,
        };
        setCheckedOptions(newCheckedOptions);

        // Get all checked options for this section after the state update
        const getCheckedOptionsForSection = (sectionTitle: string): string[] => {
            const section = dynamicFilterData.find((s) => s.title === sectionTitle);
            if (!section) return [];

            return section.options
                .filter((option) => newCheckedOptions[option.id]) // Use updated state
                .map((option) => {
                    if (sectionTitle === 'Học vị') return option.id.replace('position-', '');
                    if (sectionTitle === 'Ngôn ngữ') return option.id.replace('language-', '');
                    if (sectionTitle === 'Loại hình dịch vụ')
                        return option.id.replace('serviceType-', '');
                    if (sectionTitle === 'Giới tính') {
                        // Map gender IDs to Gender enum values
                        const genderMap: { [key: string]: string } = {
                            'checkebox-sm14': 'MALE',
                            'checkebox-sm15': 'FEMALE',
                            'checkebox-sm16': 'OTHER',
                        };
                        return genderMap[option.id] || option.id;
                    }
                    if (sectionTitle === 'Đánh giá') {
                        // Map rating IDs to numbers
                        const ratingMap: { [key: string]: number } = {
                            'checkebox-sm46': 5,
                            'checkebox-sm47': 4,
                            'checkebox-sm48': 3,
                            'checkebox-sm49': 2,
                            'checkebox-sm50': 1,
                        };
                        return ratingMap[option.id]?.toString() || option.id;
                    }
                    if (sectionTitle === 'Kinh nghiệm') {
                        // Map experience IDs to ranges with correct property names for backend
                        // Fixed ranges to avoid overlap
                        const experienceMap: {
                            [key: string]: { MinYears: number; MaxYears: number };
                        } = {
                            'checkebox-sm22': { MinYears: 0, MaxYears: 1 }, // Dưới 2 năm (0-1 năm)
                            'checkebox-sm23': { MinYears: 2, MaxYears: 4 }, // Từ 2 – 5 năm (2-4 năm)
                            'checkebox-sm24': { MinYears: 5, MaxYears: 9 }, // Từ 5 – 10 năm (5-9 năm)
                            'checkebox-sm25': { MinYears: 10, MaxYears: 19 }, // Từ 10 – 20 năm (10-19 năm)
                            'checkebox-sm26': { MinYears: 20, MaxYears: 100 }, // Trên 20 năm (20+ năm)
                        };
                        return experienceMap[option.id]
                            ? JSON.stringify(experienceMap[option.id])
                            : option.id;
                    }
                    return option.id;
                });
        };

        // Call appropriate callback based on section
        if (sectionTitle === 'Học vị') {
            const checkedPositionIds = getCheckedOptionsForSection('Học vị');
            if (onPositionFilters) {
                console.log('Calling onPositionFilters with:', checkedPositionIds);
                onPositionFilters(checkedPositionIds);
            } else if (onPositionFilter) {
                const positionId = isChecked ? id.replace('position-', '') : '';
                console.log('Calling onPositionFilter with:', positionId);
                onPositionFilter(positionId);
            }
        } else if (sectionTitle === 'Ngôn ngữ') {
            const checkedLanguageIds = getCheckedOptionsForSection('Ngôn ngữ');
            if (onLanguageFilters) {
                console.log('Calling onLanguageFilters with:', checkedLanguageIds);
                onLanguageFilters(checkedLanguageIds);
            } else if (onLanguageFilter) {
                const languageId = isChecked ? id.replace('language-', '') : '';
                console.log('Calling onLanguageFilter with:', languageId);
                onLanguageFilter(languageId);
            }
        } else if (sectionTitle === 'Loại hình dịch vụ') {
            const checkedServiceTypeIds = getCheckedOptionsForSection('Loại hình dịch vụ');
            if (onServiceTypeFilters) {
                console.log('Calling onServiceTypeFilters with:', checkedServiceTypeIds);
                onServiceTypeFilters(checkedServiceTypeIds);
            } else if (onServiceTypeFilter) {
                const serviceTypeId = isChecked ? id.replace('serviceType-', '') : '';
                console.log('Calling onServiceTypeFilter with:', serviceTypeId);
                onServiceTypeFilter(serviceTypeId);
            }
        } else if (sectionTitle === 'Đánh giá') {
            const checkedRatings = getCheckedOptionsForSection('Đánh giá');
            if (onRatingFilters) {
                console.log('Calling onRatingFilters with:', checkedRatings);
                onRatingFilters(checkedRatings);
            } else if (onRatingFilter) {
                const rating = isChecked ? id : '';
                console.log('Calling onRatingFilter with:', rating);
                onRatingFilter(rating);
            }
        } else if (sectionTitle === 'Kinh nghiệm') {
            const checkedExperiences = getCheckedOptionsForSection('Kinh nghiệm');
            if (onExperienceFilters) {
                console.log('Calling onExperienceFilters with:', checkedExperiences);
                onExperienceFilters(checkedExperiences);
            } else if (onExperienceFilter) {
                const experience = isChecked ? id : '';
                console.log('Calling onExperienceFilter with:', experience);
                onExperienceFilter(experience);
            }
        } else if (sectionTitle === 'Lịch trống' && onAvailabilityFilter) {
            const availability = isChecked ? id : '';
            console.log('Calling onAvailabilityFilter with:', availability);
            onAvailabilityFilter(availability);
        } else if (sectionTitle === 'Loại tư vấn' && onConsultationTypeFilter) {
            const consultationType = isChecked ? id : '';
            console.log('Calling onConsultationTypeFilter with:', consultationType);
            onConsultationTypeFilter(consultationType);
        } else if (sectionTitle === 'Giới tính') {
            const checkedGenders = getCheckedOptionsForSection('Giới tính');
            if (onGenderFilters) {
                console.log('Calling onGenderFilters with:', checkedGenders);
                onGenderFilters(checkedGenders);
            } else if (onGenderFilter) {
                const gender = isChecked ? id : '';
                console.log('Calling onGenderFilter with:', gender);
                onGenderFilter(gender);
            }
        }
    };

    const handleClearAll = (): void => {
        setSearchTerm('');
        setPriceRange([200000, 1000000]);
        setCheckedOptions({});
        setViewMoreSections({});

        // Clear all filters by calling callbacks with empty values
        if (onSearchChange) onSearchChange('');
        if (onSpecialtyFilter) onSpecialtyFilter('');
        if (onPositionFilter) onPositionFilter('');
        if (onPositionFilters) onPositionFilters([]);
        if (onLanguageFilter) onLanguageFilter('');
        if (onLanguageFilters) onLanguageFilters([]);
        if (onServiceTypeFilter) onServiceTypeFilter('');
        if (onServiceTypeFilters) onServiceTypeFilters([]);
        if (onRatingFilter) onRatingFilter('');
        if (onRatingFilters) onRatingFilters([]);
        if (onExperienceFilter) onExperienceFilter('');
        if (onExperienceFilters) onExperienceFilters([]);
        if (onAvailabilityFilter) onAvailabilityFilter('');
        if (onConsultationTypeFilter) onConsultationTypeFilter('');
        if (onGenderFilter) onGenderFilter('');
        if (onGenderFilters) onGenderFilters([]);
        if (onPriceFilter) onPriceFilter({ min: 0, max: 10000000 });
    };

    const valueLabelFormat = (value: number): string => formatVND(value);

    return (
        <div className="col-xl-3">
            <div className="card filter-lists">
                <div className="card-header">
                    <div className="d-flex align-items-center filter-head justify-content-between">
                        <h4>Bộ lọc</h4>
                        <Link to="#" className="btn btn-light btn-sm" onClick={handleClearAll}>
                            Xóa tất cả
                        </Link>
                    </div>
                    <div className="filter-input">
                        <div className="position-relative input-icon">
                            <input
                                type="text"
                                className="form-control"
                                value={searchTerm}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setSearchTerm(value);
                                    // Call debounced search
                                    debouncedSearch(value);
                                }}
                                placeholder="Tìm kiếm..."
                            />
                            <span>
                                <i className="isax isax-search-normal-1"></i>
                            </span>
                        </div>
                    </div>
                    {filteredSections.length === 0 && searchTerm && (
                        <p className="text-center mt-3">Không tìm thấy kết quả phù hợp</p>
                    )}
                </div>
                <div className="card-body p-0">
                    {filteredSections.map((section, index) => (
                        <div className="accordion-item border-bottom" key={section.title}>
                            <div className="accordion-header" id={`heading${index + 1}`}>
                                <div
                                    className="accordion-button"
                                    onClick={() => toggleSection(section.title)}
                                    aria-controls={`collapse${index + 1}`}
                                    role="button"
                                >
                                    <div className="d-flex align-items-center w-100">
                                        <h6 className={styles.h6Custom}>{section.title}</h6>
                                        <div className="ms-auto">
                                            <span>
                                                <i
                                                    className={clsx(
                                                        'fas',
                                                        expandedSections[section.title]
                                                            ? 'fa-chevron-up'
                                                            : 'fa-chevron-down',
                                                        styles.iconCircle
                                                    )}
                                                ></i>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div
                                id={`collapse${index + 1}`}
                                className={clsx(
                                    'accordion-collapse',
                                    expandedSections[section.title] ? 'show' : 'collapse',
                                    styles.accordionCollapse
                                )}
                                aria-labelledby={`heading${index + 1}`}
                            >
                                <div className="accordion-body pt-3">
                                    {section.title === 'Giá cả' ? (
                                        <div className="filter-range">
                                            <PrettoSlider
                                                value={priceRange}
                                                onChange={handlePriceChange}
                                                valueLabelDisplay="on"
                                                valueLabelFormat={valueLabelFormat}
                                                min={0}
                                                max={10000000}
                                                aria-label="pretto slider"
                                            />
                                            <p className={styles.labelCustom}>
                                                Giá: {formatVND(priceRange[0])} -{' '}
                                                {formatVND(priceRange[1])}
                                            </p>
                                        </div>
                                    ) : (
                                        <>
                                            {(section.title === 'Đánh giá'
                                                ? section.options
                                                : section.options.slice(
                                                      0,
                                                      viewMoreSections[section.title]
                                                          ? section.options.length
                                                          : 3
                                                  )
                                            ).map((option) => (
                                                <div
                                                    className="d-flex align-items-center justify-content-between mb-2"
                                                    key={option.id}
                                                >
                                                    <div className="form-check">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            value=""
                                                            id={option.id}
                                                            checked={
                                                                checkedOptions[option.id] || false
                                                            }
                                                            onChange={() =>
                                                                handleCheckboxChange(
                                                                    option.id,
                                                                    section.title
                                                                )
                                                            }
                                                        />
                                                        <label
                                                            className={styles.labelCustom}
                                                            htmlFor={option.id}
                                                        >
                                                            {section.title === 'Đánh giá' ? (
                                                                <>
                                                                    <span>
                                                                        {[
                                                                            ...Array(
                                                                                parseInt(
                                                                                    option.label.charAt(
                                                                                        0
                                                                                    )
                                                                                )
                                                                            ),
                                                                        ].map((_, i) => (
                                                                            <i
                                                                                key={i}
                                                                                className="fa-solid fa-star text-orange me-1"
                                                                            ></i>
                                                                        ))}
                                                                        {[
                                                                            ...Array(
                                                                                5 -
                                                                                    parseInt(
                                                                                        option.label.charAt(
                                                                                            0
                                                                                        )
                                                                                    )
                                                                            ),
                                                                        ].map((_, i) => (
                                                                            <i
                                                                                key={i}
                                                                                className="fa-regular fa-star text-orange me-1"
                                                                            ></i>
                                                                        ))}
                                                                    </span>
                                                                    {option.label}
                                                                </>
                                                            ) : (
                                                                option.label
                                                            )}
                                                        </label>
                                                    </div>
                                                    {option.count !== undefined && (
                                                        <span className={styles.filterBadgeCustom}>
                                                            {option.count}
                                                        </span>
                                                    )}
                                                </div>
                                            ))}
                                            {section.hasViewMore &&
                                                section.title !== 'Đánh giá' &&
                                                section.options.length > 3 && (
                                                    <div className="view-content">
                                                        <div
                                                            className={`viewall-${index + 1}`}
                                                        ></div>
                                                        <div className="view-all">
                                                            <Link
                                                                to="#"
                                                                className={clsx(
                                                                    `viewall-button-${index + 1}`,
                                                                    'btn btn-light btn-sm'
                                                                )}
                                                                onClick={() =>
                                                                    toggleViewMore(section.title)
                                                                }
                                                            >
                                                                {viewMoreSections[section.title]
                                                                    ? 'Thu gọn'
                                                                    : 'Xem thêm'}
                                                            </Link>
                                                        </div>
                                                    </div>
                                                )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SideBar;
