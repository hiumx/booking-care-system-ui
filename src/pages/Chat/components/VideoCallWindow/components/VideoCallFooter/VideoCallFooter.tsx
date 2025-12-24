import React from 'react';

interface VideoCallFooterProps {
    onClose: () => void;
    onToggleFullscreen: () => void;
    isFullscreen: boolean;
}

const VideoCallFooter: React.FC<VideoCallFooterProps> = ({ onClose }) => (
    <div className="call-footer">
        <div className="call-icons">
            <ul className="call-items">
                <li className="call-item">
                    <a
                        href="#"
                        className="mute-video"
                        title="Enable Video"
                        data-placement="top"
                        data-bs-toggle="tooltip"
                    >
                        <i className="isax isax-video"></i>
                    </a>
                </li>
                <li className="call-item">
                    <a href="#" className="call-end" title="Kết thúc cuộc gọi" onClick={onClose}>
                        <i className="isax isax-call"></i>
                    </a>
                </li>
                <li className="call-item">
                    <a
                        href="#"
                        className="mute-bt"
                        title="Mute"
                        data-placement="top"
                        data-bs-toggle="tooltip"
                    >
                        <i className="isax isax-microphone-2"></i>
                    </a>
                </li>
            </ul>
        </div>
    </div>
);

export default VideoCallFooter;
