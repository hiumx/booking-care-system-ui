import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './BlogHeader.module.scss';

interface BlogHeaderProps {
    onSearch?: (keyword: string) => void;
}

const BlogHeader: React.FC<BlogHeaderProps> = ({ onSearch }) => {
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
        <div className={styles.blogHeader}>
            <div className={styles.searchSection} style={{ width: '100%' }}>
                <div className={styles.searchBar} style={{ maxWidth: '720px', margin: '0 auto' }}>
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
                    <button className={styles.searchBtn} onClick={handleSearch} aria-label="Search">
                        <i className="fas fa-search"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BlogHeader;
