import { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { CheckCircle } from 'lucide-react';
import clsx from 'clsx';
import '@/styles/_auth.scss';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { AppDispatch, RootState } from '@/store';
import { changePasswordAsync } from '@/store/slices/authSlice';
import { ChangePasswordRequest } from '@/types/auth.types';

interface PasswordData {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

const ChangePassword = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { t } = useTranslation('userProfile');
    const { hasExternalProvider, isLoading } = useSelector((state: RootState) => state.auth);

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

        if (score <= 20)
            return { score, label: t('changePassword.strength.weak'), color: '#ef4444', width: 20 };
        if (score <= 40)
            return { score, label: t('changePassword.strength.fair'), color: '#f59e0b', width: 40 };
        if (score <= 60)
            return { score, label: t('changePassword.strength.good'), color: '#3b82f6', width: 60 };
        if (score <= 80)
            return {
                score,
                label: t('changePassword.strength.strong'),
                color: '#10b981',
                width: 80,
            };
        return {
            score,
            label: t('changePassword.strength.veryStrong'),
            color: '#059669',
            width: 100,
        };
    }, [passwordData.newPassword, passwordRequirements, t]);

    const canSubmit = useMemo(() => {
        const hasNewPassword = passwordData.newPassword.trim() !== '';
        const hasConfirmPassword = passwordData.confirmPassword.trim() !== '';
        const passwordsMatch = passwordData.newPassword === passwordData.confirmPassword;
        const newPasswordValid = passwordRequirements.allMet;

        // For external provider accounts, current password is not required
        if (hasExternalProvider) {
            return hasNewPassword && hasConfirmPassword && passwordsMatch && newPasswordValid;
        }

        // For regular accounts, current password is required
        const hasCurrentPassword = passwordData.currentPassword.trim() !== '';
        return (
            hasCurrentPassword &&
            hasNewPassword &&
            hasConfirmPassword &&
            passwordsMatch &&
            newPasswordValid
        );
    }, [passwordData, passwordRequirements.allMet, hasExternalProvider]);

    const handleInputChange = (field: keyof PasswordData, value: string) => {
        setPasswordData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSubmit) return;

        try {
            const request: ChangePasswordRequest = {
                currentPassword: hasExternalProvider ? undefined : passwordData.currentPassword,
                newPassword: passwordData.newPassword,
                confirmNewPassword: passwordData.confirmPassword,
            };

            await dispatch(changePasswordAsync(request)).unwrap();
            toast.success(t('changePassword.toast.success'));

            // Reset form
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
        } catch (error: unknown) {
            const errorMessage =
                error instanceof Error ? error.message : t('changePassword.toast.error');
            toast.error(errorMessage);
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
                    {/* Current Password - Only show for regular accounts */}
                    {!hasExternalProvider && (
                        <div className="mb-3">
                            <Input
                                label={t('changePassword.currentPassword.label')}
                                isRequired
                                type="password"
                                placeholder={t('changePassword.currentPassword.placeholder')}
                                leftIcon={<i className="feather-lock" />}
                                value={passwordData.currentPassword}
                                onChange={(e) =>
                                    handleInputChange('currentPassword', e.target.value)
                                }
                                showPasswordToggle
                                isPasswordVisible={showCurrentPassword}
                                onTogglePassword={() => togglePasswordVisibility('current')}
                            />
                        </div>
                    )}

                    {/* New Password */}
                    <div className="mb-3">
                        <Input
                            label={t('changePassword.newPassword.label')}
                            isRequired
                            type="password"
                            placeholder={t('changePassword.newPassword.placeholder')}
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
                                    <small className="text-muted">
                                        {t('changePassword.strength.label')}
                                    </small>
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
                            label={t('changePassword.confirmPassword.label')}
                            isRequired
                            type="password"
                            placeholder={t('changePassword.confirmPassword.placeholder')}
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
                                    <span>{t('changePassword.passwordMatch')}</span>
                                </div>
                            )}
                    </div>
                </div>

                {/* Password Requirements */}
                <div className="col-md-7">
                    <div className="mb-3">
                        <div className={'requirements-list'}>
                            <span className="mb-1" style={{ fontWeight: 600 }}>
                                {t('changePassword.requirements.title')}
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
                                    {t('changePassword.requirements.minLength')}
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
                                    {t('changePassword.requirements.uppercase')}
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
                                    {t('changePassword.requirements.lowercase')}
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
                                    {t('changePassword.requirements.number')}
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
                                    {t('changePassword.requirements.specialChar')}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal-btn border-top pt-3 text-end">
                <a href="#" className="btn btn-md btn-light rounded-pill">
                    {t('changePassword.actions.cancel')}
                </a>
                <Button
                    text={
                        isLoading
                            ? t('changePassword.actions.submitting')
                            : t('changePassword.actions.submit')
                    }
                    type="submit"
                    className={clsx('btn-md rounded-pill', !canSubmit && 'disabled')}
                    isDisabled={!canSubmit || isLoading}
                />
            </div>
        </form>
    );
};

export default ChangePassword;
