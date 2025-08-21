import { useState, useMemo } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import AuthLayout from '@/layouts/AuthLayout';
import { CheckCircle, Shield } from 'lucide-react';
import clsx from 'clsx';
import Button from '~/components/Button';

interface ResetPasswordProps {
    onSubmit?: (currentPassword: string, newPassword: string) => void;
}

const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

const ResetPassword: React.FC<ResetPasswordProps> = ({ onSubmit }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isHuman, setIsHuman] = useState(false);
    const [showCaptcha, setShowCaptcha] = useState(false);

    // Password visibility states
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Password requirements validation
    const passwordRequirements = useMemo(() => {
        const hasMinLength = newPassword.length >= 8;
        const hasUppercase = /[A-Z]/.test(newPassword);
        const hasLowercase = /[a-z]/.test(newPassword);
        const hasNumber = /\d/.test(newPassword);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

        return {
            hasMinLength,
            hasUppercase,
            hasLowercase,
            hasNumber,
            hasSpecialChar,
            allMet: hasMinLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar,
        };
    }, [newPassword]);

    // Password strength calculation
    const passwordStrength = useMemo(() => {
        if (!newPassword) return { score: 0, label: '', color: '', width: 0 };

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
    }, [newPassword, passwordRequirements]);

    const canSubmit = useMemo(() => {
        const hasCurrentPassword = currentPassword.trim() !== '';
        const hasNewPassword = newPassword.trim() !== '';
        const hasConfirmPassword = confirmPassword.trim() !== '';
        const passwordsMatch = newPassword === confirmPassword;
        const newPasswordValid = passwordRequirements.allMet;
        const isCaptchaValid = isHuman;

        return (
            hasCurrentPassword &&
            hasNewPassword &&
            hasConfirmPassword &&
            passwordsMatch &&
            newPasswordValid &&
            isCaptchaValid
        );
    }, [currentPassword, newPassword, confirmPassword, passwordRequirements.allMet, isHuman]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (canSubmit && onSubmit) {
            onSubmit(currentPassword, newPassword);
        }
    };

    const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
        switch (field) {
            case 'current':
                setShowCurrentPassword(!showCurrentPassword);
                break;
            case 'new':
                setShowNewPassword(!showNewPassword);
                break;
            case 'confirm':
                setShowConfirmPassword(!showConfirmPassword);
                break;
        }
    };

    return (
        <AuthLayout title="Đặt lại mật khẩu" subtitle="Tạo mật khẩu mới cho tài khoản của bạn">
            <div
                style={{
                    width: '4rem',
                    height: '4rem',
                    backgroundColor: '#DBEAFE',
                    borderRadius: '9999px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    marginBottom: '1rem',
                }}
            >
                <Shield
                    style={{
                        width: '2rem',
                        height: '2rem',
                        color: '#2563EB',
                    }}
                />
            </div>

            <form onSubmit={handleSubmit}>
                {/* Current Password */}
                <div className="mb-3">
                    <label className="form-label">Mật khẩu hiện tại</label>
                    <div className={clsx('auth-input-group')}>
                        <i className={clsx('feather-lock', 'left-icon')}></i>
                        <input
                            type={showCurrentPassword ? 'text' : 'password'}
                            className={clsx('form-control')}
                            placeholder="Nhập mật khẩu hiện tại"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            onFocus={() => setShowCaptcha(true)}
                        />

                        <span
                            role="button"
                            aria-label={showCurrentPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                            onClick={() => togglePasswordVisibility('current')}
                            className={clsx(
                                showCurrentPassword ? 'feather-eye' : 'feather-eye-off',
                                'toggle-password'
                            )}
                        />
                    </div>
                </div>

                {/* New Password */}
                <div className="mb-3">
                    <label className="form-label">Mật khẩu mới</label>
                    <div className={clsx('auth-input-group')}>
                        <i className={clsx('feather-lock', 'left-icon')}></i>
                        <input
                            type={showNewPassword ? 'text' : 'password'}
                            className={clsx('form-control')}
                            placeholder="Nhập mật khẩu mới"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <span
                            role="button"
                            aria-label={showNewPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                            onClick={() => togglePasswordVisibility('new')}
                            className={clsx(
                                showNewPassword ? 'feather-eye' : 'feather-eye-off',
                                'toggle-password'
                            )}
                        />
                    </div>

                    {/* Password Strength Indicator */}
                    {newPassword && (
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

                {/* Confirm Password */}
                <div className="mb-3">
                    <label className="form-label">Xác nhận mật khẩu mới</label>
                    <div className={clsx('auth-input-group')}>
                        <i className={clsx('feather-lock', 'left-icon')}></i>
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            className={clsx(
                                'form-control',
                                confirmPassword && confirmPassword === newPassword
                                    ? 'border-success'
                                    : ''
                            )}
                            placeholder="Nhập lại mật khẩu mới"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <span
                            role="button"
                            aria-label={showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                            onClick={() => togglePasswordVisibility('confirm')}
                            className={clsx(
                                showConfirmPassword ? 'feather-eye' : 'feather-eye-off',
                                'toggle-password'
                            )}
                        />
                    </div>
                    {confirmPassword && newPassword === confirmPassword && (
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
                                    passwordRequirements.hasNumber ? 'text-success' : 'text-muted'
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

                {/* Captcha */}
                {showCaptcha && (
                    <div className="mb-3">
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

                {/* Submit Button */}
                <div className="mb-1 mt-3">
                    <Button
                        text="Đặt lại mật khẩu"
                        type="submit"
                        isDisabled={!canSubmit}
                        className="w-100 fw-bold"
                    />
                </div>
            </form>
        </AuthLayout>
    );
};

export default ResetPassword;
