import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import MainLayout from '@/layouts/MainLayout';
import { Mail } from 'lucide-react';
import Banner from '@/assets/img/login-banner.png';
import clsx from 'clsx';
import styles from './ForgotPassword.module.scss';

interface ForgotPasswordProps {
    onSubmit?: (email: string, phone: string) => void;
}

const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onSubmit }) => {
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [method, setMethod] = useState<'email' | 'phone'>('phone');
    const [isHuman, setIsHuman] = useState(false);
    const [showCaptcha, setShowCaptcha] = useState(false);

    const canSend = useMemo(() => {
        const numericPhone = phone.replace(/\D/g, '');
        const validEmail = /.+@.+\..+/.test(email);
        const validIdentifier = method === 'phone' ? numericPhone.length >= 9 : validEmail;
        return validIdentifier && isHuman;
    }, [method, phone, email, isHuman]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (canSend && onSubmit) {
            onSubmit(email, phone);
        }
    };

    return (
        <MainLayout>
            <div className="content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-8 offset-md-2">
                            {/* Forgot Password Content */}
                            <div className="account-content">
                                <div className="row align-items-center justify-content-center">
                                    <div className="col-md-7 col-lg-6 login-left">
                                        <img
                                            src={Banner}
                                            className="img-fluid"
                                            alt="Doccure Forgot Password"
                                        />
                                    </div>
                                    <div
                                        className={clsx(
                                            'col-md-12 col-lg-6 login-right',
                                            styles.forgotPasswordRight
                                        )}
                                    >
                                        <div className="text-center mb-4">
                                            <h1 className={clsx('fw-bold mb-2', styles.title)}>
                                                Quên mật khẩu
                                            </h1>
                                            <p className={styles.subtitle}>
                                                Nhập email hoặc số điện thoại để khôi phục quyền
                                                truy cập vào tài khoản
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
                                                        <i className="feather-phone me-1"></i>
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
                                                        <i className="feather-mail me-1"></i>
                                                        Email
                                                    </button>
                                                </div>
                                            </div>
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
                                                        type={method === 'phone' ? 'tel' : 'email'}
                                                        className={clsx(
                                                            'form-control',
                                                            styles.bigInput
                                                        )}
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
                                                                onChange={(e) =>
                                                                    setIsHuman(e.target.checked)
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
                                            <div className="mb-3 mt-3">
                                                <button
                                                    type="submit"
                                                    disabled={!canSend}
                                                    className={clsx(
                                                        'btn w-100 fw-bold',
                                                        styles.submitBtn,
                                                        canSend
                                                            ? 'btn-primary-gradient'
                                                            : 'btn-secondary disabled'
                                                    )}
                                                >
                                                    Xác nhận
                                                </button>
                                            </div>
                                            <div className="account-signup">
                                                <p>
                                                    Đã nhớ mật khẩu?{' '}
                                                    <Link to="/login">Đăng nhập ngay</Link>
                                                </p>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                            {/* /Forgot Password Content */}
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default ForgotPassword;
