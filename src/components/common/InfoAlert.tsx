import React from 'react';

interface InfoAlertProps {
    type: 'warning' | 'info';
    title: string;
    message: string;
}

const InfoAlert: React.FC<InfoAlertProps> = ({ type, title, message }) => {
    const alertClass = type === 'warning' ? 'alert-warning' : 'alert-info';

    return (
        <div className={`alert ${alertClass}`} role="alert">
            <h4 className="alert-heading">{title}</h4>
            <p>{message}</p>
        </div>
    );
};

export default InfoAlert;
