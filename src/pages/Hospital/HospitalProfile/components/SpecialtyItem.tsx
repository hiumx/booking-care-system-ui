import clsx from 'clsx';
import styles from '../HospitalProfile.module.scss';

interface SpecialtyItemProps {
    specialty: {
        id: string;
        name: string;
        img: string;
        icon?: string;
        doctorCount?: number;
    };
    onClick: (id: string) => void;
}

export const SpecialtyItem = ({ specialty, onClick }: SpecialtyItemProps) => {
    const handleClick = () => onClick(specialty.id);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            onClick(specialty.id);
        }
    };

    return (
        <div
            className={clsx('spaciality-item')}
            onClick={handleClick}
            style={{ cursor: 'pointer' }}
            role="button"
            tabIndex={0}
            onKeyDown={handleKeyDown}
        >
            <div className={clsx('spaciality-img')}>
                <img src={specialty.img} alt={specialty.name} className={styles.specialityImgEl} />
                <span className={clsx('spaciality-icon', styles.specialityIcon)}>
                    {specialty.icon && <img src={specialty.icon} alt="icon" />}
                </span>
            </div>
            <h6 className={styles.specialityTitle}>{specialty.name}</h6>
            <p className={clsx('mb-0', styles.specialityMeta)}>
                {specialty.doctorCount || 0} Bác sĩ
            </p>
        </div>
    );
};
