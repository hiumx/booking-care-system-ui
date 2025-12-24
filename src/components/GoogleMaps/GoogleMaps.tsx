import React, { useState, useMemo } from 'react';

interface GoogleMapsProps {
    src?: string;
    address?: string;
    title: string;
    className?: string;
    fallbackMessage?: string;
}

const GoogleMaps: React.FC<GoogleMapsProps> = ({
    src,
    address,
    title,
    className = '',
    fallbackMessage = 'Bản đồ không thể tải. Có thể do trình chặn quảng cáo.',
}) => {
    const [isBlocked, setIsBlocked] = useState(false);

    // Generate Google Maps embed URL from address
    const mapSrc = useMemo(() => {
        if (src) return src;
        if (address) {
            // Use Google Maps search URL (no API key needed)
            const encodedAddress = encodeURIComponent(address);
            return `https://maps.google.com/maps?q=${encodedAddress}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
        }
        return '';
    }, [src, address]);

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
                        onClick={() => {
                            if (address) {
                                window.open(
                                    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`,
                                    '_blank'
                                );
                            } else {
                                window.open(mapSrc, '_blank');
                            }
                        }}
                    >
                        Mở bản đồ trong tab mới
                    </button>
                </div>
            </div>
        );
    }

    if (!mapSrc) {
        return (
            <div
                className={`contact-map-fallback d-flex align-items-center justify-content-center ${className}`}
            >
                <div className="text-center p-4">
                    <i className="fas fa-map-marker-alt fa-3x text-muted mb-3"></i>
                    <p className="text-muted mb-0">Không có thông tin địa chỉ</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`contact-map d-flex ${className}`}>
            <iframe
                src={mapSrc}
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
