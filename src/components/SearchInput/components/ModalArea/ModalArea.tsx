import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X, Search, Check } from 'lucide-react';
import clsx from 'clsx';
import styles from './ModalArea.module.scss';
import LocationService, { Province, District } from '@/services/location.service';

// Remove duplicate interfaces as they are now imported from LocationService

interface ModalAreaProps {
    isOpen: boolean;
    onClose: () => void;
    onApply: (areaDisplay: string, locationId: string, provinceId?: string) => void;
    selectedProvinceId?: string;
    selectedDistrictId?: string;
}

const ModalArea: React.FC<ModalAreaProps> = ({
    isOpen,
    onClose,
    onApply,
    selectedProvinceId: initialProvinceId,
    selectedDistrictId: initialDistrictId,
}) => {
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [selectedProvinceId, setSelectedProvinceId] = useState<string>('');
    const [selectedDistrictId, setSelectedDistrictId] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadLocationData = async () => {
            setIsLoading(true);
            try {
                // Load provinces
                const provincesResponse = await LocationService.getProvinces();
                if (provincesResponse.success && provincesResponse.data) {
                    setProvinces(provincesResponse.data);

                    // Load all districts
                    const districtsResponse = await LocationService.getAllDistricts();
                    if (districtsResponse.success && districtsResponse.data) {
                        setDistricts(districtsResponse.data);
                    }

                    // Don't set any default selection - start with empty state
                } else {
                    console.error('Failed to load provinces:', provincesResponse.message);
                }
            } catch (error) {
                console.error('Error loading location data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (isOpen) {
            loadLocationData();
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // Update state when props change
    useEffect(() => {
        setSelectedProvinceId(initialProvinceId || '');
        setSelectedDistrictId(initialDistrictId || '');
    }, [initialProvinceId, initialDistrictId]);

    // Xử lý sự kiện bàn phím cho modalOverlay
    const handleOverlayKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            onClose();
        }
    };

    // Xử lý sự kiện bàn phím cho modalContent
    const handleContentKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Escape') {
            e.preventDefault();
            onClose();
        }
    };

    // Xử lý sự kiện bàn phím cho province
    const handleProvinceKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, provinceId: string) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleProvinceClick(provinceId);
        }
    };

    // Xử lý sự kiện bàn phím cho district
    const handleDistrictKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, districtId: string) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleDistrictClick(districtId);
        }
    };

    // Helper function to find first matching district
    const findFirstMatchingDistrict = (searchTerm: string) => {
        return districts
            .filter((district) => district.provinceId === selectedProvinceId)
            .filter((district) => district.name.toLowerCase().includes(searchTerm.toLowerCase()));
    };

    // Xử lý sự kiện bàn phím cho search input
    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearchEnter();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            onClose();
        }
    };

    // Handle Enter key in search
    const handleSearchEnter = () => {
        if (!searchTerm) return;

        const filteredProvinces = filterProvincesBySearch(provinces, searchTerm);
        if (filteredProvinces.length > 0) {
            handleProvinceClick(filteredProvinces[0].id);
            return;
        }

        const filteredDistricts = findFirstMatchingDistrict(searchTerm);
        if (filteredDistricts.length > 0) {
            handleDistrictClick(filteredDistricts[0].id);
        }
    };

    // Helper function to get selection text
    const getSelectionText = () => {
        if (selectedProvince && selectedDistrict) {
            return `Đã chọn: ${selectedProvince.name} - ${selectedDistrict.name}`;
        }
        if (selectedProvince) {
            return `Đã chọn: ${selectedProvince.name}`;
        }
        return null;
    };

    // Helper function to render current selection
    const renderCurrentSelection = () => {
        const hasSelection =
            selectedProvinceId &&
            selectedProvinceId !== '' &&
            (selectedProvince || selectedDistrict);
        if (!hasSelection) return null;

        const selectionText = getSelectionText();
        if (!selectionText) return null;

        return (
            <div className={styles.currentSelection}>
                <span className={styles.selectionText}>{selectionText}</span>
            </div>
        );
    };

    if (!isOpen) return null;

    if (isLoading) {
        return ReactDOM.createPortal(
            <div className={styles.modalOverlay}>
                <div className={styles.modalContent}>
                    <div className={styles.loading}>Đang tải...</div>
                </div>
            </div>,
            document.body
        );
    }

    // Helper function to sort provinces
    const sortProvinces = (provinces: Province[]) => {
        return provinces.sort((a, b) => {
            // Nếu có tỉnh đã chọn, đưa nó lên đầu
            if (selectedProvinceId && selectedProvinceId !== '') {
                if (a.id === selectedProvinceId) return -1;
                if (b.id === selectedProvinceId) return 1;
            }
            // Sắp xếp theo tên
            return a.name.localeCompare(b.name);
        });
    };

    // Helper function to sort districts
    const sortDistricts = (districts: District[]) => {
        return districts.sort((a, b) => {
            // Nếu có quận đã chọn, đưa nó lên đầu
            if (selectedDistrictId && selectedDistrictId !== '') {
                if (a.id === selectedDistrictId) return -1;
                if (b.id === selectedDistrictId) return 1;
            }
            // Sắp xếp theo tên
            return a.name.localeCompare(b.name);
        });
    };

    // Helper function to filter provinces by search term
    const filterProvincesBySearch = (provinces: Province[], searchTerm: string) => {
        return provinces.filter((province) =>
            province.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    // Helper function to filter districts by search term
    const filterDistrictsBySearch = (districts: District[], searchTerm: string) => {
        return districts.filter((district) =>
            district.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    const filteredProvinces = sortProvinces(filterProvincesBySearch(provinces, searchTerm));

    const filteredDistricts = sortDistricts(
        filterDistrictsBySearch(
            districts.filter((district) => district.provinceId === selectedProvinceId),
            searchTerm
        )
    );

    const selectedProvince = provinces.find((p) => p.id === selectedProvinceId);
    const selectedDistrict = districts.find((d) => d.id === selectedDistrictId);

    const handleProvinceClick = (provinceId: string) => {
        setSelectedProvinceId(provinceId);
        setSelectedDistrictId('');
        setSearchTerm('');
    };

    const handleDistrictClick = (districtId: string) => {
        setSelectedDistrictId(districtId);
    };

    const handleClearFilter = () => {
        setSearchTerm('');
        setSelectedProvinceId('');
        setSelectedDistrictId('');
    };

    const handleApply = () => {
        if (selectedProvince && selectedDistrict) {
            onApply(
                `${selectedProvince.name} - ${selectedDistrict.name}`,
                selectedDistrictId,
                selectedProvinceId
            );
        } else if (selectedProvince) {
            onApply(selectedProvince.name, selectedProvinceId);
        }
        onClose();
    };

    return ReactDOM.createPortal(
        <div
            className={styles.modalOverlay}
            onClick={onClose}
            onKeyDown={handleOverlayKeyDown}
            tabIndex={0}
            role="button"
            aria-label="Đóng modal"
        >
            <div
                className={styles.modalContent}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={handleContentKeyDown}
                tabIndex={0}
                role="dialog"
                aria-modal="true"
            >
                <div className={styles.modalHeader}>
                    <div className={styles.modalTitleSection}>
                        <h3 className={styles.modalTitle}>Chọn khu vực</h3>
                        {renderCurrentSelection()}
                    </div>
                    <div className={styles.modalActions}>
                        <button className={styles.clearButton} onClick={handleClearFilter}>
                            Xóa bộ lọc
                        </button>
                        <button className={styles.closeButton} onClick={onClose}>
                            <X size={20} />
                        </button>
                    </div>
                </div>

                <div className={styles.searchContainer}>
                    <div className={styles.searchInputWrapper}>
                        <Search className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Tìm theo tên (Enter để chọn, Esc để đóng)"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleSearchKeyDown}
                            className={styles.searchInput}
                        />
                    </div>
                </div>

                <div className={styles.modalBody}>
                    <div
                        className={styles.provinceList}
                        role="listbox"
                        aria-label="Danh sách tỉnh/thành"
                    >
                        {filteredProvinces.length > 0 ? (
                            filteredProvinces.map((province) => (
                                <div
                                    key={province.id}
                                    className={clsx(
                                        styles.provinceItem,
                                        selectedProvinceId &&
                                            selectedProvinceId !== '' &&
                                            selectedProvinceId === province.id &&
                                            styles.active
                                    )}
                                    onClick={() => handleProvinceClick(province.id)}
                                    onKeyDown={(e) => handleProvinceKeyDown(e, province.id)}
                                    tabIndex={0}
                                    role="option"
                                    aria-selected={selectedProvinceId === province.id}
                                >
                                    <span className={styles.provinceName}>{province.name}</span>
                                    {selectedProvinceId &&
                                        selectedProvinceId !== '' &&
                                        selectedProvinceId === province.id && (
                                            <Check className={styles.checkIcon} size={16} />
                                        )}
                                </div>
                            ))
                        ) : (
                            <div className={styles.noResults}>Không tìm thấy tỉnh/thành</div>
                        )}
                    </div>

                    <div
                        className={styles.districtList}
                        role="listbox"
                        aria-label="Danh sách quận/huyện"
                    >
                        {selectedProvinceId && selectedProvinceId !== '' ? (
                            filteredDistricts.length > 0 ? (
                                filteredDistricts.map((district) => (
                                    <div
                                        key={district.id}
                                        className={clsx(
                                            styles.districtItem,
                                            selectedDistrictId &&
                                                selectedDistrictId !== '' &&
                                                selectedDistrictId === district.id &&
                                                styles.active
                                        )}
                                        onClick={() => handleDistrictClick(district.id)}
                                        onKeyDown={(e) => handleDistrictKeyDown(e, district.id)}
                                        tabIndex={0}
                                        role="option"
                                        aria-selected={selectedDistrictId === district.id}
                                    >
                                        <span className={styles.districtName}>{district.name}</span>
                                        {selectedDistrictId &&
                                            selectedDistrictId !== '' &&
                                            selectedDistrictId === district.id && (
                                                <Check className={styles.checkIcon} size={16} />
                                            )}
                                    </div>
                                ))
                            ) : (
                                <div className={styles.noResults}>
                                    {searchTerm
                                        ? 'Không tìm thấy quận/huyện'
                                        : 'Không có quận/huyện cho tỉnh/thành này'}
                                </div>
                            )
                        ) : (
                            <div className={styles.noResults}>Vui lòng chọn tỉnh/thành</div>
                        )}
                    </div>
                </div>

                {(selectedProvinceId || selectedDistrictId) && (
                    <div className={styles.modalFooter}>
                        <button className={styles.applyButton} onClick={handleApply}>
                            Áp dụng
                        </button>
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
};

export default ModalArea;
