import React, { useState } from 'react';
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
        title: 'Chuyên khoa',
        options: [
            { id: 'checkebox-sm2', label: 'Tiết niệu', count: 21 },
            { id: 'checkebox-sm3', label: 'Tâm thần học', count: 21 },
            { id: 'checkebox-sm4', label: 'Tim mạch', count: 21 },
            { id: 'checkebox-sm5', label: 'Nhi khoa', count: 21 },
            { id: 'checkebox-sm6', label: 'Tiết niệu', count: 21 },
            { id: 'checkebox-sm7', label: 'Thần kinh', count: 21 },
            { id: 'checkebox-sm8', label: 'Phổi', count: 21 },
            { id: 'checkebox-sm9', label: 'Chỉnh hình', count: 21 },
            { id: 'checkebox-sm10', label: 'Nội tiết', count: 21 },
        ],
        hasViewMore: true,
    },
    {
        title: 'Giới tính',
        options: [
            { id: 'checkebox-sm11', label: 'Nam', count: 21 },
            { id: 'checkebox-sm12', label: 'Nữ', count: 21 },
        ],
    },
    {
        title: 'Lịch trống',
        options: [
            { id: 'checkebox-sm13', label: 'Hôm nay' },
            { id: 'checkebox-sm14', label: 'Ngày mai' },
            { id: 'checkebox-sm15', label: 'Trong 7 ngày tới' },
            { id: 'checkebox-sm16', label: 'Trong 30 ngày tới' },
        ],
        hasViewMore: true,
    },
    {
        title: 'Giá cả',
        options: [],
    },
    {
        title: 'Kinh nghiệm',
        options: [
            { id: 'checkebox-sm21', label: 'Trên 2 năm' },
            { id: 'checkebox-sm22', label: 'Trên 5 năm' },
            { id: 'checkebox-sm23', label: 'Trên 7 năm' },
            { id: 'checkebox-sm24', label: 'Trên 10 năm' },
        ],
        hasViewMore: true,
    },
    {
        title: 'Phòng khám',
        options: [
            { id: 'checkebox-sm25', label: 'Phòng khám Nha khoa Nụ Cười Rạng Rỡ' },
            { id: 'checkebox-sm26', label: 'Phòng khám Chăm sóc Gia đình' },
            { id: 'checkebox-sm27', label: 'Phòng khám Sức khỏe Nhanh' },
            { id: 'checkebox-sm28', label: 'Phòng khám Phục hồi Chức năng' },
            { id: 'checkebox-sm29', label: 'Phòng khám Sức khỏe Phụ nữ Hoa Sen' },
        ],
        hasViewMore: true,
    },
    {
        title: 'Loại tư vấn',
        options: [
            { id: 'checkebox-sm30', label: 'Gọi thoại' },
            { id: 'checkebox-sm31', label: 'Gọi video' },
            { id: 'checkebox-sm32', label: 'Tư vấn tức thì' },
            { id: 'checkebox-sm33', label: 'Chat' },
        ],
    },
    {
        title: 'Ngôn ngữ',
        options: [
            { id: 'checkebox-sm34', label: 'Tiếng Anh' },
            { id: 'checkebox-sm35', label: 'Tiếng Pháp' },
            { id: 'checkebox-sm36', label: 'Tiếng Tây Ban Nha' },
            { id: 'checkebox-sm37', label: 'Tiếng Đức' },
        ],
    },
    {
        title: 'Đánh giá',
        options: [
            { id: 'checkebox-sm38', label: '5 Sao' },
            { id: 'checkebox-sm39', label: '4 Sao' },
            { id: 'checkebox-sm40', label: '3 Sao' },
            { id: 'checkebox-sm41', label: '2 Sao' },
            { id: 'checkebox-sm42', label: '1 Sao' },
        ],
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

// Hàm định dạng số tiền theo VND
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
                    acc[option.id] = false; // Mặc định không chọn bất kỳ input nào
                });
                return acc;
            },
            {} as { [key: string]: boolean }
        )
    );

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
                        <Link
                            to="#"
                            className="text-secondary text-decoration-underline"
                            onClick={handleClearAll}
                        >
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
                </div>
                <div className="card-body p-0">
                    {mockFilterData.map((section, index) => (
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
                                                ? section.options // luôn hiển thị toàn bộ đánh giá
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
                                                                    'text-secondary',
                                                                    'text-decoration-underline',
                                                                    styles.viewAllLink
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
