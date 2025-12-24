import { useState, useEffect, useRef } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';
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
    const navigate = useNavigate();
    const [showIncomingCallWindow, setShowIncomingCallWindow] = useState(false);
    const [currentCall, setCurrentCall] = useState<IncomingCallData | null>(null);

    // ✅ Track if a call is currently being handled to prevent duplicates
    const handlingCallRef = useRef<string | null>(null);

    // Get incoming call from global context
    const { clearIncomingCall } = useGlobalChat();

    // Handle incoming call from navigation state (when accepting from notification)
    useEffect(() => {
        const navState = location.state as { incomingCall?: IncomingCallData };

        console.log('[ChatMessages] 🔍 useEffect triggered, navState:', navState);
        console.log('[ChatMessages] 🔍 handlingCallRef.current:', handlingCallRef.current);

        if (navState?.incomingCall) {
            const callId = `${navState.incomingCall.callerId}-${navState.incomingCall.conversationId}`;

            // ✅ Check if already handling this call
            if (handlingCallRef.current === callId) {
                console.log('[ChatMessages] ⏭️ Already handling this call, ignoring');
                return;
            }

            console.log(
                '[ChatMessages] 📞 Received incoming call from navigation:',
                navState.incomingCall
            );

            // ✅ Mark as handling
            handlingCallRef.current = callId;

            setCurrentCall(navState.incomingCall);
            setShowIncomingCallWindow(true);
            // Clear global incoming call to prevent duplicate
            clearIncomingCall();
        }
    }, [location.state, clearIncomingCall]);

    // ✅ REMOVED: Auto-accept logic
    // Now GlobalChatProvider will always show IncomingCallNotification
    // User can choose to Accept (navigate here) or Decline

    const handleCloseCallWindow = () => {
        console.log('[ChatMessages] Closing call window');
        setShowIncomingCallWindow(false);
        setCurrentCall(null);
        // ✅ Reset handling ref when call closes
        handlingCallRef.current = null;
        // ✅ Clear location state to prevent auto-accepting next call
        console.log('[ChatMessages] Clearing location state');
        navigate('/chat', { replace: true, state: {} });
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
