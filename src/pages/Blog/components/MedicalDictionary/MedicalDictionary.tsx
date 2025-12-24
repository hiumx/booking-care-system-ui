import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PATHS } from '@/routes/paths';
import styles from './MedicalDictionary.module.scss';
import BlogCard from '@/components/BLogCard';

const MedicalDictionary: React.FC = () => {
    const [activeTab, setActiveTab] = useState('thuoc');
    const navigate = useNavigate();

    const tabs = [
        { id: 'thuoc', label: 'Thuốc' },
        { id: 'duoclieu', label: 'Dược liệu' },
        { id: 'benh', label: 'Bệnh' },
        { id: 'cothe', label: 'Cơ thể' },
    ];

    const placeholderByTab: Record<string, string> = {
        thuoc: 'Nhập tên thuốc...',
        duoclieu: 'Nhập tên dược liệu...',
        benh: 'Nhập tên bệnh...',
        cothe: 'Nhập tên cơ quan/cấu trúc cơ thể...',
    };

    const alphabet = [
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G',
        'H',
        'I',
        'J',
        'K',
        'L',
        'M',
        'N',
        'O',
        'P',
        'Q',
        'R',
        'S',
        'T',
        'U',
        'V',
        'W',
        'X',
        'Y',
        'Z',
        '#',
    ];

    const medicines = [
        {
            id: 1,
            name: 'EFFERALGAN 500 mg',
            title: 'Viên sủi Efferalgan 500 mg: những điều bạn cần biết',
            author: 'ThS.DS Trương Văn Đạt',
            updateDate: 'Cập nhật: 27 Th4, 2022',
            image: 'https://cdn.youmed.vn/tin-tuc/wp-content/uploads/2024/12/lomexin-1000-mg-1-1-768x401.jpg',
        },
        {
            id: 2,
            name: 'MEDROL 4 mg (methylprednisolon)',
            title: 'Thuốc Medrol (methylprednisolone): Chỉ định, liều dùng và tác dụng phụ',
            author: 'Thạc sĩ, Dược sĩ Phan Tiểu Long',
            updateDate: 'Cập nhật: 29 Th4, 2022',
            image: 'https://cdn.youmed.vn/tin-tuc/wp-content/uploads/2022/10/bien-suc-9-768x401.jpg',
        },
        {
            id: 3,
            name: 'Gel t dùng',
            title: 'Gel t dùng: Hướng dẫn sử dụng và lưu ý quan trọng',
            author: 'Dược sĩ',
            updateDate: 'Cập nhật: 15 Th5, 2022',
            image: 'https://cdn.youmed.vn/tin-tuc/wp-content/uploads/2025/08/ke-toa-dien-tu-6-768x401.jpg',
        },
        {
            id: 4,
            name: 'PARACETAMOL 500mg',
            title: 'Paracetamol 500mg: Công dụng và cách sử dụng an toàn',
            author: 'ThS.DS Nguyễn Văn An',
            updateDate: 'Cập nhật: 10 Th6, 2022',
            image: 'https://cdn.youmed.vn/tin-tuc/wp-content/uploads/2025/08/xay-dung-thuong-hieu-ca-nhan-cho-bac-si-6-768x401.jpg',
        },
        {
            id: 5,
            name: 'AMOXICILLIN 500mg',
            title: 'Amoxicillin 500mg: Kháng sinh điều trị nhiễm khuẩn',
            author: 'BS. Trần Thị Bình',
            updateDate: 'Cập nhật: 05 Th7, 2022',
            image: 'https://cdn.youmed.vn/tin-tuc/wp-content/uploads/2025/08/ke-toa-dien-tu-6-768x401.jpg',
        },
        {
            id: 6,
            name: 'OMEPRAZOLE 20mg',
            title: 'Omeprazole 20mg: Thuốc điều trị bệnh dạ dày',
            author: 'ThS.DS Lê Văn Cường',
            updateDate: 'Cập nhật: 20 Th8, 2022',
            image: 'https://cdn.youmed.vn/tin-tuc/wp-content/uploads/2025/08/cap-nhat-kien-thuc-y-khoa-lien-tuc.jpg',
        },
    ];

    return (
        <div className={styles.medicalDictionary}>
            <h2 className={styles.title}>Từ Điển Y Khoa</h2>

            {/* Tabs Navigation */}
            <div className={styles.tabs}>
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Search Bar */}
            <div className={styles.searchSection}>
                <div className={styles.searchBar}>
                    <input
                        type="text"
                        placeholder={placeholderByTab[activeTab]}
                        className={styles.searchInput}
                        id="medicalDictionaryHeaderSearchInput"
                    />
                    <button
                        className={styles.searchBtn}
                        onClick={() => {
                            const input = document.getElementById(
                                'medicalDictionaryHeaderSearchInput'
                            ) as HTMLInputElement | null;
                            const value = input?.value?.trim() || '';
                            if (!value) {
                                navigate('/category/all');
                            } else {
                                const params = new URLSearchParams({
                                    category: 'all',
                                    search: value,
                                    page: '1',
                                });
                                navigate(`/category/all?${params.toString()}`);
                            }
                        }}
                    >
                        <i className="fas fa-search"></i>
                    </button>
                </div>
            </div>

            {/* Alphabet Filter */}
            <div className={styles.alphabetFilter}>
                <div className={styles.alphabetLabel}>Tra cứu bằng chữ cái đầu tiên:</div>
                {alphabet.map((letter) => (
                    <Link
                        key={letter}
                        to={`${PATHS.MEDICAL_TERMS}?tab=${activeTab}&letter=${letter}`}
                        className={styles.letterBtn}
                    >
                        {letter}
                    </Link>
                ))}
            </div>

            {/* Content Cards - Using 3-column layout like ArticleSlider */}
            <div className={styles.contentCards}>
                {medicines.map((medicine) => (
                    <BlogCard
                        key={medicine.id}
                        image={medicine.image}
                        title={medicine.title}
                        name={medicine.name}
                        link={'#'}
                        source={medicine.author}
                        date={medicine.updateDate}
                        containerClassName={styles.medicineCard}
                        imageLinkClassName={styles.imageLink}
                        imageClassName={styles.medicineImage}
                        contentClassName={styles.medicineContent}
                        titleLinkClassName={styles.medicineTitle}
                        nameClassName={styles.medicineName}
                        metaClassName={styles.medicineMeta}
                        metaTextClassName={styles.medicineMetaText}
                        sourceClassName={styles.medicineSource}
                        metaSeparatorClassName={styles.metaSeparator}
                        dateClassName={styles.medicineDate}
                    />
                ))}
            </div>
        </div>
    );
};

export default MedicalDictionary;
