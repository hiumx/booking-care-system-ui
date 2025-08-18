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
    // Calculate default width and height based on screen size
    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
    // Use 80% of screen width and 70% of screen height, with min values
    const defaultWidth = Math.max(Math.floor(screenWidth * 0.8), 600);
    const defaultHeight = Math.max(Math.floor(screenHeight * 0.7), 350);

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
                x: Math.max((screenWidth - defaultWidth) / 2, 0),
                y: 60,
                width: defaultWidth,
                height: defaultHeight,
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
