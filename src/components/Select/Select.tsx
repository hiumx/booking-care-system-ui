import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import styles from './Select.module.scss';

interface SelectItem {
    label: string;
    value: string;
    disabled?: boolean;
}

interface SelectProps {
    title?: string; // Used as placeholder
    items: SelectItem[];
    value: string;
    onChange: (value: string) => void;
    className?: string;
    image?: string; // Optional image prop
}

const Select: React.FC<SelectProps> = ({ title, items, value, onChange, className, image }) => {
    const [isOpen, setIsOpen] = useState(false);

    // Get the selected item's label or use the title as fallback when value is empty
    const selectedLabel = value
        ? items.find((item) => item.value === value)?.label || title || 'Select'
        : title || 'Select';

    const handleItemClick = (item: SelectItem) => {
        if (!item.disabled) {
            onChange(item.value);
            setIsOpen(false); // Close dropdown after selection
        }
    };

    return (
        <div className={clsx(styles['browseCategorie'], className)}>
            <div className={clsx(styles['categorieDropdown'], { [styles.show]: isOpen })}>
                <Link
                    to="#"
                    className={clsx(styles['dropdownToggle'], styles['customLink'], {
                        [styles.placeholder]: !value,
                    })}
                    onClick={(e) => {
                        e.preventDefault();
                        setIsOpen(!isOpen);
                    }}
                    aria-expanded={isOpen}
                >
                    {image && <img src={image} alt="Category Icon" />}
                    {selectedLabel}
                </Link>
                <ul className={styles['dropdownMenu']}>
                    {items.map((item, index) => (
                        <li key={index}>
                            <Link
                                className={clsx(
                                    styles['dropdownItem'],
                                    styles['customLink'],
                                    { [styles.disabled]: item.disabled },
                                    { [styles.selected]: item.value === value }
                                )}
                                to="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleItemClick(item);
                                }}
                            >
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Select;
