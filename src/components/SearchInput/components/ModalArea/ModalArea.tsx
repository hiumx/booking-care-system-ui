import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X, Search } from 'lucide-react';
import clsx from 'clsx';
import styles from './ModalArea.module.scss';

interface District {
    id: string;
    name: string;
    provinceId: string;
}

interface Province {
    id: string;
    name: string;
}

interface ModalAreaProps {
    isOpen: boolean;
    onClose: () => void;
    onApply: (selectedProvince: string, selectedDistrict: string) => void;
}

const ModalArea: React.FC<ModalAreaProps> = ({ isOpen, onClose, onApply }) => {
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [selectedProvinceId, setSelectedProvinceId] = useState<string>('');
    const [selectedDistrictId, setSelectedDistrictId] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        // Lấy danh sách tỉnh/thành
        fetch('https://provinces.open-api.vn/api/?depth=1')
            .then((response) => response.json())
            .then((data) => {
                const provinceData = data.map((item: any) => ({
                    id: item.code.toString(),
                    name: item.name,
                }));
                setProvinces(provinceData);
                // Lấy danh sách quận/huyện sau khi tỉnh/thành được lấy
                fetch('https://provinces.open-api.vn/api/?depth=2')
                    .then((response) => response.json())
                    .then((data) => {
                        const districtData = data.flatMap((province: any) =>
                            province.districts.map((district: any) => ({
                                id: district.code.toString(),
                                name: district.name,
                                provinceId: province.code.toString(),
                            }))
                        );
                        setDistricts(districtData);
                        // Đặt tỉnh/thành mặc định chỉ sau khi quận/huyện được lấy
                        if (provinceData.length > 0) {
                            setSelectedProvinceId(provinceData[0].id);
                        }
                        setIsLoading(false);
                    })
                    .catch((error) => {
                        console.error('Lỗi khi lấy quận/huyện:', error);
                        setIsLoading(false);
                    });
            })
            .catch((error) => {
                console.error('Lỗi khi lấy tỉnh/thành:', error);
                setIsLoading(false);
            });
    }, []);

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

    // Lọc tỉnh/thành và quận/huyện dựa trên từ khóa tìm kiếm
    const filteredProvinces = provinces.filter((province) =>
        province.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredDistricts = districts
        .filter((district) => district.provinceId === selectedProvinceId)
        .filter((district) => district.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const selectedProvince = provinces.find((p) => p.id === selectedProvinceId);
    const selectedDistrict = districts.find((d) => d.id === selectedDistrictId);

    const handleProvinceClick = (provinceId: string) => {
        setSelectedProvinceId(provinceId);
        setSelectedDistrictId(''); // Đặt lại lựa chọn quận/huyện
        setSearchTerm(''); // Xóa từ khóa tìm kiếm
    };

    const handleDistrictClick = (districtId: string) => {
        setSelectedDistrictId(districtId);
    };

    const handleClearFilter = () => {
        setSearchTerm('');
        setSelectedProvinceId(provinces.length > 0 ? provinces[0].id : '');
        setSelectedDistrictId('');
    };

    const handleApply = () => {
        if (selectedProvince && selectedDistrict) {
            onApply(`${selectedProvince.name} - ${selectedDistrict.name}`, selectedDistrictId);
        } else if (selectedProvince) {
            onApply(selectedProvince.name, selectedProvinceId);
        }
        onClose();
    };

    return ReactDOM.createPortal(
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h3 className={styles.modalTitle}>Chọn khu vực</h3>
                    <div className={styles.modalActions}>
                        <button className={styles.clearButton} onClick={handleClearFilter}>
                            Xóa bộ lọc
                        </button>
                        <button className={styles.closeButton} onClick={onClose}>
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Ô tìm kiếm */}
                <div className={styles.searchContainer}>
                    <div className={styles.searchInputWrapper}>
                        <Search className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Tìm theo tên"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={styles.searchInput}
                        />
                    </div>
                </div>

                <div className={styles.modalBody}>
                    <div className={styles.provinceList}>
                        {filteredProvinces.length > 0 ? (
                            filteredProvinces.map((province) => (
                                <div
                                    key={province.id}
                                    className={clsx(
                                        styles.provinceItem,
                                        selectedProvinceId === province.id && styles.active
                                    )}
                                    onClick={() => handleProvinceClick(province.id)}
                                >
                                    {province.name}
                                </div>
                            ))
                        ) : (
                            <div className={styles.noResults}>Không tìm thấy tỉnh/thành</div>
                        )}
                    </div>

                    <div className={styles.districtList}>
                        {selectedProvinceId ? (
                            filteredDistricts.length > 0 ? (
                                filteredDistricts.map((district) => (
                                    <div
                                        key={district.id}
                                        className={clsx(
                                            styles.districtItem,
                                            selectedDistrictId === district.id && styles.active
                                        )}
                                        onClick={() => handleDistrictClick(district.id)}
                                    >
                                        {district.name}
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
