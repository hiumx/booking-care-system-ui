import React, { useState, useEffect } from 'react';

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
                        <i className="isax isax-calendar-tick5"></i>
                        <div className="mb-0">
                            <input
                                type="text"
                                className="form-control datetimepicker"
                                placeholder="Date"
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
