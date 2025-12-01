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

    return (
        <button type="button" className={clsx('spaciality-item')} onClick={handleClick}>
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
        </button>
    );
};
