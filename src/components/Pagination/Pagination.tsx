import React from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import styles from './Pagination.module.scss';

/**
 * Props for the Pagination component.
 * @property {number} currentPage - The currently active page number (1-based index).
 * @property {number} totalPages - The total number of pages available.
 * @property {(page: number) => void} onPageChange - Callback function invoked when the page is changed.
 * @property {boolean} [showPrevNext] - Optional. Whether to display "Previous" and "Next" navigation buttons.
 * @property {number} [maxVisiblePages] - Optional. The maximum number of page buttons to display at once.
 */
interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    showPrevNext?: boolean;
    maxVisiblePages?: number;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    showPrevNext = true,
    maxVisiblePages = 10,
}) => {
    if (totalPages <= 1) return null;

    // Adjust maxVisiblePages to not exceed totalPages
    const adjustedMaxVisiblePages = Math.min(maxVisiblePages, totalPages);

    // Calculate page range
    const getPageRange = () => {
        if (totalPages <= adjustedMaxVisiblePages) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        const halfVisible = Math.floor(adjustedMaxVisiblePages / 2);
        let startPage = Math.max(1, currentPage - halfVisible);
        const endPage = Math.min(totalPages, startPage + adjustedMaxVisiblePages - 1);

        if (endPage - startPage + 1 < adjustedMaxVisiblePages) {
            startPage = Math.max(1, endPage - adjustedMaxVisiblePages + 1);
        }

        return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
    };

    const pages = getPageRange();

    // Handle page change with boundary checks
    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            onPageChange(page);
        }
    };

    return (
        <div className="pagination dashboard-pagination">
            <ul className={styles.paginationList}>
                {showPrevNext && (
                    <li>
                        <Link
                            to="#"
                            className={clsx(styles.pageLink, styles.prevLink, 'prev-link', {
                                [styles.disabled]: currentPage === 1,
                            })}
                            onClick={(e) => {
                                e.preventDefault();
                                if (currentPage > 1) handlePageChange(currentPage - 1);
                            }}
                        >
                            <span className={styles.iconContainer}>
                                <i className="fa-solid fa-chevron-left"></i>
                            </span>
                        </Link>
                    </li>
                )}

                {totalPages > adjustedMaxVisiblePages &&
                    currentPage > Math.floor(adjustedMaxVisiblePages / 2) + 1 && (
                        <li>
                            <Link
                                to="#"
                                className={styles.pageLink}
                                onClick={(e) => {
                                    e.preventDefault();
                                    handlePageChange(1);
                                }}
                            >
                                1
                            </Link>
                        </li>
                    )}
                {totalPages > adjustedMaxVisiblePages &&
                    currentPage > Math.floor(adjustedMaxVisiblePages / 2) + 2 && (
                        <li>
                            <span className={clsx(styles.pageLink, styles.ellipsis)}>...</span>
                        </li>
                    )}

                {pages.map((page) => (
                    <li key={page}>
                        <Link
                            to="#"
                            className={clsx(styles.pageLink, {
                                [styles.active]: currentPage === page,
                            })}
                            onClick={(e) => {
                                e.preventDefault();
                                handlePageChange(page);
                            }}
                        >
                            {page}
                        </Link>
                    </li>
                ))}

                {totalPages > adjustedMaxVisiblePages &&
                    currentPage < totalPages - Math.floor(adjustedMaxVisiblePages / 2) && (
                        <li>
                            <span className={clsx(styles.pageLink, styles.ellipsis)}>...</span>
                        </li>
                    )}
                {totalPages > adjustedMaxVisiblePages &&
                    currentPage < totalPages - Math.floor(adjustedMaxVisiblePages / 2) + 1 && (
                        <li>
                            <Link
                                to="#"
                                className={styles.pageLink}
                                onClick={(e) => {
                                    e.preventDefault();
                                    handlePageChange(totalPages);
                                }}
                            >
                                {totalPages}
                            </Link>
                        </li>
                    )}

                {showPrevNext && (
                    <li>
                        <Link
                            to="#"
                            className={clsx(styles.pageLink, styles.nextLink, {
                                [styles.disabled]: currentPage === totalPages,
                            })}
                            onClick={(e) => {
                                e.preventDefault();
                                if (currentPage < totalPages) handlePageChange(currentPage + 1);
                            }}
                        >
                            <span className={styles.iconContainer}>
                                <i className="fa-solid fa-chevron-right"></i>
                            </span>
                        </Link>
                    </li>
                )}
            </ul>
        </div>
    );
};

export default Pagination;
