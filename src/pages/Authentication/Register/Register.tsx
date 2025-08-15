import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import { Check, Lock, User, Phone, Mail } from 'lucide-react';
import Select from 'react-select';
import Banner from '@/assets/img/login-banner.png';
import GoogleIcon from '@/assets/img/icons/google-icon.svg';
import FacebookIcon from '@/assets/img/icons/facebook-icon.svg';
import MainLayout from '@/layouts/MainLayout';
import clsx from 'clsx';
import styles from './Register.module.scss';

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
    const [passwordStrength, setPasswordStrength] = useState(0);

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

    const canCreatePassword = useMemo(() => {
        return password.length >= 6 && password === confirmPassword && passwordStrength >= 2;
    }, [password, confirmPassword, passwordStrength]);

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

    // Password strength calculation
    useEffect(() => {
        let strength = 0;
        if (password.length >= 6) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        setPasswordStrength(strength);
    }, [password]);

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

    const getPasswordStrengthColor = () => {
        switch (passwordStrength) {
            case 0:
                return '#ef4444';
            case 1:
                return '#f97316';
            case 2:
                return '#eab308';
            case 3:
                return '#22c55e';
            case 4:
                return '#16a34a';
            default:
                return '#d1d5db';
        }
    };

    const getPasswordStrengthText = () => {
        switch (passwordStrength) {
            case 0:
                return 'Rất yếu';
            case 1:
                return 'Yếu';
            case 2:
                return 'Trung bình';
            case 3:
                return 'Mạnh';
            case 4:
                return 'Rất mạnh';
            default:
                return '';
        }
    };

    return (
        <MainLayout>
            <div className="content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-8 offset-md-2">
                            <div className="account-content">
                                <div className="row align-items-center justify-content-center">
                                    {step === 0 && (
                                        <div className="col-md-7 col-lg-6 login-left">
                                            <img
                                                src={Banner}
                                                className="img-fluid"
                                                alt="Register banner"
                                            />
                                        </div>
                                    )}

                                    {/* Right side - Form */}
                                    <div
                                        className={clsx(
                                            step === 0
                                                ? 'col-md-12 col-lg-6 login-right'
                                                : 'col-12 col-lg-8 login-right',
                                            styles.registerRight
                                        )}
                                        style={{
                                            maxWidth: step === 0 ? undefined : 672,
                                            margin: step === 0 ? undefined : '0 auto',
                                            opacity: isTransitioning ? 0.5 : 1,
                                            pointerEvents: isTransitioning ? 'none' : 'auto',
                                            transition: 'opacity .3s ease',
                                        }}
                                    >
                                        {/* Header */}
                                        <div className="text-center mb-4">
                                            <h1 className={clsx('fw-bold mb-2', styles.title)}>
                                                {step === 0 && 'Đăng ký tài khoản'}
                                                {step === 1 && 'Xác thực OTP'}
                                                {step === 2 && 'Tạo mật khẩu'}
                                                {step === 3 && 'Thông tin cá nhân'}
                                            </h1>
                                            <p className={styles.subtitle}>
                                                {step === 0 &&
                                                    'Bắt đầu hành trình chăm sóc sức khỏe của bạn'}
                                                {step === 1 && 'Nhập mã xác thực để tiếp tục'}
                                                {step === 2 && 'Tạo mật khẩu bảo mật cho tài khoản'}
                                                {step === 3 && 'Hoàn thiện hồ sơ của bạn'}
                                            </p>
                                        </div>

                                        {/* Progress indicator */}
                                        {step > 0 && (
                                            <div className="mb-4">
                                                <div className="d-flex align-items-center justify-content-between mb-2">
                                                    <span
                                                        className="text-muted"
                                                        style={{ fontSize: 14 }}
                                                    >
                                                        Bước {step} / 3
                                                    </span>
                                                    <span
                                                        className="text-muted"
                                                        style={{ fontSize: 14 }}
                                                    >
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
                                                            background:
                                                                'linear-gradient(90deg,#0e82fd,#06aed4)',
                                                            transition: 'width .5s ease',
                                                        }}
                                                    />
                                                </div>
                                                <div className="d-flex justify-content-between mt-3">
                                                    {[1, 2, 3].map((stepNum) => (
                                                        <div
                                                            key={stepNum}
                                                            className="d-flex align-items-center"
                                                        >
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
                                                                    borderColor:
                                                                        step >= stepNum
                                                                            ? 'transparent'
                                                                            : '#d1d5db',
                                                                }}
                                                            >
                                                                {step > stepNum ? (
                                                                    <Check size={16} />
                                                                ) : (
                                                                    <span
                                                                        className="fw-medium"
                                                                        style={{ fontSize: 14 }}
                                                                    >
                                                                        {stepNum}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <span
                                                                className={clsx(
                                                                    'ms-2 fw-medium',
                                                                    step >= stepNum
                                                                        ? 'text-primary'
                                                                        : 'text-muted'
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
                                                    <div className={styles.methodToggle}>
                                                        <button
                                                            type="button"
                                                            className={clsx(
                                                                styles.toggleBtn,
                                                                method === 'phone' &&
                                                                    styles.toggleBtnActive
                                                            )}
                                                            onClick={() => setMethod('phone')}
                                                        >
                                                            <Phone size={16} className="me-2" />
                                                            Số điện thoại
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className={clsx(
                                                                styles.toggleBtn,
                                                                method === 'email' &&
                                                                    styles.toggleBtnActive
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
                                                            {method === 'phone'
                                                                ? 'Số điện thoại'
                                                                : 'Địa chỉ email'}
                                                        </label>
                                                        <div
                                                            className={clsx(
                                                                styles.inputWrap,
                                                                method === 'phone'
                                                                    ? styles.inputWrapPhone
                                                                    : styles.inputWrapEmail
                                                            )}
                                                        >
                                                            <div className={styles.flagPrefix}>
                                                                {method === 'phone' ? (
                                                                    <>
                                                                        <img
                                                                            src="https://flagcdn.com/w20/vn.png"
                                                                            alt="VN"
                                                                            width={20}
                                                                            height={15}
                                                                        />
                                                                        <span
                                                                            className="text-muted"
                                                                            style={{ fontSize: 14 }}
                                                                        >
                                                                            +84
                                                                        </span>
                                                                    </>
                                                                ) : (
                                                                    <Mail
                                                                        size={18}
                                                                        className="text-muted"
                                                                    />
                                                                )}
                                                            </div>
                                                            <input
                                                                type={
                                                                    method === 'phone'
                                                                        ? 'tel'
                                                                        : 'email'
                                                                }
                                                                className={clsx(
                                                                    'form-control',
                                                                    styles.bigInput
                                                                )}
                                                                placeholder={
                                                                    method === 'phone'
                                                                        ? 'Nhập số điện thoại'
                                                                        : 'Nhập địa chỉ email'
                                                                }
                                                                value={
                                                                    method === 'phone'
                                                                        ? phone
                                                                        : email
                                                                }
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
                                                                    onChange={() =>
                                                                        setIsHuman(true)
                                                                    }
                                                                    onExpired={() =>
                                                                        setIsHuman(false)
                                                                    }
                                                                />
                                                            ) : (
                                                                <div className="d-flex align-items-center p-3 bg-light rounded-3 border">
                                                                    <input
                                                                        type="checkbox"
                                                                        id="captcha"
                                                                        className="me-2"
                                                                        onChange={(e) =>
                                                                            setIsHuman(
                                                                                e.target.checked
                                                                            )
                                                                        }
                                                                    />
                                                                    <label
                                                                        htmlFor="captcha"
                                                                        className="text-muted"
                                                                    >
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
                                                            onChange={(e) =>
                                                                setAgree(e.target.checked)
                                                            }
                                                            style={{
                                                                width: '16px',
                                                                height: '16px',
                                                            }}
                                                        />
                                                        <label
                                                            htmlFor="agree"
                                                            className="text-muted"
                                                        >
                                                            Tôi đã đọc và đồng ý với{' '}
                                                            <Link
                                                                to="/terms"
                                                                className="text-primary"
                                                            >
                                                                điều khoản sử dụng
                                                            </Link>{' '}
                                                            và{' '}
                                                            <Link
                                                                to="/privacy"
                                                                className="text-primary"
                                                            >
                                                                chính sách bảo mật
                                                            </Link>
                                                        </label>
                                                    </div>

                                                    <button
                                                        type="submit"
                                                        disabled={!canSendOtp}
                                                        className={clsx(
                                                            'btn w-100 fw-bold',
                                                            styles.submitBtn,
                                                            canSendOtp
                                                                ? 'btn-primary-gradient'
                                                                : 'btn-secondary disabled'
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
                                                        <img src={GoogleIcon} alt="google-icon" />{' '}
                                                        Đăng nhập với Google
                                                    </button>
                                                    <button type="button" className="btn w-100">
                                                        <img src={FacebookIcon} alt="fb-icon" />{' '}
                                                        Đăng nhập với Facebook
                                                    </button>
                                                </div>
                                                <div className="account-signup">
                                                    <p>
                                                        Đã có tài khoản?{' '}
                                                        <Link to="/login">Đăng nhập ngay</Link>
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
                                                                onChange={(e) =>
                                                                    handleOtpChange(
                                                                        idx,
                                                                        e.target.value
                                                                    )
                                                                }
                                                                onKeyDown={(e) =>
                                                                    handleOtpKeyDown(idx, e)
                                                                }
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
                                                            <>
                                                                Xác thực OTP
                                                                {/* <ArrowRight
                                                                    size={18}
                                                                    className="ms-2"
                                                                /> */}
                                                            </>
                                                        )}
                                                    </button>

                                                    <div
                                                        className="d-flex justify-content-center align-items-center mt-3 text-muted"
                                                        style={{ gap: 2 }}
                                                    >
                                                        <p>Không nhận được mã?</p>
                                                        {countdown > 0 ? (
                                                            <p className="text-primary">
                                                                (Gửi lại sau {countdown}s)
                                                            </p>
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
                                                        <Lock
                                                            size={24}
                                                            style={{ color: '#16a34a' }}
                                                        />
                                                    </div>
                                                    <p className="text-muted">
                                                        Tạo mật khẩu mạnh để bảo vệ tài khoản của
                                                        bạn
                                                    </p>
                                                </div>

                                                <form onSubmit={handleCreatePassword}>
                                                    <div className="mb-3">
                                                        <label
                                                            className="form-label"
                                                            htmlFor="reg-password"
                                                        >
                                                            Mật khẩu
                                                        </label>
                                                        <div
                                                            className={clsx(
                                                                styles.inputGroup,
                                                                styles.passGroup
                                                            )}
                                                        >
                                                            <i
                                                                className={clsx(
                                                                    'feather-lock',
                                                                    styles.leftIcon
                                                                )}
                                                            ></i>
                                                            <input
                                                                id="reg-password"
                                                                name="password"
                                                                type={
                                                                    showPassword
                                                                        ? 'text'
                                                                        : 'password'
                                                                }
                                                                className="form-control"
                                                                placeholder="Nhập mật khẩu"
                                                                value={password}
                                                                onChange={(e) =>
                                                                    setPassword(e.target.value)
                                                                }
                                                            />
                                                            <span
                                                                role="button"
                                                                aria-label={
                                                                    showPassword
                                                                        ? 'Ẩn mật khẩu'
                                                                        : 'Hiện mật khẩu'
                                                                }
                                                                onClick={() =>
                                                                    setShowPassword((v) => !v)
                                                                }
                                                                className={clsx(
                                                                    showPassword
                                                                        ? 'feather-eye'
                                                                        : 'feather-eye-off',
                                                                    styles.togglePassword
                                                                )}
                                                            />
                                                        </div>

                                                        {password && (
                                                            <div className="mt-2 d-flex align-items-center gap-2">
                                                                <div
                                                                    className="flex-grow-1 rounded-pill overflow-hidden"
                                                                    style={{
                                                                        height: 8,
                                                                        background: '#e5e7eb',
                                                                    }}
                                                                >
                                                                    <div
                                                                        className="h-100"
                                                                        style={{
                                                                            width: `${(passwordStrength / 4) * 100}%`,
                                                                            background:
                                                                                getPasswordStrengthColor(),
                                                                            transition: 'width .3s',
                                                                        }}
                                                                    />
                                                                </div>
                                                                <span
                                                                    className="text-muted"
                                                                    style={{
                                                                        fontSize: 12,
                                                                        color: getPasswordStrengthColor(),
                                                                    }}
                                                                >
                                                                    {getPasswordStrengthText()}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="mb-3">
                                                        <label
                                                            className="form-label"
                                                            htmlFor="reg-confirm"
                                                        >
                                                            Xác nhận mật khẩu
                                                        </label>
                                                        <div
                                                            className={clsx(
                                                                styles.inputGroup,
                                                                styles.passGroup
                                                            )}
                                                        >
                                                            <i
                                                                className={clsx(
                                                                    'feather-lock',
                                                                    styles.leftIcon
                                                                )}
                                                            ></i>
                                                            <input
                                                                id="reg-confirm"
                                                                name="confirmPassword"
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Nhập lại mật khẩu"
                                                                value={confirmPassword}
                                                                onChange={(e) =>
                                                                    setConfirmPassword(
                                                                        e.target.value
                                                                    )
                                                                }
                                                            />

                                                            {confirmPassword && (
                                                                <div
                                                                    className="position-absolute"
                                                                    style={{
                                                                        right: 12,
                                                                        top: '50%',
                                                                        transform:
                                                                            'translateY(-50%)',
                                                                    }}
                                                                >
                                                                    {password ===
                                                                    confirmPassword ? (
                                                                        <Check
                                                                            size={18}
                                                                            style={{
                                                                                color: '#16a34a',
                                                                            }}
                                                                        />
                                                                    ) : (
                                                                        <div
                                                                            style={{
                                                                                width: 16,
                                                                                height: 16,
                                                                                borderRadius: 9999,
                                                                                background:
                                                                                    '#ef4444',
                                                                            }}
                                                                        />
                                                                    )}
                                                                </div>
                                                            )}
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
                                                        <User
                                                            size={24}
                                                            style={{ color: '#7c3aed' }}
                                                        />
                                                    </div>
                                                    <p className="text-muted">
                                                        Tạo hồ sơ y tế đầy đủ thông tin sẽ hỗ trợ
                                                        việc khám chữa bệnh của bạn tốt hơn.
                                                    </p>
                                                </div>

                                                <form
                                                    onSubmit={handleCompleteRegistration}
                                                    style={{ position: 'relative' }}
                                                >
                                                    <div className="row">
                                                        {/* Left Column */}
                                                        <div className="col-md-6">
                                                            {/* Full Name */}
                                                            <div className="mb-3">
                                                                <label className="form-label">
                                                                    Họ và tên{' '}
                                                                    <span className="text-danger">
                                                                        *
                                                                    </span>
                                                                </label>
                                                                <div className="position-relative">
                                                                    <User
                                                                        size={18}
                                                                        className="position-absolute"
                                                                        style={{
                                                                            left: 12,
                                                                            top: '50%',
                                                                            transform:
                                                                                'translateY(-50%)',
                                                                            color: '#9ca3af',
                                                                        }}
                                                                    />
                                                                    <input
                                                                        type="text"
                                                                        value={fullName}
                                                                        onChange={(e) =>
                                                                            setFullName(
                                                                                e.target.value
                                                                            )
                                                                        }
                                                                        className="form-control rounded-3"
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
                                                                    Giới tính{' '}
                                                                    <span className="text-danger">
                                                                        *
                                                                    </span>
                                                                </label>
                                                                <Select
                                                                    options={[
                                                                        {
                                                                            value: 'male',
                                                                            label: 'Nam',
                                                                        },
                                                                        {
                                                                            value: 'female',
                                                                            label: 'Nữ',
                                                                        },
                                                                        {
                                                                            value: 'other',
                                                                            label: 'Khác',
                                                                        },
                                                                    ]}
                                                                    value={
                                                                        gender
                                                                            ? {
                                                                                  value: gender,
                                                                                  label:
                                                                                      gender ===
                                                                                      'male'
                                                                                          ? 'Nam'
                                                                                          : gender ===
                                                                                              'female'
                                                                                            ? 'Nữ'
                                                                                            : 'Khác',
                                                                              }
                                                                            : null
                                                                    }
                                                                    onChange={(selected) =>
                                                                        setGender(
                                                                            selected?.value as
                                                                                | 'male'
                                                                                | 'female'
                                                                                | 'other'
                                                                                | ''
                                                                        )
                                                                    }
                                                                    placeholder="Chọn giới tính"
                                                                    className="react-select-container"
                                                                    classNamePrefix="react-select"
                                                                    styles={{
                                                                        control: (base) => ({
                                                                            ...base,
                                                                            //minHeight: '48px',
                                                                            borderRadius: '8px',
                                                                            borderColor: '#e5e7eb',
                                                                            boxShadow: 'none',
                                                                            '&:hover': {
                                                                                borderColor:
                                                                                    '#d1d5db',
                                                                            },
                                                                        }),
                                                                        option: (base, state) => ({
                                                                            ...base,
                                                                            backgroundColor:
                                                                                state.isFocused
                                                                                    ? '#f3f4f6'
                                                                                    : 'white',
                                                                            color: state.isFocused
                                                                                ? '#374151'
                                                                                : '#4b5563',
                                                                            '&:active': {
                                                                                backgroundColor:
                                                                                    '#e5e7eb',
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
                                                                    Số điện thoại{' '}
                                                                    <span className="text-danger">
                                                                        *
                                                                    </span>
                                                                </label>
                                                                <div className="position-relative">
                                                                    <Phone
                                                                        size={18}
                                                                        className="position-absolute"
                                                                        style={{
                                                                            left: 12,
                                                                            top: '50%',
                                                                            transform:
                                                                                'translateY(-50%)',
                                                                            color: '#9ca3af',
                                                                        }}
                                                                    />
                                                                    <input
                                                                        type="tel"
                                                                        value={profilePhone}
                                                                        onChange={(e) =>
                                                                            setProfilePhone(
                                                                                e.target.value
                                                                            )
                                                                        }
                                                                        className="form-control rounded-3"
                                                                        style={{ paddingLeft: 48 }}
                                                                        placeholder="Nhập số điện thoại"
                                                                        required
                                                                        disabled={
                                                                            method === 'phone'
                                                                        }
                                                                    />
                                                                </div>
                                                                {method === 'phone' && (
                                                                    <small className="text-muted">
                                                                        Số điện thoại này đã được sử
                                                                        dụng để đăng ký
                                                                    </small>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Right Column */}
                                                        <div className="col-md-6">
                                                            {/* Birth Date */}
                                                            <div className="mb-3">
                                                                <label className="form-label">
                                                                    Ngày sinh{' '}
                                                                    <span className="text-danger">
                                                                        *
                                                                    </span>
                                                                </label>
                                                                <div className="position-relative">
                                                                    <input
                                                                        type="date"
                                                                        value={birthDate}
                                                                        onChange={(e) =>
                                                                            setBirthDate(
                                                                                e.target.value
                                                                            )
                                                                        }
                                                                        className="form-control rounded-3"
                                                                        style={{
                                                                            paddingLeft: 16,
                                                                            paddingRight: 16,
                                                                        }}
                                                                        required
                                                                        max={
                                                                            new Date()
                                                                                .toISOString()
                                                                                .split('T')[0]
                                                                        }
                                                                    />
                                                                </div>
                                                            </div>

                                                            {/* Email */}
                                                            <div className="mb-3">
                                                                <label className="form-label">
                                                                    Email{' '}
                                                                    <span className="text-danger">
                                                                        *
                                                                    </span>
                                                                </label>
                                                                <div className="position-relative">
                                                                    <Mail
                                                                        size={18}
                                                                        className="position-absolute"
                                                                        style={{
                                                                            left: 12,
                                                                            top: '50%',
                                                                            transform:
                                                                                'translateY(-50%)',
                                                                            color: '#9ca3af',
                                                                        }}
                                                                    />
                                                                    <input
                                                                        type="email"
                                                                        value={profileEmail}
                                                                        onChange={(e) =>
                                                                            setProfileEmail(
                                                                                e.target.value
                                                                            )
                                                                        }
                                                                        className="form-control rounded-3"
                                                                        style={{ paddingLeft: 48 }}
                                                                        placeholder="Nhập địa chỉ email"
                                                                        required
                                                                        disabled={
                                                                            method === 'email'
                                                                        }
                                                                    />
                                                                </div>
                                                                {method === 'email' && (
                                                                    <small className="text-muted">
                                                                        Email này đã được sử dụng để
                                                                        đăng ký
                                                                    </small>
                                                                )}
                                                            </div>

                                                            {/* Address */}
                                                            <div className="mb-3">
                                                                <label className="form-label">
                                                                    Địa chỉ{' '}
                                                                    <span className="text-danger">
                                                                        *
                                                                    </span>
                                                                </label>
                                                                <textarea
                                                                    value={address}
                                                                    onChange={(e) =>
                                                                        setAddress(e.target.value)
                                                                    }
                                                                    className="form-control rounded-3"
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
                                                        disabled={
                                                            !canCompleteRegistration || isSubmitting
                                                        }
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
                                                    <p
                                                        className="m-0"
                                                        style={{ color: '#166534', fontSize: 14 }}
                                                    >
                                                        🎉 Chào mừng bạn gia nhập cộng đồng Doccure!
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default Register;
