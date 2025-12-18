import React from 'react';
import clsx from 'clsx';

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    className?: string;
}

/**
 * Shared search input component with icon
 * Reduces code duplication across list pages
 */
const SearchInput: React.FC<SearchInputProps> = ({ value, onChange, placeholder, className }) => {
    return (
        <div className={clsx('input-block', 'dash-search-input', className)}>
            <input
                type="text"
                className={clsx('form-control')}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
            <span className={clsx('search-icon')}>
                <i className={clsx('isax', 'isax-search-normal')}></i>
            </span>
        </div>
    );
};

export default SearchInput;
