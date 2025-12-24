import React from 'react';

interface KeyValueItem {
    key: string;
    value: string;
}

interface TermsKeyValueListProps {
    title?: string;
    subtitle?: string;
    description?: string;
    items: KeyValueItem[];
    className?: string;
    children?: React.ReactNode;
}

const TermsKeyValueList: React.FC<TermsKeyValueListProps> = ({
    title,
    subtitle,
    description,
    items,
    className = '',
    children,
}) => {
    return (
        <div className={`terms-text terms-list ${className}`}>
            {title && <h6>{title}</h6>}
            {subtitle && <h5 className="mb-2">{subtitle}</h5>}
            {description && <p>{description}</p>}
            <ul>
                {items.map((item) => (
                    <li key={`${item.key}-${item.value}`}>
                        <strong>{item.key}:</strong> {item.value}
                    </li>
                ))}
            </ul>
            {children}
        </div>
    );
};

export default TermsKeyValueList;
