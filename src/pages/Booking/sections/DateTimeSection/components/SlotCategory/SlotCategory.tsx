import SlotItem from '../SlotItem';

interface SlotCategoryProps {
    title: string;
    timeSlots: { id: number; time: string }[];
    handleClickSlot: (idx: number) => void;
    checkedSlots?: number[]; // Add checkedSlots prop
}

const SlotCategory: React.FC<SlotCategoryProps> = ({
    title,
    timeSlots,
    handleClickSlot,
    checkedSlots = [],
}) => {
    return (
        <div>
            <div className="book-title">
                <h6 className="fs-14 mb-2">{title}</h6>
            </div>
            <div className="token-slot mt-2 mb-2">
                {timeSlots.map((item, idx) => (
                    <SlotItem
                        key={idx}
                        id={item.id}
                        rangeTime={item.time}
                        handleClickSlot={handleClickSlot}
                        isChecked={checkedSlots.includes(item.id)}
                    />
                ))}
            </div>
        </div>
    );
};

export default SlotCategory;
