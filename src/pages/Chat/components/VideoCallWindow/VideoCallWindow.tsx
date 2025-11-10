import React, { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import { useSelector } from 'react-redux';

import styles from './VideoCallWindow.module.scss';
import videojpg from '@/assets/img/video-call.jpg';
import { useWebRTC } from '@/hooks/useWebRTC';
import type { RootState } from '@/store';
import { useGlobalChat } from '@/providers/GlobalChatProvider';

interface VideoCallWindowProps {
    isVisible?: boolean;
    onClose?: () => void;
    participantId: string;
    conversationId: string;
    participantName?: string;
    participantAvatar?: string;
    callType?: 'video' | 'audio';
    isIncoming?: boolean;
}

/**
 * Helper: Handle remote video playback with proper ready state checking
 */
const handleRemoteVideoPlayback = (
    videoElement: HTMLVideoElement,
    remoteVideoPlayingRef: { current: boolean }
) => {
    const tryPlay = () => {
        console.log('[VideoCallWindow] Attempting play (readyState:', videoElement.readyState, ')');

        videoElement
            .play()
            .then(() => {
                console.log('[VideoCallWindow] ✅ Remote video playing successfully');
            })
            .catch((error) => {
                console.error('[VideoCallWindow] ❌ Error playing:', error);
                remoteVideoPlayingRef.current = false;
            });
    };

    // If video has enough data, play immediately
    if (videoElement.readyState >= 2) {
        console.log('[VideoCallWindow] Video ready, playing immediately');
        tryPlay();
        return;
    }

    // Wait for video data to load
    console.log('[VideoCallWindow] Waiting for loadeddata event...');
    const onLoadedData = () => {
        console.log('[VideoCallWindow] loadeddata fired, playing now');
        tryPlay();
        videoElement.removeEventListener('loadeddata', onLoadedData);
    };
    videoElement.addEventListener('loadeddata', onLoadedData);

    // Timeout fallback
    setTimeout(() => {
        videoElement.removeEventListener('loadeddata', onLoadedData);
        console.log('[VideoCallWindow] Timeout, force trying play');
        tryPlay();
    }, 2000);
};

/**
 * Helper: Get button class based on state
 */
const getButtonClass = (isActive: boolean, baseClass: string): string => {
    return clsx(baseClass, isActive ? 'bg-danger text-white' : 'bg-light text-dark');
};

/**
 * Helper: Get icon class based on state
 */
const getIconClass = (condition: boolean, activeIcon: string, inactiveIcon: string): string => {
    return `isax ${condition ? activeIcon : inactiveIcon}`;
};

/**
 * Helper: Get button title/aria-label based on state
 */
const getButtonLabel = (condition: boolean, activeLabel: string, inactiveLabel: string): string => {
    return condition ? activeLabel : inactiveLabel;
};

const VideoCallWindow: React.FC<VideoCallWindowProps> = ({
    isVisible = true,
    onClose,
    participantId,
    conversationId,
    participantName: _participantName = 'User', // Reserved for future use
    participantAvatar: _participantAvatar = './src/assets/img/patients/patient1.jpg', // Reserved for future use
    callType: _callType = 'video', // Reserved for future use (audio/video mode)
    isIncoming = false,
}) => {
    // Get current user ID from Redux
    const { profile } = useSelector((state: RootState) => state.user);
    const userId = profile?.accountId || '';

    // Get global chat context for clearing processed calls
    const { clearProcessedCall } = useGlobalChat();

    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isSpeakerMuted, setIsSpeakerMuted] = useState(false);
    const [callDuration, setCallDuration] = useState(0);

    // Draggable state for local video
    const [isDragging, setIsDragging] = useState(false);
    const [localVideoPosition, setLocalVideoPosition] = useState({ x: 0, y: 0 });
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

    // Refs for video elements
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const localVideoContainerRef = useRef<HTMLButtonElement>(null);

    // Track if call has been initialized
    const callInitializedRef = useRef(false);

    // Track if remote video is playing (to prevent duplicate play() calls)
    const remoteVideoPlayingRef = useRef(false);

    // WebRTC Hook Integration
    const {
        callState,
        remoteStream,
        isMuted,
        isVideoOff,
        isScreenSharing,
        startCall,
        acceptCall,
        endCall,
        toggleMute,
        toggleVideo,
        toggleScreenShare,
        cleanup,
    } = useWebRTC(
        userId,
        {
            onCallStateChange: (state) => {
                console.log('[VideoCallWindow] Call state changed:', state);

                // ✅ Update ref synchronously (before React re-renders)
                callStateRef.current = state;

                if (
                    state === 'ended' ||
                    state === 'declined' ||
                    state === 'failed' ||
                    state === 'busy'
                ) {
                    // ✅ Clear processed call to allow same user to call again
                    console.log('[VideoCallWindow] Clearing processed call for:', participantId);
                    clearProcessedCall(participantId, conversationId);

                    // ✅ Reset remote video playing flag for next call
                    remoteVideoPlayingRef.current = false;

                    // ✅ Clear video srcObject when call ends to release camera/mic
                    if (localVideoRef.current) {
                        console.log(
                            '[VideoCallWindow] Clearing local video srcObject (call ended)'
                        );
                        localVideoRef.current.srcObject = null;
                    }
                    if (remoteVideoRef.current) {
                        console.log(
                            '[VideoCallWindow] Clearing remote video srcObject (call ended)'
                        );
                        remoteVideoRef.current.srcObject = null;
                    }
                    if (onClose) {
                        onClose();
                    } else if (globalThis.window !== undefined) {
                        const evt = new CustomEvent('closeVideoCall');
                        globalThis.window.dispatchEvent(evt);
                    }
                }
            },
            onRemoteStream: (stream) => {
                console.log('[VideoCallWindow] Remote stream received:', stream);
                console.log('[VideoCallWindow] Remote stream tracks:', stream.getTracks());
                console.log('[VideoCallWindow] Remote stream active:', stream.active);

                const videoTracks = stream.getVideoTracks();
                const audioTracks = stream.getAudioTracks();
                console.log('[VideoCallWindow] Video tracks:', videoTracks.length);
                console.log('[VideoCallWindow] Audio tracks:', audioTracks.length);

                if (!remoteVideoRef.current) return;

                // ✅ Only set srcObject if different (prevent "new load request")
                const currentSrcObject = remoteVideoRef.current.srcObject as MediaStream | null;
                if (currentSrcObject === stream) {
                    console.log('[VideoCallWindow] srcObject already set, skipping');
                } else {
                    console.log('[VideoCallWindow] Setting remote video srcObject');
                    remoteVideoRef.current.srcObject = stream;
                }

                // ✅ Only play when we have BOTH tracks AND haven't played yet
                const hasAllTracks = videoTracks.length > 0 && audioTracks.length > 0;
                const notYetPlaying = !remoteVideoPlayingRef.current;

                if (hasAllTracks && notYetPlaying) {
                    console.log('[VideoCallWindow] Both tracks ready, preparing to play...');
                    console.log(
                        '[VideoCallWindow] Video element readyState:',
                        remoteVideoRef.current.readyState
                    );

                    remoteVideoPlayingRef.current = true; // ✅ Mark as playing immediately
                    handleRemoteVideoPlayback(remoteVideoRef.current, remoteVideoPlayingRef);
                } else if (remoteVideoPlayingRef.current) {
                    console.log('[VideoCallWindow] ⏭️ Already playing, skipping duplicate play()');
                } else {
                    console.log('[VideoCallWindow] ⏳ Waiting for all tracks...');
                }
            },
            onLocalStream: (stream) => {
                console.log('[VideoCallWindow] Local stream received');
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }
            },
            onError: (error) => {
                console.error('[VideoCallWindow] ❌ WebRTC error:', error);
                // Don't show alert popup as it's annoying, just log to console
                // User will see the call failed through UI state changes
            },
        },
        {
            name: profile?.fullName,
            avatar: profile?.avatarUrl,
        }
    );

    // Ref to track current callState for cleanup
    const callStateRef = useRef(callState);

    // Keep callStateRef in sync
    useEffect(() => {
        callStateRef.current = callState;
    }, [callState]);

    // Call duration timer - use callState instead of isCallActive
    useEffect(() => {
        let interval: NodeJS.Timeout;
        const isActive = callState === 'connected' || callState === 'connecting';
        if (isActive) {
            interval = setInterval(() => {
                setCallDuration((prev) => prev + 1);
            }, 1000);
        } else {
            setCallDuration(0);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [callState]);

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

    // Handle speaker mute/unmute via ref
    useEffect(() => {
        if (remoteVideoRef.current) {
            remoteVideoRef.current.muted = isSpeakerMuted;
        }
    }, [isSpeakerMuted]);

    // Handle speaker toggle
    const toggleSpeaker = () => {
        setIsSpeakerMuted(!isSpeakerMuted);
    };

    // Handle end call
    const handleEndCall = () => {
        console.log('[VideoCallWindow] Ending call with:', participantId);

        // ✅ Clear video srcObject FIRST to release camera/mic immediately
        if (localVideoRef.current) {
            console.log('[VideoCallWindow] Clearing local video srcObject');
            localVideoRef.current.srcObject = null;
        }
        if (remoteVideoRef.current) {
            console.log('[VideoCallWindow] Clearing remote video srcObject');
            remoteVideoRef.current.srcObject = null;
        }

        endCall(participantId, 'User ended call');
        // Don't call cleanup() here - endCall already does it
        if (onClose) {
            onClose();
        } else if (globalThis.window !== undefined) {
            const evt = new CustomEvent('closeVideoCall');
            globalThis.window.dispatchEvent(evt);
        }
    };

    // Helper function to validate call initialization conditions
    const canInitializeCall = () => {
        if (callInitializedRef.current) {
            console.log('[VideoCallWindow] ⏸️ Call already initialized, skipping');
            return false;
        }
        if (callState !== 'idle') {
            console.log('[VideoCallWindow] ⏸️ Call already in progress, state:', callState);
            return false;
        }
        if (!isVisible || !participantId || !conversationId) {
            console.log('[VideoCallWindow] ⏸️ Missing required params');
            return false;
        }
        return true;
    };

    // Helper function to initialize the call
    const initializeCall = () => {
        console.log('[VideoCallWindow] ✅ All conditions met, initializing call');
        callInitializedRef.current = true;

        if (isIncoming) {
            console.log('[VideoCallWindow] 📞 Accepting incoming call from:', participantId);
            acceptCall(participantId, conversationId);
        } else {
            console.log('[VideoCallWindow] 📞 Starting outgoing call to:', participantId);
            startCall(participantId, conversationId);
        }
    };

    // Initialize call when component becomes visible
    useEffect(() => {
        console.log('[VideoCallWindow] 🔍 Init effect triggered:', {
            isVisible,
            participantId,
            conversationId,
            callState,
            isIncoming,
            callInitialized: callInitializedRef.current,
        });

        if (canInitializeCall()) {
            initializeCall();
        }
        // ✅ IMPORTANT: Remove acceptCall/startCall from dependencies to prevent re-initialization
        // callState is included to check if call already in progress (Strict Mode safety)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isVisible, participantId, conversationId, isIncoming, callState]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            const currentState = callStateRef.current;
            console.log('[VideoCallWindow] Component unmounting, callState:', currentState);

            // ✅ Clear video elements' srcObject to release media
            if (localVideoRef.current) {
                console.log('[VideoCallWindow] Clearing local video srcObject');
                localVideoRef.current.srcObject = null;
            }
            if (remoteVideoRef.current) {
                console.log('[VideoCallWindow] Clearing remote video srcObject');
                remoteVideoRef.current.srcObject = null;
            }

            // ✅ ONLY cleanup if call is truly ending (not Strict Mode remount)
            // If call is active (calling/connecting/connected), DON'T cleanup - Strict Mode remount
            if (
                currentState === 'idle' ||
                currentState === 'ended' ||
                currentState === 'declined' ||
                currentState === 'failed'
            ) {
                console.log('[VideoCallWindow] Call inactive, running cleanup');
                cleanup();
                console.log('[VideoCallWindow] Resetting initialization flag');
                callInitializedRef.current = false;
            } else {
                console.log(
                    '[VideoCallWindow] Call active, skipping cleanup (Strict Mode remount)'
                );
                console.log('[VideoCallWindow] Call active, keeping initialization flag');
            }
        };
        // ✅ Empty deps - only run on mount/unmount
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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

    // Helper: Calculate target corner position
    const calculateTargetCorner = (params: {
        centerX: number;
        centerY: number;
        midX: number;
        midY: number;
        containerWidth: number;
        containerHeight: number;
        videoWidth: number;
        videoHeight: number;
        padding: number;
    }) => {
        const {
            centerX,
            centerY,
            midX,
            midY,
            containerWidth,
            containerHeight,
            videoWidth,
            videoHeight,
            padding,
        } = params;

        const isLeft = centerX < midX;
        const isTop = centerY < midY;

        const targetX = isLeft ? padding : containerWidth - videoWidth - padding;
        const targetY = isTop ? padding : containerHeight - videoHeight - padding;

        return { targetX, targetY };
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
        const padding = 16;

        // Current position (transform offset from initial top-right position)
        const initialX = containerWidth - 216; // 200px + 16px padding
        const initialY = padding;
        const currentX = initialX + x;
        const currentY = initialY + y;

        const centerX = currentX + localVideoWidth / 2;
        const centerY = currentY + localVideoHeight / 2;
        const midX = containerWidth / 2;
        const midY = containerHeight / 2;

        // Determine which corner to snap to
        const { targetX, targetY } = calculateTargetCorner({
            centerX,
            centerY,
            midX,
            midY,
            containerWidth,
            containerHeight,
            videoWidth: localVideoWidth,
            videoHeight: localVideoHeight,
            padding,
        });

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
                                muted={false}
                                poster={videojpg}
                            >
                                <track kind="captions" />
                            </video>

                            {/* Fallback image when no remote video */}
                            <div
                                className={clsx(styles.videoPlaceholder, {
                                    [styles.hidden]:
                                        callState === 'connected' || remoteStream !== null,
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
                                    cursor: getButtonLabel(isDragging, 'grabbing', 'grab'),
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
                                    style={{ display: getButtonLabel(isVideoOff, 'none', 'block') }}
                                />
                                {/* Avatar fallback when video is off - Show current user's avatar */}
                                <img
                                    src={
                                        profile?.avatarUrl ||
                                        './src/assets/img/patients/patient1.jpg'
                                    }
                                    className={clsx('img-fluid rounded border border-primary', {
                                        'd-none': !isVideoOff,
                                    })}
                                    alt="My avatar"
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
                                    <i className={`isax isax-maximize-3`}></i>
                                </button>
                            </div>

                            {/* Call Controls */}
                            <div className="d-flex justify-content-center align-items-center flex-wrap w-100 position-fixed fixed-bottom bottom-0 z-2 p-3">
                                <div
                                    className={clsx(
                                        styles.buttonItems,
                                        'bg-light bg-opacity-50 px-4 py-2 rounded-pill d-flex justify-content-center align-items-center gap-2'
                                    )}
                                >
                                    {/* Microphone Toggle */}
                                    <button
                                        onClick={toggleMute}
                                        className={getButtonClass(
                                            isMuted,
                                            `${styles.btnIcon} btn btn-sm d-flex justify-content-center align-items-center rounded-circle`
                                        )}
                                        type="button"
                                        title={getButtonLabel(
                                            isMuted,
                                            'Bật microphone',
                                            'Tắt microphone'
                                        )}
                                        aria-label={getButtonLabel(isMuted, 'Bật mic', 'Tắt mic')}
                                    >
                                        <i
                                            className={getIconClass(
                                                isMuted,
                                                'isax-microphone-slash',
                                                'isax-microphone-2'
                                            )}
                                        ></i>
                                    </button>

                                    {/* Video Toggle */}
                                    <button
                                        onClick={toggleVideo}
                                        className={getButtonClass(
                                            isVideoOff,
                                            `${styles.btnIcon} btn btn-sm d-flex justify-content-center align-items-center rounded-circle`
                                        )}
                                        type="button"
                                        title={getButtonLabel(
                                            isVideoOff,
                                            'Bật camera',
                                            'Tắt camera'
                                        )}
                                        aria-label={getButtonLabel(
                                            isVideoOff,
                                            'Bật video',
                                            'Tắt video'
                                        )}
                                    >
                                        <i
                                            className={getIconClass(
                                                isVideoOff,
                                                'isax-video-slash',
                                                'isax-video'
                                            )}
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
                                        className={getButtonClass(
                                            isSpeakerMuted,
                                            `${styles.btnIcon} btn btn-sm d-flex justify-content-center align-items-center rounded-circle`
                                        )}
                                        type="button"
                                        title={getButtonLabel(isSpeakerMuted, 'Bật loa', 'Tắt loa')}
                                    >
                                        <i
                                            className={getIconClass(
                                                isSpeakerMuted,
                                                'isax-volume-slash',
                                                'isax-volume-high'
                                            )}
                                        ></i>
                                    </button>

                                    {/* Screen Share */}
                                    <button
                                        onClick={toggleScreenShare}
                                        className={clsx(
                                            styles.btnIcon,
                                            'btn btn-sm d-flex align-items-center justify-content-center rounded-circle',
                                            isScreenSharing
                                                ? 'bg-primary text-white'
                                                : 'bg-light text-dark'
                                        )}
                                        type="button"
                                        title={getButtonLabel(
                                            isScreenSharing,
                                            'Dừng chia sẻ màn hình',
                                            'Chia sẻ màn hình'
                                        )}
                                        aria-label={getButtonLabel(
                                            isScreenSharing,
                                            'Dừng chia sẻ',
                                            'Chia sẻ màn hình'
                                        )}
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
