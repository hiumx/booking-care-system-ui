import React, { useState } from 'react';
import InvoiceModal from './InvoiceModal';
import Pagination from '../../../components/Pagination/Pagination';
import clsx from 'clsx';

import styles from './Invoices.module.scss';

const invoiceData = [
    {
        id: '#INV1236',
        doctor: { name: 'Edalin Hendry', img: '/src/assets/img/doctors/doctor-thumb-21.jpg' },
        appointmentDate: '24 Mar 2024',
        bookedOn: '21 Mar 2024',
        amount: '$300',
    },
    {
        id: '#NV3656',
        doctor: { name: 'John Homes', img: '/src/assets/img/doctors/doctor-thumb-13.jpg' },
        appointmentDate: '17 Mar 2024',
        bookedOn: '14 Mar 2024',
        amount: '$450',
    },
    {
        id: '#INV1246',
        doctor: { name: 'Shanta Neill', img: '/src/assets/img/doctors/doctor-thumb-03.jpg' },
        appointmentDate: '11 Mar 2024',
        bookedOn: '07 Mar 2024',
        amount: '$250',
    },
    {
        id: '#INV6985',
        doctor: { name: 'Anthony Tran', img: '/src/assets/img/doctors/doctor-thumb-08.jpg' },
        appointmentDate: '26 Feb 2024',
        bookedOn: '23 Feb 2024',
        amount: '$320',
    },
    {
        id: '#INV3659',
        doctor: { name: 'Susan Lingo', img: '/src/assets/img/doctors/doctor-thumb-01.jpg' },
        appointmentDate: '18 Feb 2024',
        bookedOn: '15 Feb 2024',
        amount: '$480',
    },

    {
        id: '#INV1221',
        doctor: { name: 'HaNoi', img: '/src/assets/img/doctors/doctor-thumb-01.jpg' },
        appointmentDate: '18 Feb 2024',
        bookedOn: '15 Feb 2024',
        amount: '$420',
    },
];

const Invoices: React.FC = () => {
    const [showModal, setShowModal] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState<(typeof invoiceData)[0] | undefined>(
        undefined
    );
    const [isClosing, setIsClosing] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // Số hóa đơn hiển thị mỗi trang

    // Tính toán dữ liệu cho trang hiện tại
    const totalPages = Math.ceil(invoiceData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentInvoices = invoiceData.slice(startIndex, endIndex);

    const handleOpenModal = (invoice: (typeof invoiceData)[0]) => {
        setSelectedInvoice(invoice);
        setShowModal(true);
    };
    const handleCloseModal = () => {
        setIsClosing(true);
        setShowModal(false); // Ngay lập tức ẩn modal để tránh chớp
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

    return (
        <>
            <div className="dashboard-header">
                <h3>Hoá Đơn</h3>
                <ul className="header-list-btns">
                    <li>
                        <div className="input-block dash-search-input">
                            <input type="text" className="form-control" placeholder="Tìm kiếm" />
                            <span className="search-icon">
                                <i className="isax isax-search-normal"></i>
                            </span>
                        </div>
                    </li>
                </ul>
            </div>

            <div className="custom-table">
                <div className="table-responsive">
                    <table className="table table-center mb-0">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Bác Sĩ</th>
                                <th>Ngày Khám</th>
                                <th>Ngày Đặt</th>
                                <th>Tổng Tiền</th>
                                <th>Hành Động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentInvoices.map((item) => (
                                <tr key={item.id}>
                                    <td>
                                        <a
                                            href="#"
                                            className="link-primary"
                                            onClick={() => handleOpenModal(item)}
                                        >
                                            {item.id}
                                        </a>
                                    </td>
                                    <td>
                                        <h2 className="table-avatar">
                                            <a href="#" className="avatar avatar-sm me-2">
                                                <img
                                                    className="avatar-img rounded-3"
                                                    src={item.doctor.img}
                                                    alt="User"
                                                />
                                            </a>
                                            <a href="#">{item.doctor.name}</a>
                                        </h2>
                                    </td>
                                    <td>{item.appointmentDate}</td>
                                    <td>{item.bookedOn}</td>
                                    <td>{item.amount}</td>
                                    <td>
                                        <div className={clsx(styles.actionItem, 'action-item')}>
                                            <button
                                                type="button"
                                                className="btn btn-link"
                                                title="Xem chi tiết"
                                                onClick={() => handleOpenModal(item)}
                                            >
                                                <i className="isax isax-link-2"></i>
                                            </button>

                                            <button
                                                type="button"
                                                className="btn btn-link"
                                                title="Xuất hoá đơn"
                                            >
                                                <i className="isax isax-import"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                showPrevNext={true}
                maxVisiblePages={5}
            />

            {/* Modal View Invoice */}
            <InvoiceModal
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
