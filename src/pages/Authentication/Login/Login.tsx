import { useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import Banner from '@/assets/img/login-banner.png';
import GoogleIcon from '@/assets/img/icons/google-icon.svg';
import FacebookIcon from '@/assets/img/icons/facebook-icon.svg';
import clsx from 'clsx';
import styles from './Login.module.scss';

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
        <MainLayout>
            <div className="content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-8 offset-md-2">
                            <div className="account-content">
                                <div className="row align-items-center justify-content-center">
                                    <div className="col-md-7 col-lg-6 login-left">
                                        <img
                                            src={Banner}
                                            className="img-fluid"
                                            alt="Login banner"
                                        />
                                    </div>
                                    <div
                                        className={clsx(
                                            'col-md-12 col-lg-6 login-right',
                                            styles.loginRight
                                        )}
                                    >
                                        <div className="text-center mb-4">
                                            <h1 className={clsx('fw-bold mb-2', styles.title)}>
                                                Đăng nhập tài khoản
                                            </h1>
                                            <p className={styles.subtitle}>
                                                Trở lại với hành trình chăm sóc sức khỏe của bạn
                                            </p>
                                        </div>
                                        <form onSubmit={handleSubmit}>
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
                                                        <i className="feather-phone me-2"></i>
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
                                                        <i className="feather-mail me-2"></i>
                                                        Email
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Email / Phone input */}
                                            <div className="mb-3">
                                                {method === 'email' ? (
                                                    <>
                                                        <label
                                                            className="form-label"
                                                            htmlFor="email"
                                                        >
                                                            Email
                                                        </label>
                                                        <div className={styles.inputGroup}>
                                                            <i
                                                                className={clsx(
                                                                    'feather-mail',
                                                                    styles.leftIcon
                                                                )}
                                                            ></i>
                                                            <input
                                                                id="email"
                                                                name="email"
                                                                type="email"
                                                                placeholder="Nhập địa chỉ email"
                                                                className="form-control"
                                                                value={email}
                                                                onChange={(e) =>
                                                                    setEmail(e.target.value)
                                                                }
                                                            />
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <label
                                                            className="form-label"
                                                            htmlFor="phone"
                                                        >
                                                            Số điện thoại
                                                        </label>
                                                        <div className={styles.inputGroup}>
                                                            <i
                                                                className={clsx(
                                                                    'feather-phone',
                                                                    styles.leftIcon
                                                                )}
                                                            ></i>
                                                            <input
                                                                id="phone"
                                                                name="phone"
                                                                type="tel"
                                                                inputMode="tel"
                                                                placeholder="Nhập số điện thoại"
                                                                className="form-control"
                                                                value={phone}
                                                                onChange={(e) =>
                                                                    setPhone(e.target.value)
                                                                }
                                                            />
                                                        </div>
                                                    </>
                                                )}
                                            </div>

                                            {/* Password input */}
                                            <div className="mb-3">
                                                <div className={clsx(styles.inlineBetween)}>
                                                    <label
                                                        className="form-label"
                                                        htmlFor="password"
                                                    >
                                                        Mật khẩu
                                                    </label>
                                                </div>
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
                                                        id="password"
                                                        name="password"
                                                        type={showPassword ? 'text' : 'password'}
                                                        placeholder="Nhập mật khẩu"
                                                        className="form-control"
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
                                                        onClick={() => setShowPassword((v) => !v)}
                                                        className={clsx(
                                                            showPassword
                                                                ? 'feather-eye'
                                                                : 'feather-eye-off',
                                                            styles.togglePassword
                                                        )}
                                                    />
                                                </div>
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
                                                        <label
                                                            className="form-check-label"
                                                            htmlFor="remember"
                                                        >
                                                            Ghi nhớ đăng nhập
                                                        </label>
                                                    </div>
                                                    <Link
                                                        to="/forgot-password"
                                                        className={clsx(styles.forgotPassword)}
                                                    >
                                                        Quên mật khẩu?
                                                    </Link>
                                                </div>
                                            </div>

                                            {/* Submit */}
                                            <div className="mb-3">
                                                <button
                                                    className="btn btn-primary-gradient w-100"
                                                    type="submit"
                                                >
                                                    Đăng nhập
                                                </button>
                                            </div>

                                            {/* Social login */}
                                            <div className="login-or">
                                                <span className="or-line"></span>
                                                <span className="span-or">hoặc</span>
                                            </div>
                                            <div className="social-login-btn">
                                                <button type="button" className="btn w-100">
                                                    <img src={GoogleIcon} alt="google-icon" /> Đăng
                                                    nhập với Google
                                                </button>
                                                <button type="button" className="btn w-100">
                                                    <img src={FacebookIcon} alt="fb-icon" /> Đăng
                                                    nhập với Facebook
                                                </button>
                                            </div>

                                            {/* Register link */}
                                            <div className="account-signup">
                                                <p>
                                                    Chưa có tài khoản?{' '}
                                                    <Link to="/register">Đăng ký</Link>
                                                </p>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                            {/* /Login Tab Content */}
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default Login;
