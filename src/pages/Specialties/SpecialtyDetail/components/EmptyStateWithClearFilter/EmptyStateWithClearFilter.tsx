import React from 'react';
import clsx from 'clsx';
import styles from '../../SpecialtyDetailPage.module.scss';

interface EmptyStateWithClearFilterProps {
    icon: string;
    title: string;
    description: string;
    showClearButton: boolean;
    clearButtonText: string;
    onClear: () => void;
}

/**
 * Reusable empty state component with optional clear filters button
 * Used by SpecialtyDetailPage for doctor and hospital empty states
 */
const EmptyStateWithClearFilter: React.FC<EmptyStateWithClearFilterProps> = ({
    icon,
    title,
    description,
    showClearButton,
    clearButtonText,
    onClear,
}) => {
    return (
        <div className={styles.emptyState}>
            <div className={styles.emptyStateIcon}>
                <i className={icon}></i>
            </div>
            <h4 className={styles.emptyStateTitle}>{title}</h4>
            <p className={styles.emptyStateDescription}>{description}</p>
            {showClearButton && (
                <button
                    className={clsx(
                        'btn',
                        'btn-outline-primary',
                        'btn-sm',
                        styles.clearFiltersButton
                    )}
                    onClick={onClear}
                >
                    {clearButtonText}
                </button>
            )}
        </div>
    );
};

export default EmptyStateWithClearFilter;
