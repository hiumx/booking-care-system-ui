import Calendar from '@/components/Calendar';
import React, { useState } from 'react';
import { mockSlotCategories } from '../../data/mock';
import SlotCategory from './components/SlotCategory';
import styles from './DateTimeSection.module.scss';
import clsx from 'clsx';
import BookingSectionWrapper from '../../components/BookingSectionWrapper/BookingSectionWrapper';
import { mockDoctorInfo, mockAppointmentInfo } from '../../constants/mockData';

interface DateTimeSectionProps {
    nextStep: () => void;
    prevStep: () => void;
}

const DateTimeSection: React.FC<DateTimeSectionProps> = ({ nextStep, prevStep }) => {
    const [date, setDate] = useState<Date | null>(new Date());
    const [slotChecked, setSlotChecked] = useState<Array<number>>([]);

    const handleClickSlot = (idx: number) => {
        setSlotChecked([...slotChecked, idx]);
    };

    return (
        <BookingSectionWrapper
            doctor={mockDoctorInfo}
            appointment={mockAppointmentInfo}
            nextStepTitle="Thêm thông tin cơ bản"
            nextStep={nextStep}
            prevStep={prevStep}
            fieldsetId="first"
        >
            <div className="card mb-0">
                <div className="card-body pb-0">
                    <div className="row">
                        <div className="col-lg-5">
                            <div className={styles.calendarContainer}>
                                <Calendar
                                    value={date}
                                    onChange={setDate}
                                    usePopper={false}
                                    styles={{ width: '100%' }}
                                />
                            </div>
                        </div>
                        <div className="col-lg-7">
                            <div className="card booking-wizard-slots">
                                <div className={clsx(styles.timeSlot, 'card-body')}>
                                    {mockSlotCategories.map((category, idx) => (
                                        <SlotCategory
                                            key={idx}
                                            title={category.title}
                                            timeSlots={category.timeSlots}
                                            handleClickSlot={handleClickSlot}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </BookingSectionWrapper>
    );
};

export default DateTimeSection;
