import { useTranslation } from 'react-i18next';

interface PasswordStrengthIndicatorProps {
    password: string;
    passwordStrength: {
        score: number;
        label: string;
        color: string;
        width: number;
    };
    translationKey?: string;
    translationPrefix?: 'resetPassword' | 'register';
}

/**
 * Component for displaying password strength indicator
 */
export const PasswordStrengthIndicator = ({
    password,
    passwordStrength,
    translationKey = 'auth',
    translationPrefix = 'resetPassword',
}: PasswordStrengthIndicatorProps) => {
    const { t } = useTranslation(translationKey);

    if (!password) return null;

    return (
        <div className="mt-2">
            <div className="d-flex justify-content-between align-items-center mb-1">
                <small className="text-muted">{t(`${translationPrefix}.passwordStrength`)}</small>
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
    );
};
