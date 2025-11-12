import React from 'react';

interface TermsListSectionProps {
    title: string;
    description?: string;
    items: string[];
    className?: string;
}

const TermsListSection: React.FC<TermsListSectionProps> = ({
    title,
    description,
    items,
    className = '',
}) => {
    return (
        <div className={`terms-text terms-list ${className}`}>
            <h6>{title}</h6>
            {description && <p>{description}</p>}
            <ul>
                {items.map((item) => (
                    <li key={item}>{item}</li>
                ))}
            </ul>
        </div>
    );
};

export default TermsListSection;
