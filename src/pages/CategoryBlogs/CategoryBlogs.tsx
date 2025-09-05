import React, { useState, useEffect } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import BlogHeader from '@/pages/Blog/components/BlogHeader';
import Breadcrumb from '@/pages/BlogDetail/components/Breadcrumb';
import BlogCard from '@/components/BLogCard';
import styles from './CategoryBlogs.module.scss';

interface Article {
    id: string;
    title: string;
    image: string;
    tag: string;
    source: string;
    date: string;
    link: string;
    category: string;
}

const CategoryBlogs: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { categorySlug } = useParams<{ categorySlug: string }>();

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('co-xuong-khop');
    const [currentPage, setCurrentPage] = useState(1);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [modalSearchTerm, setModalSearchTerm] = useState('');
    const [tempSelectedCategory, setTempSelectedCategory] = useState('co-xuong-khop');
    const [isAllMode, setIsAllMode] = useState(false);

    const itemsPerPage = 12; // 4 items per row * 3 rows

    // Sample categories
    const categories = [
        { id: 'co-xuong-khop', name: 'Cơ xương khớp' },
        { id: 'than-kinh', name: 'Thần kinh' },
        { id: 'tim-mach', name: 'Tim mạch' },
        { id: 'tieu-hoa', name: 'Tiêu hóa' },
        { id: 'cot-song', name: 'Cột sống' },
        { id: 'tai-mui-hong', name: 'Tai Mũi Họng' },
        { id: 'benh-da-day', name: 'Bệnh dạ dày' },
        { id: 'di-kham-thong-minh', name: 'Đi khám thông minh' },
    ];

    // Sample articles data
    const articlesData: Article[] = [
        {
            id: '1',
            title: 'Viêm khớp dạng thấp: Nguyên nhân, triệu chứng và cách điều trị',
            image: 'https://cdn.youmed.vn/tin-tuc/wp-content/uploads/2025/08/ke-toa-dien-tu-6-768x401.jpg',
            tag: 'Cơ xương khớp',
            source: 'Bác sĩ Nguyễn Văn A',
            date: 'Ngày đăng: 25 Th12, 2024',
            link: '/article/1',
            category: 'co-xuong-khop',
        },
        {
            id: '2',
            title: 'Thoái hóa khớp gối: Dấu hiệu nhận biết và phương pháp điều trị',
            image: 'https://cdn.youmed.vn/tin-tuc/wp-content/uploads/2025/08/bo-cong-cu-lam-viec-cho-bac-si-768x401.jpg',
            tag: 'Cơ xương khớp',
            source: 'Bác sĩ Trần Thị B',
            date: 'Ngày đăng: 24 Th12, 2024',
            link: '/article/2',
            category: 'co-xuong-khop',
        },
        {
            id: '3',
            title: 'Đau lưng cấp tính: Nguyên nhân và cách xử lý tại nhà',
            image: 'https://cdn.youmed.vn/tin-tuc/wp-content/uploads/2022/10/bien-suc-9-768x401.jpg',
            tag: 'Cơ xương khớp',
            source: 'Bác sĩ Lê Văn C',
            date: 'Ngày đăng: 23 Th12, 2024',
            link: '/article/3',
            category: 'co-xuong-khop',
        },
        {
            id: '4',
            title: 'Bệnh gout: Chế độ ăn uống và lối sống cho người bệnh',
            image: 'https://cdn.youmed.vn/tin-tuc/wp-content/uploads/2024/12/lomexin-1000-mg-1-1-768x401.jpg',
            tag: 'Cơ xương khớp',
            source: 'Bác sĩ Phạm Thị D',
            date: 'Ngày đăng: 22 Th12, 2024',
            link: '/article/4',
            category: 'co-xuong-khop',
        },
        {
            id: '5',
            title: 'Loãng xương ở người cao tuổi: Phòng ngừa và điều trị',
            image: 'https://cdn.youmed.vn/tin-tuc/wp-content/uploads/2025/08/ke-toa-dien-tu-6-768x401.jpg',
            tag: 'Cơ xương khớp',
            source: 'Bác sĩ Hoàng Văn E',
            date: 'Ngày đăng: 21 Th12, 2024',
            link: '/article/5',
            category: 'co-xuong-khop',
        },
        {
            id: '6',
            title: 'Viêm gân Achilles: Triệu chứng và phương pháp điều trị',
            image: 'https://cdn.youmed.vn/tin-tuc/wp-content/uploads/2025/08/bo-cong-cu-lam-viec-cho-bac-si-768x401.jpg',
            tag: 'Cơ xương khớp',
            source: 'Bác sĩ Vũ Thị F',
            date: 'Ngày đăng: 20 Th12, 2024',
            link: '/article/6',
            category: 'co-xuong-khop',
        },
        {
            id: '7',
            title: 'Đau vai gáy: Nguyên nhân và bài tập giảm đau hiệu quả',
            image: 'https://cdn.youmed.vn/tin-tuc/wp-content/uploads/2022/10/bien-suc-9-768x401.jpg',
            tag: 'Cơ xương khớp',
            source: 'Bác sĩ Đặng Văn G',
            date: 'Ngày đăng: 19 Th12, 2024',
            link: '/article/7',
            category: 'co-xuong-khop',
        },
        {
            id: '8',
            title: 'Bệnh viêm khớp vảy nến: Dấu hiệu và điều trị',
            image: 'https://cdn.youmed.vn/tin-tuc/wp-content/uploads/2024/12/lomexin-1000-mg-1-1-768x401.jpg',
            tag: 'Cơ xương khớp',
            source: 'Bác sĩ Ngô Thị H',
            date: 'Ngày đăng: 18 Th12, 2024',
            link: '/article/8',
            category: 'co-xuong-khop',
        },
        {
            id: '9',
            title: 'Đau khớp háng: Nguyên nhân và cách điều trị',
            image: 'https://cdn.youmed.vn/tin-tuc/wp-content/uploads/2025/08/ke-toa-dien-tu-6-768x401.jpg',
            tag: 'Cơ xương khớp',
            source: 'Bác sĩ Lý Văn I',
            date: 'Ngày đăng: 17 Th12, 2024',
            link: '/article/9',
            category: 'co-xuong-khop',
        },
        {
            id: '10',
            title: 'Bệnh lupus ban đỏ: Triệu chứng và điều trị',
            image: 'https://cdn.youmed.vn/tin-tuc/wp-content/uploads/2025/08/bo-cong-cu-lam-viec-cho-bac-si-768x401.jpg',
            tag: 'Cơ xương khớp',
            source: 'Bác sĩ Trịnh Thị K',
            date: 'Ngày đăng: 16 Th12, 2024',
            link: '/article/10',
            category: 'co-xuong-khop',
        },
        {
            id: '11',
            title: 'Viêm khớp thiếu niên: Dấu hiệu và điều trị sớm',
            image: 'https://cdn.youmed.vn/tin-tuc/wp-content/uploads/2022/10/bien-suc-9-768x401.jpg',
            tag: 'Cơ xương khớp',
            source: 'Bác sĩ Mai Văn L',
            date: 'Ngày đăng: 15 Th12, 2024',
            link: '/article/11',
            category: 'co-xuong-khop',
        },
        {
            id: '12',
            title: 'Đau cơ xơ hóa: Triệu chứng và phương pháp điều trị',
            image: 'https://cdn.youmed.vn/tin-tuc/wp-content/uploads/2024/12/lomexin-1000-mg-1-1-768x401.jpg',
            tag: 'Cơ xương khớp',
            source: 'Bác sĩ Đỗ Thị M',
            date: 'Ngày đăng: 14 Th12, 2024',
            link: '/article/12',
            category: 'co-xuong-khop',
        },
        // Add more articles for pagination demo
        {
            id: '13',
            title: 'Bệnh viêm khớp phản ứng: Nguyên nhân và điều trị',
            image: 'https://cdn.youmed.vn/tin-tuc/wp-content/uploads/2025/08/ke-toa-dien-tu-6-768x401.jpg',
            tag: 'Cơ xương khớp',
            source: 'Bác sĩ Võ Văn N',
            date: 'Ngày đăng: 13 Th12, 2024',
            link: '/article/13',
            category: 'co-xuong-khop',
        },
        {
            id: '14',
            title: 'Đau khớp cổ tay: Nguyên nhân và cách điều trị',
            image: 'https://cdn.youmed.vn/tin-tuc/wp-content/uploads/2025/08/bo-cong-cu-lam-viec-cho-bac-si-768x401.jpg',
            tag: 'Cơ xương khớp',
            source: 'Bác sĩ Hồ Thị O',
            date: 'Ngày đăng: 12 Th12, 2024',
            link: '/article/14',
            category: 'co-xuong-khop',
        },
        {
            id: '15',
            title: 'Bệnh viêm khớp nhiễm khuẩn: Dấu hiệu và điều trị',
            image: 'https://cdn.youmed.vn/tin-tuc/wp-content/uploads/2022/10/bien-suc-9-768x401.jpg',
            tag: 'Cơ xương khớp',
            source: 'Bác sĩ Dương Văn P',
            date: 'Ngày đăng: 11 Th12, 2024',
            link: '/article/15',
            category: 'co-xuong-khop',
        },
        {
            id: '16',
            title: 'Đau khớp gối khi leo cầu thang: Nguyên nhân và cách khắc phục',
            image: 'https://cdn.youmed.vn/tin-tuc/wp-content/uploads/2024/12/lomexin-1000-mg-1-1-768x401.jpg',
            tag: 'Cơ xương khớp',
            source: 'Bác sĩ Bùi Thị Q',
            date: 'Ngày đăng: 10 Th12, 2024',
            link: '/article/16',
            category: 'co-xuong-khop',
        },
        {
            id: '17',
            title: 'Bệnh viêm khớp vảy nến: Dấu hiệu và điều trị',
            image: 'https://cdn.youmed.vn/tin-tuc/wp-content/uploads/2025/08/ke-toa-dien-tu-6-768x401.jpg',
            tag: 'Cơ xương khớp',
            source: 'Bác sĩ Lê Văn R',
            date: 'Ngày đăng: 09 Th12, 2024',
            link: '/article/17',
            category: 'co-xuong-khop',
        },
        {
            id: '18',
            title: 'Đau khớp háng: Nguyên nhân và cách điều trị',
            image: 'https://cdn.youmed.vn/tin-tuc/wp-content/uploads/2025/08/bo-cong-cu-lam-viec-cho-bac-si-768x401.jpg',
            tag: 'Cơ xương khớp',
            source: 'Bác sĩ Phan Thị S',
            date: 'Ngày đăng: 08 Th12, 2024',
            link: '/article/18',
            category: 'co-xuong-khop',
        },
    ];

    // Filter articles based on search term and selected category
    const getFilteredArticles = () => {
        let filtered = isAllMode
            ? articlesData
            : articlesData.filter((article) => article.category === selectedCategory);

        if (searchTerm.trim()) {
            filtered = filtered.filter(
                (article) =>
                    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    article.tag.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    article.source.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        return filtered;
    };

    const filteredArticles = getFilteredArticles();
    const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);

    // Get current page articles
    const getCurrentPageArticles = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredArticles.slice(startIndex, endIndex);
    };

    const currentArticles = getCurrentPageArticles();

    // Handle search
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            setSearchParams({
                category: isAllMode ? 'all' : selectedCategory,
                search: searchTerm.trim(),
                page: '1',
            });
            setCurrentPage(1);
        }
    };

    // Handle category selection in modal
    const handleCategorySelect = (categoryId: string) => {
        setTempSelectedCategory(categoryId);
    };

    // Handle apply category selection
    const handleApplyCategory = () => {
        setSelectedCategory(tempSelectedCategory);
        setSearchTerm('');
        setCurrentPage(1);
        setSearchParams({ category: tempSelectedCategory, page: '1' });
        setShowCategoryModal(false);
        setModalSearchTerm('');
    };

    // Handle reset category selection
    const handleResetCategory = () => {
        setSelectedCategory('co-xuong-khop');
        setTempSelectedCategory('co-xuong-khop');
        setSearchTerm('');
        setCurrentPage(1);
        setSearchParams({ category: 'co-xuong-khop', page: '1' });
        setShowCategoryModal(false);
        setModalSearchTerm('');
    };

    // Handle page change
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        setSearchParams({
            category: isAllMode ? 'all' : selectedCategory,
            search: searchTerm,
            page: page.toString(),
        });
    };

    // Initialize from URL params
    useEffect(() => {
        const categoryFromUrl = searchParams.get('category') || categorySlug || 'co-xuong-khop';
        const searchFromUrl = searchParams.get('search') || '';
        const pageFromUrl = parseInt(searchParams.get('page') || '1');

        setSelectedCategory(categoryFromUrl);
        setTempSelectedCategory(categoryFromUrl);
        setSearchTerm(searchFromUrl);
        setCurrentPage(pageFromUrl);
        setIsAllMode(categoryFromUrl === 'all');
    }, [searchParams, categorySlug]);

    // Get current category name
    const getCurrentCategoryName = () => {
        const category = categories.find((cat) => cat.id === selectedCategory);
        return category ? category.name : 'Cơ xương khớp';
    };

    // Filter categories based on modal search term
    const getFilteredCategories = () => {
        if (!modalSearchTerm.trim()) return categories;

        return categories.filter((category) =>
            category.name.toLowerCase().includes(modalSearchTerm.toLowerCase())
        );
    };

    const breadcrumbItems = isAllMode
        ? [{ label: 'Trang chủ', path: '/' }, { label: 'Tất cả bài viết' }]
        : [
              { label: 'Trang chủ', path: '/' },
              { label: 'Chuyên mục', path: '/categories' },
              { label: getCurrentCategoryName() },
          ];

    // Generate pagination numbers
    const getPaginationNumbers = () => {
        const numbers = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                numbers.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    numbers.push(i);
                }
                numbers.push('...');
                numbers.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                numbers.push(1);
                numbers.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    numbers.push(i);
                }
            } else {
                numbers.push(1);
                numbers.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    numbers.push(i);
                }
                numbers.push('...');
                numbers.push(totalPages);
            }
        }

        return numbers;
    };

    return (
        <div className={styles.categoryArticles}>
            <BlogHeader />

            <div className={styles.container}>
                <Breadcrumb items={breadcrumbItems} />

                <div className={styles.header}>
                    <h1 className={styles.title}>
                        {isAllMode ? 'Tất cả bài viết' : getCurrentCategoryName()}
                    </h1>
                    <p className={styles.subtitle}>
                        {isAllMode
                            ? 'Tổng hợp các bài viết mới nhất'
                            : `Tổng hợp các bài viết về ${getCurrentCategoryName().toLowerCase()}`}
                    </p>
                </div>

                {/* Search and Filter Section */}
                <div
                    className={`${styles.searchSection} ${isAllMode ? styles.allMode : styles.categoryMode}`}
                >
                    <form onSubmit={handleSearch} className={styles.searchForm}>
                        <div className={styles.searchBar}>
                            <input
                                type="text"
                                placeholder="Từ khóa tìm kiếm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={styles.searchInput}
                            />
                            <button type="submit" className={styles.searchBtn}>
                                <i className="fas fa-search"></i>
                            </button>
                        </div>
                    </form>

                    {!isAllMode && (
                        <div className={styles.categoryFilter}>
                            <div className={styles.categoryDisplay}>
                                <span className={styles.categoryLabel}>Danh mục:</span>
                                <button
                                    className={styles.categoryBtn}
                                    onClick={() => {
                                        setShowCategoryModal(true);
                                        setTempSelectedCategory(selectedCategory);
                                        setModalSearchTerm('');
                                    }}
                                >
                                    {getCurrentCategoryName()}
                                    <i className="fas fa-chevron-down"></i>
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Category Selection Modal */}
                {showCategoryModal && (
                    <div
                        className={styles.modalOverlay}
                        onClick={() => {
                            setShowCategoryModal(false);
                            setTempSelectedCategory(selectedCategory);
                            setModalSearchTerm('');
                        }}
                    >
                        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                            <div className={styles.modalHeader}>
                                <h3>Lựa chọn danh mục</h3>
                                <button
                                    className={styles.closeBtn}
                                    onClick={() => {
                                        setShowCategoryModal(false);
                                        setTempSelectedCategory(selectedCategory);
                                        setModalSearchTerm('');
                                    }}
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>

                            <div className={styles.modalSearch}>
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm"
                                    value={modalSearchTerm}
                                    onChange={(e) => setModalSearchTerm(e.target.value)}
                                    className={styles.modalSearchInput}
                                />
                                <i className="fas fa-search"></i>
                            </div>

                            <div className={styles.categoryGrid}>
                                {getFilteredCategories().map((category) => (
                                    <button
                                        key={category.id}
                                        className={`${styles.categoryOption} ${
                                            tempSelectedCategory === category.id
                                                ? styles.selected
                                                : ''
                                        }`}
                                        onClick={() => handleCategorySelect(category.id)}
                                    >
                                        {category.name}
                                    </button>
                                ))}
                            </div>

                            <div className={styles.modalActions}>
                                <button className={styles.resetBtn} onClick={handleResetCategory}>
                                    <i className="fas fa-undo"></i>
                                    Đặt lại
                                </button>
                                <button className={styles.applyBtn} onClick={handleApplyCategory}>
                                    Áp dụng
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Articles Grid */}
                <div className={styles.content}>
                    {currentArticles.length > 0 ? (
                        <>
                            <div className={styles.articlesGrid}>
                                {currentArticles.map((article) => (
                                    <BlogCard
                                        key={article.id}
                                        image={article.image}
                                        title={article.title}
                                        link={article.link}
                                        tag={article.tag}
                                        source={article.source}
                                        date={article.date}
                                        containerClassName={styles.articleCard}
                                        imageLinkClassName={styles.imageLink}
                                        contentClassName={styles.cardContent}
                                        tagClassName={styles.articleTag}
                                        titleLinkClassName={styles.cardTitle}
                                        metaClassName={styles.articleMeta}
                                        metaTextClassName={styles.articleMetaText}
                                        sourceClassName={styles.articleSource}
                                        metaSeparatorClassName={styles.metaSeparator}
                                        dateClassName={styles.articleDate}
                                    />
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className={styles.pagination}>
                                    <button
                                        className={`${styles.pageBtn} ${styles.prevBtn}`}
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        ←
                                    </button>

                                    {getPaginationNumbers().map((page, index) => (
                                        <button
                                            key={index}
                                            className={`${styles.pageBtn} ${
                                                page === currentPage ? styles.active : ''
                                            } ${page === '...' ? styles.ellipsis : ''}`}
                                            onClick={() =>
                                                typeof page === 'number' && handlePageChange(page)
                                            }
                                            disabled={page === '...'}
                                        >
                                            {page}
                                        </button>
                                    ))}

                                    <button
                                        className={`${styles.pageBtn} ${styles.nextBtn}`}
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                    >
                                        →
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className={styles.noResults}>
                            <p>Không tìm thấy bài viết nào cho "{searchTerm}"</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CategoryBlogs;
