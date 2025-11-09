import React from 'react';

interface TermsTextSectionProps {
    title: string;
    description?: string;
    descriptions?: string[];
    className?: string;
    children?: React.ReactNode;
}

const TermsTextSection: React.FC<TermsTextSectionProps> = ({
    title,
    description,
    descriptions,
    className = '',
    children,
}) => {
    return (
        <div className={`terms-text ${className}`}>
            <h6>{title}</h6>
            {description && <p>{description}</p>}
            {descriptions?.map((desc, index) => (
                <p key={index}>{desc}</p>
            ))}
            {children}
        </div>
    );
};

export default TermsTextSection;
