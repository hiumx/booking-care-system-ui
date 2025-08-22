import React, { useMemo, useState } from 'react';
import clsx from 'clsx';
import '@/styles/_auth.scss';
import styles from './Input.module.scss';

/**
 * Props for the Input component.
 *
 * @property {string} [id] - The unique identifier for the input element.
 * @property {string} [name] - The name attribute for the input element.
 * @property {string} [label] - The label to display alongside the input.
 * @property {boolean} [isRequired] - Whether the input is required.
 * @property {React.ReactNode} [leftIcon] - An icon to display on the left side of the input.
 * @property {React.ReactNode} [leftContent] - Custom content to display on the left side of the input.
 * @property {'phone' | 'email'} [wrapVariant] - The variant of the input wrapper, e.g., for phone or email styling.
 * @property {boolean} [showPasswordToggle] - Whether to show a toggle button for password visibility.
 * @property {boolean} [isPasswordVisible] - Whether the password is currently visible.
 * @property {(visible: boolean) => void} [onTogglePassword] - Callback when the password visibility is toggled.
 * @property {string} [wrapperClassName] - Additional class name(s) for the input wrapper.
 *
 * Inherits all standard input attributes from React.InputHTMLAttributes<HTMLInputElement>.
 */
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    id?: string;
    name?: string;
    label?: string;
    isRequired?: boolean;
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
    isRequired = false,
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
                    {isRequired && (
                        <span className={clsx(styles.starRequired, 'text-danger')}>*</span>
                    )}
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
