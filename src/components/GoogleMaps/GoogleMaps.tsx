import React, { useState } from 'react';

interface GoogleMapsProps {
    src: string;
    title: string;
    className?: string;
    fallbackMessage?: string;
}

const GoogleMaps: React.FC<GoogleMapsProps> = ({
    src,
    title,
    className = '',
    fallbackMessage = 'Bản đồ không thể tải. Có thể do trình chặn quảng cáo.',
}) => {
    const [isBlocked, setIsBlocked] = useState(false);

    const handleError = () => {
        console.warn('Google Maps iframe failed to load, likely blocked by ad blocker');
        setIsBlocked(true);
    };

    if (isBlocked) {
        return (
            <div
                className={`contact-map-fallback d-flex align-items-center justify-content-center ${className}`}
            >
                <div className="text-center p-4">
                    <i className="fas fa-map-marker-alt fa-3x text-muted mb-3"></i>
                    <p className="text-muted mb-0">{fallbackMessage}</p>
                    <button
                        className="btn btn-outline-primary btn-sm mt-2"
                        onClick={() => window.open(src, '_blank')}
                    >
                        Mở bản đồ trong tab mới
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={`contact-map d-flex ${className}`}>
            <iframe
                src={src}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={title}
                onError={handleError}
            ></iframe>
        </div>
    );
};

export default GoogleMaps;
