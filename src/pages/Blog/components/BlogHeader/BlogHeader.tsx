import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './BlogHeader.module.scss';
import { PATHS } from '@/routes/paths';
import clsx from 'clsx';
import logo from '@/assets/img/logo.svg';

interface BlogHeaderProps {
    onSearch?: (keyword: string) => void;
}

const BlogHeader: React.FC<BlogHeaderProps> = ({ onSearch }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchValue, setSearchValue] = useState<string>('');
    const searchInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const handleSearch = () => {
        const keyword = searchValue.trim();
        if (onSearch) {
            // If onSearch callback is provided, use it (for Blog page)
            onSearch(keyword);
            return;
        }

        // Otherwise, navigate to category page (fallback behavior)
        if (!keyword) {
            navigate('/category/all');
            return;
        }

        const params = new URLSearchParams({
            category: 'all',
            search: keyword,
            page: '1',
        });
        navigate(`/category/all?${params.toString()}`);
    };

    return (
        <header className={styles.blogHeader}>
            {/* Top Section: Logo and Search */}
            <div className={styles.topSection}>
                <button
                    type="button"
                    className={styles.menuBtn}
                    aria-label={isMobileMenuOpen ? 'Đóng menu' : 'Mở menu'}
                    onClick={() => setIsMobileMenuOpen((v) => !v)}
                >
                    <i className={isMobileMenuOpen ? 'fas fa-times' : 'fas fa-bars'}></i>
                </button>

                <div className="navbar-header">
                    <Link to={PATHS.HOME} className="navbar-brand logo">
                        <img src={logo} className={clsx(styles.logoImg, 'img-fluid')} alt="Logo" />
                    </Link>
                </div>

                <div className={styles.searchSection}>
                    <div className={styles.searchBar}>
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder="Tìm kiếm bài viết, thông tin bệnh, thuốc ..."
                            className={styles.searchInput}
                            id="globalBlogHeaderSearchInput"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSearch();
                                }
                            }}
                        />
                        <button className={styles.searchBtn} onClick={handleSearch}>
                            <i className="fas fa-search"></i>
                        </button>
                    </div>
                </div>

                <button
                    type="button"
                    className={styles.mobileSearchBtn}
                    aria-label="Search"
                    onClick={() => navigate('/category/all')}
                >
                    <i className="fas fa-search"></i>
                </button>
            </div>
        </header>
    );
};

export default BlogHeader;
