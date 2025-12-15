import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import Button from '../../../../components/Button';

import { generateInvoicePDF, printInvoice } from '../pdfGenerator';
import styles from './InvoiceModal.module.scss';
import logo from '@/assets/img/logo.svg';

interface InvoiceModalProps {
    profile?: any;
    show: boolean;
    onClose: () => void;
    invoice?: {
        id: string;
        doctor: { name: string; img: string };
        appointmentDate: string;
        bookedOn: string;
        amount: string;
        appointmentType: string;
    };
    isClosing?: boolean; // Optional prop to handle closing animation
    onAnimationEnd?: () => void; // Callback for animation end
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({
    profile,
    show,
    onClose,
    invoice,
    isClosing,
    onAnimationEnd,
}) => {
    const { t } = useTranslation('userProfile');
    const invoiceContentRef = useRef<HTMLDivElement>(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [isPrinting, setIsPrinting] = useState(false);

    // Handle PDF download
    const handleDownloadPDF = async () => {
        if (!invoiceContentRef.current || !invoice) return;

        try {
            setIsDownloading(true);
            await generateInvoicePDF(
                invoiceContentRef.current,
                invoice.id,
                profile?.fullName || 'Patient'
            );
        } catch (error) {
            console.error('Error downloading PDF:', error);
            alert(t('invoices.modal.errors.downloadFailed'));
        } finally {
            setIsDownloading(false);
        }
    };

    // Handle print
    const handlePrint = () => {
        if (!invoiceContentRef.current) return;

        try {
            setIsPrinting(true);
            printInvoice(invoiceContentRef.current);
        } catch (error) {
            console.error('Error printing invoice:', error);
            alert(t('invoices.modal.errors.printFailed'));
        } finally {
            // Reset printing state after a short delay
            setTimeout(() => setIsPrinting(false), 1000);
        }
    };
    // Prevent body scroll when modal is open
    useEffect(() => {
        if (show && !isClosing) {
            // Add class and set styles to prevent scroll
            document.body.classList.add(clsx(styles.modalOpen));
        } else if (!show && !isClosing) {
            // Modal is completely closed, restore scroll
            const timer = setTimeout(() => {
                // Remove class and styles
                document.body.classList.remove(clsx(styles.modalOpen));
            }, 100); // Slightly longer delay to ensure modal is fully closed

            return () => clearTimeout(timer);
        }

        // Cleanup on unmount
        return () => {
            document.body.classList.remove(clsx(styles.modalOpen));
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
                    isClosing && typeof onAnimationEnd === 'function' ? onAnimationEnd : undefined
                }
            >
                <div
                    className={clsx('modal-dialog modal-dialog-centered', styles.responsiveModal)}
                    role="document"
                >
                    <div className={clsx('modal-content', styles.modalContent)}>
                        <div className={clsx('modal-header')}>
                            <h3 className="modal-title">{t('invoices.modal.title')}</h3>
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
                                            text={
                                                isDownloading
                                                    ? t('invoices.modal.downloading')
                                                    : t('invoices.modal.downloadPdf')
                                            }
                                            type="button"
                                            className="btn-md rounded-pill me-2"
                                            onClick={handleDownloadPDF}
                                            isDisabled={isDownloading || isPrinting}
                                        />
                                    </li>
                                    <li>
                                        <Button
                                            text={
                                                isPrinting
                                                    ? t('invoices.modal.printing')
                                                    : t('invoices.modal.print')
                                            }
                                            type="button"
                                            className="btn-md rounded-pill btn-outline-primary"
                                            onClick={handlePrint}
                                            isDisabled={isDownloading || isPrinting}
                                        />
                                    </li>
                                </ul>
                            </div>
                            <div
                                ref={invoiceContentRef}
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
                                                <img src={logo} alt="logo" />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <p
                                                className={clsx(
                                                    styles.invoiceDetails,
                                                    'invoice-details'
                                                )}
                                            >
                                                {t('invoices.modal.invoiceNumber')} :{' '}
                                                <span>{invoice.id}</span>
                                                <br />
                                                {t('invoices.modal.issuedDate')}:{' '}
                                                <span>{invoice.bookedOn}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                {/* Invoice Item */}
                                <div className="invoice-item">
                                    <div className="row">
                                        <div className="col-md-6 col-sm-6">
                                            <div
                                                className={clsx(styles.invoiceInfo, 'invoice-info')}
                                            >
                                                <h6 className="customer-text">
                                                    {t('invoices.modal.paymentFrom')}
                                                </h6>
                                                <p
                                                    className={clsx(
                                                        styles.invoiceDetails,
                                                        'invoice-details invoice-details-two'
                                                    )}
                                                >
                                                    {profile?.fullName} <br />
                                                    {profile?.phone} <br />
                                                </p>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-sm-6">
                                            <div
                                                className={clsx(styles.invoiceInfo, 'invoice-info')}
                                            >
                                                <h6 className="customer-text">
                                                    {t('invoices.modal.paymentTo')}
                                                </h6>
                                                <p
                                                    className={clsx(
                                                        styles.invoiceDetails,
                                                        'invoice-details invoice-details-two'
                                                    )}
                                                >
                                                    SE33 <br />
                                                    FPT University
                                                    <br />
                                                    Nam Kỳ Khởi Nghĩa, Đà Nẵng, Việt Nam
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
                                            <h6>{t('invoices.modal.invoiceDetails')}</h6>
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
                                                                <th>
                                                                    {t('invoices.modal.content')}
                                                                </th>

                                                                <th>{t('invoices.modal.vat')}</th>
                                                                <th>
                                                                    {t('invoices.modal.deposit')}
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td className="text-gray-9">
                                                                    {invoice.appointmentType ===
                                                                    'IN_PERSON'
                                                                        ? t(
                                                                              'invoices.modal.appointmentType.inPerson'
                                                                          )
                                                                        : t(
                                                                              'invoices.modal.appointmentType.remote'
                                                                          )}
                                                                </td>

                                                                <td>0 ₫</td>
                                                                <td>{invoice.amount}</td>
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
                                                            <th>{t('invoices.modal.subtotal')}</th>
                                                            <td>
                                                                <span>{invoice.amount}</span>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <th>{t('invoices.modal.discount')}</th>
                                                            <td>
                                                                <span>0%</span>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <th>
                                                                {t('invoices.modal.totalAmount')}
                                                            </th>
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
                                    <h6 className="mb-2">{t('invoices.modal.otherInfo')}</h6>
                                    <p className="mb-0">
                                        {t('invoices.modal.otherInfoDescription')}
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
