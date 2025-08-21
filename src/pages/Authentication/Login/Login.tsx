import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '@/layouts/AuthLayout';
import GoogleIcon from '@/assets/img/icons/google-icon.svg';
import FacebookIcon from '@/assets/img/icons/facebook-icon.svg';
import clsx from 'clsx';
import styles from './Login.module.scss';
import { PATHS } from '~/routes/paths';
import Button from '~/components/Button';
import Input from '~/components/Input';
interface LoginProps {
    onSubmit?: (credentials: {
        method: 'email' | 'phone';
        email?: string;
        phone?: string;
        password: string;
    }) => void;
}

const Login: React.FC<LoginProps> = ({ onSubmit }) => {
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [method, setMethod] = useState<'email' | 'phone'>('phone');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit?.({
            method,
            email: method === 'email' ? email : undefined,
            phone: method === 'phone' ? phone : undefined,
            password,
        });
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
                            inputMode="tel"
                            placeholder="Nhập số điện thoại"
                            leftIcon={<i className="feather-phone" />}
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
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
                        <Link to="/forgot-password" className={clsx(styles.forgotPassword)}>
                            Quên mật khẩu?
                        </Link>
                    </div>
                </div>

                {/* Submit */}
                <div className="mb-3">
                    <Button text="Đăng nhập" type="submit" className="w-100" />
                </div>

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
