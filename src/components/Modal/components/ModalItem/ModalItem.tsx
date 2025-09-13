import React from 'react';
import styles from './ModalItem.module.scss';

interface ModalItemProps {
    id: string;
    name: string;
    icon?: React.ComponentType<{ className?: string }>;
    imageUrl?: string;
    color?: string;
    isSelected: boolean;
    onToggle: (id: string) => void;
}

const ModalItem: React.FC<ModalItemProps> = ({
    id,
    name,
    icon: IconComponent,
    imageUrl,
    color,
    isSelected,
    onToggle,
}) => {
    return (
        <button
            onClick={() => onToggle(id)}
            className={`${styles.modalItem} ${isSelected ? styles.selected : ''}`}
        >
            {IconComponent ? (
                <div className={`${styles.iconContainer} ${color ? styles[color] : ''}`}>
                    <IconComponent className="w-5 h-5" />
                </div>
            ) : imageUrl ? (
                <img src={imageUrl} alt={name} className={styles.imageIcon} />
            ) : (
                <div className="w-5 h-5 bg-gray-200" />
            )}

            <span className={styles.specialtyName}>{name}</span>
        </button>
    );
};

export default ModalItem;
