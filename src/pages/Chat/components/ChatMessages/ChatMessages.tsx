import { useState, useEffect } from 'react';

import { useLocation } from 'react-router-dom';
import clsx from 'clsx';
import ChatHeader from './components/ChatHeader';
import MessageList from './components/MessageList';
import ChatFooter from './components/ChatFooter';
import VideoCallWindow from '../VideoCallWindow';

import { useGlobalChat } from '@/providers/GlobalChatProvider';
import type { IncomingCallData } from '@/hooks/useChatHub';

import styles from './ChatMessages.module.scss';

const ChatMessages = () => {
    const location = useLocation();
    const [showIncomingCallWindow, setShowIncomingCallWindow] = useState(false);
    const [currentCall, setCurrentCall] = useState<IncomingCallData | null>(null);

    // Get incoming call from global context
    const { incomingCall, clearIncomingCall } = useGlobalChat();

    // Handle incoming call from navigation state (when accepting from notification)
    useEffect(() => {
        const navState = location.state as { incomingCall?: IncomingCallData };
        if (navState?.incomingCall) {
            console.log(
                '[ChatMessages] 📞 Received incoming call from navigation:',
                navState.incomingCall
            );
            setCurrentCall(navState.incomingCall);
            setShowIncomingCallWindow(true);
            // Clear global incoming call to prevent duplicate
            clearIncomingCall();
            // Clear navigation state
            window.history.replaceState({}, document.title);
        }
    }, [location, clearIncomingCall]);

    // Auto-show call window if there's an incoming call and user is ALREADY on chat page
    // Only show if we don't already have a currentCall to avoid duplicates
    useEffect(() => {
        if (incomingCall && !currentCall && !showIncomingCallWindow) {
            console.log('[ChatMessages] 📞 Auto-accepting call on chat page:', incomingCall);
            setCurrentCall(incomingCall);
            setShowIncomingCallWindow(true);
            // Clear global incoming call to prevent it from triggering again
            clearIncomingCall();
        }
    }, [incomingCall, currentCall, showIncomingCallWindow, clearIncomingCall]);

    const handleCloseCallWindow = () => {
        console.log('[ChatMessages] Closing call window');
        setShowIncomingCallWindow(false);
        setCurrentCall(null);
    };

    return (
        <>
            <div className="chat chat-messages" id="middle">
                <ChatHeader />
                <div className={clsx(styles.chatMessagesScroll, 'slimscroll chat-messages-scroll')}>
                    <div className="chat-body">
                        <MessageList />
                    </div>
                </div>
                <ChatFooter setIsTyping={() => {}} />
            </div>

            {/* Video Call Window - For Incoming Calls */}
            {showIncomingCallWindow && currentCall && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        zIndex: 9999,
                    }}
                >
                    <VideoCallWindow
                        isVisible={showIncomingCallWindow}
                        onClose={handleCloseCallWindow}
                        participantId={currentCall.callerId}
                        conversationId={currentCall.conversationId}
                        participantName={currentCall.callerName || 'User'}
                        participantAvatar={currentCall.callerAvatar}
                        callType="video"
                        isIncoming={true}
                    />
                </div>
            )}
        </>
    );
};

export default ChatMessages;
