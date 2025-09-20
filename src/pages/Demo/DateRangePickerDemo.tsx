import React, { useState } from 'react';
import { RangeKeyDict } from 'react-date-range';
import DateRangePicker from '@/components/DateRangePicker';
import MainLayout from '@/layouts/MainLayout';

const DateRangePickerDemo: React.FC = () => {
    const [ranges, setRanges] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection',
        },
    ]);

    const [isOpen, setIsOpen] = useState(false);

    const handleRangeChange = (rangesByKey: RangeKeyDict) => {
        const selection = rangesByKey.selection;
        if (selection && selection.startDate && selection.endDate && selection.key) {
            setRanges([
                {
                    startDate: selection.startDate,
                    endDate: selection.endDate,
                    key: selection.key,
                },
            ]);
        }
    };

    return (
        <MainLayout>
            <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
                <h1>DateRangePicker Demo</h1>

                <div style={{ marginBottom: '40px' }}>
                    <h2>Basic Usage</h2>
                    <DateRangePicker
                        ranges={ranges}
                        onChange={handleRangeChange}
                        placeholder="Select your date range"
                    />
                </div>

                <div style={{ marginBottom: '40px' }}>
                    <h2>Controlled Component</h2>
                    <DateRangePicker
                        ranges={ranges}
                        onChange={handleRangeChange}
                        isOpen={isOpen}
                        onToggle={setIsOpen}
                        placeholder="Controlled date range picker"
                    />
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        style={{ marginLeft: '10px', padding: '8px 16px' }}
                    >
                        {isOpen ? 'Close' : 'Open'} Picker
                    </button>
                </div>

                <div style={{ marginBottom: '40px' }}>
                    <h2>Custom Configuration</h2>
                    <DateRangePicker
                        ranges={ranges}
                        onChange={handleRangeChange}
                        months={1}
                        direction="vertical"
                        rangeColors={['#00b894']}
                        placeholder="Custom configured picker"
                    />
                </div>

                <div style={{ marginBottom: '40px' }}>
                    <h2>With Date Limits</h2>
                    <DateRangePicker
                        ranges={ranges}
                        onChange={handleRangeChange}
                        minDate={new Date()}
                        maxDate={new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)} // 90 days from now
                        placeholder="Pick dates within 90 days"
                    />
                </div>

                <div style={{ marginBottom: '40px' }}>
                    <h2>Disabled State</h2>
                    <DateRangePicker
                        ranges={ranges}
                        onChange={handleRangeChange}
                        disabled={true}
                        placeholder="This picker is disabled"
                    />
                </div>

                <div
                    style={{
                        marginTop: '40px',
                        padding: '20px',
                        backgroundColor: '#f5f5f5',
                        borderRadius: '8px',
                    }}
                >
                    <h3>Selected Range:</h3>
                    <pre>{JSON.stringify(ranges, null, 2)}</pre>
                </div>
            </div>
        </MainLayout>
    );
};

export default DateRangePickerDemo;
