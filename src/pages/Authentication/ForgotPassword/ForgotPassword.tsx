import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import AuthLayout from '@/layouts/AuthLayout';
import { Mail } from 'lucide-react';
import clsx from 'clsx';
import { PATHS } from '~/routes/paths';
import Button from '~/components/Button';
import Input from '~/components/Input';

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
        <AuthLayout
            title="Quên mật khẩu"
            subtitle="Nhập email hoặc số điện thoại để khôi phục quyền truy cập vào tài khoản"
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
                            onChange={(e) => setPhone(e.target.value)}
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
                <div className="mb-3 mt-3">
                    <Button
                        text="Đặt lại mật khẩu"
                        type="submit"
                        isDisabled={!canSend}
                        className="w-100 fw-bold"
                    />
                </div>
                <div className="account-signup">
                    <p>
                        Đã nhớ mật khẩu? <Link to={PATHS.LOGIN}>Đăng nhập ngay</Link>
                    </p>
                </div>
            </form>
        </AuthLayout>
    );
};

export default ForgotPassword;
