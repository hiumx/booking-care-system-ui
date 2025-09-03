import Calendar from '@/components/Calendar';
import React, { useState } from 'react';
import { mockSlotCategories } from '../../data/mock';
import SlotCategory from './components/SlotCategory';
import styles from './DateTimeSection.module.scss';
import clsx from 'clsx';
import BookingFooter from '../../components/BookingFooter/BookingFooter';

const DateTimeSection: React.FC = () => {
    const [date, setDate] = useState<Date | null>(new Date());
    const [slotChecked, setSlotChecked] = useState<Array<number>>([]);

    const handleClickSlot = (idx: number) => {
        setSlotChecked([...slotChecked, idx]);
    };

    console.log('Selected slot:', slotChecked);

    return (
        <fieldset id="first">
            <div className="card booking-card mb-0">
                <div className="card-header">
                    <div className="booking-header pb-0">
                        <div className="card mb-0">
                            <div className="card-body">
                                <div className="d-flex align-items-center flex-wrap rpw-gap-2 mb-4 flex-wrap row-gap-2">
                                    <span className="avatar avatar-xxxl avatar-rounded me-2 flex-shrink-0">
                                        <img src="./src/assets/img/clients/client-15.jpg" alt="" />
                                    </span>
                                    <div>
                                        <h4 className="mb-1">
                                            Dr. Michael Brown{' '}
                                            <span className="badge bg-orange fs-12">
                                                <i className="fa-solid fa-star me-1"></i>5.0
                                            </span>
                                        </h4>
                                        <p className="text-indigo mb-3 fw-medium">Psychologist</p>
                                        <p className="mb-0">
                                            <i className="isax isax-location me-2"></i>5th Street -
                                            1011 W 5th St, Suite 120, Austin, TX 78703
                                        </p>
                                    </div>
                                </div>
                                <h6 className="mb-2">Booking Info</h6>
                                <div className="row gx-2 gy-3">
                                    <div className="col-lg-3 col-sm-6">
                                        <div>
                                            <h6 className="fs-14 fw-medium mb-1">Service</h6>
                                            <p className="mb-0">Cardiology (30 Mins)</p>
                                        </div>
                                    </div>
                                    <div className="col-lg-3 col-sm-6">
                                        <div>
                                            <h6 className="fs-14 fw-medium mb-1">Service</h6>
                                            <p className="mb-0">Echocardiograms</p>
                                        </div>
                                    </div>
                                    <div className="col-lg-3 col-sm-6">
                                        <div>
                                            <h6 className="fs-14 fw-medium mb-1">Date & Time</h6>
                                            <p className="mb-0">10:00 - 11:00 AM, 15, Oct</p>
                                        </div>
                                    </div>
                                    <div className="col-lg-3 col-sm-6">
                                        <div>
                                            <h6 className="fs-14 fw-medium mb-1">
                                                Appointment type
                                            </h6>
                                            <p className="mb-0">Clinic (Wellness Path)</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card-body booking-body">
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
                </div>
                <BookingFooter nextStepTitle="Add Basic Information" />
            </div>
        </fieldset>
    );
};

export default DateTimeSection;
