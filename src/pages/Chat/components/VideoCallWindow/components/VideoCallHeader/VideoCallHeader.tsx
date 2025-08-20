import React from 'react';

interface VideoCallHeaderProps {
    onClose: () => void;
    onToggleFullscreen: () => void;
    isFullscreen: boolean;
}

const VideoCallHeader: React.FC<VideoCallHeaderProps> = ({
    onClose,
    onToggleFullscreen,
    isFullscreen,
}) => (
    <div
        className="fixed-header"
        style={{ cursor: isFullscreen ? 'default' : 'move', userSelect: 'none' }}
    >
        <div className="navbar">
            <div className="user-details">
                <div className="float-start user-img">
                    <a
                        className="avatar avatar-sm me-2"
                        href="patient-profile.html"
                        title="Charlene Reed"
                    >
                        <img
                            src="./src/assets/img/patients/patient1.jpg"
                            alt="User Image"
                            className="rounded-circle"
                        />
                        <span className="status online"></span>
                    </a>
                </div>
                <div className="user-info float-start">
                    <a href="patient-profile.html">
                        <span>Charlene Reed</span>
                    </a>
                    <span className="last-seen">Online</span>
                </div>
            </div>
            <ul className="nav float-end custom-menu">
                <li className="nav-item">
                    <button
                        type="button"
                        className="btn btn-danger me-2"
                        style={{ minWidth: 32, minHeight: 32, borderRadius: '50%' }}
                        onClick={onClose}
                        title="Đóng video call"
                    >
                        <i className="fa fa-close"></i>
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        type="button"
                        className="btn btn-secondary"
                        style={{ minWidth: 32, minHeight: 32, borderRadius: '50%' }}
                        onClick={onToggleFullscreen}
                        title={isFullscreen ? 'Thu nhỏ video call' : 'Toàn màn hình video call'}
                    >
                        <i className={`fa ${isFullscreen ? 'fa-compress' : 'fa-expand'}`}></i>
                    </button>
                </li>
            </ul>
        </div>
    </div>
);

export default VideoCallHeader;
