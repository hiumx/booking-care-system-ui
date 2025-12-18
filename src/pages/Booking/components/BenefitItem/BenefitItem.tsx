import React from 'react';

interface BenefitItemProps {
    icon: string;
    iconColorClass: string;
    text: string;
    useHtml?: boolean;
}

/**
 * Reusable benefit item component for payment options
 * Reduces code duplication in PaymentSection
 */
const BenefitItem: React.FC<BenefitItemProps> = ({
    icon,
    iconColorClass,
    text,
    useHtml = false,
}) => {
    return (
        <div className="benefit-item">
            <i className={`${icon} ${iconColorClass} me-2`} aria-hidden="true"></i>
            {useHtml ? <span dangerouslySetInnerHTML={{ __html: text }} /> : <span>{text}</span>}
        </div>
    );
};

export default BenefitItem;
