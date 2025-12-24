import clsx from 'clsx';
import styles from './SlotItem.module.scss';

interface SlotItemProps {
    id: number;
    rangeTime: string;
    handleClickSlot: (idx: number) => void;
    isChecked?: boolean;
}

const SlotItem: React.FC<SlotItemProps> = ({
    id,
    rangeTime,
    handleClickSlot,
    isChecked = false,
}) => {
    return (
        <div className={clsx(styles.slotItem, 'form-check-inline visits me-0')}>
            <label className={clsx(styles.slotLabel, 'visit-btns')}>
                <input
                    type="radio"
                    className="form-check-input"
                    name="appointment"
                    checked={isChecked}
                    onChange={() => handleClickSlot(id)}
                />
                <span className={clsx(styles.visitRsn, 'visit-rsn')}>{rangeTime}</span>
            </label>
        </div>
    );
};

export default SlotItem;
