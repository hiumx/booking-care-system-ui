import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ReCAPTCHA from 'react-google-recaptcha';
import { Lock, User, Phone, Mail, CheckCircle } from 'lucide-react';
import Select from 'react-select';
import { SocialLogin } from '@/components/SocialLogin';
import AuthLayout from '@/layouts/AuthLayout';
import StepWizard from '@/components/StepWizard';
import clsx from 'clsx';
import styles from './Register.module.scss';
import { PATHS } from '@/routes/paths';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { registerAsync, clearError } from '@/store/slices/authSlice';
import { RootState, AppDispatch } from '@/store';
import { RegisterRequest } from '@/types/auth.types';
import { SendOtpRequest, VerifyOtpRequest } from '@/types/otp.types';
import { AuthService } from '@/services/auth.service';
import { OtpService } from '@/services/otp.service';
import { usePhoneInput } from '@/hooks/usePhoneInput';
import { toast } from 'react-toastify';
import { PASSWORD_REGEX, PASSWORD_MIN_LENGTH, OTP_REGEX, NAME_REGEX } from '@/constants';
import { Gender } from '@/enums/common.enums';

type Step = 0 | 1 | 2 | 3;

const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
const deviceId = import.meta.env.VITE_DEVICE_ID || 'booking-care-web-client';
const OTP_LENGTH = 6;

