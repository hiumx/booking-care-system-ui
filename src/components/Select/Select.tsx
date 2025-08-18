import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import styles from './Select.module.scss';

interface SelectItem {
    label: string;
    value: string;
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

    // Get the selected item's label or use the title as fallback
    const selectedLabel = items.find((item) => item.value === value)?.label || title || 'Select';

    const handleItemClick = (value: string) => {
        onChange(value);
        setIsOpen(false); // Close dropdown after selection
    };

    return (
        <div className={clsx(styles['browse-categorie'], className)}>
            <div className={clsx(styles['categorie-dropdown'], { [styles.show]: isOpen })}>
                <Link
                    to="#"
                    className={clsx(styles['dropdown-toggle'], styles['customLink'])}
                    onClick={(e) => {
                        e.preventDefault();
                        setIsOpen(!isOpen);
                    }}
                    aria-expanded={isOpen}
                >
                    {image && <img src={image} alt="Category Icon" />}
                    {selectedLabel}
                </Link>
                <ul className={styles['dropdown-menu']}>
                    {items.map((item, index) => (
                        <li key={index}>
                            <Link
                                className={clsx(styles['dropdown-item'], styles['customLink'])}
                                to="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleItemClick(item.value);
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
