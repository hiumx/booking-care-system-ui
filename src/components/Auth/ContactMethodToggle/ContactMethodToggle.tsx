import clsx from 'clsx';
import { ReactNode } from 'react';

interface ToggleOption {
    value: 'phone' | 'email';
    label: string;
    icon: ReactNode;
}

interface ContactMethodToggleProps {
    method: 'phone' | 'email';
    options: ToggleOption[];
    onChange: (value: 'phone' | 'email') => void;
    wrapperClassName?: string;
}

export const ContactMethodToggle = ({
    method,
    options,
    onChange,
    wrapperClassName,
}: ContactMethodToggleProps) => {
    return (
        <div className={clsx('d-flex justify-content-center mb-3', wrapperClassName)}>
            <div className="method-toggle">
                {options.map((option) => (
                    <button
                        key={option.value}
                        type="button"
                        className={clsx(
                            'toggle-btn',
                            method === option.value && 'toggle-btn-active'
                        )}
                        onClick={() => onChange(option.value)}
                    >
                        {option.icon}
                        {option.label}
                    </button>
                ))}
            </div>
        </div>
    );
};
