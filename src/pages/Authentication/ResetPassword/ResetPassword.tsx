import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import AuthLayout from '@/layouts/AuthLayout';
import { CheckCircle, Shield } from 'lucide-react';
import clsx from 'clsx';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { resetPasswordAsync, clearError } from '@/store/slices/authSlice';
import { RootState, AppDispatch } from '@/store';
import { ResetPasswordRequest } from '@/types/auth.types';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-toastify';
import { PASSWORD_REGEX, PASSWORD_MIN_LENGTH } from '@/constants';
import { PATHS } from '@/routes/paths';

const ResetPassword: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { isLoading, error } = useSelector((state: RootState) => state.auth);
    const { isAuthenticated } = useAuth();

    // Get email and token from URL params
    const email = searchParams.get('email') || '';
    const resetToken = searchParams.get('token') || '';

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Password requirements validation
    const passwordRequirements = useMemo(() => {
        const hasMinLength = newPassword.length >= PASSWORD_MIN_LENGTH;
        const hasUppercase = PASSWORD_REGEX.UPPERCASE.test(newPassword);
        const hasLowercase = PASSWORD_REGEX.LOWERCASE.test(newPassword);
        const hasNumber = PASSWORD_REGEX.DIGIT.test(newPassword);
        const hasSpecialChar = PASSWORD_REGEX.SPECIAL_CHAR.test(newPassword);

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
        const hasEmail = email.trim() !== '';
        const hasResetToken = resetToken.trim() !== '';
        const hasNewPassword = newPassword.trim() !== '';
        const hasConfirmPassword = confirmPassword.trim() !== '';
        const passwordsMatch = newPassword === confirmPassword;
        const newPasswordValid = passwordRequirements.allMet;

        return (
            hasEmail &&
            hasResetToken &&
            hasNewPassword &&
            hasConfirmPassword &&
            passwordsMatch &&
            newPasswordValid
        );
    }, [email, resetToken, newPassword, confirmPassword, passwordRequirements.allMet]);

    // Check authentication and validate token/email
    useEffect(() => {
        if (isAuthenticated) {
            navigate(PATHS.HOME);
        }
        dispatch(clearError());
    }, [isAuthenticated, navigate, dispatch]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSubmit) return;

        const resetPasswordData: ResetPasswordRequest = {
            email,
            resetToken,
            newPassword,
            confirmNewPassword: confirmPassword,
        };

        try {
            await dispatch(resetPasswordAsync(resetPasswordData)).unwrap();

            toast.success('Đặt lại mật khẩu thành công!');
            // Redirect to login after 2 seconds
            setTimeout(() => {
                navigate(PATHS.LOGIN);
            }, 2000);
        } catch (error: any) {
            console.error('Reset password error:', error);
            toast.error(
                error.message ||
                    'Đặt lại mật khẩu thất bại. Link có thể đã hết hạn hoặc không hợp lệ.'
            );
        }
    };

    const togglePasswordVisibility = (field: 'new' | 'confirm') => {
        switch (field) {
            case 'new':
                setShowNewPassword(!showNewPassword);
                break;
            case 'confirm':
                setShowConfirmPassword(!showConfirmPassword);
                break;
        }
    };

    // Error state for invalid/missing token
    if (!resetToken || !email) {
        return (
            <AuthLayout
                title="Link không hợp lệ!"
                subtitle="Link đặt lại này không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu đặt lại
                            mật khẩu mới."
            >
                <div className="text-center">
                    <div
                        style={{
                            width: '4rem',
                            height: '4rem',
                            backgroundColor: '#FEE2E2',
                            borderRadius: '9999px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto',
                            marginBottom: '1.5rem',
                        }}
                    >
                        <i
                            className="feather-x-circle"
                            style={{
                                fontSize: '2rem',
                                color: '#DC2626',
                            }}
                        />
                    </div>

                    <div className="d-grid gap-2">
                        <Button
                            text="Yêu cầu đặt lại mới"
                            type="button"
                            className="w-100"
                            onClick={() => navigate(PATHS.FORGOT_PASSWORD)}
                        />
                    </div>
                </div>
            </AuthLayout>
        );
    }

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
                {/* New Password */}
                <div className="mb-3">
                    <Input
                        label="Mật khẩu mới"
                        type="password"
                        placeholder="Nhập mật khẩu mới"
                        leftIcon={<i className="feather-lock" />}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        showPasswordToggle
                        isPasswordVisible={showNewPassword}
                        onTogglePassword={() => togglePasswordVisibility('new')}
                    />

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
                    <Input
                        label="Xác nhận mật khẩu mới"
                        type="password"
                        placeholder="Nhập lại mật khẩu mới"
                        leftIcon={<i className="feather-lock" />}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={clsx(
                            confirmPassword && confirmPassword === newPassword
                                ? 'border-success'
                                : ''
                        )}
                        showPasswordToggle
                        isPasswordVisible={showConfirmPassword}
                        onTogglePassword={() => togglePasswordVisibility('confirm')}
                    />
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

                {/* Error message */}
                {error && (
                    <div className="alert alert-danger text-center mb-3" role="alert">
                        {error}
                    </div>
                )}

                {/* Submit Button */}
                <div className="mb-1 mt-3">
                    <Button
                        text={isLoading ? 'Đang đặt lại...' : 'Đặt lại mật khẩu'}
                        type="submit"
                        isDisabled={!canSubmit || isLoading}
                        className="w-100 fw-bold"
                    />
                </div>
            </form>
        </AuthLayout>
    );
};

export default ResetPassword;
