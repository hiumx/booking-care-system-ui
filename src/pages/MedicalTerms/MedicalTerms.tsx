import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import styles from './MedicalTerms.module.scss';

interface MedicalTerm {
    id: string;
    name: string;
    vietnameseName?: string;
    description?: string;
}

const MedicalTerms: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState('benh');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLetter, setSelectedLetter] = useState('A');
    const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

    const tabs = [
        { id: 'thuoc', label: 'Thuốc' },
        { id: 'duoclieu', label: 'Dược liệu' },
        { id: 'benh', label: 'Bệnh' },
        { id: 'cothe', label: 'Cơ thể' },
    ];

    const alphabet = [
        'A',
        'B',
        'C',
        'D',
        'Đ',
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

    // Sample data for diseases (Bệnh)
    const diseasesData: { [key: string]: MedicalTerm[] } = {
        A: [
            { id: 'addison', name: 'Addison', vietnameseName: 'Bệnh Addison' },
            { id: 'apxe-phoi', name: 'Áp-xe phổi', vietnameseName: 'Lung abscess' },
            { id: 'alzheimer', name: 'Alzheimer', vietnameseName: 'Bệnh Alzheimer' },
            { id: 'am-thoi-tim', name: 'Âm thổi tại tim', vietnameseName: 'Heart murmur' },
            { id: 'ap-xe-ma', name: 'Áp xe má', vietnameseName: 'Cheek abscess' },
        ],
        B: [
            {
                id: 'barrett-thuc-quan',
                name: 'Barrett thực quản',
                vietnameseName: "Barrett's esophagus",
            },
            { id: 'basedow', name: 'Basedow', vietnameseName: "Graves' disease" },
            { id: 'beo-phi', name: 'Béo phì', vietnameseName: 'Obesity' },
            {
                id: 'bien-dang-ngon-chan-cai',
                name: 'Biến dạng ngón chân cái',
                vietnameseName: 'Hallux valgus / Bunion',
            },
            { id: 'burnout', name: 'Burnout', vietnameseName: 'Hội chứng kiệt sức' },
            {
                id: 'buong-trung-da-nang',
                name: 'Buồng trứng đa nang',
                vietnameseName: 'Polycystic ovary',
            },
            {
                id: 'bien-chung-tieu-duong',
                name: 'Biến chứng tiểu đường gây loét da',
                vietnameseName: 'Diabetic skin ulcers',
            },
            { id: 'buou-co', name: 'Bướu cổ', vietnameseName: 'Goiter' },
        ],
        C: [
            {
                id: 'can-thiep-noi-mach',
                name: 'Can thiệp nội mạch',
                vietnameseName: 'Endovascular intervention',
            },
            { id: 'chay-dich-tai', name: 'Chảy dịch tai', vietnameseName: 'Ear discharge' },
            {
                id: 'chan-thuong-so-nao',
                name: 'Chấn thương sọ não',
                vietnameseName: 'Traumatic brain injury',
            },
            {
                id: 'chung-so-khoang-rong',
                name: 'Chứng sợ khoảng rộng',
                vietnameseName: 'Agoraphobia',
            },
            { id: 'crohn', name: 'Crohn', vietnameseName: "Crohn's disease" },
            { id: 'cuoc', name: 'Cước', vietnameseName: 'Chilblains' },
            { id: 'cam-lanh', name: 'Cảm lạnh', vietnameseName: 'Common cold' },
            {
                id: 'celiac',
                name: 'Celiac (Không dung nạp Gluten)',
                vietnameseName: 'Celiac disease',
            },
            {
                id: 'chay-mau-cam',
                name: 'Chảy máu cam (chảy máu mũi)',
                vietnameseName: 'Nosebleed',
            },
            {
                id: 'chan-thuong-so-nao-kin',
                name: 'Chấn thương sọ não kín',
                vietnameseName: 'Closed head injury',
            },
            {
                id: 'con-ong-dong-mach',
                name: 'Còn ống động mạch',
                vietnameseName: 'Patent ductus arteriosus',
            },
            { id: 'cum-gia-cam', name: 'Cúm gia cầm', vietnameseName: 'Avian flu' },
            {
                id: 'cuong-aldosterone',
                name: 'Cường aldosterone nguyên phát',
                vietnameseName: 'Primary aldosteronism',
            },
            { id: 'can-thi', name: 'Cận thị', vietnameseName: 'Myopia' },
            { id: 'cham-da', name: 'Chàm da (Eczema)', vietnameseName: 'Eczema' },
            {
                id: 'chay-mau-chan-rang',
                name: 'Chảy máu chân răng khi mang thai',
                vietnameseName: 'Gingival bleeding during pregnancy',
            },
            {
                id: 'chung-mat-ngon-ngu',
                name: 'Chứng mất ngôn ngữ (Aphasia)',
                vietnameseName: 'Aphasia',
            },
            { id: 'co-giat-nua-mat', name: 'Co giật nửa mặt', vietnameseName: 'Hemifacial spasm' },
            { id: 'cum-mua', name: 'Cúm mùa', vietnameseName: 'Seasonal flu' },
            { id: 'cuong-giap', name: 'Cường giáp', vietnameseName: 'Hyperthyroidism' },
            { id: 'co-truong', name: 'Cổ trướng', vietnameseName: 'Ascites' },
            { id: 'chong-mat', name: 'Chóng mặt', vietnameseName: 'Dizziness' },
            {
                id: 'chay-mau-lau-cam',
                name: 'Chảy máu lâu cầm',
                vietnameseName: 'Prolonged bleeding',
            },
            {
                id: 'chung-ngu-nhieu',
                name: 'Chứng ngủ nhiều nguyên phát',
                vietnameseName: 'Primary hypersomnia',
            },
            {
                id: 'co-that-thanh-quan',
                name: 'Co thắt thanh quản',
                vietnameseName: 'Laryngospasm',
            },
            {
                id: 'con-mat-tri-nho',
                name: 'Cơn mất trí nhớ thoáng qua',
                vietnameseName: 'Transient amnesia',
            },
            { id: 'cam-cum', name: 'Cảm cúm', vietnameseName: 'Influenza' },
        ],
        D: [
            {
                id: 'da-nhiem-corticoid',
                name: 'Da nhiễm corticoid',
                vietnameseName: 'Corticosteroid-induced skin changes',
            },
            { id: 'day-thi-som', name: 'Dậy thì sớm', vietnameseName: 'Precocious puberty' },
            { id: 'di-ung-lua-mi', name: 'Dị ứng lúa mì', vietnameseName: 'Wheat allergy' },
            { id: 'di-tinh', name: 'Di tinh', vietnameseName: 'Nocturnal emission' },
            { id: 'di-dang-chiari', name: 'Dị dạng Chiari', vietnameseName: 'Chiari malformation' },
            { id: 'di-ung-sua', name: 'Dị ứng sữa', vietnameseName: 'Milk allergy' },
            {
                id: 'duong-vat-bi-noi-mun',
                name: 'Dương vật bị nổi mụn',
                vietnameseName: 'Penile bumps',
            },
            {
                id: 'di-dang-dong-tinh-mach',
                name: 'Dị dạng động tĩnh mạch',
                vietnameseName: 'Arteriovenous malformation',
            },
            { id: 'di-ung-thoi-tiet', name: 'Dị ứng thời tiết', vietnameseName: 'Weather allergy' },
            { id: 'dai', name: 'Dại', vietnameseName: 'Rabies' },
            {
                id: 'di-ung-anh-sang',
                name: 'Dị ứng ánh sáng mặt trời',
                vietnameseName: 'Sunlight allergy',
            },
        ],
        Đ: [
            { id: 'dau-bung', name: 'Đau bụng', vietnameseName: 'Abdominal pain' },
            { id: 'dau-dau', name: 'Đau đầu', vietnameseName: 'Headache' },
            { id: 'dau-lung', name: 'Đau lưng', vietnameseName: 'Back pain' },
        ],
        E: [
            { id: 'eczema', name: 'Eczema', vietnameseName: 'Chàm da' },
            { id: 'emphysema', name: 'Emphysema', vietnameseName: 'Khí phế thũng' },
        ],
        F: [
            { id: 'fibromyalgia', name: 'Fibromyalgia', vietnameseName: 'Đau cơ xơ hóa' },
            { id: 'flu', name: 'Flu', vietnameseName: 'Cúm' },
        ],
        G: [
            { id: 'gastritis', name: 'Gastritis', vietnameseName: 'Viêm dạ dày' },
            { id: 'gout', name: 'Gout', vietnameseName: 'Bệnh gút' },
        ],
        H: [
            { id: 'hypertension', name: 'Hypertension', vietnameseName: 'Tăng huyết áp' },
            { id: 'hypothyroidism', name: 'Hypothyroidism', vietnameseName: 'Suy giáp' },
        ],
        I: [
            { id: 'insomnia', name: 'Insomnia', vietnameseName: 'Mất ngủ' },
            { id: 'influenza', name: 'Influenza', vietnameseName: 'Cúm' },
        ],
        //J: [{ id: 'jaundice', name: 'Jaundice', vietnameseName: 'Vàng da' }],
        K: [{ id: 'kidney-stones', name: 'Kidney Stones', vietnameseName: 'Sỏi thận' }],
        L: [{ id: 'lupus', name: 'Lupus', vietnameseName: 'Lupus ban đỏ' }],
        M: [{ id: 'migraine', name: 'Migraine', vietnameseName: 'Đau nửa đầu' }],
        N: [{ id: 'nausea', name: 'Nausea', vietnameseName: 'Buồn nôn' }],
        O: [{ id: 'obesity', name: 'Obesity', vietnameseName: 'Béo phì' }],
        P: [{ id: 'pneumonia', name: 'Pneumonia', vietnameseName: 'Viêm phổi' }],
        Q: [{ id: 'quinsy', name: 'Quinsy', vietnameseName: 'Viêm amidan' }],
        R: [
            {
                id: 'rheumatoid-arthritis',
                name: 'Rheumatoid Arthritis',
                vietnameseName: 'Viêm khớp dạng thấp',
            },
        ],
        S: [{ id: 'sinusitis', name: 'Sinusitis', vietnameseName: 'Viêm xoang' }],
        T: [{ id: 'tuberculosis', name: 'Tuberculosis', vietnameseName: 'Bệnh lao' }],
        U: [{ id: 'ulcer', name: 'Ulcer', vietnameseName: 'Loét' }],
        V: [{ id: 'varicose-veins', name: 'Varicose Veins', vietnameseName: 'Giãn tĩnh mạch' }],
        W: [{ id: 'whooping-cough', name: 'Whooping Cough', vietnameseName: 'Ho gà' }],
        X: [{ id: 'xeroderma', name: 'Xeroderma', vietnameseName: 'Khô da' }],
        Y: [{ id: 'yeast-infection', name: 'Yeast Infection', vietnameseName: 'Nhiễm nấm men' }],
        Z: [{ id: 'zika', name: 'Zika', vietnameseName: 'Bệnh Zika' }],
        '#': [{ id: '123-syndrome', name: '123 Syndrome', vietnameseName: 'Hội chứng 123' }],
    };

    // Sample data for medicines (Thuốc)
    const medicinesData: { [key: string]: MedicalTerm[] } = {
        A: [
            { id: 'amoxicillin', name: 'Amoxicillin', vietnameseName: 'Amoxicillin 500mg' },
            { id: 'aspirin', name: 'Aspirin', vietnameseName: 'Aspirin 100mg' },
        ],
        B: [{ id: 'betadine', name: 'Betadine', vietnameseName: 'Betadine 10%' }],
        C: [{ id: 'ceftriaxone', name: 'Ceftriaxone', vietnameseName: 'Ceftriaxone 1g' }],
        P: [
            { id: 'paracetamol', name: 'Paracetamol', vietnameseName: 'Paracetamol 500mg' },
            { id: 'penicillin', name: 'Penicillin', vietnameseName: 'Penicillin V' },
        ],
    };

    // Sample data for herbs (Dược liệu)
    const herbsData: { [key: string]: MedicalTerm[] } = {
        C: [{ id: 'cam-thao', name: 'Cam thảo', vietnameseName: 'Licorice root' }],
        G: [{ id: 'giao-co-lam', name: 'Giao cổ lam', vietnameseName: 'Gynostemma pentaphyllum' }],
        N: [{ id: 'nghe', name: 'Nghệ', vietnameseName: 'Turmeric' }],
    };

    // Sample data for body parts (Cơ thể)
    const bodyPartsData: { [key: string]: MedicalTerm[] } = {
        C: [
            { id: 'co', name: 'Cổ', vietnameseName: 'Neck' },
            { id: 'chan', name: 'Chân', vietnameseName: 'Leg' },
        ],
        D: [{ id: 'da', name: 'Da', vietnameseName: 'Skin' }],
        T: [
            { id: 'tay', name: 'Tay', vietnameseName: 'Arm' },
            { id: 'tim', name: 'Tim', vietnameseName: 'Heart' },
        ],
    };

    // Get current data based on active tab
    const getCurrentData = () => {
        switch (activeTab) {
            case 'benh':
                return diseasesData;
            case 'thuoc':
                return medicinesData;
            case 'duoclieu':
                return herbsData;
            case 'cothe':
                return bodyPartsData;
            default:
                return diseasesData;
        }
    };

    const currentData = getCurrentData();

    // Check if letter has data
    const hasLetterData = (letter: string) => {
        const letterData = currentData[letter];
        const hasData = Boolean(letterData && letterData.length > 0);
        console.log(`Checking letter ${letter} in tab ${activeTab}:`, hasData, letterData);
        return hasData;
    };

    // Handle letter selection
    const handleLetterClick = (letter: string) => {
        // Only allow click if letter has data
        if (!hasLetterData(letter)) {
            return;
        }

        setSelectedLetter(letter);
        setSearchParams({ tab: activeTab, letter });

        // Scroll to section only if it exists
        const sectionRef = sectionRefs.current[letter];
        if (sectionRef) {
            sectionRef.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    // Handle search
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            setSearchParams({ tab: activeTab, search: searchTerm.trim() });
        }
    };

    // Filter data based on search term
    const getFilteredData = () => {
        if (!searchTerm.trim()) return currentData;

        const filtered: { [key: string]: MedicalTerm[] } = {};
        Object.keys(currentData).forEach((letter) => {
            const filteredTerms = currentData[letter].filter(
                (term) =>
                    term.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (term.vietnameseName &&
                        term.vietnameseName.toLowerCase().includes(searchTerm.toLowerCase()))
            );
            if (filteredTerms.length > 0) {
                filtered[letter] = filteredTerms;
            }
        });
        return filtered;
    };

    const filteredData = getFilteredData();

    // Initialize from URL params
    useEffect(() => {
        const tabFromUrl = searchParams.get('tab') || 'benh';
        const letterFromUrl = searchParams.get('letter') || 'A';
        const searchFromUrl = searchParams.get('search') || '';

        setActiveTab(tabFromUrl);
        setSelectedLetter(letterFromUrl);
        setSearchTerm(searchFromUrl);
    }, [searchParams]); // Add searchParams as dependency

    // Separate effect for scrolling after data is loaded
    useEffect(() => {
        const letterFromUrl = searchParams.get('letter');

        // Only proceed if there's a letter in URL
        if (!letterFromUrl) {
            return;
        }

        const hasData = hasLetterData(letterFromUrl);
        const hasRef = !!sectionRefs.current[letterFromUrl];

        console.log('Scroll effect triggered:', {
            letterFromUrl,
            activeTab,
            hasData,
            hasRef,
            shouldScroll: hasData && hasRef,
        });

        if (hasData && hasRef) {
            console.log('✅ Scrolling to letter:', letterFromUrl);
            setTimeout(() => {
                sectionRefs.current[letterFromUrl]?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                });
            }, 100);
        } else {
            console.log('❌ Not scrolling - no data or ref for letter:', letterFromUrl);
            // Force scroll to top when no data exists
            if (letterFromUrl && !hasData) {
                console.log('🔄 Forcing scroll to top - no data for letter:', letterFromUrl);
                setTimeout(() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }, 50);
            }
        }
    }, [activeTab, currentData, searchParams, hasLetterData]);

    // Update URL when tab changes
    const handleTabChange = (tabId: string) => {
        setActiveTab(tabId);
        setSelectedLetter(''); // Reset selected letter when changing tab
        setSearchTerm(''); // Reset search term when changing tab
        setSearchParams({ tab: tabId }); // Remove letter and search from URL when changing tab
    };

    const breadcrumbItems = [{ label: 'Trang chủ', path: '/' }, { label: 'Từ Điển Y Khoa' }];

    // Dynamic placeholder based on active tab
    const getPlaceholderByTab = () => {
        switch (activeTab) {
            case 'thuoc':
                return 'Nhập tên thuốc...';
            case 'duoclieu':
                return 'Nhập tên dược liệu...';
            case 'benh':
                return 'Nhập tên bệnh, triệu chứng...';
            case 'cothe':
                return 'Nhập tên bộ phận cơ thể...';
            default:
                return 'Nhập tên bệnh, triệu chứng...';
        }
    };

    return (
        <div className={styles.medicalTerms}>
            <div className={styles.container}>
                <Breadcrumb items={breadcrumbItems} title="Từ Điển Y Khoa" />

                <div className={styles.header}>
                    <h1 className={styles.title}>Từ Điển Y Khoa</h1>
                    <p className={styles.subtitle}>
                        Tra cứu thông tin chi tiết về các thuật ngữ y khoa
                    </p>
                </div>

                {/* Tabs Navigation */}
                <div className={styles.tabs}>
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
                            onClick={() => handleTabChange(tab.id)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Search Bar */}
                <div className={styles.searchSection}>
                    <form onSubmit={handleSearch} className={styles.searchForm}>
                        <div className={styles.searchBar}>
                            <input
                                type="text"
                                placeholder={getPlaceholderByTab()}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={styles.searchInput}
                            />
                            <button type="submit" className={styles.searchBtn}>
                                <i className="fas fa-search"></i>
                            </button>
                        </div>
                    </form>
                </div>

                {/* Alphabet Filter */}
                <div className={styles.alphabetFilter}>
                    <div className={styles.alphabetLabel}>Tìm theo bảng chữ cái:</div>
                    <div className={styles.letterGrid}>
                        {alphabet.map((letter) => {
                            const hasData = hasLetterData(letter);
                            return (
                                <button
                                    key={letter}
                                    className={`${styles.letterBtn} ${
                                        selectedLetter === letter ? styles.active : ''
                                    } ${!hasData ? styles.disabled : ''}`}
                                    onClick={() => handleLetterClick(letter)}
                                    disabled={!hasData}
                                    title={!hasData ? 'Không có dữ liệu cho chữ cái này' : ''}
                                >
                                    {letter}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Content Sections */}
                <div className={styles.content}>
                    {Object.keys(filteredData).length > 0 ? (
                        Object.keys(filteredData).map((letter) => (
                            <div
                                key={letter}
                                ref={(el) => {
                                    sectionRefs.current[letter] = el;
                                }}
                                className={styles.letterSection}
                            >
                                <h2 className={styles.letterTitle}>{letter}</h2>
                                <div className={styles.termsGrid}>
                                    {filteredData[letter].map((term) => (
                                        <div key={term.id} className={styles.termCard}>
                                            <a
                                                href={`/medical-term/${term.id}`}
                                                style={{ textDecoration: 'none' }}
                                            >
                                                <h3 className={styles.termName}>{term.name}</h3>
                                            </a>

                                            {term.vietnameseName && (
                                                <div>
                                                    <p
                                                        className={styles.termTranslation}
                                                        onMouseEnter={(e) => {
                                                            const termName =
                                                                e.currentTarget.parentElement?.previousElementSibling?.querySelector(
                                                                    `.${styles.termName}`
                                                                );
                                                            if (termName) {
                                                                termName.classList.add(
                                                                    styles.hovered
                                                                );
                                                            }
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            const termName =
                                                                e.currentTarget.parentElement?.previousElementSibling?.querySelector(
                                                                    `.${styles.termName}`
                                                                );
                                                            if (termName) {
                                                                termName.classList.remove(
                                                                    styles.hovered
                                                                );
                                                            }
                                                        }}
                                                    >
                                                        {term.vietnameseName}
                                                    </p>
                                                </div>
                                            )}
                                            {term.description && (
                                                <p className={styles.termDescription}>
                                                    {term.description}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <div className={styles.backToTop}>
                                    <button
                                        onClick={() =>
                                            window.scrollTo({ top: 0, behavior: 'smooth' })
                                        }
                                        className={styles.backToTopBtn}
                                    >
                                        Back to top
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className={styles.noResults}>
                            <p>Không tìm thấy kết quả nào cho "{searchTerm}"</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MedicalTerms;
