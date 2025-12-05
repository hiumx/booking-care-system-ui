import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X, Search, Loader2 } from 'lucide-react';
import ModalItem from './components/ModalItem';
import styles from './Modal.module.scss';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onApply: (selectedItems: string[], searchTerm: string) => void;
    items: Array<{
        id: string;
        name: string;
        icon?: React.ComponentType<{ className?: string }>;
        imageUrl?: string;
        color?: string;
    }>;
    title: string;
    itemType?: 'hospital' | 'specialty';
    initialSelectedItems?: string[]; // Add initial selected items
}

const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    onApply,
    items,
    title,
    itemType = 'specialty',
    initialSelectedItems = [],
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [selectedItems, setSelectedItems] = useState<string[]>(initialSelectedItems);
    const [isSearching, setIsSearching] = useState(false);

    // Sync selectedItems with initialSelectedItems whenever it changes
    useEffect(() => {
        setSelectedItems(initialSelectedItems || []);
    }, [initialSelectedItems]);

    // Debounce search term - wait 1 seconds after user stops typing
    useEffect(() => {
        // Show loading if searchTerm is different from debouncedSearchTerm
        if (searchTerm !== debouncedSearchTerm && searchTerm) {
            setIsSearching(true);
        } else {
            setIsSearching(false);
        }

        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
            setIsSearching(false);
        }, 1000);

        return () => {
            clearTimeout(timer);
        };
    }, [searchTerm, debouncedSearchTerm]);

    // Reset debounced search when modal closes
    useEffect(() => {
        if (!isOpen) {
            setSearchTerm('');
            setDebouncedSearchTerm('');
        }
    }, [isOpen]);

    // Thêm useEffect để xử lý cuộn trang
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'; // Ngăn cuộn trang
        } else {
            document.body.style.overflow = ''; // Khôi phục cuộn
        }

        // Cleanup khi component unmount hoặc isOpen thay đổi
        return () => {
            document.body.style.overflow = ''; // Đảm bảo khôi phục khi component bị hủy
        };
    }, [isOpen]);

    const handleItemToggle = (itemId: string) => {
        setSelectedItems((prev) => {
            // For hospital and specialty, only allow single selection
            if (itemType === 'hospital' || itemType === 'specialty') {
                return prev.includes(itemId) ? [] : [itemId];
            }
            // For other types, allow multiple selection
            return prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId];
        });
    };

    const handleClearFilter = () => {
        setSearchTerm('');
        setDebouncedSearchTerm('');
        setSelectedItems([]);
        // Clear selection in parent component and close modal
        onApply([], '');
        onClose();
    };

    const handleApply = () => {
        onApply(selectedItems, debouncedSearchTerm);
        onClose();
    };

    // Use debounced search term for filtering
    const filteredItems = items.filter((item) =>
        item.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className={styles.modalOverlay}>
            <div className={styles.modalContainer}>
                {/* Header */}
                <div className={styles.header}>
                    <h2 className={styles.title}>{title}</h2>
                    <button onClick={onClose} className={styles.closeButton}>
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Search Input */}
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

                {/* Item List */}
                <div className={styles.specialtyList}>
                    <div className={styles.scrollContainer}>
                        {filteredItems.length > 0 ? (
                            filteredItems.map((item) => (
                                <ModalItem
                                    key={item.id}
                                    id={item.id}
                                    name={item.name}
                                    icon={item.icon}
                                    imageUrl={item.imageUrl}
                                    color={item.color}
                                    isSelected={selectedItems.includes(item.id)}
                                    onToggle={handleItemToggle}
                                    itemType={itemType}
                                />
                            ))
                        ) : (
                            <div className={styles.noResults}>
                                {isSearching ? (
                                    <>
                                        <Loader2 className={styles.loadingIcon} size={24} />
                                        <span>Đang tìm kiếm...</span>
                                    </>
                                ) : (
                                    <>
                                        <Search className={styles.iconPrimary} size={24} />
                                        <span>
                                            {debouncedSearchTerm
                                                ? 'Không tìm thấy kết quả'
                                                : 'Không có dữ liệu'}
                                        </span>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className={styles.actionButtons}>
                    <button onClick={handleClearFilter} className={styles.clearButton}>
                        Xóa bỏ lọc
                    </button>
                    <button onClick={handleApply} className={styles.applyButton}>
                        Áp dụng
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default Modal;