const Register: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { isLoading, error, isAuthenticated } = useSelector((state: RootState) => state.auth);

    const [step, setStep] = useState<Step>(0);
    const [method, setMethod] = useState<'email' | 'phone'>('phone');
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Step 0: phone/email
    const [email, setEmail] = useState('');

    // Use phone input hook for registration method
    const { phone, handlePhoneChange, handlePhonePaste, handlePhoneKeyDown, isPhoneValid } =
        usePhoneInput();

    // Use separate phone input hook for profile phone
    const {
        phone: profilePhone,
        handlePhoneChange: handleProfilePhoneChange,
        handlePhonePaste: handleProfilePhonePaste,
        handlePhoneKeyDown: handleProfilePhoneKeyDown,
        setPhoneValue: setProfilePhoneValue,
    } = usePhoneInput();
    const [isHuman, setIsHuman] = useState(false);
    const [showCaptcha, setShowCaptcha] = useState(false);
    const [agree, setAgree] = useState(true);

    // Step 1: OTP
    const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
    const otpRefs = useRef<Array<HTMLInputElement | null>>([]);
    const [countdown, setCountdown] = useState<number>(60);
    const [isSending, setIsSending] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [otpProof, setOtpProof] = useState<string>('');
    const [otpIssuedAt, setOtpIssuedAt] = useState<string>('');

    // Step 2: password
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    // Password requirements validation
    const passwordRequirements = useMemo(() => {
        const hasMinLength = password.length >= PASSWORD_MIN_LENGTH;
        const hasUppercase = PASSWORD_REGEX.UPPERCASE.test(password);
        const hasLowercase = PASSWORD_REGEX.LOWERCASE.test(password);
        const hasNumber = PASSWORD_REGEX.DIGIT.test(password);
        const hasSpecialChar = PASSWORD_REGEX.SPECIAL_CHAR.test(password);

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
    const [birthday, setBirthday] = useState('');
    const [gender, setGender] = useState<Gender | ''>('');

    // Helper function to get gender label
    const getGenderLabel = (genderValue: Gender | '') => {
        switch (genderValue) {
            case Gender.MALE:
                return 'Nam';
            case Gender.FEMALE:
                return 'Nữ';
            case Gender.OTHER:
                return 'Khác';
            default:
                return '';
        }
    };
    const [address, setAddress] = useState('');
    const [profileEmail, setProfileEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Validation error states for step 3
    const [fullNameError, setFullNameError] = useState('');
    const [birthdayError, setBirthdayError] = useState('');
    const [genderError, setGenderError] = useState('');
    const [addressError, setAddressError] = useState('');
    const [profileEmailError, setProfileEmailError] = useState('');
    const [profilePhoneError, setProfilePhoneError] = useState('');

    // Social login handlers
    const handleSocialSuccess = () => navigate('/');
    const handleSocialError = (error: any) => console.error('Social login error:', error);

    // Validation helper: Check if user is at least 18 years old
    const validateAge = (dateOfBirth: string): boolean => {
        if (!dateOfBirth) return false;
        const birthDate = new Date(dateOfBirth);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            return age - 1 >= 18;
        }
        return age >= 18;
    };

    const canSendOtp = useMemo(() => {
        // Use AuthService for consistent email validation
        const validEmail = email.trim() && AuthService.validateEmail(email);

        // Use phone validation from hook (must be exactly 10 digits starting with 0)
        const validPhone = isPhoneValid();

        // Check if the selected method has valid input
        const validIdentifier = method === 'phone' ? validPhone : validEmail;

        return validIdentifier && isHuman && agree;
    }, [method, email, isPhoneValid, isHuman, agree]);

    const otpValue = useMemo(() => otp.join(''), [otp]);
    const canVerifyOtp = otpValue.length === OTP_LENGTH && OTP_REGEX.SIX_DIGITS.test(otpValue);

    // Validation handlers for step 3 fields
    const handleFullNameChange = (value: string) => {
        setFullName(value);
        if (!value.trim()) {
            setFullNameError('Họ và tên không được để trống');
        } else if (value.trim().length < 2) {
            setFullNameError('Họ và tên phải có ít nhất 2 ký tự');
        } else if (!NAME_REGEX.NO_NUMBERS.test(value)) {
            setFullNameError('Họ và tên không được chứa số');
        } else {
            setFullNameError('');
        }
    };

    const handleBirthdayChange = (value: string) => {
        setBirthday(value);
        if (!value.trim()) {
            setBirthdayError('Ngày sinh không được để trống');
        } else if (new Date(value) > new Date()) {
            setBirthdayError('Ngày sinh không thể là ngày trong tương lai');
        } else if (!validateAge(value)) {
            setBirthdayError('Bạn phải từ 18 tuổi trở lên');
        } else {
            setBirthdayError('');
        }
    };

    const handleGenderChange = (value: Gender | '') => {
        setGender(value);
        if (value === '') {
            setGenderError('Vui lòng chọn giới tính');
        } else {
            setGenderError('');
        }
    };

    const handleAddressChange = (value: string) => {
        setAddress(value);
        if (!value.trim()) {
            setAddressError('Địa chỉ không được để trống');
        } else if (value.trim().length < 5) {
            setAddressError('Địa chỉ phải có ít nhất 5 ký tự');
        } else {
            setAddressError('');
        }
    };

    const handleProfileEmailChange = (value: string) => {
        setProfileEmail(value);
        if (method === 'email') return; // Skip validation if email is used for registration

        if (!value.trim()) {
            setProfileEmailError('');
        } else if (!AuthService.validateEmail(value)) {
            setProfileEmailError('Email không hợp lệ');
        } else {
            setProfileEmailError('');
        }
    };

    const handleProfilePhoneChange2 = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleProfilePhoneChange(e);
        const value = e.target.value;

        if (method === 'phone') return; // Skip validation if phone is used for registration

        if (!value.trim()) {
            setProfilePhoneError('');
        } else if (!AuthService.validatePhoneNumber(value)) {
            setProfilePhoneError('Số điện thoại phải có 10 chữ số và bắt đầu bằng 0');
        } else {
            setProfilePhoneError('');
        }
    };

    // Auto-fill email/phone based on registration method
    useEffect(() => {
        if (method === 'email') {
            setProfileEmail(email);
        } else {
            setProfilePhoneValue(phone);
        }
    }, [method, email, phone, setProfilePhoneValue]);

    // Clear error when component mounts
    useEffect(() => {
        dispatch(clearError());
    }, [dispatch]);

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

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
        setIsSending(true);

        try {
            // Call send OTP API
            const sendOtpData: SendOtpRequest = {
                ...(method === 'email' ? { email } : { phone, deviceId }),
                purpose: 'REGISTER',
            };
            const response = await OtpService.sendOtp(sendOtpData);

            transitionToStep(1);
            toast.success(response.message || 'Mã OTP đã được gửi thành công!');
        } catch (error: any) {
            console.error('Send OTP error:', error);
            toast.error(
                method === 'email'
                    ? 'Email này đã được đăng ký.'
                    : 'Số điện thoại này đã được đăng ký.'
            );
        } finally {
            setIsSending(false);
        }
    };

    const handleOtpChange = (index: number, value: string) => {
        if (!OTP_REGEX.SINGLE_DIGIT.test(value)) return;
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

        try {
            // Call verify OTP API
            const verifyOtpData: VerifyOtpRequest = {
                ...(method === 'email' ? { email } : { phone }),
                otp: otpValue,
                purpose: 'REGISTER',
            };
            const response = await OtpService.verifyOtp(verifyOtpData);

            // Store OTP verification proof for registration
            setOtpProof(response.data.proof);
            setOtpIssuedAt(response.data.issuedAt);

            // OTP verification successful, move to password creation step
            transitionToStep(2);
            toast.success(response.message || 'Xác thực OTP thành công!');
        } catch (error: any) {
            console.error('Verify OTP error:', error);
            toast.error('Mã OTP không chính xác hoặc đã hết hạn');
        } finally {
            setIsVerifying(false);
        }
    };

    const handleResendOtp = async () => {
        if (countdown > 0) return;

        try {
            // Call send OTP API again
            const sendOtpData: SendOtpRequest = {
                ...(method === 'email' ? { email } : { phone, deviceId }),
                purpose: 'REGISTER',
            };
            const response = await OtpService.sendOtp(sendOtpData);

            setCountdown(60);
            setOtp(new Array(6).fill(''));
            toast.success(response.message || 'Mã OTP mới đã được gửi thành công!');
        } catch (error: any) {
            console.error('Resend OTP error:', error);
            toast.error(
                method === 'email'
                    ? 'Email này đã được đăng ký.'
                    : 'Số điện thoại này đã được đăng ký.'
            );
        }
    };

    const handleCreatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!canCreatePassword) return;
        transitionToStep(3);
    };

    const handleCompleteRegistration = async (e: React.FormEvent) => {
        e.preventDefault();

        let hasError = false;

        // Validate all fields
        if (!fullName.trim()) {
            setFullNameError('Họ và tên không được để trống');
            hasError = true;
        } else if (fullName.trim().length < 2) {
            setFullNameError('Họ và tên phải có ít nhất 2 ký tự');
            hasError = true;
        } else if (!NAME_REGEX.NO_NUMBERS.test(fullName)) {
            setFullNameError('Họ và tên không được chứa số');
            hasError = true;
        }

        if (!birthday.trim()) {
            setBirthdayError('Ngày sinh không được để trống');
            hasError = true;
        } else if (new Date(birthday) > new Date()) {
            setBirthdayError('Ngày sinh không thể là ngày trong tương lai');
            hasError = true;
        } else if (!validateAge(birthday)) {
            setBirthdayError('Bạn phải từ 18 tuổi trở lên');
            hasError = true;
        }

        if (gender === '') {
            setGenderError('Vui lòng chọn giới tính');
            hasError = true;
        }

        if (!address.trim()) {
            setAddressError('Địa chỉ không được để trống');
            hasError = true;
        } else if (address.trim().length < 5) {
            setAddressError('Địa chỉ phải có ít nhất 5 ký tự');
            hasError = true;
        }

        if (method !== 'email' && !AuthService.validateEmail(profileEmail)) {
            setProfileEmailError('Email không hợp lệ');
            hasError = true;
        }

        if (method !== 'phone' && !AuthService.validatePhoneNumber(profilePhone)) {
            setProfilePhoneError('Số điện thoại phải có 10 chữ số và bắt đầu bằng 0');
            hasError = true;
        }

        if (hasError) {
            toast.error('Vui lòng kiểm tra lại thông tin!');
            return;
        }

        setIsSubmitting(true);

        const registerData: RegisterRequest = {
            email: profileEmail,
            phoneNumber: profilePhone,
            password,
            confirmPassword,
            fullName,
            gender: gender as Gender,
            address,
            birthday: birthday, // Keep as YYYY-MM-DD format
            channel: method,
            purpose: 'REGISTER',
            proof: otpProof,
            issuedAt: otpIssuedAt,
        };

        try {
            await dispatch(registerAsync(registerData)).unwrap();

            // Registration successful, redirect to home
            toast.success('Đăng ký thành công! Chào mừng bạn đến với Doccure!');
            navigate('/login');
        } catch (error) {
            console.error('Registration error:', error);
            if (method === 'phone') {
                toast.error('Độ tuổi không hợp lệ hoặc email này đã được đăng ký tài khoản.');
            } else {
                toast.error(
                    'Độ tuổi không hợp lệ hoặc số điện thoại này đã được đăng ký tài khoản.'
                );
            }
        } finally {
            setIsSubmitting(false);
        }
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
                <StepWizard
                    steps={[
                        { id: 1, title: 'Xác thực' },
                        { id: 2, title: 'Mật khẩu' },
                        { id: 3, title: 'Hoàn tất' },
                    ]}
                    currentStep={step}
                    className="mb-4"
                />
            )}

            {/* Step 0: Initial registration */}
            {step === 0 && (
                <div>
                    {/* Method toggle */}
                    <div className="d-flex justify-content-center mb-3">
                        <div className={clsx('method-toggle')}>
                            <button
                                type="button"
                                className={clsx(
                                    'toggle-btn',
                                    method === 'phone' && 'toggle-btn-active'
                                )}
                                onClick={() => setMethod('phone')}
                            >
                                <Phone size={16} className="me-2" />
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
                                <Mail size={16} className="me-2" />
                                Email
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleSendOtp}>
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

                        <Button
                            text={isSending ? 'Đang gửi...' : 'Gửi mã OTP'}
                            type="submit"
                            isDisabled={!canSendOtp || isSending}
                            className="w-100 fw-bold"
                        />
                    </form>

                    <SocialLogin
                        onSuccess={handleSocialSuccess}
                        onError={handleSocialError}
                        isDisabled={isSending}
                    />

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
                                    onClick={handleResendOtp}
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
                            <Input
                                id="reg-password"
                                name="password"
                                label="Mật khẩu"
                                type="password"
                                placeholder="Nhập mật khẩu"
                                leftIcon={<i className="feather-lock" />}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                showPasswordToggle
                                isPasswordVisible={showPassword}
                                onTogglePassword={() => togglePasswordVisibility('password')}
                            />

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
                                    <div className={'strength-bar'}>
                                        <div
                                            className={'strength-fill'}
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
                            <Input
                                id="reg-confirm"
                                label="Xác nhận mật khẩu"
                                type="password"
                                className={clsx(
                                    confirmPassword && confirmPassword === password
                                        ? 'border-success'
                                        : ''
                                )}
                                placeholder="Nhập lại mật khẩu mới"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                leftIcon={<i className="feather-lock" />}
                                showPasswordToggle
                                isPasswordVisible={showConfirmPassword}
                                onTogglePassword={() => togglePasswordVisibility('confirm')}
                            />
                            {confirmPassword && password === confirmPassword && (
                                <div className="d-flex align-items-center mt-2 text-success">
                                    <CheckCircle size={16} className="me-2" />
                                    <span>Mật khẩu trùng khớp</span>
                                </div>
                            )}
                        </div>
                        {/* Password Requirements */}
                        <div className="mb-3">
                            <div className={'requirements-list'}>
                                <span className="mb-1" style={{ fontWeight: 600 }}>
                                    Yêu cầu mật khẩu:
                                </span>
                                <div className={'requirement-item'}>
                                    <span className={'requirement-icon'}>
                                        {passwordRequirements.hasMinLength ? (
                                            <CheckCircle size={16} className="text-success" />
                                        ) : (
                                            <CheckCircle size={16} className="text-muted" />
                                        )}
                                    </span>
                                    <span
                                        className={clsx(
                                            'requirement-text',
                                            passwordRequirements.hasMinLength
                                                ? 'text-success'
                                                : 'text-muted'
                                        )}
                                    >
                                        Ít nhất 8 ký tự
                                    </span>
                                </div>
                                <div className={'requirement-item'}>
                                    <span className={'requirement-icon'}>
                                        {passwordRequirements.hasUppercase ? (
                                            <CheckCircle size={16} className="text-success" />
                                        ) : (
                                            <CheckCircle size={16} className="text-muted" />
                                        )}
                                    </span>
                                    <span
                                        className={clsx(
                                            'requirement-text',
                                            passwordRequirements.hasUppercase
                                                ? 'text-success'
                                                : 'text-muted'
                                        )}
                                    >
                                        Một chữ hoa
                                    </span>
                                </div>
                                <div className={'requirement-item'}>
                                    <span className={'requirement-icon'}>
                                        {passwordRequirements.hasLowercase ? (
                                            <CheckCircle size={16} className="text-success" />
                                        ) : (
                                            <CheckCircle size={16} className="text-muted" />
                                        )}
                                    </span>
                                    <span
                                        className={clsx(
                                            'requirement-text',
                                            passwordRequirements.hasLowercase
                                                ? 'text-success'
                                                : 'text-muted'
                                        )}
                                    >
                                        Một chữ thường
                                    </span>
                                </div>
                                <div className={'requirement-item'}>
                                    <span className={'requirement-icon'}>
                                        {passwordRequirements.hasNumber ? (
                                            <CheckCircle size={16} className="text-success" />
                                        ) : (
                                            <CheckCircle size={16} className="text-muted" />
                                        )}
                                    </span>
                                    <span
                                        className={clsx(
                                            'requirement-text',
                                            passwordRequirements.hasNumber
                                                ? 'text-success'
                                                : 'text-muted'
                                        )}
                                    >
                                        Một số
                                    </span>
                                </div>
                                <div className={'requirement-item'}>
                                    <span className={'requirement-icon'}>
                                        {passwordRequirements.hasSpecialChar ? (
                                            <CheckCircle size={16} className="text-success" />
                                        ) : (
                                            <CheckCircle size={16} className="text-muted" />
                                        )}
                                    </span>
                                    <span
                                        className={clsx(
                                            'requirement-text',
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
                        <Button
                            text="Tạo mật khẩu"
                            type="submit"
                            isDisabled={!canCreatePassword}
                            className="w-100 fw-medium"
                        />
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
                                    <Input
                                        label="Họ và tên"
                                        isRequired
                                        type="text"
                                        leftIcon={<User size={18} />}
                                        value={fullName}
                                        onChange={(e) => handleFullNameChange(e.target.value)}
                                        className={clsx('rounded-3', styles.inputCustom)}
                                        style={{ paddingLeft: 48 }}
                                        placeholder="Nhập họ và tên đầy đủ"
                                        error={fullNameError}
                                    />
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
                                    <Select<{ value: Gender; label: string }>
                                        options={[
                                            { value: Gender.MALE, label: 'Nam' },
                                            { value: Gender.FEMALE, label: 'Nữ' },
                                            { value: Gender.OTHER, label: 'Khác' },
                                        ]}
                                        value={
                                            gender === ''
                                                ? undefined
                                                : {
                                                      value: gender,
                                                      label: getGenderLabel(gender),
                                                  }
                                        }
                                        onChange={(selected) => {
                                            handleGenderChange(selected?.value ?? '');
                                        }}
                                        placeholder="Chọn giới tính"
                                        className={clsx(
                                            'react-select-container',
                                            genderError && 'is-invalid'
                                        )}
                                        classNamePrefix="react-select"
                                        isClearable={false}
                                        styles={{
                                            control: (base) => ({
                                                ...base,
                                                borderRadius: '8px',
                                                borderColor: '#e5e7eb',
                                                boxShadow: 'none',
                                                height: '45px',
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
                                    {genderError && (
                                        <div className="invalid-feedback d-block">
                                            {genderError}
                                        </div>
                                    )}
                                </div>
                                {/* Phone */}
                                <div className="mb-3">
                                    <Input
                                        label="Số điện thoại"
                                        isRequired
                                        type="tel"
                                        inputMode="numeric"
                                        leftIcon={<i className="feather-phone" />}
                                        value={profilePhone}
                                        onChange={handleProfilePhoneChange2}
                                        onKeyDown={handleProfilePhoneKeyDown}
                                        onPaste={handleProfilePhonePaste}
                                        className={clsx('rounded-3')}
                                        placeholder="Nhập số điện thoại"
                                        disabled={method === 'phone'}
                                        error={profilePhoneError}
                                    />
                                    {method === 'phone' && !profilePhoneError && (
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
                                            value={birthday}
                                            onChange={(e) => handleBirthdayChange(e.target.value)}
                                            className={clsx(
                                                'form-control rounded-3',
                                                styles.inputCustom,
                                                birthdayError && 'is-invalid'
                                            )}
                                            style={{
                                                paddingLeft: 16,
                                                paddingRight: 16,
                                                height: '45px',
                                            }}
                                            max={new Date().toISOString().split('T')[0]}
                                        />
                                    </div>
                                    {birthdayError && (
                                        <div className="invalid-feedback d-block">
                                            {birthdayError}
                                        </div>
                                    )}
                                </div>

                                {/* Email */}
                                <div className="mb-3">
                                    <Input
                                        label="Email"
                                        isRequired
                                        type="email"
                                        leftIcon={<i className="feather-mail" />}
                                        value={profileEmail}
                                        onChange={(e) => handleProfileEmailChange(e.target.value)}
                                        className={clsx('rounded-3')}
                                        placeholder="Nhập địa chỉ email"
                                        disabled={method === 'email'}
                                        error={profileEmailError}
                                    />
                                    {method === 'email' && !profileEmailError && (
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
                                        onChange={(e) => handleAddressChange(e.target.value)}
                                        className={clsx(
                                            'form-control rounded-3',
                                            styles.inputCustom,
                                            addressError && 'is-invalid'
                                        )}
                                        rows={2}
                                        placeholder="Nhập địa chỉ đầy đủ"
                                        style={{
                                            paddingLeft: 16,
                                            paddingRight: 16,
                                            paddingTop: 12,
                                            paddingBottom: 12,
                                        }}
                                    />
                                    {addressError && (
                                        <div className="invalid-feedback d-block">
                                            {addressError}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Error message */}
                        {error && (
                            <div className="alert alert-danger text-center mb-3" role="alert">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting || isLoading}
                            className={clsx('btn w-100 fw-medium btn-primary-gradient')}
                        >
                            {isSubmitting || isLoading ? (
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
