import { useState, useMemo, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import ReCAPTCHA from 'react-google-recaptcha';
import AuthLayout from '@/layouts/AuthLayout';
import { Phone, ArrowLeft } from 'lucide-react';
import clsx from 'clsx';
import { PATHS } from '@/routes/paths';
import Button from '@/components/Button';
import { forgotPasswordAsync, clearError } from '@/store/slices/authSlice';
import { RootState, AppDispatch } from '@/store';
import { ForgotPasswordRequest, ResetTokenRequest } from '@/types/auth.types';
import { VerifyOtpRequest } from '@/types/otp.types';
import { AuthService } from '@/services/auth.service';
import { OtpService } from '@/services/otp.service';
import { usePhoneInput } from '@/hooks/usePhoneInput';
import { useOtpInput } from '@/hooks/useOtpInput';
import { toast } from 'react-toastify';
import { ContactMethodInput } from '@/components/Auth/ContactMethodInput';
import { CaptchaSection } from '@/components/Auth/CaptchaSection';

interface ForgotPasswordProps {
    onSubmit?: (email: string, phone: string) => void;
}

const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
const deviceId = import.meta.env.VITE_DEVICE_ID || 'booking-care-web-client';

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onSubmit }) => {
    const { t } = useTranslation('auth');
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
    const { otp, otpValue, otpRefs, canVerifyOtp, handleOtpChange, handleOtpKeyDown, resetOtp } =
        useOtpInput({ length: 6 });
    const [isVerifying, setIsVerifying] = useState(false);
    const [countdown, setCountdown] = useState(60);

    // Create stable IDs for OTP inputs to avoid using array index as key
    const otpInputIds = useMemo(
        () => new Array(6).fill(0).map((_, i) => `otp-input-${i}-${Date.now()}`),
        []
    );
    const recaptchaRef = useRef<ReCAPTCHA | null>(null);

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

    const handleEmailFlow = async () => {
        // Email flow: reset captcha and show success toast
        setIsHuman(false); // Reset human verification

        // Reset ReCAPTCHA if it exists
        if (recaptchaRef.current) {
            recaptchaRef.current.reset();
        }

        // Also keep captcha visible for user to verify again
        setShowCaptcha(true);

        toast.success(t('forgotPassword.successEmail'));
    };

    const handlePhoneFlow = async () => {
        // Phone flow: move to OTP step
        setStep('otp');
        setCountdown(60);
        toast.success(t('forgotPassword.successPhone'));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSend) return;

        const forgotPasswordData: ForgotPasswordRequest = {
            ...(method === 'email' ? { email } : { phoneNumber: phone, deviceId }),
        };

        try {
            await dispatch(forgotPasswordAsync(forgotPasswordData)).unwrap();

            if (method === 'email') {
                await handleEmailFlow();
            } else {
                await handlePhoneFlow();
            }
        } catch (error) {
            console.error('Forgot password error:', error);
            toast.error(t('forgotPassword.error'));
        }

        // Also call the optional onSubmit prop for backward compatibility
        onSubmit?.(email, phone);
    };

    const processOtpVerification = async () => {
        const verifyOtpData: VerifyOtpRequest = {
            phone: phone,
            otp: otpValue,
            purpose: 'FORGOT_PASSWORD',
        };
        return await OtpService.verifyOtp(verifyOtpData);
    };

    const processResetToken = async (verifyResponse: any) => {
        const resetTokenData: ResetTokenRequest = {
            phoneNumber: phone,
            purpose: 'FORGOT_PASSWORD',
            proof: verifyResponse.data.proof,
            issuedAt: verifyResponse.data.issuedAt,
        };
        return await AuthService.resetToken(resetTokenData);
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!canVerifyOtp) return;

        setIsVerifying(true);

        try {
            const verifyResponse = await processOtpVerification();
            const resetTokenResponse = await processResetToken(verifyResponse);

            toast.success(t('forgotPassword.successPhone'));
            globalThis.location.href = resetTokenResponse.data.resetUrl;
        } catch (error: any) {
            console.error('OTP verification error:', error);
            toast.error(t('forgotPassword.error'));
        } finally {
            setIsVerifying(false);
        }
    };

    const handleResendOtp = async () => {
        if (countdown > 0) return;

        try {
            await dispatch(forgotPasswordAsync({ phoneNumber: phone, deviceId })).unwrap();
            setCountdown(60);
            resetOtp();
            toast.success(t('forgotPassword.successPhone'));
        } catch (error) {
            console.error('Resend OTP error:', error);
            toast.error(t('forgotPassword.error'));
        }
    };

    const handleBackToInput = () => {
        setStep('input');
        resetOtp();
        setCountdown(60);
    };

    const getTitle = () => {
        if (step === 'otp') return t('forgotPassword.otpTitle');
        return t('forgotPassword.title');
    };

    const getSubtitle = () => {
        if (step === 'otp') return t('forgotPassword.otpSubtitle');
        return t('forgotPassword.subtitle');
    };

    const maskPhoneNumber = (phoneNumber: string) => {
        if (!phoneNumber || phoneNumber.length < 3) return phoneNumber;
        const lastThreeDigits = phoneNumber.slice(-3);
        const maskedPart = '*'.repeat(phoneNumber.length - 3);
        return maskedPart + lastThreeDigits;
    };

    const renderMethodToggle = () => (
        <div className="d-flex justify-content-center mb-3">
            <div className="method-toggle">
                <button
                    type="button"
                    className={clsx('toggle-btn', method === 'phone' && 'toggle-btn-active')}
                    onClick={() => setMethod('phone')}
                >
                    <i className="feather-phone me-1"></i>
                    {t('forgotPassword.phone')}
                </button>
                <button
                    type="button"
                    className={clsx('toggle-btn', method === 'email' && 'toggle-btn-active')}
                    onClick={() => setMethod('email')}
                >
                    <i className="feather-mail me-1"></i>
                    {t('forgotPassword.email')}
                </button>
            </div>
        </div>
    );

    const renderInputStep = () => (
        <form onSubmit={handleSubmit}>
            {renderMethodToggle()}
            <div className="mb-3">
                <ContactMethodInput
                    method={method}
                    phoneInput={{
                        label: t('forgotPassword.phone'),
                        placeholder: t('forgotPassword.phonePlaceholder'),
                        value: phone,
                        onChange: handlePhoneChange,
                        onKeyDown: handlePhoneKeyDown,
                        onPaste: handlePhonePaste,
                    }}
                    emailInput={{
                        label: t('forgotPassword.email'),
                        placeholder: t('forgotPassword.emailPlaceholder'),
                        value: email,
                        onChange: (event) => setEmail(event.target.value),
                    }}
                    onFocus={() => setShowCaptcha(true)}
                />
            </div>
            {/* Error message */}
            {error && (
                <div className="alert alert-danger text-center mb-3" role="alert">
                    {error}
                </div>
            )}
            {/* Captcha */}
            <CaptchaSection
                isVisible={showCaptcha}
                siteKey={siteKey ?? undefined}
                onVerify={(value) => setIsHuman(Boolean(value))}
                onExpired={() => setIsHuman(false)}
                checkboxId="forgot-captcha"
                checkboxChecked={isHuman}
                onCheckboxChange={setIsHuman}
                label={t('common.notRobot', 'Tôi không phải là robot')}
                recaptchaRef={recaptchaRef}
            />

            <div className="mb-3 mt-3">
                <Button
                    text={isLoading ? t('forgotPassword.submitting') : t('forgotPassword.submit')}
                    type="submit"
                    isDisabled={!canSend || isLoading}
                    className="w-100 fw-bold"
                />
            </div>
            <div className="account-signup">
                <p>
                    {t('forgotPassword.backToLogin')}{' '}
                    <Link to={PATHS.LOGIN}>{t('register.login')}</Link>
                </p>
            </div>
        </form>
    );

    const renderOtpStep = () => (
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
                    {t('forgotPassword.otpSentTo')}{' '}
                    <span className="fw-medium text-dark">{maskPhoneNumber(phone)}</span>
                </p>
            </div>

            <form onSubmit={handleVerifyOtp}>
                {/* OTP Input */}
                <div className="d-flex justify-content-center gap-2 mb-4">
                    {otp.map((digit, idx) => (
                        <input
                            key={otpInputIds[idx]}
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
                    text={
                        isVerifying ? t('forgotPassword.verifying') : t('forgotPassword.verifyOtp')
                    }
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
                        {t('forgotPassword.backToLogin')}
                    </button>

                    <div className="text-muted">
                        {countdown > 0 ? (
                            <span>
                                {t('forgotPassword.resendIn')} {countdown}s
                            </span>
                        ) : (
                            <button
                                type="button"
                                onClick={handleResendOtp}
                                className="btn btn-link p-0 text-primary"
                            >
                                {t('forgotPassword.resendOtp')}
                            </button>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );

    return (
        <AuthLayout title={getTitle()} subtitle={getSubtitle()}>
            {step === 'input' ? renderInputStep() : renderOtpStep()}
        </AuthLayout>
    );
};

export default ForgotPassword;
