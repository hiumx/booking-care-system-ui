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
    itemName?: string;
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
            />

            {/* Modal */}
            <div
                className={`modal fade ${show ? 'show d-block' : ''}`}
                tabIndex={-1}
                role="dialog"
                aria-hidden={!show}
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
                                <div
                                    className={`alert ${
                                        refundInfo.refundPercentage === 100
                                            ? 'alert-success'
                                            : refundInfo.refundPercentage > 0
                                              ? 'alert-warning'
                                              : 'alert-danger'
                                    } mb-3`}
                                >
                                    <div className="d-flex align-items-center">
                                        <i
                                            className={`isax ${
                                                refundInfo.refundPercentage === 100
                                                    ? 'isax-tick-circle'
                                                    : refundInfo.refundPercentage > 0
                                                      ? 'isax-info-circle'
                                                      : 'isax-close-circle'
                                            } me-2 fs-5`}
                                        />
                                        <div>
                                            <strong>Chính sách hoàn tiền:</strong>
                                            <p className="mb-0 mt-1">{refundInfo.policyMessage}</p>
                                        </div>
                                    </div>
                                </div>
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
                                            role="status"
                                            aria-hidden="true"
                                        />
                                        Đang xử lý...
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
