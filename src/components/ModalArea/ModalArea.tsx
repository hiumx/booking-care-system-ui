import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { X, Search, Check } from 'lucide-react';
import clsx from 'clsx';
import styles from './ModalArea.module.scss';
import LocationService, { Province, District } from '@/services/location.service';

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

    // Ensure native <dialog> is centered using showModal()
    const dialogRef = useRef<HTMLDialogElement | null>(null);
    useEffect(() => {
        const dialogEl = dialogRef.current;
        if (!isLoading && isOpen && dialogEl && !dialogEl.open) {
            try {
                dialogEl.showModal();
            } catch (err) {
                console.warn('showModal failed', err);
            }
        }
        return () => {
            if (dialogEl && dialogEl.open) {
                try {
                    dialogEl.close();
                } catch (err) {
                    console.warn('dialog close failed', err);
                }
            }
        };
    }, [isOpen, isLoading]);

    // Update state when props change
    useEffect(() => {
        setSelectedProvinceId(initialProvinceId || '');
        setSelectedDistrictId(initialDistrictId || '');
    }, [initialProvinceId, initialDistrictId]);

    // Xử lý sự kiện bàn phím cho modalContent
    const handleContentKeyDown = (e: React.KeyboardEvent<HTMLDialogElement>) => {
        if (e.key === 'Escape') {
            e.preventDefault();
            onClose();
        }
    };

    // Native buttons will handle keyboard activation

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

    const renderDistrictList = () => {
        if (!selectedProvinceId || selectedProvinceId === '') {
            return <div className={styles.noResults}>Vui lòng chọn tỉnh/thành</div>;
        }

        if (filteredDistricts.length === 0) {
            const message = searchTerm
                ? 'Không tìm thấy quận/huyện'
                : 'Không có quận/huyện cho tỉnh/thành này';
            return <div className={styles.noResults}>{message}</div>;
        }

        return filteredDistricts.map((district) => (
            <button
                key={district.id}
                type="button"
                className={clsx(
                    styles.districtItem,
                    selectedDistrictId &&
                        selectedDistrictId !== '' &&
                        selectedDistrictId === district.id &&
                        styles.active
                )}
                onClick={() => handleDistrictClick(district.id)}
                aria-pressed={selectedDistrictId === district.id}
            >
                <span className={styles.districtName}>{district.name}</span>
                {selectedDistrictId &&
                    selectedDistrictId !== '' &&
                    selectedDistrictId === district.id && (
                        <Check className={styles.checkIcon} size={16} />
                    )}
            </button>
        ));
    };

    return ReactDOM.createPortal(
        <div className={styles.modalOverlay} onClick={onClose} aria-label="Đóng modal">
            <dialog
                className={styles.modalContent}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={handleContentKeyDown}
                aria-modal="true"
                ref={dialogRef}
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
                    <div className={styles.provinceList} aria-label="Danh sách tỉnh/thành">
                        {filteredProvinces.length > 0 ? (
                            filteredProvinces.map((province) => (
                                <button
                                    key={province.id}
                                    type="button"
                                    className={clsx(
                                        styles.provinceItem,
                                        selectedProvinceId &&
                                            selectedProvinceId !== '' &&
                                            selectedProvinceId === province.id &&
                                            styles.active
                                    )}
                                    onClick={() => handleProvinceClick(province.id)}
                                    aria-pressed={selectedProvinceId === province.id}
                                >
                                    <span className={styles.provinceName}>{province.name}</span>
                                    {selectedProvinceId &&
                                        selectedProvinceId !== '' &&
                                        selectedProvinceId === province.id && (
                                            <Check className={styles.checkIcon} size={16} />
                                        )}
                                </button>
                            ))
                        ) : (
                            <div className={styles.noResults}>Không tìm thấy tỉnh/thành</div>
                        )}
                    </div>

                    <div className={styles.districtList} aria-label="Danh sách quận/huyện">
                        {renderDistrictList()}
                    </div>
                </div>

                {(selectedProvinceId || selectedDistrictId) && (
                    <div className={styles.modalFooter}>
                        <button className={styles.applyButton} onClick={handleApply}>
                            Áp dụng
                        </button>
                    </div>
                )}
            </dialog>
        </div>,
        document.body
    );
};

export default ModalArea;
