import React from 'react';

interface SectionHeaderProps {
    title: string;
    subtitle: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle }) => {
    return (
        <div className="section-head-fourteen">
            <h2>
                {title} <span> Services</span>
            </h2>
            <p>{subtitle}</p>
        </div>
    );
};

export default SectionHeader;
