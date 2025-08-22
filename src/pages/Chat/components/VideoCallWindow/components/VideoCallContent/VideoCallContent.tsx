import React from 'react';

const VideoCallContent: React.FC = () => (
    <div className="call-contents h-100">
        <div className="call-content-wrap h-100">
            <div className="user-video h-75">
                <img
                    src="./src/assets/img/video-call.jpg"
                    alt="User Image"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
            </div>
            <div className="my-video">
                <ul>
                    <li>
                        <img
                            src="./src/assets/img/patients/patient1.jpg"
                            className="img-fluid"
                            alt="User Image"
                        />
                    </li>
                </ul>
            </div>
        </div>
    </div>
);

export default VideoCallContent;
