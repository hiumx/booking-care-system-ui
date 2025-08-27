import React, { useEffect, useRef, useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { Popper } from '@mui/material';

interface CalendarProps {
    value: Date | null;
    onChange: (value: Date | null) => void;
    minDate?: Date;
    maxDate?: Date;
    anchorEl: HTMLElement | null;
    open: boolean;
    onClose: () => void;
    isTodaySelected?: boolean;
}

const Calendar: React.FC<CalendarProps> = ({
    value,
    onChange,
    minDate,
    maxDate,
    anchorEl,
    open,
    onClose,
    isTodaySelected = false,
}) => {
    const popperRef = useRef<HTMLDivElement>(null);
    const [isFadingOut, setIsFadingOut] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Handle click outside to close the popup
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                popperRef.current &&
                !popperRef.current.contains(event.target as Node) &&
                anchorEl &&
                !anchorEl.contains(event.target as Node)
            ) {
                onClose();
            }
        };

        if (open) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [open, anchorEl, onClose]);

    // Handle mouse leave with 3-second delay for fade-out
    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setIsFadingOut(true);
            // Wait for the fade-out animation to complete before closing
            setTimeout(() => {
                onClose();
                setIsFadingOut(false); // Reset fade-out state after closing
            }, 300); // Match the CSS transition duration
        }, 3000); // 3-second delay
    };

    // Clear timeout if mouse re-enters the popup
    const handleMouseEnter = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
            setIsFadingOut(false); // Reset fade-out state if mouse re-enters
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Popper
                open={open}
                anchorEl={anchorEl}
                placement="bottom-end"
                sx={{
                    zIndex: 10000,
                    opacity: isFadingOut ? 0 : 1,
                    transition: 'opacity 0.3s ease-in-out', // Smooth fade-out effect
                }}
                onMouseLeave={handleMouseLeave}
                onMouseEnter={handleMouseEnter}
            >
                <div ref={popperRef}>
                    <DateCalendar
                        value={value}
                        onChange={(newValue) => {
                            onChange(newValue);
                            onClose();
                        }}
                        minDate={minDate}
                        maxDate={maxDate}
                        sx={{
                            background: '#ffffff',
                            border: '1px solid #e0e0e0',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                            padding: '10px',
                            width: '300px',
                            fontFamily: "'Inter', sans-serif",
                            '& .MuiTypography-root': {
                                fontFamily: "'Inter', sans-serif",
                                fontSize: '16px',
                                fontWeight: 500,
                                color: '#333',
                            },
                            '& .MuiPickersCalendarHeader-root': {
                                background: '#f1f3f5',
                                padding: '10px',
                            },
                            '& .MuiPickersArrowSwitcher-button': {
                                background: 'none',
                                border: 'none',
                                padding: '8px',
                                borderRadius: '4px',
                                '&:hover': {
                                    background: '#e9ecef',
                                },
                                '&.Mui-disabled': {
                                    color: '#ccc',
                                },
                            },
                            '& .MuiDayCalendar-weekDayLabel': {
                                fontSize: '12px',
                                fontWeight: 500,
                                color: '#666',
                                textTransform: 'uppercase',
                            },
                            '& .MuiPickersDay-root': {
                                fontFamily: "'Inter', sans-serif",
                                fontSize: '14px',
                                color: '#333',
                                borderRadius: '4px',
                                '&:hover': {
                                    background: '#e9ecef',
                                },
                                '&.Mui-selected': {
                                    background: '#007bff !important',
                                    color: '#ffffff',
                                },
                                '&.MuiPickersDay-today': {
                                    background: isTodaySelected ? '#e6f0fa' : 'transparent',
                                    color: isTodaySelected ? '#ffffff' : '#333',
                                },
                                '&.Mui-disabled': {
                                    color: '#ccc',
                                },
                            },
                        }}
                    />
                </div>
            </Popper>
        </LocalizationProvider>
    );
};

export default Calendar;
