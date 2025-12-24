import React from 'react';
import BookingLayout from '@/layouts/BookingLayout';
import FullScreenSpinner from '@/components/FullScreenSpinner';

interface BookingLoadingStateProps {
    message: string;
}

/**
 * Shared loading state component for booking pages
 * Used by RescheduleAppointment and ConfirmNewDoctor
 */
const BookingLoadingState: React.FC<BookingLoadingStateProps> = ({ message }) => {
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

export default BookingLoadingState;
