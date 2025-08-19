import React from 'react';
import clsx from 'clsx';

import styles from './InvoiceModal.module.scss';

interface InvoiceModalProps {
    show: boolean;
    onClose: () => void;
    invoice?: {
        id: string;
        doctor: { name: string; img: string };
        appointmentDate: string;
        bookedOn: string;
        amount: string;
    };
    isClosing?: boolean; // Optional prop to handle closing animation
    onAnimationEnd?: () => void; // Callback for animation end
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({
    show,
    onClose,
    invoice,
    isClosing,
    onAnimationEnd,
}) => {
    if ((!show && !isClosing) || !invoice) return null;
    return (
        <>
            <div
                className={clsx(
                    isClosing ? styles.modalAnimateLeave : styles.modalAnimate,
                    'modal fade custom-modals',
                    show && !isClosing ? 'show' : ''
                )}
                style={{ display: show || isClosing ? 'block' : 'none' }}
                tabIndex={-1}
                onAnimationEnd={
                    isClosing
                        ? typeof onAnimationEnd === 'function'
                            ? onAnimationEnd
                            : undefined
                        : undefined
                }
            >
                <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3 className="modal-title">Xem Hoá Đơn</h3>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={onClose}
                                aria-label="Close"
                            >
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                        <div className="modal-body pb-0">
                            <div className="prescribe-download">
                                <h5>{invoice.bookedOn}</h5>
                                <ul>
                                    <li>
                                        <button className="print-link btn btn-link">
                                            <i className="isax isax-printer"></i>
                                        </button>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="btn btn-md btn-primary-gradient rounded-pill"
                                        >
                                            Tải xuống
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div className="view-prescribe invoice-content mb-0">
                                <div className="invoice-item">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="invoice-logo">
                                                <img src="/src/assets/img/logo.svg" alt="logo" />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <p className="invoice-details">
                                                Hoá Đơn Số : <span>{invoice.id}</span>
                                                <br />
                                                Ban Hành: <span>{invoice.bookedOn}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                {/* Invoice Item */}
                                <div className="invoice-item">
                                    <div className="row">
                                        <div className="col-md-4">
                                            <div className="invoice-info">
                                                <h6 className="customer-text">Thanh Toán Từ</h6>
                                                <p className="invoice-details invoice-details-two">
                                                    {invoice.doctor.name} <br />
                                                    806 Twin Willow Lane, <br />
                                                    Newyork, USA <br />
                                                </p>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="invoice-info">
                                                <h6 className="customer-text">Thanh Toán Cho</h6>
                                                <p className="invoice-details invoice-details-two">
                                                    Richard Wilson <br />
                                                    299 Star Trek Drive
                                                    <br />
                                                    Florida, 32405, USA
                                                    <br />
                                                </p>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="invoice-info invoice-info2">
                                                <h6
                                                    className={clsx(
                                                        styles.paymentMethodText,
                                                        'customer-text'
                                                    )}
                                                >
                                                    Phương Thức Thanh Toán
                                                </h6>
                                                <p className="invoice-details">
                                                    Debit Card <br />
                                                    XXXXXXXXXXXX-2541
                                                    <br />
                                                    HDFC Bank
                                                    <br />
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* /Invoice Item */}
                                {/* Invoice Item */}
                                <div
                                    className={clsx(
                                        styles.invoiceTableWrap,
                                        'invoice-item invoice-table-wrap'
                                    )}
                                >
                                    <div className="row">
                                        <div className="col-md-12">
                                            <h6>Chi Tiết Hoá Đơn</h6>
                                            <div className="invoice-table">
                                                <div className="table-responsive">
                                                    <table className="table table-bordered">
                                                        <thead>
                                                            <tr>
                                                                <th>Nội dung</th>
                                                                <th>Số lượng</th>
                                                                <th>VAT</th>
                                                                <th>Tổng cộng</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td className="text-gray-9">
                                                                    General Consultation
                                                                </td>
                                                                <td>1</td>
                                                                <td>$0</td>
                                                                <td>$150</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="text-gray-9">
                                                                    Video Call
                                                                </td>
                                                                <td>1</td>
                                                                <td>$0</td>
                                                                <td>$100</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-xl-4 ms-auto">
                                            <div className="table-responsive">
                                                <table className="invoice-table-two table">
                                                    <tbody>
                                                        <tr>
                                                            <th>Tổng Phụ:</th>
                                                            <td>
                                                                <span>$350</span>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <th>Giảm Giá:</th>
                                                            <td>
                                                                <span>-10%</span>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <th>Tổng Số Tiền:</th>
                                                            <td>
                                                                <span>{invoice.amount}</span>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* /Invoice Item */}
                                {/* Invoice Information */}
                                <div className="other-info mb-0">
                                    <h6 className="mb-2">Thông tin khác</h6>
                                    <p className="mb-0">
                                        Một bản tường trình về căn bệnh hiện tại, bao gồm các tình
                                        huống xung quanh sự khởi phát của những thay đổi sức khỏe
                                        gần đây và trình tự thời gian của các sự kiện tiếp theo
                                        khiến bệnh nhân phải tìm đến thuốc
                                    </p>
                                </div>
                                {/* /Invoice Information */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Overlay to close modal when clicking outside */}
            <div
                className="modal-backdrop fade show modal-animate"
                onClick={onClose}
                style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1040 }}
            />
        </>
    );
};

export default InvoiceModal;
