import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './BlogHeader.module.scss';

const BlogHeader: React.FC = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
    const navigate = useNavigate();

    const navigationItems = [
        {
            id: 'diseases',
            label: 'Tra cứu bệnh',
            icon: '',
            children: [
                { id: 'benh-bach-hau', label: 'Bệnh bạch hầu', href: '/diseases/benh-bach-hau' },
                {
                    id: 'roi-loan-tien-dinh',
                    label: 'Rối loạn tiền đình',
                    href: '/diseases/roi-loan-tien-dinh',
                },
                { id: 'sot-xuat-huyet', label: 'Sốt xuất huyết', href: '/diseases/sot-xuat-huyet' },
                {
                    id: 'trao-nguoc-da-day',
                    label: 'Trào ngược dạ dày thực quản',
                    href: '/diseases/trao-nguoc-da-day-thuc-quan',
                },
                { id: 'viem-da-di-ung', label: 'Viêm da dị ứng', href: '/diseases/viem-da-di-ung' },
                { id: 'dot-quy', label: 'Đột quỵ', href: '/diseases/dot-quy' },
                { id: 'parkinson', label: 'Bệnh Parkinson', href: '/diseases/parkinson' },
                { id: 'more', label: 'Tra cứu thêm', href: '/diseases', isMore: true },
            ],
        },
        {
            id: 'topics',
            label: 'Chủ đề được quan tâm nhiều',
            icon: '',
            children: [
                { id: 'skin-care', label: 'Chăm sóc da', href: '/topics/cham-soc-da' },
                { id: 'nutrition', label: 'Dinh dưỡng', href: '/topics/dinh-duong' },
                { id: 'pregnancy', label: 'Mang thai', href: '/topics/mang-thai' },
                { id: 'parenting', label: 'Nuôi dạy con', href: '/topics/nuoi-day-con' },
                {
                    id: 'mens-health',
                    label: 'Sức khỏe nam giới',
                    href: '/topics/suc-khoe-nam-gioi',
                },
                {
                    id: 'womens-health',
                    label: 'Sức khỏe nữ giới',
                    href: '/topics/suc-khoe-nu-gioi',
                },
                { id: 'more-topics', label: 'Xem thêm chủ đề', href: '/topics', isMore: true },
            ],
        },
        {
            id: 'experience',
            label: 'Kinh nghiệm đi khám',
            icon: '',
            children: [
                { id: 'chon-bac-si', label: 'Cách chọn bác sĩ', href: '/experience/chon-bac-si' },
                {
                    id: 'chuan-bi-kham',
                    label: 'Chuẩn bị trước khi khám',
                    href: '/experience/chuan-bi-kham',
                },
                {
                    id: 'quy-trinh-benh-vien',
                    label: 'Quy trình tại bệnh viện',
                    href: '/experience/quy-trinh-benh-vien',
                },
                { id: 'more-exp', label: 'Xem thêm bài viết', href: '/experience', isMore: true },
            ],
        },
        {
            id: 'news',
            label: 'Bản tin sức khỏe',
            icon: '',
            children: [
                { id: 'news-hot', label: 'Tin nóng', href: '/news/hot' },
                { id: 'policy', label: 'Chính sách y tế', href: '/news/policy' },
                { id: 'technology', label: 'Công nghệ y tế', href: '/news/technology' },
                { id: 'more-news', label: 'Xem thêm tin tức', href: '/news', isMore: true },
            ],
        },
    ];

    const toggleSubmenu = (id: string, e: React.MouseEvent) => {
        if (!isMobileMenuOpen) return; // desktop keeps default behavior
        e.preventDefault();
        setOpenSubmenu((prev) => (prev === id ? null : id));
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

                <div className={styles.logoSection}>
                    <h1 className={styles.logo}>YouMed</h1>
                </div>

                <div className={styles.searchSection}>
                    <div className={styles.searchBar}>
                        <input
                            type="text"
                            placeholder="Tìm kiếm bài viết, thông tin bệnh, thuốc ..."
                            className={styles.searchInput}
                            id="globalBlogHeaderSearchInput"
                        />
                        <button
                            className={styles.searchBtn}
                            onClick={() => {
                                const input = document.getElementById(
                                    'globalBlogHeaderSearchInput'
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

                <button
                    type="button"
                    className={styles.mobileSearchBtn}
                    aria-label="Search"
                    onClick={() => navigate('/category/all')}
                >
                    <i className="fas fa-search"></i>
                </button>
            </div>

            {/* Navigation Menu */}

            <nav className={styles.navigation}>
                <ul className={`${styles.navList} ${isMobileMenuOpen ? styles.open : ''}`}>
                    {/* Close button inside overlay */}
                    {isMobileMenuOpen && (
                        <button
                            type="button"
                            className={styles.mobileCloseBtn}
                            aria-label="Đóng menu"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <i className="fas fa-times"></i>
                        </button>
                    )}

                    {navigationItems.map((item) => (
                        <li
                            key={item.id}
                            className={`${styles.navItem} ${isMobileMenuOpen && openSubmenu === item.id ? styles.submenuOpen : ''}`}
                        >
                            <a
                                href={`#${item.id}`}
                                className={styles.navLink}
                                onClick={(e) => toggleSubmenu(item.id, e)}
                            >
                                {item.icon && <span className={styles.navIcon}>{item.icon}</span>}
                                <span className={styles.navText}>{item.label}</span>
                                <span className={styles.chevron} aria-hidden>
                                    <i className="fas fa-chevron-down"></i>
                                </span>
                            </a>

                            {item.children && (
                                <div className={styles.dropdown}>
                                    <ul className={styles.dropdownList}>
                                        {item.children.map((child) => (
                                            <li key={child.id} className={styles.dropdownItem}>
                                                <a
                                                    href={child.href}
                                                    className={`${styles.dropdownLink} ${child.isMore ? styles.moreLink : ''}`}
                                                >
                                                    <span>{child.label}</span>
                                                    {child.isMore && (
                                                        <span
                                                            className={styles.moreIcon}
                                                            aria-hidden
                                                        >
                                                            <i className="fas fa-arrow-right"></i>
                                                        </span>
                                                    )}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>

                {/* Mobile overlay backdrop */}
                {isMobileMenuOpen && (
                    <div
                        className={styles.mobileOverlay}
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                )}
            </nav>
        </header>
    );
};

export default BlogHeader;
