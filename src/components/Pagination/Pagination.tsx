import React from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import styles from './Pagination.module.scss';

/**
 * Props for the Pagination component.
 *
 * @property {number} currentPage - The currently active page number (1-based index).
 * @property {number} totalPages - The total number of pages available.
 * @property {(page: number) => void} onPageChange - Callback function invoked when the page is changed. Receives the new page number as an argument.
 * @property {boolean} [showPrevNext] - Optional. Whether to display "Previous" and "Next" navigation buttons. Defaults to false if not provided.
 * @property {number} [maxVisiblePages] - Optional. The maximum number of page buttons to display at once. If not specified, all pages are shown.
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
    // Ensure totalPages doesn't exceed maxVisiblePages
    const adjustedTotalPages = Math.min(totalPages, maxVisiblePages);

    if (adjustedTotalPages <= 1) return null;

    // Calculate page range
    const getPageRange = () => {
        const range = [];
        const halfVisible = Math.floor(maxVisiblePages / 2);
        let startPage = Math.max(1, currentPage - halfVisible);
        const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            range.push(i);
        }
        return range;
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

                {currentPage > Math.floor(maxVisiblePages / 2) + 1 && (
                    <li>
                        <Link
                            to="#"
                            className={styles.pageLink}
                            onClick={(e) => {
                                handlePageChange(1);
                                e.preventDefault();
                            }}
                        >
                            1
                        </Link>
                    </li>
                )}
                {currentPage > Math.floor(maxVisiblePages / 2) + 2 && (
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

                {currentPage < totalPages - Math.floor(maxVisiblePages / 2) && (
                    <li>
                        <span className={clsx(styles.pageLink, styles.ellipsis)}>...</span>
                    </li>
                )}
                {currentPage < totalPages - Math.floor(maxVisiblePages / 2) + 1 &&
                    totalPages > 1 && (
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
