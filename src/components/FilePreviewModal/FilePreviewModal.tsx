import React, { useEffect } from 'react';
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

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            // Prevent body scroll when modal is open
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const isImage = /\.(jpg|jpeg|png|gif|webp)(\?|$)/i.test(fileUrl);
    const isPdf = /\.pdf(\?|$)/i.test(fileUrl);
    const isDoc = /\.(doc|docx)(\?|$)/i.test(fileUrl);

    const docViewerUrl = isDoc
        ? `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`
        : '';

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="modal fade show"
            style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby="file-preview-modal-title"
        >
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content">
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
            </div>
        </div>
    );
};

export default FilePreviewModal;
