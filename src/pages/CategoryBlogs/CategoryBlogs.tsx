import React, { useState, useEffect } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import BlogHeader from '@/pages/Blog/components/BlogHeader';
import Breadcrumb from '@/pages/BlogDetail/components/Breadcrumb';
import BlogCard from '@/components/BLogCard';
import styles from './CategoryBlogs.module.scss';
import { BlogService } from '@/services/blog.service';
import { BlogSummaryDto, BlogCategoryDto, BlogStatus } from '@/types/blog.types';
import { useApiCall } from '@/hooks/useApiCall';
import Spinner from '@/components/Spinner';
import { PATHS, replacePathParams } from '@/routes/paths';

const CategoryBlogs: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { categorySlug } = useParams<{ categorySlug: string }>();

    const [searchTerm, setSearchTerm] = useState('');
    const [inputSearch, setInputSearch] = useState('');
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>('');
    const [currentPage, setCurrentPage] = useState(1);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [modalSearchTerm, setModalSearchTerm] = useState('');
    const [tempSelectedCategoryId, setTempSelectedCategoryId] = useState<number | null>(null);
    const [isAllMode, setIsAllMode] = useState(false);
    const [categories, setCategories] = useState<BlogCategoryDto[]>([]);
    const [blogs, setBlogs] = useState<BlogSummaryDto[]>([]);
    const [totalPages, setTotalPages] = useState(1);

    const itemsPerPage = 12; // 4 items per row * 3 rows

    // Fetch categories
    const { data: categoriesData, execute: fetchCategories } = useApiCall(async () => {
        const response = await BlogService.getCategories(true);
        return response.data || [];
    });

    // Fetch blogs
    const {
        data: blogsData,
        isLoading: isLoadingBlogs,
        execute: fetchBlogs,
    } = useApiCall(async () => {
        const params: any = {
            status: BlogStatus.Active,
            page: currentPage,
            pageSize: itemsPerPage,
        };

        if (isAllMode) {
            // Fetch all blogs
            if (searchTerm.trim()) {
                params.keyword = searchTerm.trim();
                params.titleOnly = true;
            }
        } else {
            // Fetch by category
            if (selectedCategoryId) {
                params.categoryId = selectedCategoryId;
            }
            if (searchTerm.trim()) {
                params.keyword = searchTerm.trim();
                params.titleOnly = true;
            }
        }

        const response = await BlogService.getBlogs(params);
        return response.data;
    });

    // Format date helper
    const formatDate = (dateString?: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return `Ngày đăng: ${date.getDate()} Th${date.getMonth() + 1}, ${date.getFullYear()}`;
    };

    // Convert category name to slug (simple version)
    const categoryNameToSlug = (name: string): string => {
        const normalized = name.toLowerCase().normalize('NFD');
        const slug = (normalized as any)
            .replaceAll(/[\u0300-\u036f]/g, '')
            .replaceAll(/đ/g, 'd')
            .replaceAll(/Đ/g, 'D')
            .replaceAll(/[^a-z0-9]+/g, '-');

        // Trim leading and trailing hyphens without regex to avoid potential ReDoS
        let start = 0;
        let end = slug.length;

        while (start < end && slug[start] === '-') {
            start++;
        }

        while (end > start && slug[end - 1] === '-') {
            end--;
        }

        return slug.slice(start, end);
    };

    // Find category by slug
    const findCategoryBySlug = (slug: string): BlogCategoryDto | undefined => {
        const findInCategories = (cats: BlogCategoryDto[]): BlogCategoryDto | undefined => {
            for (const cat of cats) {
                if (categoryNameToSlug(cat.categoryName) === slug) {
                    return cat;
                }
                if (cat.children) {
                    const found = findInCategories(cat.children);
                    if (found) return found;
                }
            }
            return undefined;
        };
        return findInCategories(categories);
    };

    // Initialize categories
    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        if (categoriesData) {
            setCategories(categoriesData);
        }
    }, [categoriesData]);

    // Initialize from URL params
    useEffect(() => {
        const categoryFromUrl = searchParams.get('category');
        const searchFromUrl = searchParams.get('search') || '';
        const pageFromUrl = Number.parseInt(searchParams.get('page') || '1', 10);

        setSearchTerm(searchFromUrl);
        setInputSearch(searchFromUrl);
        setCurrentPage(pageFromUrl);

        if (categoryFromUrl === 'all') {
            setIsAllMode(true);
            setSelectedCategoryId(null);
            setSelectedCategorySlug('');
        } else if (categorySlug) {
            // Find category by slug from URL
            const category = findCategoryBySlug(categorySlug);
            if (category) {
                setIsAllMode(false);
                setSelectedCategoryId(category.id);
                setSelectedCategorySlug(categorySlug);
                setTempSelectedCategoryId(category.id);
            }
        } else if (categoryFromUrl) {
            // Try to find by slug from query param
            const category = findCategoryBySlug(categoryFromUrl);
            if (category) {
                setIsAllMode(false);
                setSelectedCategoryId(category.id);
                setSelectedCategorySlug(categoryFromUrl);
                setTempSelectedCategoryId(category.id);
            }
        } else if (categories.length > 0) {
            // Default to first category
            const firstCategory = categories[0];
            setIsAllMode(false);
            setSelectedCategoryId(firstCategory.id);
            setSelectedCategorySlug(categoryNameToSlug(firstCategory.categoryName));
            setTempSelectedCategoryId(firstCategory.id);
        }
    }, [searchParams, categorySlug, categories]);

    // Fetch blogs when filters change
    useEffect(() => {
        if (categories.length > 0 && (isAllMode || selectedCategoryId !== null)) {
            fetchBlogs();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, selectedCategoryId, searchTerm, isAllMode, categories.length]);

    // Update blogs state when data changes
    useEffect(() => {
        if (blogsData) {
            setBlogs(blogsData.items || []);
            setTotalPages(Math.ceil((blogsData.totalItems || 0) / itemsPerPage));
        }
    }, [blogsData, itemsPerPage]);

    // Handle search
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1);
        const params: Record<string, string> = {
            page: '1',
        };
        if (isAllMode) {
            params.category = 'all';
        } else if (selectedCategorySlug) {
            params.category = selectedCategorySlug;
        }
        const trimmed = inputSearch.trim();
        // Apply search only on submit; search in titles only
        if (trimmed) {
            params.search = trimmed;
            params.titleOnly = 'true';
        }
        // update applied searchTerm (used for fetching)
        setSearchTerm(trimmed);
        setSearchParams(params);
    };

    // Handle category selection in modal
    const handleCategorySelect = (categoryId: number) => {
        setTempSelectedCategoryId(categoryId);
    };

    // Handle apply category selection
    const handleApplyCategory = () => {
        if (tempSelectedCategoryId !== null) {
            const category =
                categories.find((cat) => cat.id === tempSelectedCategoryId) ||
                categories.find((cat) =>
                    cat.children?.some((child) => child.id === tempSelectedCategoryId)
                );
            if (category) {
                const foundCategory =
                    category.id === tempSelectedCategoryId
                        ? category
                        : category.children?.find((child) => child.id === tempSelectedCategoryId);
                if (foundCategory) {
                    setSelectedCategoryId(foundCategory.id);
                    setSelectedCategorySlug(categoryNameToSlug(foundCategory.categoryName));
                    setSearchTerm('');
                    setCurrentPage(1);
                    setIsAllMode(false);
                    setSearchParams({
                        category: categoryNameToSlug(foundCategory.categoryName),
                        page: '1',
                    });
                }
            }
        }
        setShowCategoryModal(false);
        setModalSearchTerm('');
    };

    // Handle reset category selection
    const handleResetCategory = () => {
        if (categories.length > 0) {
            const firstCategory = categories[0];
            setSelectedCategoryId(firstCategory.id);
            setSelectedCategorySlug(categoryNameToSlug(firstCategory.categoryName));
            setTempSelectedCategoryId(firstCategory.id);
            setSearchTerm('');
            setCurrentPage(1);
            setIsAllMode(false);
            setSearchParams({
                category: categoryNameToSlug(firstCategory.categoryName),
                page: '1',
            });
        }
        setShowCategoryModal(false);
        setModalSearchTerm('');
    };

    // Handle page change
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        const params: Record<string, string> = {
            page: page.toString(),
        };
        if (isAllMode) {
            params.category = 'all';
        } else if (selectedCategorySlug) {
            params.category = selectedCategorySlug;
        }
        if (searchTerm.trim()) {
            params.search = searchTerm.trim();
        }
        setSearchParams(params);
        // Scroll to top when page changes
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Handle search coming from the global header (BlogHeader)
    const handleHeaderSearch = (keyword: string) => {
        const trimmed = keyword.trim();
        setInputSearch(trimmed);
        setCurrentPage(1);
        // Switch to "all" mode to show search across all categories
        setIsAllMode(true);
        setSelectedCategoryId(null);
        setSelectedCategorySlug('');

        if (!trimmed) {
            setSearchParams({ category: 'all', page: '1' });
            return;
        }

        // Trigger search across titles only
        setSearchParams({ category: 'all', search: trimmed, titleOnly: 'true', page: '1' });
    };

    // Get current category name
    const getCurrentCategoryName = () => {
        if (isAllMode) return 'Tất cả bài viết';
        if (!selectedCategoryId) return 'Chuyên mục';

        const findCategory = (cats: BlogCategoryDto[]): BlogCategoryDto | undefined => {
            for (const cat of cats) {
                if (cat.id === selectedCategoryId) return cat;
                if (cat.children) {
                    const found = findCategory(cat.children);
                    if (found) return found;
                }
            }
            return undefined;
        };

        const category = findCategory(categories);
        return category ? category.categoryName : 'Chuyên mục';
    };

    // Get all categories (flattened for modal)
    const getAllCategories = (): BlogCategoryDto[] => {
        const result: BlogCategoryDto[] = [];
        const flatten = (cats: BlogCategoryDto[]) => {
            for (const cat of cats) {
                result.push(cat);
                if (cat.children) {
                    flatten(cat.children);
                }
            }
        };
        flatten(categories);
        return result;
    };

    // Filter categories based on modal search term
    const getFilteredCategories = () => {
        const allCats = getAllCategories();
        if (!modalSearchTerm.trim()) return allCats;

        return allCats.filter((category) =>
            category.categoryName.toLowerCase().includes(modalSearchTerm.toLowerCase())
        );
    };

    const breadcrumbItems = isAllMode
        ? [{ label: 'Trang chủ', path: PATHS.HOME }, { label: 'Tất cả bài viết' }]
        : [
              { label: 'Trang chủ', path: PATHS.HOME },
              { label: 'Bản tin sức khỏe', path: PATHS.BLOG },
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
            <BlogHeader onSearch={handleHeaderSearch} />

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
                                value={inputSearch}
                                onChange={(e) => setInputSearch(e.target.value)}
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
                                        setTempSelectedCategoryId(selectedCategoryId);
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
                            setTempSelectedCategoryId(selectedCategoryId);
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
                                        setTempSelectedCategoryId(selectedCategoryId);
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
                                            tempSelectedCategoryId === category.id
                                                ? styles.selected
                                                : ''
                                        }`}
                                        onClick={() => handleCategorySelect(category.id)}
                                    >
                                        {category.categoryName}
                                    </button>
                                ))}
                            </div>

                            <div className={styles.modalActions}>
                                <button className={styles.resetBtn} onClick={handleResetCategory}>
                                    <i className="fas fa-undo"></i>
                                    {''}
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
                    {isLoadingBlogs ? (
                        <div style={{ textAlign: 'center', padding: '4rem' }}>
                            <Spinner />
                        </div>
                    ) : blogs.length > 0 ? (
                        <>
                            <div className={styles.articlesGrid}>
                                {blogs.map((blog) => {
                                    const blogTag = blog.tag || blog.category?.categoryName || '';
                                    return (
                                        <BlogCard
                                            key={blog.id}
                                            image={blog.thumbnailUrl || '/placeholder-blog.jpg'}
                                            title={blog.titleVi}
                                            link={replacePathParams(PATHS.BLOG_DETAIL, {
                                                id: blog.id,
                                            })}
                                            tag={blogTag}
                                            source={blog.source || 'Medcure'}
                                            date={formatDate(blog.publishedAt || blog.createdAt)}
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
                                    );
                                })}
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

                                    {getPaginationNumbers().map((page) => (
                                        <button
                                            key={
                                                typeof page === 'number'
                                                    ? `page-${page}`
                                                    : 'ellipsis'
                                            }
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
                            <p>
                                {searchTerm.trim()
                                    ? `Không tìm thấy bài viết nào cho "${searchTerm}"`
                                    : 'Không có bài viết nào trong danh mục này'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CategoryBlogs;
