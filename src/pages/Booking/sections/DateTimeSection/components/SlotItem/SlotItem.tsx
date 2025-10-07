import clsx from 'clsx';
import styles from './SlotItem.module.scss';

interface SlotItemProps {
    id: number;
    rangeTime: string;
    handleClickSlot: (idx: number) => void;
}

const SlotItem: React.FC<SlotItemProps> = ({ id, rangeTime, handleClickSlot }) => {
    return (
        <div className={clsx(styles.slotItem, 'form-check-inline visits me-0')}>
            <label className={clsx(styles.slotLabel, 'visit-btns')}>
                <input
                    type="checkbox"
                    className="form-check-input"
                    name="appointment"
                    onClick={() => handleClickSlot(id)}
                />
                <span className={clsx(styles.visitRsn, 'visit-rsn')}>{rangeTime}</span>
            </label>
        </div>
    );
};

export default SlotItem;
