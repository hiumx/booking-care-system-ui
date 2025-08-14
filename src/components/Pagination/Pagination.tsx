import React from 'react';
import { Link } from 'react-router-dom';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    showPrevNext?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    showPrevNext = true,
}) => {
    if (totalPages <= 1) return null;

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className="pagination dashboard-pagination">
            <ul>
                {showPrevNext && (
                    <li>
                        <Link
                            to="#"
                            className="page-link prev-link"
                            onClick={(e) => {
                                e.preventDefault();
                                if (currentPage > 1) onPageChange(currentPage - 1);
                            }}
                        >
                            <i className="fa-solid fa-chevron-left me-2"></i>Trước
                        </Link>
                    </li>
                )}

                {pages.map((page) => (
                    <li key={page}>
                        <Link
                            to="#"
                            className={`page-link ${currentPage === page ? 'active' : ''}`}
                            onClick={(e) => {
                                e.preventDefault();
                                onPageChange(page);
                            }}
                        >
                            {page}
                        </Link>
                    </li>
                ))}

                {showPrevNext && (
                    <li>
                        <Link
                            to="#"
                            className="page-link next-link"
                            onClick={(e) => {
                                e.preventDefault();
                                if (currentPage < totalPages) onPageChange(currentPage + 1);
                            }}
                        >
                            Sau<i className="fa-solid fa-chevron-right ms-2"></i>
                        </Link>
                    </li>
                )}
            </ul>
        </div>
    );
};

export default Pagination;
