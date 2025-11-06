import React from 'react';

interface LoadingSpinnerProps {
    minHeight?: string;
    message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    minHeight = '200px',
    message = 'Loading...',
}) => {
    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight }}>
            <div className="spinner-border text-primary">
                <span className="visually-hidden">{message}</span>
            </div>
        </div>
    );
};

export default LoadingSpinner;
