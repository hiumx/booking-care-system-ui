import { useState, useMemo, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ReCAPTCHA from 'react-google-recaptcha';
import AuthLayout from '@/layouts/AuthLayout';
import { Mail, Phone, ArrowLeft } from 'lucide-react';
import clsx from 'clsx';
import { PATHS } from '@/routes/paths';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { forgotPasswordAsync, clearError } from '@/store/slices/authSlice';
import { RootState, AppDispatch } from '@/store';
import { ForgotPasswordRequest, ResetTokenRequest } from '@/types/auth.types';
import { VerifyOtpRequest } from '@/types/otp.types';
import { AuthService } from '@/services/auth.service';
import { OtpService } from '@/services/otp.service';
import { usePhoneInput } from '@/hooks/usePhoneInput';
import { toast } from 'react-toastify';
import { OTP_REGEX } from '@/constants';

interface ForgotPasswordProps {
    onSubmit?: (email: string, phone: string) => void;
}

const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
const deviceId = import.meta.env.VITE_DEVICE_ID || 'booking-care-web-client';

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onSubmit }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { isLoading, error } = useSelector((state: RootState) => state.auth);

    const [email, setEmail] = useState('');
    const [step, setStep] = useState<'input' | 'otp'>('input');

    // Use phone input hook
    const { phone, handlePhoneChange, handlePhonePaste, handlePhoneKeyDown, isPhoneValid } =
        usePhoneInput();
    const [method, setMethod] = useState<'email' | 'phone'>('phone');
    const [isHuman, setIsHuman] = useState(false);

    const [showCaptcha, setShowCaptcha] = useState(false);

    // OTP states
    const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
    const [isVerifying, setIsVerifying] = useState(false);
    const [countdown, setCountdown] = useState(60);
    const otpRefs = useRef<Array<HTMLInputElement | null>>([]);
    const recaptchaRef = useRef<ReCAPTCHA>(null);

    const canSend = useMemo(() => {
        // Use AuthService for consistent email validation
        const validEmail = email.trim() && AuthService.validateEmail(email);

        // Use phone validation from hook (must be exactly 10 digits starting with 0)
        const validPhone = isPhoneValid();

        // Check if the selected method has valid input
        const validIdentifier = method === 'phone' ? validPhone : validEmail;

        return validIdentifier && isHuman;
    }, [method, email, phone, isPhoneValid, isHuman]);

    // Clear error when component mounts or method changes
    useEffect(() => {
        dispatch(clearError());
    }, [dispatch, method]);

    // Countdown timer for OTP resend
    useEffect(() => {
        if (step !== 'otp' || countdown <= 0) return;
        const timer = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [step, countdown]);

    // OTP validation
    const otpValue = useMemo(() => otp.join(''), [otp]);
    const canVerifyOtp = otpValue.length === 6 && OTP_REGEX.SIX_DIGITS.test(otpValue);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSend) return;

        const forgotPasswordData: ForgotPasswordRequest = {
            ...(method === 'email' ? { email } : { phoneNumber: phone, deviceId }),
        };

        try {
            await dispatch(forgotPasswordAsync(forgotPasswordData)).unwrap();

            if (method === 'email') {
                // Email flow: reset captcha and show success toast
                setIsHuman(false); // Reset human verification

                // Reset ReCAPTCHA if it exists
                if (recaptchaRef.current) {
                    recaptchaRef.current.reset();
                }

                // Also keep captcha visible for user to verify again
                setShowCaptcha(true);

                toast.success(
                    'Nếu email tồn tại trong hệ thống, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu.'
                );
            } else {
                // Phone flow: move to OTP step
                setStep('otp');
                setCountdown(60);
                toast.success('Mã OTP đã được gửi đến số điện thoại của bạn.');
            }
        } catch (error) {
            console.error('Forgot password error:', error);
            toast.error('Gửi yêu cầu thất bại. Vui lòng thử lại.');
        }

        // Also call the optional onSubmit prop for backward compatibility
        onSubmit?.(email, phone);
    };

    // OTP handlers
    const handleOtpChange = (index: number, value: string) => {
        if (!OTP_REGEX.SINGLE_DIGIT.test(value)) return;

        setOtp((prev) => {
            const next = [...prev];
            next[index] = value;
            return next;
        });

        // Auto focus next input
        if (value && index < 5) {
            otpRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!canVerifyOtp) return;

        setIsVerifying(true);

        try {
            // Step 1: Verify OTP
            const verifyOtpData: VerifyOtpRequest = {
                phone: phone,
                otp: otpValue,
                purpose: 'FORGOT_PASSWORD',
            };
            const verifyResponse = await OtpService.verifyOtp(verifyOtpData);

            // Step 2: Get reset token
            const resetTokenData: ResetTokenRequest = {
                phoneNumber: phone,
                purpose: 'FORGOT_PASSWORD',
                proof: verifyResponse.data.proof,
                issuedAt: verifyResponse.data.issuedAt,
            };
            const resetTokenResponse = await AuthService.resetToken(resetTokenData);

            toast.success('Xác thực thành công! Đang chuyển hướng...');
            // Navigate to reset password page
            window.location.href = resetTokenResponse.data.resetUrl;
        } catch (error: any) {
            console.error('OTP verification error:', error);
            toast.error('Xác thực OTP thất bại. Vui lòng thử lại.');
        } finally {
            setIsVerifying(false);
        }
    };

    const handleResendOtp = async () => {
        if (countdown > 0) return;

        try {
            await dispatch(forgotPasswordAsync({ phoneNumber: phone, deviceId })).unwrap();
            setCountdown(60);
            setOtp(Array(6).fill(''));
            toast.success('Mã OTP mới đã được gửi.');
        } catch (error) {
            console.error('Resend OTP error:', error);
            toast.error('Gửi lại mã OTP thất bại. Vui lòng thử lại.');
        }
    };

    const handleBackToInput = () => {
        setStep('input');
        setOtp(Array(6).fill(''));
        setCountdown(60);
    };

    const getTitle = () => {
        if (step === 'otp') return 'Xác thực OTP';
        return 'Quên mật khẩu';
    };

    const getSubtitle = () => {
        if (step === 'otp') return `Nhập mã OTP từ tin nhắn đã gửi đến số điện thoại`;
        return 'Nhập email hoặc số điện thoại để khôi phục quyền truy cập vào tài khoản';
    };

    const maskPhoneNumber = (phoneNumber: string) => {
        if (!phoneNumber || phoneNumber.length < 3) return phoneNumber;
        const lastThreeDigits = phoneNumber.slice(-3);
        const maskedPart = '*'.repeat(phoneNumber.length - 3);
        return maskedPart + lastThreeDigits;
    };

    return (
        <AuthLayout title={getTitle()} subtitle={getSubtitle()}>
            {step === 'input' ? (
                <form onSubmit={handleSubmit}>
                    <div className="d-flex justify-content-center mb-3">
                        <div className="method-toggle">
                            <button
                                type="button"
                                className={clsx(
                                    'toggle-btn',
                                    method === 'phone' && 'toggle-btn-active'
                                )}
                                onClick={() => setMethod('phone')}
                            >
                                <i className="feather-phone me-1"></i>
                                Số điện thoại
                            </button>
                            <button
                                type="button"
                                className={clsx(
                                    'toggle-btn',
                                    method === 'email' && 'toggle-btn-active'
                                )}
                                onClick={() => setMethod('email')}
                            >
                                <i className="feather-mail me-1"></i>
                                Email
                            </button>
                        </div>
                    </div>
                    <div className="mb-3">
                        {method === 'phone' ? (
                            <Input
                                label="Số điện thoại"
                                type="tel"
                                inputMode="numeric"
                                placeholder="Nhập số điện thoại"
                                leftContent={
                                    <>
                                        <img
                                            src="https://flagcdn.com/w20/vn.png"
                                            alt="VN"
                                            width={20}
                                            height={15}
                                        />
                                        <span className="text-muted" style={{ fontSize: 14 }}>
                                            +84
                                        </span>
                                    </>
                                }
                                wrapVariant="phone"
                                value={phone}
                                onChange={handlePhoneChange}
                                onKeyDown={handlePhoneKeyDown}
                                onPaste={handlePhonePaste}
                                onFocus={() => setShowCaptcha(true)}
                            />
                        ) : (
                            <Input
                                label="Địa chỉ email"
                                type="email"
                                placeholder="Nhập địa chỉ email"
                                leftIcon={<Mail size={18} className="text-muted" />}
                                wrapVariant="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onFocus={() => setShowCaptcha(true)}
                            />
                        )}
                    </div>
                    {/* Error message */}
                    {error && (
                        <div className="alert alert-danger text-center mb-3" role="alert">
                            {error}
                        </div>
                    )}
                    {/* Captcha */}
                    {showCaptcha && (
                        <div>
                            {siteKey ? (
                                <ReCAPTCHA
                                    ref={recaptchaRef}
                                    sitekey={siteKey}
                                    onChange={(value) => setIsHuman(!!value)}
                                    onExpired={() => setIsHuman(false)}
                                />
                            ) : (
                                <div className="d-flex align-items-center p-3 bg-light rounded-3 border">
                                    <input
                                        type="checkbox"
                                        id="captcha"
                                        className="me-2"
                                        checked={isHuman}
                                        onChange={(e) => setIsHuman(e.target.checked)}
                                    />
                                    <label htmlFor="captcha" className="text-muted">
                                        Tôi không phải là robot
                                    </label>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="mb-3 mt-3">
                        <Button
                            text={isLoading ? 'Đang gửi...' : 'Đặt lại mật khẩu'}
                            type="submit"
                            isDisabled={!canSend || isLoading}
                            className="w-100 fw-bold"
                        />
                    </div>
                    <div className="account-signup">
                        <p>
                            Đã nhớ mật khẩu? <Link to={PATHS.LOGIN}>Đăng nhập ngay</Link>
                        </p>
                    </div>
                </form>
            ) : (
                /* OTP Verification Step */
                <div style={{ maxWidth: 480, margin: '0 auto' }}>
                    <div className="text-center mb-4">
                        <div
                            className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                            style={{
                                width: 64,
                                height: 64,
                                background: '#dbeafe',
                            }}
                        >
                            <Phone size={24} className="text-primary" />
                        </div>
                        <p className="text-muted">
                            Mã OTP đã được gửi đến số điện thoại{' '}
                            <span className="fw-medium text-dark">{maskPhoneNumber(phone)}</span>
                        </p>
                    </div>

                    <form onSubmit={handleVerifyOtp}>
                        {/* OTP Input */}
                        <div className="d-flex justify-content-center gap-2 mb-4">
                            {otp.map((digit, idx) => (
                                <input
                                    key={idx}
                                    ref={(el) => {
                                        otpRefs.current[idx] = el;
                                    }}
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                                    className={clsx(
                                        'text-center fw-bold border rounded',
                                        digit ? 'border-primary' : 'border-secondary',
                                        'focus:border-primary focus:ring-1 focus:ring-primary'
                                    )}
                                    style={{
                                        width: 48,
                                        height: 56,
                                        fontSize: 20,
                                        outline: 'none',
                                        transition: 'border-color 0.15s ease-in-out',
                                    }}
                                />
                            ))}
                        </div>

                        {/* Error message */}
                        {error && (
                            <div className="alert alert-danger mb-3 text-center" role="alert">
                                {error}
                            </div>
                        )}

                        {/* Verify Button */}
                        <Button
                            text={isVerifying ? 'Đang xác thực...' : 'Xác thực OTP'}
                            type="submit"
                            isDisabled={!canVerifyOtp || isVerifying}
                            className={clsx(
                                'w-100 fw-medium mb-3',
                                canVerifyOtp && !isVerifying ? 'btn-primary' : 'btn-secondary'
                            )}
                        />

                        {/* Resend & Back buttons */}
                        <div className="d-flex justify-content-between align-items-center">
                            <button
                                type="button"
                                onClick={handleBackToInput}
                                className="btn btn-link p-0 d-flex align-items-center text-muted"
                            >
                                <ArrowLeft size={16} className="me-1" />
                                Quay lại
                            </button>

                            <div className="text-muted">
                                {countdown > 0 ? (
                                    <span>Gửi lại sau {countdown}s</span>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleResendOtp}
                                        className="btn btn-link p-0 text-primary"
                                    >
                                        Gửi lại mã OTP
                                    </button>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
            )}
        </AuthLayout>
    );
};

export default ForgotPassword;
