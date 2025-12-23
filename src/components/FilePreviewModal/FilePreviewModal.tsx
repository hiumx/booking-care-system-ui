import React, { useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

interface FilePreviewModalProps {
    isOpen: boolean;
    fileUrl: string;
    fileName: string;
    onClose: () => void;
}

const FilePreviewModal: React.FC<FilePreviewModalProps> = ({
    isOpen,
    fileUrl,
    fileName,
    onClose,
}) => {
    const { t } = useTranslation('common');
    const dialogRef = useRef<HTMLDialogElement>(null);

    // Handle dialog open/close
    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        if (isOpen) {
            dialog.showModal();
            document.body.style.overflow = 'hidden';
        } else {
            dialog.close();
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Handle native dialog close event (Escape key)
    const handleDialogClose = useCallback(() => {
        onClose();
    }, [onClose]);

    // Handle backdrop click
    const handleBackdropClick = useCallback(
        (e: React.MouseEvent<HTMLDialogElement>) => {
            const dialog = dialogRef.current;
            if (dialog && e.target === dialog) {
                onClose();
            }
        },
        [onClose]
    );

    const isImage = /\.(jpg|jpeg|png|gif|webp)(\?|$)/i.test(fileUrl);
    const isPdf = /\.pdf(\?|$)/i.test(fileUrl);
    const isDoc = /\.(doc|docx)(\?|$)/i.test(fileUrl);

    const docViewerUrl = isDoc
        ? `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`
        : '';

    return (
        <dialog
            ref={dialogRef}
            className="file-preview-dialog"
            aria-labelledby="file-preview-modal-title"
            onClose={handleDialogClose}
            onClick={handleBackdropClick}
            style={{
                padding: 0,
                border: 'none',
                borderRadius: '0.5rem',
                maxWidth: '800px',
                width: '90%',
                maxHeight: '90vh',
                backgroundColor: 'transparent',
            }}
        >
            <div className="modal-content" style={{ backgroundColor: 'white' }}>
                <div className="modal-header">
                    <h5 className="modal-title" id="file-preview-modal-title">
                        {fileName}
                    </h5>
                    <button
                        type="button"
                        className="btn-close"
                        onClick={onClose}
                        aria-label={t('filePreview.close')}
                    ></button>
                </div>
                <div className="modal-body">
                    {isImage && (
                        <img
                            src={fileUrl}
                            alt={fileName}
                            className="img-fluid w-100"
                            style={{ maxHeight: '70vh', objectFit: 'contain' }}
                        />
                    )}
                    {isPdf && (
                        <iframe
                            src={fileUrl}
                            title={fileName}
                            style={{ width: '100%', height: '70vh', border: 'none' }}
                        />
                    )}
                    {isDoc && (
                        <div>
                            <iframe
                                src={docViewerUrl}
                                title={fileName}
                                style={{ width: '100%', height: '70vh', border: 'none' }}
                            />
                            <div className="alert alert-info mt-3 mb-0">
                                <i className="isax isax-info-circle me-2"></i>
                                {t('filePreview.docViewerNote')}{' '}
                                <a
                                    href={fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="alert-link"
                                >
                                    {t('filePreview.downloadFile')}
                                </a>
                            </div>
                        </div>
                    )}
                    {!isImage && !isPdf && !isDoc && (
                        <div className="text-center py-5">
                            <i
                                className="isax isax-document-text"
                                style={{ fontSize: '4rem', color: 'var(--bs-gray-400)' }}
                            ></i>
                            <p className="mt-3 text-muted">{t('filePreview.cannotPreview')}</p>
                            <a
                                href={fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-primary"
                            >
                                <i className="isax isax-import me-2"></i>
                                {t('filePreview.download')}
                            </a>
                        </div>
                    )}
                </div>
                <div className="modal-footer">
                    <a
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary"
                    >
                        <i className="isax isax-export-3 me-2"></i>
                        {t('filePreview.openInNewTab')}
                    </a>
                    <button type="button" className="btn btn-danger" onClick={onClose}>
                        {t('filePreview.close')}
                    </button>
                </div>
            </div>
        </dialog>
    );
};

export default FilePreviewModal;
