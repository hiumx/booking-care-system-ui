import React from 'react';
import clsx from 'clsx';
import styles from './AppointmentFilters.module.scss';

interface FilterCheckboxItemProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label: string;
}

/**
 * Reusable checkbox item for filter dropdowns
 * Reduces code duplication in AppointmentFilters
 */
const FilterCheckboxItem: React.FC<FilterCheckboxItemProps> = ({ checked, onChange, label }) => {
    return (
        <li>
            <div className={clsx(styles.filterChecks, 'filter-checks')}>
                <label className={clsx(styles.checkBoxs, 'checkboxs')}>
                    <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => onChange(e.target.checked)}
                    />
                    <span className="checkmarks"></span>{' '}
                    <span className="check-title">{label}</span>
                </label>
            </div>
        </li>
    );
};

export default FilterCheckboxItem;
