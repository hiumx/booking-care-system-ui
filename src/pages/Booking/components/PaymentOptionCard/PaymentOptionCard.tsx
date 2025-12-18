import React from 'react';

interface PaymentOptionCardProps {
    optionValue: 'deposit' | 'no-payment';
    currentValue: 'deposit' | 'no-payment';
    onSelect: (value: 'deposit' | 'no-payment') => void;
    ariaLabel: string;
    className?: string;
    children: React.ReactNode;
}

/**
 * Shared component for payment option card wrapper
 * Handles click, keyboard navigation, and accessibility attributes
 * Used to reduce code duplication in PaymentSection
 */
const PaymentOptionCard: React.FC<PaymentOptionCardProps> = ({
    optionValue,
    currentValue,
    onSelect,
    ariaLabel,
    className = '',
    children,
}) => {
    const isActive = currentValue === optionValue;

    const handleClick = () => {
        onSelect(optionValue);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelect(optionValue);
        }
    };

    return (
        <div className={className}>
            <div
                className={`payment-option-card ${isActive ? 'active' : ''}`}
                onClick={handleClick}
                onKeyDown={handleKeyDown}
                role="button"
                tabIndex={0}
                aria-label={ariaLabel}
                aria-pressed={isActive}
            >
                {children}
            </div>
        </div>
    );
};

export default PaymentOptionCard;
