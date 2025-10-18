import React, { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';

import styles from './VideoCallWindow.module.scss';
import videojpg from '@/assets/img/video-call.jpg';

interface VideoCallWindowProps {
    isVisible?: boolean;
    onClose?: () => void;
    participantAvatar?: string;
}

const VideoCallWindow: React.FC<VideoCallWindowProps> = ({
    isVisible = true,
    onClose,
    participantAvatar = './src/assets/img/patients/patient1.jpg',
}) => {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isMicMuted, setIsMicMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [isSpeakerMuted, setIsSpeakerMuted] = useState(false);
    const [callDuration, setCallDuration] = useState(0);
    const [isCallActive, setIsCallActive] = useState(false);

    // Draggable state for local video
    const [isDragging, setIsDragging] = useState(false);
    const [localVideoPosition, setLocalVideoPosition] = useState({ x: 0, y: 0 }); // Transform offset from initial position
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

    // Refs for video elements - will be used for WebRTC integration
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const localVideoContainerRef = useRef<HTMLButtonElement>(null);

    // Call duration timer
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isCallActive) {
            interval = setInterval(() => {
                setCallDuration((prev) => prev + 1);
            }, 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isCallActive]);

    // Format call duration
    const formatDuration = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Toggle fullscreen
    const toggleFullscreen = () => {
        if (!containerRef.current) return;

        if (!isFullscreen) {
            if (containerRef.current.requestFullscreen) {
                containerRef.current.requestFullscreen();
            }
        } else if (document.exitFullscreen) {
            document.exitFullscreen();
        }
        setIsFullscreen(!isFullscreen);

        // Reset position when toggling fullscreen
        setTimeout(() => {
            setLocalVideoPosition({ x: 0, y: 0 });
        }, 100);
    };

    // Handle mic toggle
    const toggleMic = () => {
        setIsMicMuted(!isMicMuted);
        // Future WebRTC integration:
        // if (localStreamRef.current) {
        //     localStreamRef.current.getAudioTracks().forEach(track => {
        //         track.enabled = isMicMuted;
        //     });
        // }
    };

    // Handle video toggle
    const toggleVideo = () => {
        setIsVideoOff(!isVideoOff);
        // Future WebRTC integration:
        // if (localStreamRef.current) {
        //     localStreamRef.current.getVideoTracks().forEach(track => {
        //         track.enabled = isVideoOff;
        //     });
        // }
    };

    // Handle speaker toggle
    const toggleSpeaker = () => {
        setIsSpeakerMuted(!isSpeakerMuted);
        // Future WebRTC integration:
        // if (remoteVideoRef.current) {
        //     remoteVideoRef.current.muted = !isSpeakerMuted;
        // }
    };

    // Handle end call
    const handleEndCall = () => {
        setIsCallActive(false);
        setCallDuration(0);
        // Future WebRTC cleanup:
        // if (peerConnectionRef.current) {
        //     peerConnectionRef.current.close();
        // }
        // if (localStreamRef.current) {
        //     localStreamRef.current.getTracks().forEach(track => track.stop());
        // }
        if (onClose) {
            onClose();
        } else if (globalThis.window !== undefined) {
            const evt = new CustomEvent('closeVideoCall');
            globalThis.window.dispatchEvent(evt);
        }
    };

    // Start call (placeholder for WebRTC initialization)
    const startCall = () => {
        setIsCallActive(true);
        // Future WebRTC initialization will go here
    };

    useEffect(() => {
        if (isVisible && !isCallActive) {
            startCall();
        }
    }, [isVisible]);

    // Drag & Drop handlers for local video
    const handleMouseDown = (e: React.MouseEvent) => {
        if (!localVideoContainerRef.current || !containerRef.current) return;

        console.log('Mouse down triggered'); // Debug log
        setIsDragging(true);
        const rect = localVideoContainerRef.current.getBoundingClientRect();

        const offset = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };

        console.log('Drag offset:', offset); // Debug log
        setDragOffset(offset);

        e.preventDefault();
        e.stopPropagation();
    };

    // Double-click to snap to nearest corner
    const handleDoubleClick = () => {
        snapToCorner();
    };

    // Keyboard support for accessibility
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            snapToCorner(); // Snap to corner when Enter or Space is pressed
        }
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging || !containerRef.current || !localVideoContainerRef.current) return;

        const containerRect = containerRef.current.getBoundingClientRect();
        const localVideoWidth = 200;
        const localVideoHeight = 150;
        const padding = 16;

        // Calculate new position relative to mouse
        let newX = e.clientX - containerRect.left - dragOffset.x;
        let newY = e.clientY - containerRect.top - dragOffset.y;

        // Constrain to container bounds
        newX = Math.max(padding, Math.min(newX, containerRect.width - localVideoWidth - padding));
        newY = Math.max(padding, Math.min(newY, containerRect.height - localVideoHeight - padding));

        // Convert to transform offset (relative to initial position at top-right)
        const initialX = containerRect.width - localVideoWidth - padding;
        const initialY = padding;

        const transformX = newX - initialX;
        const transformY = newY - initialY;

        console.log('Moving to:', { transformX, transformY }); // Debug log
        setLocalVideoPosition({ x: transformX, y: transformY });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        // Don't automatically snap - let user control where they want the video
        // snapToCorner();
    };

    const handleTouchEndWithSnap = () => {
        setIsDragging(false);
        // Keep snap for touch since it's more common on mobile to want corner placement
        snapToCorner();
    };

    // Snap to nearest corner for better UX
    const snapToCorner = () => {
        if (!containerRef.current) return;

        const containerRect = containerRef.current.getBoundingClientRect();
        const { x, y } = localVideoPosition;
        const containerWidth = containerRect.width;
        const containerHeight = containerRect.height;
        const localVideoWidth = 200;
        const localVideoHeight = 150;

        // Current position (transform offset from initial top-right position)
        const initialX = containerWidth - 216; // 200px + 16px padding
        const initialY = 16;
        const currentX = initialX + x;
        const currentY = initialY + y;

        const centerX = currentX + localVideoWidth / 2;
        const centerY = currentY + localVideoHeight / 2;
        const midX = containerWidth / 2;
        const midY = containerHeight / 2;

        let targetX, targetY;

        // Determine which corner to snap to
        if (centerX < midX && centerY < midY) {
            // Top-left
            targetX = 16;
            targetY = 16;
        } else if (centerX >= midX && centerY < midY) {
            // Top-right
            targetX = containerWidth - localVideoWidth - 16;
            targetY = 16;
        } else if (centerX < midX && centerY >= midY) {
            // Bottom-left
            targetX = 16;
            targetY = containerHeight - localVideoHeight - 16;
        } else {
            // Bottom-right
            targetX = containerWidth - localVideoWidth - 16;
            targetY = containerHeight - localVideoHeight - 16;
        }

        // Convert to transform offset
        const transformX = targetX - initialX;
        const transformY = targetY - initialY;

        setLocalVideoPosition({ x: transformX, y: transformY });
    };

    // Touch handlers for mobile
    const handleTouchStart = (e: React.TouchEvent) => {
        if (!localVideoContainerRef.current || !containerRef.current) return;

        const touch = e.touches[0];
        setIsDragging(true);

        const rect = localVideoContainerRef.current.getBoundingClientRect();

        setDragOffset({
            x: touch.clientX - rect.left,
            y: touch.clientY - rect.top,
        });

        e.preventDefault();
    };

    const handleTouchMove = (e: TouchEvent) => {
        if (!isDragging || !containerRef.current) return;

        const touch = e.touches[0];
        const containerRect = containerRef.current.getBoundingClientRect();
        const localVideoWidth = 200;
        const localVideoHeight = 150;

        let newX = touch.clientX - containerRect.left - dragOffset.x;
        let newY = touch.clientY - containerRect.top - dragOffset.y;

        // Constrain to container bounds
        newX = Math.max(16, Math.min(newX, containerRect.width - localVideoWidth - 16));
        newY = Math.max(16, Math.min(newY, containerRect.height - localVideoHeight - 16));

        setLocalVideoPosition({ x: newX, y: newY });

        e.preventDefault();
    };

    // Add event listeners for mouse and touch events
    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            document.addEventListener('touchmove', handleTouchMove, { passive: false });
            document.addEventListener('touchend', handleTouchEndWithSnap);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEndWithSnap);
        };
    }, [isDragging, dragOffset]);

    return (
        <div className={clsx(styles.videoCallOverlay, { [styles.fullscreen]: isFullscreen })}>
            <div className={clsx(styles.videoCallContainer)} ref={containerRef}>
                {/* Video Call Area */}
                <div className={styles.videoCallArea}>
                    <div className={clsx(styles.singleVideo, 'd-flex')}>
                        <div className={clsx(styles.joinVideo, 'flex-fill position-relative')}>
                            {/* Remote Video */}
                            <video
                                ref={remoteVideoRef}
                                className={clsx(styles.remoteVideo, 'w-100 h-100')}
                                autoPlay
                                playsInline
                                muted={isSpeakerMuted}
                                poster={videojpg}
                            >
                                <track kind="captions" />
                            </video>

                            {/* Fallback image when no remote video */}
                            <div
                                className={clsx(styles.videoPlaceholder, {
                                    [styles.hidden]: isCallActive,
                                })}
                            >
                                <img
                                    src={videojpg}
                                    className="img-fluid w-100"
                                    alt="Video background"
                                />
                            </div>

                            {/* Local Video (Picture in Picture) - Draggable */}
                            <button
                                ref={localVideoContainerRef}
                                className={clsx(
                                    styles.localVideoContainer,
                                    styles.draggable,
                                    { [styles.dragging]: isDragging },
                                    'video-avatar'
                                )}
                                style={{
                                    position: 'absolute',
                                    right: '16px',
                                    top: '16px',
                                    padding: '8px',
                                    cursor: isDragging ? 'grabbing' : 'grab',
                                    zIndex: isDragging ? 1001 : 1000,
                                    transform: `translate(${localVideoPosition.x}px, ${localVideoPosition.y}px)`,
                                    border: 'none',
                                    background: 'transparent',
                                }}
                                onMouseDown={handleMouseDown}
                                onTouchStart={handleTouchStart}
                                onDoubleClick={handleDoubleClick}
                                onClick={snapToCorner}
                                onKeyDown={handleKeyDown}
                                type="button"
                                aria-label="Local video - kéo để di chuyển, click để snap về góc"
                                title="Kéo để di chuyển, click để snap về góc"
                            >
                                <video
                                    ref={localVideoRef}
                                    className={clsx(
                                        styles.localVideo,
                                        'img-fluid rounded border border-primary'
                                    )}
                                    autoPlay
                                    playsInline
                                    muted
                                    style={{ display: isVideoOff ? 'none' : 'block' }}
                                />
                                {/* Avatar fallback when video is off */}
                                <img
                                    src={participantAvatar}
                                    className={clsx('img-fluid rounded border border-primary', {
                                        'd-none': !isVideoOff,
                                    })}
                                    alt="User avatar"
                                />

                                {/* Drag indicator */}
                                <div className={clsx(styles.dragIndicator)}>
                                    <i className="isax isax-menu"></i>
                                </div>
                            </button>

                            {/* Call Duration and Fullscreen Button */}
                            <div className="position-absolute start-0 top-0 p-2 z-1 d-flex align-items-center">
                                <div className="me-2">
                                    <span className="bg-light-subtle rounded badge text-dark p-2 d-inline-flex align-items-center">
                                        <i className="isax isax-clock me-1 text-success"></i>
                                        {formatDuration(callDuration)}
                                    </span>
                                </div>
                                <button
                                    onClick={toggleFullscreen}
                                    className={clsx(styles.btn, 'btn p-0 avatar-sm btn-light')}
                                    type="button"
                                >
                                    <i
                                        className={`isax ${isFullscreen ? 'X' : 'isax-maximize-3'}`}
                                    ></i>
                                </button>
                            </div>

                            {/* Call Controls */}
                            <div className="d-flex justify-content-center align-items-center flex-wrap w-100 position-absolute bottom-0 z-2 p-3">
                                <div
                                    className={clsx(
                                        styles.buttonItems,
                                        'bg-light bg-opacity-50 px-4 py-3 rounded-pill d-flex justify-content-center align-items-center gap-2'
                                    )}
                                >
                                    {/* Microphone Toggle */}
                                    <button
                                        onClick={toggleMic}
                                        className={clsx(
                                            styles.btnIcon,
                                            'btn btn-sm d-flex justify-content-center align-items-center rounded-circle',
                                            isMicMuted
                                                ? 'bg-danger text-white'
                                                : 'bg-light text-dark'
                                        )}
                                        type="button"
                                        title={isMicMuted ? 'Bật microphone' : 'Tắt microphone'}
                                    >
                                        <i
                                            className={`isax ${isMicMuted ? 'isax-microphone-slash' : 'isax-microphone-2'}`}
                                        ></i>
                                    </button>

                                    {/* Video Toggle */}
                                    <button
                                        onClick={toggleVideo}
                                        className={clsx(
                                            styles.btnIcon,
                                            'btn btn-sm d-flex justify-content-center align-items-center rounded-circle',
                                            isVideoOff
                                                ? 'bg-danger text-white'
                                                : 'bg-light text-dark'
                                        )}
                                        type="button"
                                        title={isVideoOff ? 'Bật camera' : 'Tắt camera'}
                                    >
                                        <i
                                            className={`isax ${isVideoOff ? 'isax-video-slash' : 'isax-video'}`}
                                        ></i>
                                    </button>

                                    {/* End Call */}
                                    <button
                                        onClick={handleEndCall}
                                        className={clsx(
                                            styles.btnIcon,
                                            styles.btnLg,
                                            'btn btn-lg text-white bg-danger d-flex justify-content-center align-items-center rounded-circle mx-2'
                                        )}
                                        type="button"
                                        title="Kết thúc cuộc gọi"
                                    >
                                        <i className="isax isax-call-slash"></i>
                                    </button>

                                    {/* Speaker Toggle */}
                                    <button
                                        onClick={toggleSpeaker}
                                        className={clsx(
                                            styles.btnIcon,
                                            'btn btn-sm d-flex justify-content-center align-items-center rounded-circle',
                                            isSpeakerMuted
                                                ? 'bg-danger text-white'
                                                : 'bg-light text-dark'
                                        )}
                                        type="button"
                                        title={isSpeakerMuted ? 'Bật loa' : 'Tắt loa'}
                                    >
                                        <i
                                            className={`isax ${isSpeakerMuted ? 'isax-volume-slash' : 'isax-volume-high'}`}
                                        ></i>
                                    </button>

                                    {/* Screen Share (for future implementation) */}
                                    <button
                                        className={clsx(
                                            styles.btnIcon,
                                            'btn btn-sm bg-light text-dark d-flex align-items-center justify-content-center rounded-circle'
                                        )}
                                        type="button"
                                        title="Chia sẻ màn hình"
                                    >
                                        <i className="isax isax-screenmirroring"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoCallWindow;
