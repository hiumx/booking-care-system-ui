import React from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

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
            <ul>
                {showPrevNext && (
                    <li>
                        <Link
                            to="#"
                            className={clsx('page-link prev-link', { disabled: currentPage === 1 })}
                            onClick={(e) => {
                                e.preventDefault();
                                if (currentPage > 1) handlePageChange(currentPage - 1);
                            }}
                        >
                            <span className="icon-container">
                                <i className="fa-solid fa-chevron-left"></i>
                            </span>
                        </Link>
                    </li>
                )}

                {currentPage > Math.floor(maxVisiblePages / 2) + 1 && (
                    <li>
                        <Link
                            to="#"
                            className="page-link"
                            onClick={(e) => {
                                e.preventDefault();
                                handlePageChange(1);
                            }}
                        >
                            1
                        </Link>
                    </li>
                )}
                {currentPage > Math.floor(maxVisiblePages / 2) + 2 && (
                    <li>
                        <span className="page-link ellipsis">...</span>
                    </li>
                )}

                {pages.map((page) => (
                    <li key={page}>
                        <Link
                            to="#"
                            className={clsx('page-link', { active: currentPage === page })}
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
                        <span className="page-link ellipsis">...</span>
                    </li>
                )}
                {currentPage < totalPages - Math.floor(maxVisiblePages / 2) + 1 &&
                    totalPages > 1 && (
                        <li>
                            <Link
                                to="#"
                                className="page-link"
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
                            className={clsx('page-link next-link', {
                                disabled: currentPage === totalPages,
                            })}
                            onClick={(e) => {
                                e.preventDefault();
                                if (currentPage < totalPages) handlePageChange(currentPage + 1);
                            }}
                        >
                            <span className="icon-container">
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
