import React from 'react';

interface ErrorAlertProps {
    title?: string;
    message: string;
    onRetry?: () => void;
    retryButtonText?: string;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({
    title = 'Lỗi!',
    message,
    onRetry,
    retryButtonText = 'Thử lại',
}) => {
    return (
        <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading">{title}</h4>
            <p>{message}</p>
            {onRetry && (
                <>
                    <hr />
                    <button className="btn btn-outline-danger" onClick={onRetry}>
                        {retryButtonText}
                    </button>
                </>
            )}
        </div>
    );
};

export default ErrorAlert;
