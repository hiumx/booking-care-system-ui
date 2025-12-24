import React from 'react';
import BookingLayout from '@/layouts/BookingLayout';
import FullScreenSpinner from '@/components/FullScreenSpinner';

interface BookingLoadingSpinnerProps {
    message?: string;
}

const BookingLoadingSpinner: React.FC<BookingLoadingSpinnerProps> = ({
    message = 'Đang tải thông tin...',
}) => {
    return (
        <BookingLayout>
            <div className="container">
                <div className="row">
                    <div className="col-lg-10 mx-auto">
                        <div
                            className="d-flex flex-column align-items-center justify-content-center"
                            style={{ minHeight: '60vh' }}
                        >
                            <FullScreenSpinner isVisible={true} message={message} />
                        </div>
                    </div>
                </div>
            </div>
        </BookingLayout>
    );
};

export default BookingLoadingSpinner;
