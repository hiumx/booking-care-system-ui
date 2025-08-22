import { useState, useMemo } from 'react';
import { CheckCircle } from 'lucide-react';
import clsx from 'clsx';
import '@/styles/_auth.scss';
import Input from '~/components/Input';
import Button from '~/components/Button';

interface PasswordData {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

const ChangePassword = () => {
    const [passwordData, setPasswordData] = useState<PasswordData>({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    // Password visibility states
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Password requirements validation
    const passwordRequirements = useMemo(() => {
        const hasMinLength = passwordData.newPassword.length >= 8;
        const hasUppercase = /[A-Z]/.test(passwordData.newPassword);
        const hasLowercase = /[a-z]/.test(passwordData.newPassword);
        const hasNumber = /\d/.test(passwordData.newPassword);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(passwordData.newPassword);

        return {
            hasMinLength,
            hasUppercase,
            hasLowercase,
            hasNumber,
            hasSpecialChar,
            allMet: hasMinLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar,
        };
    }, [passwordData.newPassword]);

    // Password strength calculation
    const passwordStrength = useMemo(() => {
        if (!passwordData.newPassword) return { score: 0, label: '', color: '', width: 0 };

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
    }, [passwordData.newPassword, passwordRequirements]);

    const canSubmit = useMemo(() => {
        const hasCurrentPassword = passwordData.currentPassword.trim() !== '';
        const hasNewPassword = passwordData.newPassword.trim() !== '';
        const hasConfirmPassword = passwordData.confirmPassword.trim() !== '';
        const passwordsMatch = passwordData.newPassword === passwordData.confirmPassword;
        const newPasswordValid = passwordRequirements.allMet;

        return (
            hasCurrentPassword &&
            hasNewPassword &&
            hasConfirmPassword &&
            passwordsMatch &&
            newPasswordValid
        );
    }, [passwordData, passwordRequirements.allMet]);

    const handleInputChange = (field: keyof PasswordData, value: string) => {
        setPasswordData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (canSubmit) {
            console.log('Password data:', passwordData);
            // Xử lý thay đổi mật khẩu
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
        <form onSubmit={handleSubmit}>
            <div className="row">
                <div className="col-md-7">
                    {/* Current Password */}
                    <div className="mb-3">
                        <Input
                            label={
                                <>
                                    Mật khẩu hiện tại <span className="text-danger">*</span>
                                </>
                            }
                            type="password"
                            placeholder="Nhập mật khẩu hiện tại"
                            leftIcon={<i className="feather-lock" />}
                            value={passwordData.currentPassword}
                            onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                            showPasswordToggle
                            isPasswordVisible={showCurrentPassword}
                            onTogglePassword={() => togglePasswordVisibility('current')}
                        />
                    </div>

                    {/* New Password */}
                    <div className="mb-3">
                        <Input
                            label={
                                <>
                                    Mật khẩu mới <span className="text-danger">*</span>
                                </>
                            }
                            type="password"
                            placeholder="Nhập mật khẩu mới"
                            leftIcon={<i className="feather-lock" />}
                            value={passwordData.newPassword}
                            onChange={(e) => handleInputChange('newPassword', e.target.value)}
                            showPasswordToggle
                            isPasswordVisible={showNewPassword}
                            onTogglePassword={() => togglePasswordVisibility('new')}
                        />

                        {/* Password Strength Indicator */}
                        {passwordData.newPassword && (
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
                            label={
                                <>
                                    Xác nhận mật khẩu mới <span className="text-danger">*</span>
                                </>
                            }
                            type="password"
                            placeholder="Nhập lại mật khẩu mới"
                            leftIcon={<i className="feather-lock" />}
                            value={passwordData.confirmPassword}
                            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                            className={clsx(
                                passwordData.confirmPassword &&
                                    passwordData.confirmPassword === passwordData.newPassword
                                    ? 'border-success'
                                    : ''
                            )}
                            showPasswordToggle
                            isPasswordVisible={showConfirmPassword}
                            onTogglePassword={() => togglePasswordVisibility('confirm')}
                        />
                        {passwordData.confirmPassword &&
                            passwordData.newPassword === passwordData.confirmPassword && (
                                <div className="d-flex align-items-center mt-2 text-success">
                                    <CheckCircle size={16} className="me-2" />
                                    <span>Mật khẩu trùng khớp</span>
                                </div>
                            )}
                    </div>
                </div>

                {/* Password Requirements */}
                <div className="col-md-7">
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
                </div>
            </div>

            <div className="modal-btn border-top pt-3 text-end">
                <a href="#" className="btn btn-md btn-light rounded-pill">
                    Hủy
                </a>
                <Button
                    text="Thay đổi mật khẩu"
                    type="submit"
                    className={clsx('btn-md rounded-pill', !canSubmit && 'disabled')}
                    isDisabled={!canSubmit}
                />
            </div>
        </form>
    );
};

export default ChangePassword;
