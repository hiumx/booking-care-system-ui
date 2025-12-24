import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SignatureCanvas from 'react-signature-canvas';
import { toast } from 'react-toastify';
import { validateToken, sendSigningOtp, signContract } from '@/services/contract-signing.service';
import type { ContractSigningInfo } from '@/types/contract-signing.types';
import { PATHS } from '@/routes/paths';
import StepWizard from '@/components/StepWizard/StepWizard';
import Spinner from '@/components/Spinner';

const ContractSigningPage: React.FC = () => {
    const { t } = useTranslation('contractSigning');
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();
    const signatureRef = useRef<SignatureCanvas>(null);

    const [isLoading, setIsLoading] = useState(true);
    const [isValidToken, setIsValidToken] = useState(false);
    const [contractInfo, setContractInfo] = useState<ContractSigningInfo | null>(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [hasSignature, setHasSignature] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otpCode, setOtpCode] = useState('');
    const [isSendingOtp, setIsSendingOtp] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [isSigning, setIsSigning] = useState(false);

    useEffect(() => {
        if (token) {
            validateContractToken();
        }
    }, [token]);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const validateContractToken = async () => {
        setIsLoading(true);
        try {
            const response = await validateToken(token!);
            if (response.success && response.data) {
                const tokenData = response.data;
                if (tokenData.isValid && tokenData.contractInfo) {
                    setIsValidToken(true);
                    setContractInfo(tokenData.contractInfo);
                } else {
                    setIsValidToken(false);
                    setErrorMessage(tokenData.errorMessage || t('invalidToken.defaultError'));
                }
            } else {
                setIsValidToken(false);
                setErrorMessage(t('invalidToken.defaultError'));
            }
        } catch (error: any) {
            setIsValidToken(false);
            setErrorMessage(error.message || t('invalidToken.validationError'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleClearSignature = () => {
        signatureRef.current?.clear();
        setHasSignature(false);
    };

    const handleSendOtp = async () => {
        if (!token) return;

        setIsSendingOtp(true);
        try {
            const response = await sendSigningOtp(token);
            if (response.success) {
                setOtpSent(true);
                setCountdown(60);
                toast.success(response.message || t('toast.otpSent'));
            } else {
                toast.error(response.message || t('toast.otpSendFailed'));
            }
        } catch (error: any) {
            toast.error(error.message || t('toast.otpSendError'));
        } finally {
            setIsSendingOtp(false);
        }
    };

    const handleSignContract = async () => {
        if (!token || !signatureRef.current || !otpCode) {
            toast.error(t('toast.completeAllSteps'));
            return;
        }

        if (signatureRef.current.isEmpty()) {
            toast.error(t('toast.drawSignature'));
            return;
        }

        if (otpCode.length !== 6) {
            toast.error(t('toast.otpLength'));
            return;
        }

        setIsSigning(true);
        try {
            const signatureBase64 = signatureRef.current.toDataURL();

            const response = await signContract({
                token,
                signatureBase64,
                otpCode,
            });

            if (response.success) {
                toast.success(response.message || t('toast.signSuccess'));
                setTimeout(() => {
                    navigate(PATHS.CONTRACT_SIGNING.SUCCESS);
                }, 2000);
            } else {
                toast.error(response.message || t('toast.signFailed'));
            }
        } catch (error: any) {
            toast.error(error.message || t('toast.signError'));
        } finally {
            setIsSigning(false);
        }
    };

    if (isLoading) {
        return (
            <div
                className="d-flex justify-content-center align-items-center"
                style={{ minHeight: 'calc(100vh - 300px)', width: '100%' }}
            >
                <div className="text-center">
                    <Spinner size="large" variant="primary" />
                    <p className="mt-3 text-muted">{t('loading')}</p>
                </div>
            </div>
        );
    }

    if (!isValidToken) {
        return (
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card">
                            <div className="card-body text-center py-5">
                                <i
                                    className="isax isax-close-circle5 text-danger mb-3"
                                    style={{ fontSize: '48px' }}
                                ></i>
                                <h4 className="text-danger mb-3">{t('invalidToken.title')}</h4>
                                <p className="text-muted mb-0">{errorMessage}</p>
                                <p className="text-muted">{t('invalidToken.contactAdmin')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-4">
            <div className="row justify-content-center">
                <div className="col-lg-10">
                    {/* Header */}
                    <div className="text-center mb-4">
                        <h3 className="mb-2">{t('header.title')}</h3>
                        <p className="text-muted">{t('header.subtitle')}</p>
                        <div className="mt-3">
                            <StepWizard
                                steps={[
                                    { id: 1, title: t('steps.signature') },
                                    { id: 2, title: t('steps.otp') },
                                    { id: 3, title: t('steps.confirm') },
                                ]}
                                currentStep={(() => {
                                    if (otpCode.length === 6) return 3;
                                    if (otpSent || hasSignature) return 2;
                                    return 1;
                                })()}
                            />
                        </div>
                    </div>

                    {/* Contract Info */}
                    <div className="card mb-4">
                        <div className="card-header">
                            <h6 className="mb-0">
                                <i className="isax isax-document-text5 me-2 text-primary"></i>{' '}
                                {t('contractInfo.title')}
                            </h6>
                        </div>
                        <div className="card-body">
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <div className="d-flex align-items-center">
                                        <i className="isax isax-receipt-15 text-primary me-2"></i>
                                        <div>
                                            <small className="text-muted d-block">
                                                {t('contractInfo.contractNumber')}
                                            </small>
                                            <span className="fw-medium">
                                                {contractInfo?.contractNumber}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="d-flex align-items-center">
                                        <i className="isax isax-hospital5 text-success me-2"></i>
                                        <div>
                                            <small className="text-muted d-block">
                                                {t('contractInfo.hospital')}
                                            </small>
                                            <span className="fw-medium">
                                                {contractInfo?.hospitalName}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="d-flex align-items-center">
                                        <i className="isax isax-user text-info me-2"></i>
                                        <div>
                                            <small className="text-muted d-block">
                                                {t('contractInfo.representative')}
                                            </small>
                                            <span className="fw-medium">
                                                {contractInfo?.representativeName}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="d-flex align-items-center">
                                        <i className="isax isax-sms5 text-warning me-2"></i>
                                        <div>
                                            <small className="text-muted d-block">
                                                {t('contractInfo.email')}
                                            </small>
                                            <span className="fw-medium">
                                                {contractInfo?.representativeEmail}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contract Preview */}
                    <div className="card mb-4">
                        <div className="card-header d-flex align-items-center justify-content-between">
                            <h6 className="mb-0">
                                <i className="isax isax-eye5 me-2 text-primary"></i>{' '}
                                {t('contractPreview.title')}
                            </h6>
                            <span className="badge bg-info">{t('contractPreview.draft')}</span>
                        </div>
                        <div className="card-body">
                            <div className="alert alert-warning mb-3">
                                <i className="isax isax-warning-25 me-2"></i>
                                <small>{t('contractPreview.warning')}</small>
                            </div>
                            <div className="ratio ratio-16x9 mb-3 rounded overflow-hidden border">
                                <iframe
                                    src={contractInfo?.contractDraftUrl}
                                    title="Contract Preview"
                                    className="border-0"
                                />
                            </div>
                            <a
                                href={contractInfo?.contractDraftUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-outline-primary btn-sm"
                            >
                                <i className="isax isax-export-35 me-1"></i>{' '}
                                {t('contractPreview.openNewTab')}
                            </a>
                        </div>
                    </div>

                    {/* Signature Section */}
                    <div className="card mb-4">
                        <div className="card-header">
                            <h6 className="mb-0">
                                <span className="badge bg-primary me-2">1</span>{' '}
                                <i className="isax isax-edit-25 me-2"></i> {t('signature.title')}
                            </h6>
                        </div>
                        <div className="card-body">
                            <p className="text-muted small mb-3">
                                <i className="isax isax-info-circle5 me-1"></i>{' '}
                                {t('signature.description')}
                            </p>
                            <div
                                className="border rounded p-2 mb-3 position-relative bg-white"
                                style={{ minHeight: '200px' }}
                            >
                                <SignatureCanvas
                                    ref={signatureRef}
                                    canvasProps={{
                                        className: 'signature-canvas w-100',
                                        style: { height: '200px' },
                                    }}
                                    onEnd={() => setHasSignature(true)}
                                />
                                {!hasSignature && (
                                    <div
                                        className="position-absolute top-50 start-50 translate-middle text-muted"
                                        style={{ pointerEvents: 'none', opacity: 0.5 }}
                                    >
                                        <i
                                            className="isax isax-edit5 me-2"
                                            style={{ fontSize: '20px' }}
                                        ></i>
                                        <span>{t('signature.placeholder')}</span>
                                    </div>
                                )}
                            </div>
                            <div className="d-flex align-items-center gap-2">
                                <button
                                    type="button"
                                    className="btn btn-outline-danger btn-sm"
                                    onClick={handleClearSignature}
                                    disabled={!hasSignature}
                                >
                                    <i className="isax isax-trash me-1"></i> {t('signature.clear')}
                                </button>
                                {hasSignature && (
                                    <span className="badge bg-success">
                                        <i className="isax isax-tick-circle5 me-1"></i>{' '}
                                        {t('signature.hasSignature')}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* OTP Section */}
                    <div className="card mb-4">
                        <div className="card-header">
                            <h6 className="mb-0">
                                <span className="badge bg-primary me-2">2</span>{' '}
                                <i className="isax isax-shield-tick5 me-2"></i> {t('otp.title')}
                            </h6>
                        </div>
                        <div className="card-body">
                            {otpSent ? (
                                <div>
                                    <div className="alert alert-success mb-3">
                                        <i className="isax isax-tick-circle5 me-2"></i>
                                        <strong>{t('otp.sent')}</strong>
                                        <span className="ms-1">{t('otp.checkEmail')}</span>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="otp-input" className="form-label fw-medium">
                                            {t('otp.inputLabel')}
                                        </label>
                                        <input
                                            id="otp-input"
                                            type="text"
                                            className="form-control form-control-lg text-center"
                                            placeholder="● ● ● ● ● ●"
                                            maxLength={6}
                                            value={otpCode}
                                            onChange={(e) =>
                                                setOtpCode(
                                                    e.target.value
                                                        .split('')
                                                        .filter((c) => /\d/.test(c))
                                                        .join('')
                                                )
                                            }
                                            style={{ letterSpacing: '0.5em', fontSize: '1.25rem' }}
                                        />
                                    </div>
                                    <div className="d-flex align-items-center justify-content-between">
                                        {countdown > 0 ? (
                                            <p className="text-muted small mb-0">
                                                <i className="isax isax-clock5 me-1"></i>{' '}
                                                {t('otp.resendIn')} <strong>{countdown}</strong>{' '}
                                                {t('otp.seconds')}
                                            </p>
                                        ) : (
                                            <button
                                                type="button"
                                                className="btn btn-link p-0 text-decoration-none"
                                                onClick={handleSendOtp}
                                            >
                                                <i className="isax isax-refresh5 me-1"></i>{' '}
                                                {t('otp.resend')}
                                            </button>
                                        )}
                                        {otpCode.length === 6 && (
                                            <span className="badge bg-success">
                                                <i className="isax isax-tick-circle5 me-1"></i>{' '}
                                                {t('otp.inputComplete')}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <div className="alert alert-info mb-3">
                                        <i className="isax isax-info-circle5 me-2"></i>
                                        <small>
                                            {t('otp.sendTo')}{' '}
                                            <strong className="text-primary">
                                                {contractInfo?.representativeEmail}
                                            </strong>
                                        </small>
                                    </div>
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={handleSendOtp}
                                        disabled={isSendingOtp || !hasSignature}
                                    >
                                        {isSendingOtp ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2"></span>{' '}
                                                {t('otp.sending')}
                                            </>
                                        ) : (
                                            <>
                                                <i className="isax isax-sms5 me-2"></i>{' '}
                                                {t('otp.sendButton')}
                                            </>
                                        )}
                                    </button>
                                    {!hasSignature && (
                                        <div className="alert alert-warning mt-3 mb-0">
                                            <i className="isax isax-warning-25 me-2"></i>
                                            <small>{t('otp.completeStep1')}</small>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="card">
                        <div className="card-body text-center py-4">
                            <h6 className="mb-3">
                                <span className="badge bg-primary me-2">3</span> {t('submit.title')}
                            </h6>
                            <button
                                type="button"
                                className="btn btn-success btn-lg px-4"
                                onClick={handleSignContract}
                                disabled={
                                    !hasSignature || !otpSent || otpCode.length !== 6 || isSigning
                                }
                            >
                                {isSigning ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2"></span>{' '}
                                        {t('submit.processing')}
                                    </>
                                ) : (
                                    <>
                                        <i className="isax isax-tick-circle5 me-2"></i>{' '}
                                        {t('submit.button')}
                                    </>
                                )}
                            </button>
                            <div className="alert alert-light border mt-3 mb-0">
                                <i className="isax isax-shield-tick5 me-2 text-success"></i>
                                <small className="text-muted">{t('submit.disclaimer')}</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContractSigningPage;
