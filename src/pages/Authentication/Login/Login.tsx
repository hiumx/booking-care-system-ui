import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '@/layouts/AuthLayout';
import clsx from 'clsx';
import styles from './Login.module.scss';
import { PATHS } from '@/routes/paths';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { SocialLogin } from '@/components/SocialLogin';
import { LoginRequest } from '@/types/auth.types';
import { useAuth } from '@/hooks/useAuth';
import { usePhoneInput } from '@/hooks/usePhoneInput';
import { AuthService } from '@/services/auth.service';
import { toast } from 'react-toastify';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const { login, isLoading, error, isAuthenticated, clearError } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [method, setMethod] = useState<'email' | 'phone'>('phone');

    // Use phone input hook
    const { phone, handlePhoneChange, handlePhonePaste, handlePhoneKeyDown, isPhoneValid } =
        usePhoneInput();

    // Validation logic for form submission
    const canSubmit = useMemo(() => {
        // Validate password (must not be empty)
        const validPassword = password.trim().length > 0;

        // Validate email using AuthService
        const validEmail = email.trim() && AuthService.validateEmail(email);

        // Validate phone using hook (exactly 10 digits starting with 0)
        const validPhone = isPhoneValid();

        // Check if the selected method has valid input
        const validIdentifier = method === 'email' ? validEmail : validPhone;

        return validIdentifier && validPassword;
    }, [method, email, phone, password, isPhoneValid]);

    // Social login handlers
    const handleSocialSuccess = () => navigate(PATHS.HOME);
    const handleSocialError = (error: any) => console.error('Social login error:', error);

    // Clear error when component mounts or method changes
    useEffect(() => {
        clearError();
    }, [clearError, method]);

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate(PATHS.HOME);
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const credentials: LoginRequest = {
            password,
            ...(method === 'email' ? { email } : { phoneNumber: phone }),
        };

        try {
            await login(credentials);
            toast.success('Đăng nhập thành công!');
            navigate(PATHS.HOME);
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    return (
        <AuthLayout
            title="Đăng nhập tài khoản"
            subtitle="Trở lại với hành trình chăm sóc sức khỏe của bạn"
        >
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
                            <i className="feather-phone me-2"></i>
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
                            <i className="feather-mail me-2"></i>
                            Email
                        </button>
                    </div>
                </div>

                {/* Email / Phone input */}
                <div className="mb-3">
                    {method === 'email' ? (
                        <Input
                            id="email"
                            name="email"
                            label="Email"
                            type="email"
                            placeholder="Nhập địa chỉ email"
                            leftIcon={<i className="feather-mail" />}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            wrapVariant="email"
                        />
                    ) : (
                        <Input
                            id="phone"
                            name="phone"
                            label="Số điện thoại"
                            type="tel"
                            inputMode="numeric"
                            placeholder="Nhập số điện thoại"
                            leftIcon={<i className="feather-phone" />}
                            value={phone}
                            onChange={handlePhoneChange}
                            onKeyDown={handlePhoneKeyDown}
                            onPaste={handlePhonePaste}
                        />
                    )}
                </div>

                {/* Password input */}
                <div className="mb-3">
                    <Input
                        id="password"
                        name="password"
                        label="Mật khẩu"
                        type="password"
                        placeholder="Nhập mật khẩu"
                        leftIcon={<i className="feather-lock" />}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        showPasswordToggle
                        isPasswordVisible={showPassword}
                        onTogglePassword={(v) => setShowPassword(v)}
                    />
                </div>

                {/* Remember me & Forgot password */}
                <div className="mb-3 form-check-box">
                    <div className={styles.inlineBetween}>
                        <div className="form-check mb-0">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="remember"
                                defaultChecked
                            />
                            <label className="form-check-label" htmlFor="remember">
                                Ghi nhớ đăng nhập
                            </label>
                        </div>
                        <Link to={PATHS.FORGOT_PASSWORD} className={clsx(styles.forgotPassword)}>
                            Quên mật khẩu?
                        </Link>
                    </div>
                </div>

                {/* Error message */}
                {error && (
                    <div className="alert alert-danger text-center mb-3" role="alert">
                        {error}
                    </div>
                )}

                {/* Submit */}
                <div className="mb-3">
                    <Button
                        text={isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                        type="submit"
                        className="w-100"
                        isDisabled={isLoading || !canSubmit}
                    />
                </div>

                {/* Social login */}
                <SocialLogin
                    onSuccess={handleSocialSuccess}
                    onError={handleSocialError}
                    isDisabled={isLoading}
                />

                {/* Register link */}
                <div className="account-signup">
                    <p>
                        Chưa có tài khoản? <Link to={PATHS.REGISTER}>Đăng ký</Link>
                    </p>
                </div>
            </form>
        </AuthLayout>
    );
};

export default Login;
