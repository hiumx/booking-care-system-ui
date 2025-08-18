import { useState } from 'react';
import { Rnd } from 'react-rnd';
import VideoCallHeader from './components/VideoCallHeader';
import VideoCallContent from './components/VideoCallContent';
import VideoCallFooter from './components/VideoCallFooter';

const VideoCallWindow = () => {
    const [isFullscreen, setIsFullscreen] = useState(false);

    const handleFullscreen = () => {
        setIsFullscreen((prev) => !prev);
    };
    const handleClose = () => {
        if (typeof window !== 'undefined') {
            const evt = new CustomEvent('closeVideoCall');
            window.dispatchEvent(evt);
        }
    };
    return isFullscreen ? (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 9999,
                background: '#fff',
                boxShadow: '0 2px 16px rgba(0,0,0,0.2)',
                borderRadius: 0,
            }}
        >
            <div className={' content'} style={{ height: '100%' }}>
                <div className="container-fluid h-100">
                    <div className="row h-100">
                        <div className="col-12 h-100">
                            <div className={' call-wrapper'} style={{ height: '100%' }}>
                                <div className="call-main-row h-100">
                                    <div className="call-main-wrapper h-100">
                                        <div className="call-view h-100">
                                            <div className="call-window h-100">
                                                <VideoCallHeader
                                                    onClose={handleClose}
                                                    onToggleFullscreen={handleFullscreen}
                                                    isFullscreen={isFullscreen}
                                                />
                                                <VideoCallContent />
                                                <VideoCallFooter
                                                    onClose={handleClose}
                                                    onToggleFullscreen={handleFullscreen}
                                                    isFullscreen={isFullscreen}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ) : (
        <Rnd
            default={{
                x: Math.max((window.innerWidth - 1100) / 2, 0),
                y: 60,
                width: 1100,
                height: 700,
            }}
            minWidth={600}
            minHeight={350}
            bounds="window"
            dragHandleClassName="fixed-header"
            enableResizing={{
                top: true,
                right: true,
                bottom: true,
                left: true,
                topRight: true,
                bottomRight: true,
                bottomLeft: true,
                topLeft: true,
            }}
            style={{
                zIndex: 9999,
                position: 'fixed',
                boxShadow: '0 2px 16px rgba(0,0,0,0.2)',
                background: '#fff',
                borderRadius: 8,
            }}
        >
            <div className={' content'}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12 mx-auto">
                            <div className={' call-wrapper'}>
                                <div className="call-main-row">
                                    <div className="call-main-wrapper">
                                        <div className="call-view">
                                            <div className="call-window">
                                                <VideoCallHeader
                                                    onClose={handleClose}
                                                    onToggleFullscreen={handleFullscreen}
                                                    isFullscreen={isFullscreen}
                                                />
                                                <VideoCallContent />
                                                <VideoCallFooter
                                                    onClose={handleClose}
                                                    onToggleFullscreen={handleFullscreen}
                                                    isFullscreen={isFullscreen}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Rnd>
    );
};

export default VideoCallWindow;
