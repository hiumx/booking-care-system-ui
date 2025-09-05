import React, { useEffect } from 'react';
import clsx from 'clsx';
import Button from '../../../../components/Button';

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
    // Prevent body scroll when modal is open
    useEffect(() => {
        if (show && !isClosing) {
            // Add class and set styles to prevent scroll
            document.body.classList.add('modalOpen');
        } else if (!show && !isClosing) {
            // Modal is completely closed, restore scroll
            const timer = setTimeout(() => {
                // Remove class and styles
                document.body.classList.remove('modalOpen');
            }, 100); // Slightly longer delay to ensure modal is fully closed

            return () => clearTimeout(timer);
        }

        // Cleanup on unmount
        return () => {
            document.body.classList.remove('modalOpen');
            document.body.style.overflow = '';
        };
    }, [show, isClosing]);

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
                <div
                    className={clsx('modal-dialog modal-dialog-centered', styles.responsiveModal)}
                    role="document"
                >
                    <div className={clsx('modal-content', styles.modalContent)}>
                        <div className={clsx('modal-header')}>
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
                        <div className={clsx('modal-body pb-0')}>
                            <div className={clsx(styles.prescribeDownload, 'prescribe-download')}>
                                <h5>{invoice.bookedOn}</h5>
                                <ul>
                                    <li>
                                        <Button
                                            text="Tải xuống"
                                            type="button"
                                            className="btn-md rounded-pill"
                                        />
                                    </li>
                                </ul>
                            </div>
                            <div
                                className={clsx(
                                    'view-prescribe invoice-content mb-0',
                                    styles.invoiceContent
                                )}
                            >
                                <div className="invoice-item">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div
                                                className={clsx(styles.invoiceLogo, 'invoice-logo')}
                                            >
                                                <img src="/src/assets/img/logo.svg" alt="logo" />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <p
                                                className={clsx(
                                                    styles.invoiceDetails,
                                                    'invoice-details'
                                                )}
                                            >
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
                                        <div className="col-md-4 col-sm-6">
                                            <div
                                                className={clsx(styles.invoiceInfo, 'invoice-info')}
                                            >
                                                <h6 className="customer-text">Thanh Toán Từ</h6>
                                                <p
                                                    className={clsx(
                                                        styles.invoiceDetails,
                                                        'invoice-details invoice-details-two'
                                                    )}
                                                >
                                                    {invoice.doctor.name} <br />
                                                    806 Twin Willow Lane, <br />
                                                    Newyork, USA <br />
                                                </p>
                                            </div>
                                        </div>
                                        <div className="col-md-4 col-sm-6">
                                            <div
                                                className={clsx(styles.invoiceInfo, 'invoice-info')}
                                            >
                                                <h6 className="customer-text">Thanh Toán Cho</h6>
                                                <p
                                                    className={clsx(
                                                        styles.invoiceDetails,
                                                        'invoice-details invoice-details-two'
                                                    )}
                                                >
                                                    Richard Wilson <br />
                                                    299 Star Trek Drive
                                                    <br />
                                                    Florida, 32405, USA
                                                    <br />
                                                </p>
                                            </div>
                                        </div>
                                        <div className="col-md-4 col-12">
                                            <div
                                                className={clsx(
                                                    styles.invoiceInfo,
                                                    'invoice-info2'
                                                )}
                                            >
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
                                                <div
                                                    className={clsx(
                                                        styles.tableResponsive,
                                                        'table-responsive'
                                                    )}
                                                >
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
                className={clsx('modal-backdrop fade show modal-animate', styles.modalBackdrop)}
                onClick={onClose}
            />
        </>
    );
};

export default InvoiceModal;
