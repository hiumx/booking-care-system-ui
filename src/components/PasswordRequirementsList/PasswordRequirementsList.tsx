import { CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

interface PasswordRequirements {
    hasMinLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumber: boolean;
    hasSpecialChar: boolean;
}

interface PasswordRequirementsListProps {
    passwordRequirements: PasswordRequirements;
    translationKey?: string;
    translationPrefix?: 'resetPassword' | 'register';
}

/**
 * Component for displaying password requirements list
 */
export const PasswordRequirementsList = ({
    passwordRequirements,
    translationKey = 'auth',
    translationPrefix = 'resetPassword',
}: PasswordRequirementsListProps) => {
    const { t } = useTranslation(translationKey);

    const requirements = [
        {
            key: 'hasMinLength',
            label: t(`${translationPrefix}.passwordMinLength`),
            met: passwordRequirements.hasMinLength,
        },
        {
            key: 'hasUppercase',
            label: t(`${translationPrefix}.passwordUppercase`),
            met: passwordRequirements.hasUppercase,
        },
        {
            key: 'hasLowercase',
            label: t(`${translationPrefix}.passwordLowercase`),
            met: passwordRequirements.hasLowercase,
        },
        {
            key: 'hasNumber',
            label: t(`${translationPrefix}.passwordNumber`),
            met: passwordRequirements.hasNumber,
        },
        {
            key: 'hasSpecialChar',
            label: t(`${translationPrefix}.passwordSpecialChar`),
            met: passwordRequirements.hasSpecialChar,
        },
    ];

    return (
        <div className={'requirements-list'}>
            <span className="mb-1" style={{ fontWeight: 600 }}>
                {t(`${translationPrefix}.passwordRequirements`)}
            </span>
            {requirements.map((requirement) => (
                <div key={requirement.key} className={'requirement-item'}>
                    <span className={'requirement-icon'}>
                        {requirement.met ? (
                            <CheckCircle size={16} className="text-success" />
                        ) : (
                            <CheckCircle size={16} className="text-muted" />
                        )}
                    </span>
                    <span
                        className={clsx(
                            'requirement-text',
                            requirement.met ? 'text-success' : 'text-muted'
                        )}
                    >
                        {requirement.label}
                    </span>
                </div>
            ))}
        </div>
    );
};
