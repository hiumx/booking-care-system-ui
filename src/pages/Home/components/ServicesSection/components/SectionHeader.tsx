import React from 'react';

interface SectionHeaderProps {
    title: string;
    titleSuffix: string;
    subtitle: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, titleSuffix, subtitle }) => {
    return (
        <div className="section-head-fourteen">
            <h2>
                {title} <span> {titleSuffix}</span>
            </h2>
            <p>{subtitle}</p>
        </div>
    );
};

export default SectionHeader;
