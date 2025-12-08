import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SignatureCanvas from 'react-signature-canvas';
import { toast } from 'react-toastify';
import { validateToken, sendSigningOtp, signContract } from '@/services/contract-signing.service';
import type { ContractSigningInfo } from '@/types/contract-signing.types';
import { PATHS } from '@/routes/paths';
import StepWizard from '@/components/StepWizard/StepWizard';
import Spinner from '@/components/Spinner';

const ContractSigningPage: React.FC = () => {
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();
    const signatureRef = useRef<SignatureCanvas>(null);

    // State
    const [isLoading, setIsLoading] = useState(true);
    const [isValidToken, setIsValidToken] = useState(false);
    const [contractInfo, setContractInfo] = useState<ContractSigningInfo | null>(null);
    const [errorMessage, setErrorMessage] = useState('');

    // Signature state
    const [hasSignature, setHasSignature] = useState(false);

    // OTP state
    const [otpSent, setOtpSent] = useState(false);
    const [otpCode, setOtpCode] = useState('');
    const [isSendingOtp, setIsSendingOtp] = useState(false);
    const [countdown, setCountdown] = useState(0);

    // Signing state
    const [isSigning, setIsSigning] = useState(false);

    // Validate token on mount
    useEffect(() => {
        if (token) {
            validateContractToken();
        }
    }, [token]);

    // Countdown timer for OTP resend
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
                    setErrorMessage(tokenData.errorMessage || 'Token không hợp lệ hoặc đã hết hạn');
                }
            } else {
                setIsValidToken(false);
                setErrorMessage('Token không hợp lệ hoặc đã hết hạn');
            }
        } catch (error: any) {
            setIsValidToken(false);
            setErrorMessage(error.message || 'Không thể xác thực token. Vui lòng thử lại sau.');
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
                toast.success(response.message || 'Mã OTP đã được gửi đến email của bạn');
            } else {
                toast.error(response.message || 'Không thể gửi OTP');
            }
        } catch (error: any) {
            toast.error(error.message || 'Có lỗi xảy ra khi gửi OTP');
        } finally {
            setIsSendingOtp(false);
        }
    };

    const handleSignContract = async () => {
        if (!token || !signatureRef.current || !otpCode) {
            toast.error('Vui lòng hoàn thành tất cả các bước');
            return;
        }

        if (signatureRef.current.isEmpty()) {
            toast.error('Vui lòng vẽ chữ ký của bạn');
            return;
        }

        if (otpCode.length !== 6) {
            toast.error('Mã OTP phải có 6 chữ số');
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
                toast.success(response.message || 'Ký hợp đồng thành công!');
                setTimeout(() => {
                    navigate(PATHS.CONTRACT_SIGNING.SUCCESS);
                }, 2000);
            } else {
                toast.error(response.message || 'Ký hợp đồng thất bại');
            }
        } catch (error: any) {
            toast.error(error.message || 'Có lỗi xảy ra khi ký hợp đồng');
        } finally {
            setIsSigning(false);
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <div
                className="d-flex justify-content-center align-items-center"
                style={{ minHeight: 'calc(100vh - 300px)', width: '100%' }}
            >
                <div className="text-center">
                    <Spinner size="large" variant="primary" />
                    <p className="mt-3 text-muted">Đang xác thực...</p>
                </div>
            </div>
        );
    }

    // Invalid token
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
                                <h4 className="text-danger mb-3">Token không hợp lệ</h4>
                                <p className="text-muted mb-0">{errorMessage}</p>
                                <p className="text-muted">
                                    Vui lòng liên hệ admin để nhận link ký hợp đồng mới.
                                </p>
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
                        <h3 className="mb-2">Ký hợp đồng điện tử</h3>
                        <p className="text-muted">
                            Vui lòng đọc kỹ hợp đồng và hoàn thành các bước ký bên dưới
                        </p>
                        <div className="mt-3">
                            <StepWizard
                                steps={[
                                    { id: 1, title: 'Chữ ký' },
                                    { id: 2, title: 'Xác thực OTP' },
                                    { id: 3, title: 'Xác nhận' },
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
                                <i className="isax isax-document-text5 me-2 text-primary"></i> Thông
                                tin hợp đồng
                            </h6>
                        </div>
                        <div className="card-body">
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <div className="d-flex align-items-center">
                                        <i className="isax isax-receipt-15 text-primary me-2"></i>
                                        <div>
                                            <small className="text-muted d-block">
                                                Số hợp đồng
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
                                            <small className="text-muted d-block">Bệnh viện</small>
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
                                                Người đại diện
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
                                            <small className="text-muted d-block">Email</small>
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
                                <i className="isax isax-eye5 me-2 text-primary"></i> Xem hợp đồng
                            </h6>
                            <span className="badge bg-info">Bản nháp</span>
                        </div>
                        <div className="card-body">
                            <div className="alert alert-warning mb-3">
                                <i className="isax isax-warning-25 me-2"></i>
                                <small>
                                    Vui lòng đọc kỹ toàn bộ nội dung hợp đồng trước khi ký
                                </small>
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
                                <i className="isax isax-export-35 me-1"></i> Mở trong tab mới
                            </a>
                        </div>
                    </div>

                    {/* Signature Section */}
                    <div className="card mb-4">
                        <div className="card-header">
                            <h6 className="mb-0">
                                <span className="badge bg-primary me-2">1</span>{' '}
                                <i className="isax isax-edit-25 me-2"></i> Vẽ chữ ký của bạn
                            </h6>
                        </div>
                        <div className="card-body">
                            <p className="text-muted small mb-3">
                                <i className="isax isax-info-circle5 me-1"></i> Vẽ chữ ký của bạn
                                trong khung bên dưới. Chữ ký này sẽ được sử dụng để xác thực hợp
                                đồng.
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
                                        <span>Vẽ chữ ký tại đây</span>
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
                                    <i className="isax isax-trash5 me-1"></i> Xóa và vẽ lại
                                </button>
                                {hasSignature && (
                                    <span className="badge bg-success">
                                        <i className="isax isax-tick-circle5 me-1"></i> Đã có chữ ký
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
                                <i className="isax isax-shield-tick5 me-2"></i> Xác thực OTP
                            </h6>
                        </div>
                        <div className="card-body">
                            {otpSent ? (
                                <div>
                                    <div className="alert alert-success mb-3">
                                        <i className="isax isax-tick-circle5 me-2"></i>
                                        <strong>Mã OTP đã được gửi!</strong>
                                        <span className="ms-1">
                                            Vui lòng kiểm tra email của bạn
                                        </span>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="otp-input" className="form-label fw-medium">
                                            Nhập mã OTP (6 chữ số)
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
                                                <i className="isax isax-clock5 me-1"></i> Gửi lại mã
                                                sau <strong>{countdown}</strong> giây
                                            </p>
                                        ) : (
                                            <button
                                                type="button"
                                                className="btn btn-link p-0 text-decoration-none"
                                                onClick={handleSendOtp}
                                            >
                                                <i className="isax isax-refresh5 me-1"></i> Gửi lại
                                                mã OTP
                                            </button>
                                        )}
                                        {otpCode.length === 6 && (
                                            <span className="badge bg-success">
                                                <i className="isax isax-tick-circle5 me-1"></i> Đã
                                                nhập đủ
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <div className="alert alert-info mb-3">
                                        <i className="isax isax-info-circle5 me-2"></i>
                                        <small>
                                            Mã OTP sẽ được gửi đến email{' '}
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
                                                Đang gửi...
                                            </>
                                        ) : (
                                            <>
                                                <i className="isax isax-sms5 me-2"></i> Gửi mã OTP
                                            </>
                                        )}
                                    </button>
                                    {!hasSignature && (
                                        <div className="alert alert-warning mt-3 mb-0">
                                            <i className="isax isax-warning-25 me-2"></i>
                                            <small>
                                                Vui lòng hoàn thành bước 1 (vẽ chữ ký) trước khi gửi
                                                OTP
                                            </small>
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
                                <span className="badge bg-primary me-2">3</span> Xác nhận ký hợp
                                đồng
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
                                        Đang xử lý...
                                    </>
                                ) : (
                                    <>
                                        <i className="isax isax-tick-circle5 me-2"></i> Xác nhận ký
                                        hợp đồng
                                    </>
                                )}
                            </button>
                            <div className="alert alert-light border mt-3 mb-0">
                                <i className="isax isax-shield-tick5 me-2 text-success"></i>
                                <small className="text-muted">
                                    Bằng việc ký hợp đồng, bạn xác nhận đã đọc và đồng ý với tất cả
                                    các điều khoản trong hợp đồng. Chữ ký điện tử của bạn có giá trị
                                    pháp lý.
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContractSigningPage;
