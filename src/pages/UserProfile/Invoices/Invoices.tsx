import React, { useState, useEffect } from 'react';
import { Skeleton } from '@mui/material';
import InvoiceModal from './InvoiceModal';
import Pagination from '../../../components/Pagination/Pagination';
import { PaymentService, InvoiceItem } from '../../../services/payment.service';
import clsx from 'clsx';

import styles from './Invoices.module.scss';

// Adapter interface to convert InvoiceItem to expected modal format
interface InvoiceModalData {
    id: string;
    doctor: { name: string; img: string };
    appointmentDate: string;
    bookedOn: string;
    amount: string;
    appointmentType: string;
}

interface InvoicesProps {
    patientId?: string;
    profile?: any; // User profile object
}

const Invoices: React.FC<InvoicesProps> = ({ patientId, profile }) => {
    const [showModal, setShowModal] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState<InvoiceModalData | undefined>(undefined);
    const [isClosing, setIsClosing] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('CreatedAt');
    const [sortOrder, setSortOrder] = useState('desc');
    const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
    const itemsPerPage = 5; // Số hóa đơn hiển thị mỗi trang

    // Convert InvoiceItem to InvoiceModalData format
    const convertToModalData = (invoice: InvoiceItem): InvoiceModalData => {
        return {
            id: invoice.id,
            doctor: {
                name: invoice.paymentMethodName, // Using payment method as "doctor" since we don't have doctor info
                img: '/src/assets/img/doctors/doctor-thumb-01.jpg', // Default image
            },
            appointmentDate: formatDate(invoice.appointmentDate),
            bookedOn: formatDate(invoice.createdAt),
            amount: formatCurrency(invoice.amount),
            appointmentType: invoice.appointmentType,
        };
    };

    // Fetch invoices từ API
    useEffect(() => {
        if (patientId) {
            fetchInvoices();
        }
    }, [patientId, currentPage, sortBy, sortOrder]);

    // Debounced search effect
    useEffect(() => {
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }

        const timeout = setTimeout(() => {
            if (patientId) {
                setCurrentPage(1); // Reset to first page when searching
                fetchInvoices();
            }
        }, 500); // 500ms delay

        setSearchTimeout(timeout);

        return () => {
            if (timeout) {
                clearTimeout(timeout);
            }
        };
    }, [searchTerm]);

    const fetchInvoices = async () => {
        if (!patientId) return;

        try {
            setLoading(true);
            const response = await PaymentService.getPatientInvoices(
                patientId,
                currentPage,
                itemsPerPage,
                searchTerm,
                sortBy,
                sortOrder
            );
            setInvoices(response.items);
            setTotalPages(response.totalPages);
        } catch (error) {
            console.error('Error fetching invoices:', error);
            setInvoices([]);
            setTotalPages(0);
        } finally {
            setLoading(false);
        }
    };

    // Format date helper
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    // Format currency helper
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };

    const handleOpenModal = (invoice: InvoiceItem) => {
        setSelectedInvoice(convertToModalData(invoice));
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setIsClosing(true);
        setShowModal(false);
    };

    // Callback khi animation kết thúc
    const handleModalAnimationEnd = () => {
        if (isClosing) {
            setIsClosing(false);
            setSelectedInvoice(undefined);
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    // Show loading message if no patientId
    if (!patientId) {
        return (
            <div className="text-center py-5">
                <p>Đang tải thông tin người dùng...</p>
            </div>
        );
    }

    return (
        <>
            <div className="dashboard-header">
                <h3>
                    Hoá Đơn
                    {loading && <output className="ms-2 spinner-border spinner-border-sm"></output>}
                </h3>
                <ul className={clsx(styles.headerListBtns, 'header-list-btns')}>
                    <li>
                        <div className="input-block dash-search-input">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Tìm kiếm hóa đơn..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                            <span className="search-icon">
                                <i className="isax isax-search-normal"></i>
                            </span>
                        </div>
                    </li>
                    <li>
                        <select
                            className="form-select"
                            value={`${sortBy}-${sortOrder}`}
                            onChange={(e) => {
                                const [field, order] = e.target.value.split('-');
                                setSortBy(field);
                                setSortOrder(order);
                                setCurrentPage(1); // Reset to first page when changing sort
                            }}
                        >
                            <option value="CreatedAt-desc">Mới nhất</option>
                            <option value="CreatedAt-asc">Cũ nhất</option>
                            <option value="Amount-desc">Số tiền giảm dần</option>
                            <option value="Amount-asc">Số tiền tăng dần</option>
                        </select>
                    </li>
                </ul>
            </div>

            <div className="custom-table">
                {loading ? (
                    <div className="table-responsive">
                        <table className="text-center table table-center mb-0">
                            <thead>
                                <tr>
                                    <th>
                                        <Skeleton variant="text" width="60px" height={20} />
                                    </th>
                                    <th>
                                        <Skeleton variant="text" width="120px" height={20} />
                                    </th>
                                    <th>
                                        <Skeleton variant="text" width="100px" height={20} />
                                    </th>
                                    <th>
                                        <Skeleton variant="text" width="110px" height={20} />
                                    </th>
                                    <th>
                                        <Skeleton variant="text" width="80px" height={20} />
                                    </th>
                                    <th>
                                        <Skeleton variant="text" width="90px" height={20} />
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <tr key={`skeleton-row-${index}-${Date.now()}`}>
                                        <td>
                                            <Skeleton variant="text" width="80px" height={16} />
                                        </td>
                                        <td>
                                            <Skeleton
                                                variant="rectangular"
                                                width="100px"
                                                height={24}
                                                sx={{ borderRadius: '12px' }}
                                            />
                                        </td>
                                        <td>
                                            <Skeleton variant="text" width="90px" height={16} />
                                        </td>
                                        <td>
                                            <Skeleton variant="text" width="90px" height={16} />
                                        </td>
                                        <td>
                                            <Skeleton variant="text" width="100px" height={16} />
                                        </td>
                                        <td>
                                            <Skeleton
                                                variant="rectangular"
                                                width="80px"
                                                height={20}
                                                sx={{ borderRadius: '8px' }}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="text-center table table-center mb-0">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Phương thức thanh toán</th>
                                    <th>Ngày Khám</th>
                                    <th>Ngày Thanh Toán</th>
                                    <th>Tổng Tiền</th>
                                    <th>Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoices.length > 0 ? (
                                    invoices.map((item) => (
                                        <tr key={item.id}>
                                            <td>
                                                <button
                                                    className="link-primary btn btn-link p-0"
                                                    onClick={() => handleOpenModal(item)}
                                                >
                                                    #{item.id.slice(0, 8)}...
                                                </button>
                                            </td>
                                            <td>
                                                <span className="badge bg-light text-dark">
                                                    {item.paymentMethodName}
                                                </span>
                                            </td>
                                            <td>{formatDate(item.appointmentDate)}</td>
                                            <td>{formatDate(item.createdAt)}</td>
                                            <td className="fw-bold text-success">
                                                {formatCurrency(item.amount)}
                                            </td>
                                            <td>
                                                <span
                                                    className={clsx('badge', {
                                                        'bg-success': item.status === 'COMPLETED',
                                                        'bg-warning': item.status === 'PENDING',
                                                        'bg-danger': item.status === 'FAILED',
                                                        'bg-secondary': item.status === 'CANCELLED',
                                                    })}
                                                >
                                                    {item.status === 'COMPLETED' && 'Đã thanh toán'}
                                                    {item.status === 'PENDING' && 'Đang xử lý'}
                                                    {item.status === 'FAILED' && 'Thất bại'}
                                                    {item.status === 'CANCELLED' && 'Đã hủy'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="text-center py-4">
                                            {searchTerm
                                                ? 'Không tìm thấy hóa đơn phù hợp với từ khóa tìm kiếm'
                                                : 'Chưa có hóa đơn nào'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {!loading && totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    showPrevNext={true}
                    maxVisiblePages={5}
                />
            )}

            {/* Modal View Invoice */}
            <InvoiceModal
                profile={profile}
                show={showModal}
                onClose={handleCloseModal}
                invoice={selectedInvoice}
                isClosing={isClosing}
                onAnimationEnd={handleModalAnimationEnd}
            />
        </>
    );
};

export default Invoices;
