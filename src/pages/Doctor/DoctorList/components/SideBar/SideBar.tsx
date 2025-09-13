import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import styles from './SideBar.module.scss';
import { Slider, styled } from '@mui/material';

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
        options: [
            { id: 'checkebox-sm60', label: 'Bác sĩ', count: 40 },
            { id: 'checkebox-sm61', label: 'Thạc sĩ', count: 25 },
            { id: 'checkebox-sm62', label: 'Tiến sĩ', count: 15 },
            { id: 'checkebox-sm63', label: 'Phó Giáo sư', count: 10 },
            { id: 'checkebox-sm64', label: 'Giáo sư', count: 5 },
        ],
        hasViewMore: true,
    },
    {
        title: 'Kinh nghiệm',
        options: [
            { id: 'checkebox-sm22', label: 'Dưới 2 năm' },
            { id: 'checkebox-sm23', label: 'Trên 2 năm' },
            { id: 'checkebox-sm24', label: 'Trên 5 năm' },
            { id: 'checkebox-sm25', label: 'Trên 7 năm' },
            { id: 'checkebox-sm26', label: 'Trên 10 năm' },
            { id: 'checkebox-sm27', label: 'Trên 15 năm' },
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
            { id: 'checkebox-sm14', label: 'Nam', count: 50 },
            { id: 'checkebox-sm15', label: 'Nữ', count: 45 },
            { id: 'checkebox-sm16', label: 'Khác', count: 5 },
        ],
    },
    {
        title: 'Ngôn ngữ',
        options: [
            { id: 'checkebox-sm40', label: 'Tiếng Anh' },
            { id: 'checkebox-sm41', label: 'Tiếng Pháp' },
            { id: 'checkebox-sm42', label: 'Tiếng Tây Ban Nha' },
            { id: 'checkebox-sm43', label: 'Tiếng Đức' },
            { id: 'checkebox-sm44', label: 'Tiếng Nhật' },
            { id: 'checkebox-sm45', label: 'Tiếng Hàn' },
        ],
        hasViewMore: true,
    },
    {
        title: 'Loại hình dịch vụ',
        options: [
            { id: 'checkebox-sm56', label: 'Khám bệnh định kỳ' },
            { id: 'checkebox-sm57', label: 'Tư vấn sức khỏe' },
            { id: 'checkebox-sm58', label: 'Chăm sóc tại nhà' },
            { id: 'checkebox-sm59', label: 'Xét nghiệm y khoa' },
        ],
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

const SideBar: React.FC = () => {
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

    // Lọc dữ liệu theo từ khóa tìm kiếm
    const filteredSections = useMemo(() => {
        if (!searchTerm) return mockFilterData;
        return mockFilterData
            .map((section) => ({
                ...section,
                options: section.options.filter((option) =>
                    option.label.toLowerCase().includes(searchTerm.toLowerCase())
                ),
            }))
            .filter((section) => section.options.length > 0); // Chỉ giữ section có options
    }, [searchTerm]);

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
        setPriceRange(newValue as number[]);
    };

    const handleCheckboxChange = (id: string): void => {
        setCheckedOptions((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const handleClearAll = (): void => {
        setSearchTerm('');
        setPriceRange([200000, 1000000]);
        setCheckedOptions(
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
        setViewMoreSections({});
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
                                onChange={(e) => setSearchTerm(e.target.value)}
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
                                                            checked={checkedOptions[option.id]}
                                                            onChange={() =>
                                                                handleCheckboxChange(option.id)
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
                                                    {option.count && (
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
