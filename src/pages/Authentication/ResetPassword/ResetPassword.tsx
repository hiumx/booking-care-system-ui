import { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import AuthLayout from '@/layouts/AuthLayout';
import { Shield } from 'lucide-react';
import clsx from 'clsx';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { resetPasswordAsync } from '@/store/slices/authSlice';
import { RootState, AppDispatch } from '@/store';
import { ResetPasswordRequest } from '@/types/auth.types';
import { toast } from 'react-toastify';
import { PATHS } from '@/routes/paths';
import { usePasswordValidation } from '@/hooks/usePasswordValidation';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import { PasswordStrengthIndicator } from '@/components/PasswordStrengthIndicator';
import { PasswordRequirementsList } from '@/components/PasswordRequirementsList';

const ResetPassword: React.FC = () => {
    const { t } = useTranslation('auth');
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { isLoading, error } = useSelector((state: RootState) => state.auth);

    // Use auth redirect hook
    useAuthRedirect();

    // Get email and token from URL params
    const email = searchParams.get('email') || '';
    const resetToken = searchParams.get('token') || '';

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Use password validation hook
    const { passwordRequirements, passwordStrength } = usePasswordValidation({
        password: newPassword,
        translationPrefix: 'resetPassword',
    });

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

            toast.success(t('resetPassword.success'));
            // Redirect to login after 2 seconds
            setTimeout(() => {
                navigate(PATHS.LOGIN);
            }, 2000);
        } catch (error: any) {
            console.error('Reset password error:', error);
            toast.error(error.message || t('resetPassword.error'));
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
                title={t('resetPassword.invalidLinkTitle')}
                subtitle={t('resetPassword.invalidLinkSubtitle')}
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
                            text={t('resetPassword.requestNewReset')}
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
        <AuthLayout title={t('resetPassword.title')} subtitle={t('resetPassword.subtitle')}>
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
                        label={t('resetPassword.newPassword')}
                        type="password"
                        placeholder={t('resetPassword.newPasswordPlaceholder')}
                        leftIcon={<i className="feather-lock" />}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        showPasswordToggle
                        isPasswordVisible={showNewPassword}
                        onTogglePassword={() => togglePasswordVisibility('new')}
                    />

                    {/* Password Strength Indicator */}
                    <PasswordStrengthIndicator
                        password={newPassword}
                        passwordStrength={passwordStrength}
                        translationPrefix="resetPassword"
                    />
                </div>

                {/* Confirm Password */}
                <div className="mb-3">
                    <Input
                        label={t('resetPassword.confirmPassword')}
                        type="password"
                        placeholder={t('resetPassword.confirmPasswordPlaceholder')}
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
                    <PasswordRequirementsList
                        passwordRequirements={passwordRequirements}
                        translationPrefix="resetPassword"
                    />
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
                        text={isLoading ? t('resetPassword.submitting') : t('resetPassword.submit')}
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
