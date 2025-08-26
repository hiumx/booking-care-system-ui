import React, { useState, useEffect, useRef } from 'react';
import Calendar from '@/components/Calendar';

const SearchResult: React.FC = () => {
    const placeholders = [
        'Tìm kiếm theo cơ sở y tế',
        'Tìm kiếm theo bác sĩ',
        'Tìm kiếm theo chuyên khoa',
        'Tìm kiếm theo gói khám',
        'Tìm kiếm theo dịch vụ',
    ];

    const [currentText, setCurrentText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [charIndex, setCharIndex] = useState(0);
    const [typingSpeed, setTypingSpeed] = useState(100);
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const dateInputRef = useRef<HTMLInputElement>(null);

    // Typing animation effect
    useEffect(() => {
        const handleTyping = () => {
            const currentPlaceholder = placeholders[currentIndex];

            if (!isDeleting && charIndex < currentPlaceholder.length) {
                // Typing forward
                setCurrentText((prev) => prev + currentPlaceholder[charIndex]);
                setCharIndex((prev) => prev + 1);
                setTypingSpeed(100);
            } else if (isDeleting && charIndex > 0) {
                // Deleting backward
                setCurrentText((prev) => prev.slice(0, -1));
                setCharIndex((prev) => prev - 1);
                setTypingSpeed(50);
            } else if (!isDeleting && charIndex === currentPlaceholder.length) {
                // Pause at end of typing
                setTypingSpeed(1000);
                setIsDeleting(true);
            } else if (isDeleting && charIndex === 0) {
                // Move to next placeholder
                setIsDeleting(false);
                setCurrentIndex((prev) => (prev + 1) % placeholders.length);
                setTypingSpeed(100);
            }
        };

        const timer = setTimeout(handleTyping, typingSpeed);
        return () => clearTimeout(timer);
    }, [charIndex, isDeleting, currentIndex, typingSpeed, placeholders]);

    // Handle date selection
    const handleDateChange = (value: Date | null) => {
        if (!value || isNaN(value.getTime())) return; // Ignore invalid dates
        setSelectedDate(value);
        setShowDatePicker(false);
    };

    // Format date for display
    const formatDate = (date: Date | null) => {
        if (!date) return '';
        return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    };

    // Check if today's date is selected
    const today = new Date();
    const isTodaySelected = selectedDate
        ? selectedDate.getDate() === today.getDate() &&
          selectedDate.getMonth() === today.getMonth() &&
          selectedDate.getFullYear() === today.getFullYear()
        : false;

    return (
        <div className="bg-primary-gradient rounded-pill doctors-search-box">
            <div className="search-box-one rounded-pill">
                <form action="https://doccure.dreamstechnologies.com/html/template/search-2.html">
                    <div className="search-input search-line">
                        <i className="isax isax-hospital5 bficon"></i>
                        <div className="mb-0">
                            <input type="text" className="form-control" placeholder={currentText} />
                        </div>
                    </div>
                    <div className="search-input search-map-line">
                        <i className="isax isax-location5"></i>
                        <div className="mb-0">
                            <input type="text" className="form-control" placeholder="Location" />
                        </div>
                    </div>
                    <div className="search-input search-calendar-line">
                        <i
                            className="isax isax-calendar-tick5"
                            onClick={() => setShowDatePicker(!showDatePicker)}
                        ></i>
                        <div className="mb-0">
                            <input
                                type="text"
                                className="form-control datetimepicker"
                                placeholder="Date"
                                value={formatDate(selectedDate)}
                                onClick={() => setShowDatePicker(!showDatePicker)}
                                ref={dateInputRef}
                                readOnly
                            />
                            <Calendar
                                value={selectedDate}
                                onChange={handleDateChange}
                                minDate={new Date()}
                                maxDate={
                                    new Date(
                                        today.getFullYear(),
                                        today.getMonth(),
                                        today.getDate() + 30
                                    )
                                }
                                anchorEl={dateInputRef.current}
                                open={showDatePicker}
                                onClose={() => setShowDatePicker(false)}
                                isTodaySelected={isTodaySelected} // Pass the isTodaySelected prop
                            />
                        </div>
                    </div>
                    <div className="form-search-btn">
                        <button
                            className="btn btn-primary d-inline-flex align-items-center rounded-pill"
                            type="submit"
                        >
                            <i className="isax isax-search-normal-15 me-2"></i>Search
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SearchResult;
