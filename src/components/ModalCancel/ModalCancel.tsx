import React, { useState, useEffect } from 'react';

interface ModalCancelProps {
    show: boolean;
    onHide: () => void;
    onConfirm: (cancellationReason: string) => void;
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    loading?: boolean;
    reasonLabel?: string;
    reasonPlaceholder?: string;
    minReasonLength?: number;
    refundInfo?: {
        refundPercentage: number;
        policyMessage: string;
    };
}

const ModalCancel: React.FC<ModalCancelProps> = ({
    show,
    onHide,
    onConfirm,
    title = 'Xác Nhận Hủy',
    message = 'Bạn có chắc chắn muốn hủy',
    confirmText = 'Xác nhận',
    cancelText = 'Đóng',
    loading = false,
    reasonLabel = 'Lý do',
    reasonPlaceholder = 'Vui lòng nhập lý do hủy...',
    minReasonLength = 10,
    refundInfo,
}) => {
    const [cancelReason, setCancelReason] = useState('');
    const [error, setError] = useState('');

    // Helper function to get alert class based on refund percentage
    const getAlertClass = (refundPercentage: number): string => {
        if (refundPercentage === 100) return 'alert-success';
        if (refundPercentage > 0) return 'alert-warning';
        return 'alert-danger';
    };

    // Helper function to get icon class based on refund percentage
    const getIconClass = (refundPercentage: number): string => {
        if (refundPercentage === 100) return 'isax-tick-circle';
        if (refundPercentage > 0) return 'isax-info-circle';
        return 'isax-close-circle';
    };

    // Reset state when modal is closed
    useEffect(() => {
        if (!show) {
            setCancelReason('');
            setError('');
        }
    }, [show]);

    const handleConfirm = () => {
        // Validate reason length
        if (cancelReason.trim().length < minReasonLength) {
            setError(`Lý do hủy phải có ít nhất ${minReasonLength} ký tự`);
            return;
        }

        onConfirm(cancelReason.trim());
    };

    const handleReasonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setCancelReason(value);

        // Clear error when user starts typing
        if (error && value.trim().length >= minReasonLength) {
            setError('');
        }
    };

    if (!show) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className={`modal-backdrop fade ${show ? 'show' : ''}`}
                onClick={loading ? undefined : onHide}
                onKeyDown={(e) => {
                    if (!loading && e.key === 'Escape') {
                        e.preventDefault();
                        onHide();
                    }
                }}
                tabIndex={-1}
                aria-hidden="true"
            />

            {/* Modal */}
            <div
                className={`modal fade ${show ? 'show d-block' : ''}`}
                tabIndex={-1}
                aria-hidden={!show}
                aria-modal="true"
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        {/* Header */}
                        <div className="modal-header border-bottom">
                            <h5 className="modal-title fw-semibold">{title}</h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={onHide}
                                disabled={loading}
                                aria-label="Close"
                            />
                        </div>

                        {/* Body */}
                        <div className="modal-body">
                            <p className="text-muted mb-3">{message}?</p>

                            {/* Refund Info */}
                            {refundInfo && (
                                <>
                                    {/* Current Refund Amount Alert */}
                                    <div
                                        className={`alert ${getAlertClass(refundInfo.refundPercentage)} mb-3`}
                                    >
                                        <div className="d-flex align-items-center">
                                            <i
                                                className={`isax ${getIconClass(refundInfo.refundPercentage)} me-2 `}
                                            />
                                            <div className="flex-grow-1">
                                                <strong>Số tiền hoàn lại của bạn:</strong>
                                                <p className="mb-0 mt-1">
                                                    {refundInfo.policyMessage}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Refund Policy Details - Collapsible */}
                                    <div className="card border mb-3">
                                        <div
                                            className="card-header bg-light py-2 px-3"
                                            style={{ cursor: 'pointer' }}
                                            data-bs-toggle="collapse"
                                            data-bs-target="#refundPolicyDetails"
                                            aria-expanded="false"
                                            aria-controls="refundPolicyDetails"
                                        >
                                            <div className="d-flex align-items-center justify-content-between">
                                                <div className="d-flex align-items-center">
                                                    <i className="isax isax-info-circle me-2 text-primary"></i>
                                                    <small className="fw-semibold text-dark">
                                                        Chính sách hoàn tiền của hệ thống
                                                    </small>
                                                </div>
                                                <i className="isax isax-arrow-down-1"></i>
                                            </div>
                                        </div>
                                        <div className="collapse" id="refundPolicyDetails">
                                            <div className="card-body p-3">
                                                <div className="table-responsive">
                                                    <table className="table table-sm table-bordered mb-0">
                                                        <thead className="table-light">
                                                            <tr>
                                                                <th
                                                                    className="text-center"
                                                                    style={{ width: '45%' }}
                                                                >
                                                                    <small>Thời gian hủy</small>
                                                                </th>
                                                                <th
                                                                    className="text-center"
                                                                    style={{ width: '30%' }}
                                                                >
                                                                    <small>% Hoàn tiền</small>
                                                                </th>
                                                                <th
                                                                    className="text-center"
                                                                    style={{ width: '25%' }}
                                                                >
                                                                    <small>Trạng thái</small>
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td>
                                                                    <small>
                                                                        ≥ 24 giờ trước lịch hẹn
                                                                    </small>
                                                                </td>
                                                                <td className="text-center">
                                                                    <span className="badge bg-success">
                                                                        <small>100%</small>
                                                                    </span>
                                                                </td>
                                                                <td className="text-center">
                                                                    <small className="text-success">
                                                                        <i className="isax isax-tick-circle"></i>{' '}
                                                                        Tốt
                                                                    </small>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>
                                                                    <small>
                                                                        12-24 giờ trước lịch hẹn
                                                                    </small>
                                                                </td>
                                                                <td className="text-center">
                                                                    <span className="badge bg-warning">
                                                                        <small>50%</small>
                                                                    </span>
                                                                </td>
                                                                <td className="text-center">
                                                                    <small className="text-warning">
                                                                        <i className="isax isax-info-circle"></i>{' '}
                                                                        Trung bình
                                                                    </small>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>
                                                                    <small>
                                                                        &lt; 12 giờ trước lịch hẹn
                                                                    </small>
                                                                </td>
                                                                <td className="text-center">
                                                                    <span className="badge bg-danger">
                                                                        <small>0%</small>
                                                                    </span>
                                                                </td>
                                                                <td className="text-center">
                                                                    <small className="text-danger">
                                                                        <i className="isax isax-close-circle"></i>{' '}
                                                                        Không hoàn
                                                                    </small>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>

                                                {/* Additional Notes */}
                                                <div className="mt-3 p-2 bg-light rounded">
                                                    <small className="text-muted d-block mb-1">
                                                        <strong>📌 Lưu ý:</strong>
                                                    </small>
                                                    <ul
                                                        className="mb-0 ps-3"
                                                        style={{ fontSize: '0.85rem' }}
                                                    >
                                                        <li className="text-muted mb-1">
                                                            Thời gian tính từ lúc bạn xác nhận hủy
                                                            đến giờ bắt đầu lịch hẹn
                                                        </li>
                                                        <li className="text-muted mb-1">
                                                            Nếu bệnh viện hủy lịch, bạn sẽ được hoàn
                                                            100% bất kể thời gian
                                                        </li>
                                                        <li className="text-muted">
                                                            Tiền hoàn sẽ được xử lý trong vòng 3-5
                                                            ngày làm việc
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Cancellation Reason */}
                            <div className="mb-3">
                                <label htmlFor="cancelReason" className="form-label fw-medium">
                                    {reasonLabel} <span className="text-danger">*</span>
                                </label>
                                <textarea
                                    id="cancelReason"
                                    className={`form-control ${error ? 'is-invalid' : ''}`}
                                    rows={4}
                                    placeholder={reasonPlaceholder}
                                    value={cancelReason}
                                    onChange={handleReasonChange}
                                    disabled={loading}
                                    maxLength={500}
                                />
                                {error && <div className="invalid-feedback">{error}</div>}
                                <small className="text-muted">
                                    {cancelReason.length}/500 ký tự (tối thiểu {minReasonLength})
                                </small>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="modal-footer border-top">
                            <button
                                type="button"
                                className="btn btn-light"
                                onClick={onHide}
                                disabled={loading}
                            >
                                {cancelText}
                            </button>
                            <button
                                type="button"
                                className={`btn ${
                                    refundInfo && refundInfo.refundPercentage === 0
                                        ? 'btn-danger'
                                        : 'btn-primary'
                                }`}
                                onClick={handleConfirm}
                                disabled={loading || cancelReason.trim().length < minReasonLength}
                            >
                                {loading ? (
                                    <>
                                        <span
                                            className="spinner-border spinner-border-sm me-2"
                                            aria-hidden="true"
                                        />
                                        <span>Đang xử lý...</span>
                                    </>
                                ) : (
                                    confirmText
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ModalCancel;
