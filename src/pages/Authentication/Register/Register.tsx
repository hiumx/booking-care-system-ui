import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import { Check, Lock, User, Phone, Mail, CheckCircle } from 'lucide-react';
import Select from 'react-select';
import GoogleIcon from '@/assets/img/icons/google-icon.svg';
import FacebookIcon from '@/assets/img/icons/facebook-icon.svg';
import AuthLayout from '@/layouts/AuthLayout';
import clsx from 'clsx';
import styles from './Register.module.scss';
import authStyles from '@/layouts/AuthLayout/AuthLayout.module.scss';
import { PATHS } from '~/routes/paths';

type Step = 0 | 1 | 2 | 3;

const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
const OTP_LENGTH = 6;

const Register: React.FC = () => {
    const [step, setStep] = useState<Step>(0);
    const [method, setMethod] = useState<'email' | 'phone'>('phone');
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Step 0: phone/email
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [isHuman, setIsHuman] = useState(false);
    const [showCaptcha, setShowCaptcha] = useState(false);
    const [agree, setAgree] = useState(true);

    // Step 1: OTP
    const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
    const otpRefs = useRef<Array<HTMLInputElement | null>>([]);
    const [countdown, setCountdown] = useState<number>(60);
    const [isVerifying, setIsVerifying] = useState(false);

    // Step 2: password
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    // Password requirements validation
    const passwordRequirements = useMemo(() => {
        const hasMinLength = password.length >= 8;
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        return {
            hasMinLength,
            hasUppercase,
            hasLowercase,
            hasNumber,
            hasSpecialChar,
            allMet: hasMinLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar,
        };
    }, [password]);

    // Password strength calculation
    const passwordStrength = useMemo(() => {
        if (!password) return { score: 0, label: '', color: '', width: 0 };

        let score = 0;
        if (passwordRequirements.hasMinLength) score += 20;
        if (passwordRequirements.hasUppercase) score += 20;
        if (passwordRequirements.hasLowercase) score += 20;
        if (passwordRequirements.hasNumber) score += 20;
        if (passwordRequirements.hasSpecialChar) score += 20;

        if (score <= 20) return { score, label: 'Yếu', color: '#ef4444', width: 20 };
        if (score <= 40) return { score, label: 'Trung bình', color: '#f59e0b', width: 40 };
        if (score <= 60) return { score, label: 'Tốt', color: '#3b82f6', width: 60 };
        if (score <= 80) return { score, label: 'Mạnh', color: '#10b981', width: 80 };
        return { score, label: 'Rất mạnh', color: '#059669', width: 100 };
    }, [password, passwordRequirements]);

    const canCreatePassword = useMemo(() => {
        const hasPassword = password.trim() !== '';
        const hasConfirmPassword = confirmPassword.trim() !== '';
        const passwordsMatch = password === confirmPassword;
        const newPasswordValid = passwordRequirements.allMet;

        return hasPassword && hasConfirmPassword && passwordsMatch && newPasswordValid;
    }, [password, confirmPassword, passwordRequirements.allMet]);

    const togglePasswordVisibility = (field: 'password' | 'confirm') => {
        switch (field) {
            case 'password':
                setShowPassword(!showPassword);
                break;

            case 'confirm':
                setShowConfirmPassword(!showConfirmPassword);
                break;
        }
    };

    // Step 3: profile
    const [fullName, setFullName] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [gender, setGender] = useState<'male' | 'female' | 'other' | ''>('');
    const [address, setAddress] = useState('');
    const [profileEmail, setProfileEmail] = useState('');
    const [profilePhone, setProfilePhone] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const canSendOtp = useMemo(() => {
        const numericPhone = phone.replace(/\D/g, '');
        const validEmail = /.+@.+\..+/.test(email);
        const validIdentifier = method === 'phone' ? numericPhone.length >= 9 : validEmail;
        return validIdentifier && isHuman && agree;
    }, [method, phone, email, isHuman, agree]);

    const otpValue = useMemo(() => otp.join(''), [otp]);
    const canVerifyOtp = otpValue.length === OTP_LENGTH && /^\d{6}$/.test(otpValue);

    const canCompleteRegistration = useMemo(() => {
        return (
            fullName.trim().length >= 2 &&
            birthDate &&
            gender !== '' &&
            address.trim().length >= 5 &&
            profileEmail &&
            profilePhone
        );
    }, [fullName, birthDate, gender, address, profileEmail, profilePhone]);

    // Auto-fill email/phone based on registration method
    useEffect(() => {
        if (method === 'email') {
            setProfileEmail(email);
        } else {
            setProfilePhone(phone);
        }
    }, [method, email, phone]);

    // Countdown timer
    useEffect(() => {
        if (step !== 1) return;
        setCountdown(60);
        const interval = setInterval(() => {
            setCountdown((s) => (s > 0 ? s - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, [step]);

    const transitionToStep = (newStep: Step) => {
        setIsTransitioning(true);
        setTimeout(() => {
            setStep(newStep);
            setIsTransitioning(false);
        }, 300);
    };

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSendOtp) return;
        transitionToStep(1);
    };

    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d?$/.test(value)) return;
        setOtp((prev) => {
            const next = [...prev];
            next[index] = value;
            return next;
        });
        if (value && index < OTP_LENGTH - 1) {
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
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setIsVerifying(false);
        transitionToStep(2);
    };

    const handleCreatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!canCreatePassword) return;
        transitionToStep(3);
    };

    const handleCompleteRegistration = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!canCompleteRegistration) return;
        setIsSubmitting(true);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setIsSubmitting(false);
        alert('Registration completed successfully!');
    };

    const getStepTitle = () => {
        switch (step) {
            case 0:
                return 'Đăng ký tài khoản';
            case 1:
                return 'Xác thực OTP';
            case 2:
                return 'Tạo mật khẩu';
            case 3:
                return 'Thông tin cá nhân';
            default:
                return 'Đăng ký tài khoản';
        }
    };

    const getStepSubtitle = () => {
        switch (step) {
            case 0:
                return 'Bắt đầu hành trình chăm sóc sức khỏe của bạn';
            case 1:
                return 'Nhập mã xác thực để tiếp tục';
            case 2:
                return 'Tạo mật khẩu bảo mật cho tài khoản';
            case 3:
                return 'Hoàn thiện hồ sơ của bạn';
            default:
                return 'Bắt đầu hành trình chăm sóc sức khỏe của bạn';
        }
    };

    return (
        <AuthLayout
            title={getStepTitle()}
            subtitle={getStepSubtitle()}
            showBanner={step === 0}
            maxWidth={step === 0 ? undefined : 672}
            centerContent={step > 0}
            isTransitioning={isTransitioning}
        >
            {/* Progress indicator */}
            {step > 0 && (
                <div className="mb-4">
                    <div className="d-flex align-items-center justify-content-between mb-2">
                        <span className="text-muted" style={{ fontSize: 14 }}>
                            Bước {step} / 3
                        </span>
                        <span className="text-muted" style={{ fontSize: 14 }}>
                            {Math.round((step / 3) * 100)}%
                        </span>
                    </div>
                    <div
                        className="rounded-pill overflow-hidden"
                        style={{ height: 8, background: '#e5e7eb' }}
                    >
                        <div
                            className="h-100 rounded-pill"
                            style={{
                                width: `${(step / 3) * 100}%`,
                                background: 'linear-gradient(90deg,#0e82fd,#06aed4)',
                                transition: 'width .5s ease',
                            }}
                        />
                    </div>
                    <div className="d-flex justify-content-between mt-3">
                        {[1, 2, 3].map((stepNum) => (
                            <div key={stepNum} className="d-flex align-items-center">
                                <div
                                    className={clsx(
                                        'rounded-circle d-flex align-items-center justify-content-center',
                                        step >= stepNum
                                            ? 'bg-primary text-white border-0'
                                            : 'text-muted'
                                    )}
                                    style={{
                                        width: 30,
                                        height: 30,
                                        border: '2px solid',
                                        borderColor: step >= stepNum ? 'transparent' : '#d1d5db',
                                    }}
                                >
                                    {step > stepNum ? (
                                        <Check size={16} />
                                    ) : (
                                        <span className="fw-medium" style={{ fontSize: 14 }}>
                                            {stepNum}
                                        </span>
                                    )}
                                </div>
                                <span
                                    className={clsx(
                                        'ms-2 fw-medium',
                                        step >= stepNum ? 'text-primary' : 'text-muted'
                                    )}
                                    style={{ fontSize: 14 }}
                                >
                                    {stepNum === 1 && 'Xác thực'}
                                    {stepNum === 2 && 'Mật khẩu'}
                                    {stepNum === 3 && 'Hoàn tất'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Step 0: Initial registration */}
            {step === 0 && (
                <div>
                    {/* Method toggle */}
                    <div className="d-flex justify-content-center mb-3">
                        <div className={clsx(authStyles.methodToggle)}>
                            <button
                                type="button"
                                className={clsx(
                                    authStyles.toggleBtn,
                                    method === 'phone' && authStyles.toggleBtnActive
                                )}
                                onClick={() => setMethod('phone')}
                            >
                                <Phone size={16} className="me-2" />
                                Số điện thoại
                            </button>
                            <button
                                type="button"
                                className={clsx(
                                    authStyles.toggleBtn,
                                    method === 'email' && authStyles.toggleBtnActive
                                )}
                                onClick={() => setMethod('email')}
                            >
                                <Mail size={16} className="me-2" />
                                Email
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleSendOtp}>
                        <div className="mb-3">
                            <label className="form-label">
                                {method === 'phone' ? 'Số điện thoại' : 'Địa chỉ email'}
                            </label>
                            <div
                                className={clsx(
                                    authStyles.inputGroup,
                                    method === 'phone'
                                        ? authStyles.inputWrapPhone
                                        : authStyles.inputWrapEmail
                                )}
                            >
                                <div className={authStyles.leftIcon}>
                                    {method === 'phone' ? (
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
                                    ) : (
                                        <Mail size={18} className="text-muted" />
                                    )}
                                </div>
                                <input
                                    type={method === 'phone' ? 'tel' : 'email'}
                                    className={clsx('form-control')}
                                    placeholder={
                                        method === 'phone'
                                            ? 'Nhập số điện thoại'
                                            : 'Nhập địa chỉ email'
                                    }
                                    value={method === 'phone' ? phone : email}
                                    onChange={(e) =>
                                        method === 'phone'
                                            ? setPhone(e.target.value)
                                            : setEmail(e.target.value)
                                    }
                                    onFocus={() => setShowCaptcha(true)}
                                />
                            </div>
                        </div>

                        {/* Captcha */}
                        {showCaptcha && (
                            <div>
                                {siteKey ? (
                                    <ReCAPTCHA
                                        sitekey={siteKey}
                                        onChange={() => setIsHuman(true)}
                                        onExpired={() => setIsHuman(false)}
                                    />
                                ) : (
                                    <div className="d-flex align-items-center p-3 bg-light rounded-3 border">
                                        <input
                                            type="checkbox"
                                            id="captcha"
                                            className="me-2"
                                            onChange={(e) => setIsHuman(e.target.checked)}
                                        />
                                        <label htmlFor="captcha" className="text-muted">
                                            Tôi không phải là robot
                                        </label>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Agreement */}
                        <div className="d-flex align-items-start mb-3 mt-3">
                            <input
                                type="checkbox"
                                id="agree"
                                className="me-2 mt-1"
                                checked={agree}
                                onChange={(e) => setAgree(e.target.checked)}
                                style={{
                                    width: '16px',
                                    height: '16px',
                                }}
                            />
                            <label htmlFor="agree" className="text-muted">
                                Tôi đã đọc và đồng ý với{' '}
                                <Link to="/terms" className="text-primary">
                                    điều khoản sử dụng
                                </Link>{' '}
                                và{' '}
                                <Link to="/privacy" className="text-primary">
                                    chính sách bảo mật
                                </Link>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={!canSendOtp}
                            className={clsx(
                                'btn w-100 fw-bold',
                                authStyles.submitBtn,
                                canSendOtp ? 'btn-primary-gradient' : 'btn-secondary disabled'
                            )}
                        >
                            Gửi mã OTP
                        </button>
                    </form>
                    {/* Social login */}
                    <div className="login-or">
                        <span className="or-line"></span>
                        <span className="span-or">hoặc</span>
                    </div>
                    <div className="social-login-btn">
                        <button type="button" className="btn w-100">
                            <img src={GoogleIcon} alt="google-icon" /> Đăng nhập với Google
                        </button>
                        <button type="button" className="btn w-100">
                            <img src={FacebookIcon} alt="fb-icon" /> Đăng nhập với Facebook
                        </button>
                    </div>
                    <div className="account-signup">
                        <p>
                            Đã có tài khoản? <Link to={PATHS.LOGIN}>Đăng nhập ngay</Link>
                        </p>
                    </div>
                </div>
            )}

            {/* Step 1: OTP Verification */}
            {step === 1 && (
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
                            <Mail size={24} className="text-primary" />
                        </div>
                        <p className="text-muted">
                            Mã OTP đã được gửi đến{' '}
                            <span className="fw-medium text-dark">
                                {method === 'phone' ? phone : email}
                            </span>
                        </p>
                    </div>

                    <form onSubmit={handleVerifyOtp}>
                        <div className="d-flex justify-content-center gap-2">
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
                                    className="text-center fw-bold"
                                    style={{
                                        width: 48,
                                        height: 56,
                                        fontSize: 20,
                                        borderRadius: 8,
                                        border: '2px solid #e5e7eb',
                                    }}
                                />
                            ))}
                        </div>

                        <button
                            type="submit"
                            disabled={!canVerifyOtp || isVerifying}
                            className={clsx(
                                'btn w-100 mt-4 fw-medium',
                                canVerifyOtp && !isVerifying
                                    ? 'btn-primary-gradient'
                                    : 'btn-secondary disabled'
                            )}
                        >
                            {isVerifying ? (
                                <>
                                    <div
                                        className="spinner-border spinner-border-sm me-2"
                                        role="status"
                                    />
                                    Đang xác thực...
                                </>
                            ) : (
                                <>Xác thực OTP</>
                            )}
                        </button>

                        <div
                            className="d-flex justify-content-center align-items-center mt-3 text-muted"
                            style={{ gap: 2 }}
                        >
                            <p>Không nhận được mã?</p>
                            {countdown > 0 ? (
                                <p className="text-primary">(Gửi lại sau {countdown}s)</p>
                            ) : (
                                <button
                                    type="button"
                                    className="btn btn-link p-0"
                                    onClick={() => setCountdown(60)}
                                    style={{ marginBottom: 14 }}
                                >
                                    {'(Gửi lại mã)'}
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            )}

            {/* Step 2: Password Creation */}
            {step === 2 && (
                <div style={{ maxWidth: 480, margin: '0 auto' }}>
                    <div className="text-center mb-4">
                        <div
                            className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                            style={{
                                width: 64,
                                height: 64,
                                background: '#dcfce7',
                            }}
                        >
                            <Lock size={24} style={{ color: '#16a34a' }} />
                        </div>
                        <p className="text-muted">Tạo mật khẩu mạnh để bảo vệ tài khoản của bạn</p>
                    </div>

                    <form onSubmit={handleCreatePassword}>
                        <div className="mb-3">
                            <label className="form-label" htmlFor="reg-password">
                                Mật khẩu
                            </label>
                            <div className={clsx(authStyles.inputGroup)}>
                                <i className={clsx('feather-lock', authStyles.leftIcon)}></i>
                                <input
                                    id="reg-password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    className={clsx('form-control')}
                                    placeholder="Nhập mật khẩu"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <span
                                    role="button"
                                    aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                                    onClick={() => togglePasswordVisibility('password')}
                                    className={clsx(
                                        showPassword ? 'feather-eye' : 'feather-eye-off',
                                        authStyles.togglePassword
                                    )}
                                />
                            </div>

                            {password && (
                                <div className="mt-2">
                                    <div className="d-flex justify-content-between align-items-center mb-1">
                                        <small className="text-muted">Độ mạnh mật khẩu:</small>
                                        <small
                                            className="fw-medium"
                                            style={{
                                                color: passwordStrength.color,
                                            }}
                                        >
                                            {passwordStrength.label}
                                        </small>
                                    </div>
                                    <div className={authStyles.strengthBar}>
                                        <div
                                            className={authStyles.strengthFill}
                                            style={{
                                                width: `${passwordStrength.width}%`,
                                                backgroundColor: passwordStrength.color,
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mb-3">
                            <label className="form-label" htmlFor="reg-confirm">
                                Xác nhận mật khẩu
                            </label>
                            <div className={clsx(authStyles.inputGroup)}>
                                <i className={clsx('feather-lock', authStyles.leftIcon)}></i>
                                <input
                                    id="reg-confirm"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    className={clsx(
                                        'form-control',

                                        confirmPassword && confirmPassword === password
                                            ? authStyles.borderSuccess
                                            : ''
                                    )}
                                    placeholder="Nhập lại mật khẩu mới"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                <span
                                    role="button"
                                    aria-label={
                                        showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'
                                    }
                                    onClick={() => togglePasswordVisibility('confirm')}
                                    className={clsx(
                                        showConfirmPassword ? 'feather-eye' : 'feather-eye-off',
                                        authStyles.togglePassword
                                    )}
                                />
                            </div>
                            {confirmPassword && password === confirmPassword && (
                                <div className="d-flex align-items-center mt-2 text-success">
                                    <CheckCircle size={16} className="me-2" />
                                    <span>Mật khẩu trùng khớp</span>
                                </div>
                            )}
                        </div>
                        {/* Password Requirements */}
                        <div className="mb-3">
                            <div className={authStyles.requirementsList}>
                                <span className="mb-1" style={{ fontWeight: 600 }}>
                                    Yêu cầu mật khẩu:
                                </span>
                                <div className={authStyles.requirementItem}>
                                    <span className={authStyles.requirementIcon}>
                                        {passwordRequirements.hasMinLength ? (
                                            <CheckCircle size={16} className="text-success" />
                                        ) : (
                                            <CheckCircle size={16} className="text-muted" />
                                        )}
                                    </span>
                                    <span
                                        className={clsx(
                                            authStyles.requirementText,
                                            passwordRequirements.hasMinLength
                                                ? 'text-success'
                                                : 'text-muted'
                                        )}
                                    >
                                        Ít nhất 8 ký tự
                                    </span>
                                </div>
                                <div className={authStyles.requirementItem}>
                                    <span className={authStyles.requirementIcon}>
                                        {passwordRequirements.hasUppercase ? (
                                            <CheckCircle size={16} className="text-success" />
                                        ) : (
                                            <CheckCircle size={16} className="text-muted" />
                                        )}
                                    </span>
                                    <span
                                        className={clsx(
                                            authStyles.requirementText,
                                            passwordRequirements.hasUppercase
                                                ? 'text-success'
                                                : 'text-muted'
                                        )}
                                    >
                                        Một chữ hoa
                                    </span>
                                </div>
                                <div className={authStyles.requirementItem}>
                                    <span className={authStyles.requirementIcon}>
                                        {passwordRequirements.hasLowercase ? (
                                            <CheckCircle size={16} className="text-success" />
                                        ) : (
                                            <CheckCircle size={16} className="text-muted" />
                                        )}
                                    </span>
                                    <span
                                        className={clsx(
                                            authStyles.requirementText,
                                            passwordRequirements.hasLowercase
                                                ? 'text-success'
                                                : 'text-muted'
                                        )}
                                    >
                                        Một chữ thường
                                    </span>
                                </div>
                                <div className={authStyles.requirementItem}>
                                    <span className={authStyles.requirementIcon}>
                                        {passwordRequirements.hasNumber ? (
                                            <CheckCircle size={16} className="text-success" />
                                        ) : (
                                            <CheckCircle size={16} className="text-muted" />
                                        )}
                                    </span>
                                    <span
                                        className={clsx(
                                            authStyles.requirementText,
                                            passwordRequirements.hasNumber
                                                ? 'text-success'
                                                : 'text-muted'
                                        )}
                                    >
                                        Một số
                                    </span>
                                </div>
                                <div className={authStyles.requirementItem}>
                                    <span className={authStyles.requirementIcon}>
                                        {passwordRequirements.hasSpecialChar ? (
                                            <CheckCircle size={16} className="text-success" />
                                        ) : (
                                            <CheckCircle size={16} className="text-muted" />
                                        )}
                                    </span>
                                    <span
                                        className={clsx(
                                            authStyles.requirementText,
                                            passwordRequirements.hasSpecialChar
                                                ? 'text-success'
                                                : 'text-muted'
                                        )}
                                    >
                                        Một ký tự đặc biệt
                                    </span>
                                </div>
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={!canCreatePassword}
                            className={clsx(
                                'btn w-100 fw-medium',
                                canCreatePassword
                                    ? 'btn-primary-gradient'
                                    : 'btn-secondary disabled'
                            )}
                        >
                            Tạo mật khẩu
                        </button>
                    </form>
                </div>
            )}

            {/* Step 3: Profile completion */}
            {step === 3 && (
                <div>
                    <div className="text-center mb-4">
                        <div
                            className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                            style={{
                                width: 64,
                                height: 64,
                                background: '#ede9fe',
                            }}
                        >
                            <User size={24} style={{ color: '#7c3aed' }} />
                        </div>
                        <p className="text-muted">
                            Tạo hồ sơ y tế đầy đủ thông tin sẽ hỗ trợ việc khám chữa bệnh của bạn
                            tốt hơn.
                        </p>
                    </div>

                    <form onSubmit={handleCompleteRegistration} style={{ position: 'relative' }}>
                        <div className="row">
                            {/* Left Column */}
                            <div className="col-md-6">
                                {/* Full Name */}
                                <div className="mb-3">
                                    <label className="form-label">
                                        Họ và tên <span className="text-danger">*</span>
                                    </label>
                                    <div className={authStyles.inputGroup}>
                                        <User size={18} className={authStyles.leftIcon} />
                                        <input
                                            type="text"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            className={clsx(
                                                'form-control rounded-3',
                                                styles.inputCustom
                                            )}
                                            style={{ paddingLeft: 48 }}
                                            placeholder="Nhập họ và tên đầy đủ"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Gender */}
                                <div
                                    className="mb-3"
                                    style={{
                                        position: 'relative',
                                        zIndex: 1000,
                                    }}
                                >
                                    <label className="form-label">
                                        Giới tính <span className="text-danger">*</span>
                                    </label>
                                    <Select
                                        options={[
                                            { value: 'male', label: 'Nam' },
                                            { value: 'female', label: 'Nữ' },
                                            { value: 'other', label: 'Khác' },
                                        ]}
                                        value={
                                            gender
                                                ? {
                                                      value: gender,
                                                      label:
                                                          gender === 'male'
                                                              ? 'Nam'
                                                              : gender === 'female'
                                                                ? 'Nữ'
                                                                : 'Khác',
                                                  }
                                                : null
                                        }
                                        onChange={(selected) =>
                                            setGender(
                                                selected?.value as 'male' | 'female' | 'other' | ''
                                            )
                                        }
                                        placeholder="Chọn giới tính"
                                        className="react-select-container"
                                        classNamePrefix="react-select"
                                        styles={{
                                            control: (base) => ({
                                                ...base,
                                                borderRadius: '8px',
                                                borderColor: '#e5e7eb',
                                                boxShadow: 'none',
                                                '&:hover': {
                                                    borderColor: '#d1d5db',
                                                },
                                            }),
                                            option: (base, state) => ({
                                                ...base,
                                                backgroundColor: state.isFocused
                                                    ? '#f3f4f6'
                                                    : 'white',
                                                color: state.isFocused ? '#374151' : '#4b5563',
                                                '&:active': {
                                                    backgroundColor: '#e5e7eb',
                                                },
                                            }),
                                            singleValue: (base) => ({
                                                ...base,
                                                color: '#374151',
                                            }),
                                            placeholder: (base) => ({
                                                ...base,
                                                color: '#9ca3af',
                                            }),
                                            menu: (base) => ({
                                                ...base,
                                                zIndex: 9999,
                                                boxShadow:
                                                    '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                                            }),
                                            menuList: (base) => ({
                                                ...base,
                                                padding: '8px 0',
                                            }),
                                        }}
                                    />
                                </div>
                                {/* Phone */}
                                <div className="mb-3">
                                    <label className="form-label">
                                        Số điện thoại <span className="text-danger">*</span>
                                    </label>
                                    <div className={authStyles.inputGroup}>
                                        <i
                                            className={clsx('feather-phone', authStyles.leftIcon)}
                                        ></i>
                                        <input
                                            type="tel"
                                            value={profilePhone}
                                            onChange={(e) => setProfilePhone(e.target.value)}
                                            className={clsx('form-control rounded-3')}
                                            placeholder="Nhập số điện thoại"
                                            required
                                            disabled={method === 'phone'}
                                        />
                                    </div>
                                    {method === 'phone' && (
                                        <small className="text-muted">
                                            Số điện thoại này đã được sử dụng để đăng ký
                                        </small>
                                    )}
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="col-md-6">
                                {/* Birth Date */}
                                <div className="mb-3">
                                    <label className="form-label">
                                        Ngày sinh <span className="text-danger">*</span>
                                    </label>
                                    <div className="position-relative">
                                        <input
                                            type="date"
                                            value={birthDate}
                                            onChange={(e) => setBirthDate(e.target.value)}
                                            className={clsx(
                                                'form-control rounded-3',
                                                styles.inputCustom
                                            )}
                                            style={{
                                                paddingLeft: 16,
                                                paddingRight: 16,
                                            }}
                                            required
                                            max={new Date().toISOString().split('T')[0]}
                                        />
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="mb-3">
                                    <label className="form-label">
                                        Email <span className="text-danger">*</span>
                                    </label>
                                    <div className={authStyles.inputGroup}>
                                        <i
                                            className={clsx('feather-mail', authStyles.leftIcon)}
                                        ></i>
                                        <input
                                            type="email"
                                            value={profileEmail}
                                            onChange={(e) => setProfileEmail(e.target.value)}
                                            className={clsx('form-control rounded-3')}
                                            placeholder="Nhập địa chỉ email"
                                            required
                                            disabled={method === 'email'}
                                        />
                                    </div>
                                    {method === 'email' && (
                                        <small className="text-muted">
                                            Email này đã được sử dụng để đăng ký
                                        </small>
                                    )}
                                </div>

                                {/* Address */}
                                <div className="mb-3">
                                    <label className="form-label">
                                        Địa chỉ <span className="text-danger">*</span>
                                    </label>
                                    <textarea
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        className={clsx(
                                            'form-control rounded-3',
                                            styles.inputCustom
                                        )}
                                        rows={2}
                                        placeholder="Nhập địa chỉ đầy đủ"
                                        required
                                        style={{
                                            paddingLeft: 16,
                                            paddingRight: 16,
                                            paddingTop: 12,
                                            paddingBottom: 12,
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={!canCompleteRegistration || isSubmitting}
                            className={clsx(
                                'btn w-100 fw-medium',
                                canCompleteRegistration && !isSubmitting
                                    ? 'btn-primary-gradient'
                                    : 'btn-secondary disabled'
                            )}
                        >
                            {isSubmitting ? (
                                <>
                                    <div
                                        className="spinner-border spinner-border-sm me-2"
                                        role="status"
                                    />
                                    Đang tạo tài khoản...
                                </>
                            ) : (
                                <>Hoàn tất đăng ký</>
                            )}
                        </button>
                    </form>

                    <div
                        className="mt-3 p-3 rounded-3 text-center"
                        style={{
                            background: '#ecfdf5',
                            border: '1px solid #bbf7d0',
                        }}
                    >
                        <p className="m-0" style={{ color: '#166534', fontSize: 14 }}>
                            🎉 Chào mừng bạn gia nhập cộng đồng Doccure!
                        </p>
                    </div>
                </div>
            )}
        </AuthLayout>
    );
};

export default Register;
