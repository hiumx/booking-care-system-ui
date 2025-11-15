import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Lock, User, CheckCircle, Mail } from 'lucide-react';
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
import { useOtpInput } from '@/hooks/useOtpInput';
import { usePasswordValidation } from '@/hooks/usePasswordValidation';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import { PasswordStrengthIndicator } from '@/components/PasswordStrengthIndicator';
import { PasswordRequirementsList } from '@/components/PasswordRequirementsList';
import {
    AuthContactMethodForm,
    createAuthContactMethodFormProps,
} from '@/components/Auth/AuthContactMethodForm';
import { OtpInputGrid } from '@/components/Auth/OtpInputGrid';
import { toast } from 'react-toastify';
import { NAME_REGEX } from '@/constants';
import { Gender } from '@/enums/common.enums';
import { validateAge } from '@/utils/validation';

type Step = 0 | 1 | 2 | 3;

const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
const deviceId = import.meta.env.VITE_DEVICE_ID || 'booking-care-web-client';
const OTP_LENGTH = 6;

const Register: React.FC = () => {
    const { t } = useTranslation('auth');
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { isLoading, error } = useSelector((state: RootState) => state.auth);

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

    // Use auth redirect hook
    useAuthRedirect();

    // Step 1: OTP
    const { otp, otpValue, otpRefs, canVerifyOtp, handleOtpChange, handleOtpKeyDown, resetOtp } =
        useOtpInput({ length: OTP_LENGTH });
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

    // Use password validation hook
    const { passwordRequirements, passwordStrength } = usePasswordValidation({
        password,
        translationPrefix: 'register',
    });

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
                return t('register.genderMale');
            case Gender.FEMALE:
                return t('register.genderFemale');
            case Gender.OTHER:
                return t('register.genderOther');
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

    const canSendOtp = useMemo(() => {
        // Use AuthService for consistent email validation
        const validEmail = email.trim() && AuthService.validateEmail(email);

        // Use phone validation from hook (must be exactly 10 digits starting with 0)
        const validPhone = isPhoneValid();

        // Check if the selected method has valid input
        const validIdentifier = method === 'phone' ? validPhone : validEmail;

        return validIdentifier && isHuman && agree;
    }, [method, email, isPhoneValid, isHuman, agree]);

    // Validation handlers for step 3 fields
    const handleFullNameChange = (value: string) => {
        setFullName(value);
        if (!value.trim()) {
            setFullNameError('Họ và tên không được để trống');
        } else if (value.trim().length < 2) {
            setFullNameError('Họ và tên phải có ít nhất 2 ký tự');
        } else {
            const hasNumbers = NAME_REGEX.NO_NUMBERS.test(value);
            if (hasNumbers) {
                setFullNameError('');
            } else {
                setFullNameError('Họ và tên không được chứa số');
            }
        }
    };

    const handleBirthdayChange = (value: string) => {
        setBirthday(value);
        if (!value.trim()) {
            setBirthdayError('Ngày sinh không được để trống');
        } else if (new Date(value) > new Date()) {
            setBirthdayError('Ngày sinh không thể là ngày trong tương lai');
        } else {
            const isAgeValid = validateAge(value);
            if (isAgeValid) {
                setBirthdayError('');
            } else {
                setBirthdayError('Bạn phải từ 18 tuổi trở lên');
            }
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

        if (value.trim()) {
            const isEmailValid = AuthService.validateEmail(value);
            if (isEmailValid) {
                setProfileEmailError('');
            } else {
                setProfileEmailError('Email không hợp lệ');
            }
        } else {
            setProfileEmailError('');
        }
    };

    const handleProfilePhoneChange2 = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleProfilePhoneChange(e);
        const value = e.target.value;

        if (method === 'phone') return; // Skip validation if phone is used for registration

        if (value.trim()) {
            const isPhoneValid = AuthService.validatePhoneNumber(value);
            if (isPhoneValid) {
                setProfilePhoneError('');
            } else {
                setProfilePhoneError('Số điện thoại phải có 10 chữ số và bắt đầu bằng 0');
            }
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
            resetOtp();
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

    // Helper: Validate all registration fields
    const validateRegistrationFields = (): boolean => {
        let hasError = false;

        // Validate fullName
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

        // Validate birthday
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

        // Validate gender
        if (gender === '') {
            setGenderError('Vui lòng chọn giới tính');
            hasError = true;
        }

        // Validate address
        if (!address.trim()) {
            setAddressError('Địa chỉ không được để trống');
            hasError = true;
        } else if (address.trim().length < 5) {
            setAddressError('Địa chỉ phải có ít nhất 5 ký tự');
            hasError = true;
        }

        // Validate email (if not primary method)
        if (method !== 'email' && !AuthService.validateEmail(profileEmail)) {
            setProfileEmailError('Email không hợp lệ');
            hasError = true;
        }

        // Validate phone (if not primary method)
        if (method !== 'phone' && !AuthService.validatePhoneNumber(profilePhone)) {
            setProfilePhoneError('Số điện thoại phải có 10 chữ số và bắt đầu bằng 0');
            hasError = true;
        }

        return hasError;
    };

    const handleCompleteRegistration = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate all fields
        if (validateRegistrationFields()) {
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
            birthday: birthday,
            channel: method,
            purpose: 'REGISTER',
            proof: otpProof,
            issuedAt: otpIssuedAt,
        };

        try {
            await dispatch(registerAsync(registerData)).unwrap();
            toast.success(t('register.success'));
            navigate('/login');
        } catch (error) {
            console.error('Registration error:', error);
            const errorMsg =
                method === 'phone'
                    ? t('register.errorAgeOrDuplicatePhone')
                    : t('register.errorAgeOrDuplicateEmail');
            toast.error(errorMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getStepTitle = () => {
        switch (step) {
            case 0:
                return t('register.title');
            case 1:
                return t('register.otpTitle');
            case 2:
                return t('register.passwordTitle');
            case 3:
                return t('register.profileTitle');
            default:
                return t('register.title');
        }
    };

    const getStepSubtitle = () => {
        switch (step) {
            case 0:
                return t('register.subtitle');
            case 1:
                return t('register.otpSubtitle');
            case 2:
                return t('register.passwordSubtitle');
            case 3:
                return t('register.profileSubtitle');
            default:
                return t('register.subtitle');
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
                        { id: 1, title: t('register.stepVerification') },
                        { id: 2, title: t('register.stepPassword') },
                        { id: 3, title: t('register.stepComplete') },
                    ]}
                    currentStep={step}
                    className="mb-4"
                />
            )}

            {/* Step 0: Initial registration */}
            {step === 0 && (
                <div>
                    <form onSubmit={handleSendOtp}>
                        <AuthContactMethodForm
                            {...createAuthContactMethodFormProps({
                                method,
                                phone,
                                email,
                                showCaptcha,
                                isHuman,
                                setMethod,
                                handlePhoneChange,
                                setEmail,
                                handlePhoneKeyDown,
                                handlePhonePaste,
                                setShowCaptcha,
                                setIsHuman,
                                translations: {
                                    phoneLabel: t('register.phone'),
                                    phonePlaceholder: t('register.phonePlaceholder'),
                                    emailLabel: t('register.addressEmail'),
                                    emailPlaceholder: t('register.emailPlaceholder'),
                                    phoneToggleLabel: t('register.phone'),
                                    emailToggleLabel: t('register.email'),
                                    notRobotLabel: t('common.notRobot', 'Tôi không phải là robot'),
                                },
                                captchaId: 'register-captcha',
                                siteKey: siteKey ?? undefined,
                            })}
                        />

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
                                {t('register.agreeTerms')}{' '}
                                <Link to="/terms" className="text-primary">
                                    {t('register.termsOfService')}
                                </Link>{' '}
                                {t('register.and')}{' '}
                                <Link to="/privacy" className="text-primary">
                                    {t('register.privacyPolicy')}
                                </Link>
                            </label>
                        </div>

                        <Button
                            text={isSending ? t('register.sending') : t('register.sendOtp')}
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
                            {t('register.hasAccount')}{' '}
                            <Link to={PATHS.LOGIN}>{t('register.login')}</Link>
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
                            {t('register.otpSentTo')}{' '}
                            <span className="fw-medium text-dark">
                                {method === 'phone' ? phone : email}
                            </span>
                        </p>
                    </div>

                    <form onSubmit={handleVerifyOtp}>
                        <OtpInputGrid
                            otp={otp}
                            otpRefs={otpRefs}
                            onChange={handleOtpChange}
                            onKeyDown={handleOtpKeyDown}
                            containerClassName="d-flex justify-content-center gap-2"
                            baseInputClassName="text-center fw-bold"
                            inputStyle={{
                                width: 48,
                                height: 56,
                                fontSize: 20,
                                borderRadius: 8,
                                border: '2px solid #e5e7eb',
                            }}
                        />

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
                                    {t('register.verifying')}
                                </>
                            ) : (
                                <>{t('register.verifyOtp')}</>
                            )}
                        </button>

                        <div
                            className="d-flex justify-content-center align-items-center mt-3 text-muted"
                            style={{ gap: 2 }}
                        >
                            <p>{t('register.otpNotReceived')}</p>
                            {countdown > 0 ? (
                                <p className="text-primary">
                                    ({t('register.resendIn')} {countdown}s)
                                </p>
                            ) : (
                                <button
                                    type="button"
                                    className="btn btn-link p-0"
                                    onClick={handleResendOtp}
                                    style={{ marginBottom: 14 }}
                                >
                                    {'(' + t('register.resendOtp') + ')'}
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
                        <p className="text-muted">{t('register.passwordSubtitle')}</p>
                    </div>

                    <form onSubmit={handleCreatePassword}>
                        <div className="mb-3">
                            <Input
                                id="reg-password"
                                name="password"
                                label={t('register.password')}
                                type="password"
                                placeholder={t('register.passwordPlaceholder')}
                                leftIcon={<i className="feather-lock" />}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                showPasswordToggle
                                isPasswordVisible={showPassword}
                                onTogglePassword={() => togglePasswordVisibility('password')}
                            />

                            <PasswordStrengthIndicator
                                password={password}
                                passwordStrength={passwordStrength}
                                translationPrefix="register"
                            />
                        </div>

                        <div className="mb-3">
                            <Input
                                id="reg-confirm"
                                label={t('register.confirmPassword')}
                                type="password"
                                className={clsx(
                                    confirmPassword && confirmPassword === password
                                        ? 'border-success'
                                        : ''
                                )}
                                placeholder={t('register.confirmPasswordPlaceholder')}
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
                            <PasswordRequirementsList
                                passwordRequirements={passwordRequirements}
                                translationPrefix="register"
                            />
                        </div>
                        <Button
                            text={t('register.createPassword')}
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
                                        label={t('register.fullName')}
                                        isRequired
                                        type="text"
                                        leftIcon={<User size={18} />}
                                        value={fullName}
                                        onChange={(e) => handleFullNameChange(e.target.value)}
                                        className={clsx('rounded-3', styles.inputCustom)}
                                        style={{ paddingLeft: 48 }}
                                        placeholder={t('register.fullNamePlaceholder')}
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
                                        {t('register.gender')}{' '}
                                        <span className="text-danger">*</span>
                                    </label>
                                    <Select<{ value: Gender; label: string }>
                                        options={[
                                            { value: Gender.MALE, label: t('register.genderMale') },
                                            {
                                                value: Gender.FEMALE,
                                                label: t('register.genderFemale'),
                                            },
                                            {
                                                value: Gender.OTHER,
                                                label: t('register.genderOther'),
                                            },
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
                                        placeholder={t('register.genderPlaceholder')}
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
                                        label={t('register.phone')}
                                        isRequired
                                        type="tel"
                                        inputMode="numeric"
                                        leftIcon={<i className="feather-phone" />}
                                        value={profilePhone}
                                        onChange={handleProfilePhoneChange2}
                                        onKeyDown={handleProfilePhoneKeyDown}
                                        onPaste={handleProfilePhonePaste}
                                        className={clsx('rounded-3')}
                                        placeholder={t('register.phonePlaceholder')}
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
                                        {t('register.dateOfBirth')}{' '}
                                        <span className="text-danger">*</span>
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
                                        label={t('register.email')}
                                        isRequired
                                        type="email"
                                        leftIcon={<i className="feather-mail" />}
                                        value={profileEmail}
                                        onChange={(e) => handleProfileEmailChange(e.target.value)}
                                        className={clsx('rounded-3')}
                                        placeholder={t('register.emailPlaceholder')}
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
                                        {t('register.address')}{' '}
                                        <span className="text-danger">*</span>
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
                                        placeholder={t('register.addressPlaceholder')}
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
                                    {t('register.submitting')}
                                </>
                            ) : (
                                <>{t('register.submit')}</>
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
