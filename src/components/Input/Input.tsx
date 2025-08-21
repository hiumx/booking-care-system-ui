import React, { useMemo, useState } from 'react';
import clsx from 'clsx';
import '@/styles/_auth.scss';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    id?: string;
    name?: string;
    label?: React.ReactNode;
    leftIcon?: React.ReactNode;
    leftContent?: React.ReactNode;
    wrapVariant?: 'phone' | 'email';
    showPasswordToggle?: boolean;
    isPasswordVisible?: boolean;
    onTogglePassword?: (visible: boolean) => void;
    wrapperClassName?: string;
}

const Input: React.FC<InputProps> = ({
    id,
    name,
    label,
    type = 'text',
    leftIcon,
    leftContent,
    wrapVariant,
    showPasswordToggle,
    isPasswordVisible,
    onTogglePassword,
    className,
    wrapperClassName,
    ...rest
}) => {
    const isPasswordType = useMemo(() => type === 'password', [type]);
    const [internalVisible, setInternalVisible] = useState(false);

    const passwordVisible = isPasswordVisible ?? internalVisible;
    const effectiveType =
        isPasswordType && (showPasswordToggle || isPasswordVisible !== undefined)
            ? passwordVisible
                ? 'text'
                : 'password'
            : type;

    const handleToggle = () => {
        const next = !passwordVisible;
        if (onTogglePassword) onTogglePassword(next);
        if (isPasswordVisible === undefined) setInternalVisible(next);
    };

    return (
        <div className={clsx(wrapperClassName)}>
            {label && (
                <label htmlFor={id} className="form-label">
                    {label}
                </label>
            )}
            <div
                className={clsx(
                    'auth-input-group',
                    (leftIcon || leftContent) && 'has-left-icon',
                    wrapVariant === 'phone' && 'input-wrap-phone',
                    wrapVariant === 'email' && 'input-wrap-email'
                )}
            >
                {leftIcon && <span className={clsx('left-icon')}>{leftIcon}</span>}
                {leftContent && <div className={clsx('left-icon')}>{leftContent}</div>}
                <input
                    id={id}
                    name={name}
                    type={effectiveType}
                    className={clsx('form-control', className)}
                    {...rest}
                />
                {isPasswordType && showPasswordToggle && (
                    <span
                        role="button"
                        aria-label={passwordVisible ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                        onClick={handleToggle}
                        className={clsx(
                            passwordVisible ? 'feather-eye' : 'feather-eye-off',
                            'toggle-password'
                        )}
                    />
                )}
            </div>
        </div>
    );
};

export default Input;
