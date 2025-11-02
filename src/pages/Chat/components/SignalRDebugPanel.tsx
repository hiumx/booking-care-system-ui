import React, { useState, useEffect } from 'react';
import { useChat } from '@/providers/ChatProvider';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

/**
 * SignalR Debug Panel Component
 * Hiển thị thông tin debug cho SignalR connection
 * Sử dụng để kiểm tra và troubleshoot kết nối
 */
const SignalRDebugPanel: React.FC = () => {
    const { isConnected, conversations, activeConversation, messages, onlineUsers } = useChat();
    const userProfile = useSelector((state: RootState) => state.user.profile);
    const accessToken = useSelector((state: RootState) => state.auth.accessToken);
    const [showDebug, setShowDebug] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);

    useEffect(() => {
        // Add connection status to logs
        const status = isConnected ? 'CONNECTED ✅' : 'DISCONNECTED ❌';
        addLog(`Connection Status: ${status}`);
    }, [isConnected]);

    const addLog = (message: string) => {
        const timestamp = new Date().toLocaleTimeString();
        setLogs((prev) => [...prev.slice(-20), `[${timestamp}] ${message}`]); // Keep last 20 logs
    };

    // Test connection info
    const connectionInfo = {
        'Hub URL': `${import.meta.env.VITE_GATEWAY_URL}/api/v1/communication/chatHub`,
        'Gateway URL': import.meta.env.VITE_GATEWAY_URL || 'NOT SET ⚠️',
        'API Base URL': import.meta.env.VITE_API_URL || 'NOT SET ⚠️',
        'Backend Auth': '[AllowAnonymous] 🔓',
        'User ID': userProfile?.accountId || userProfile?.id || 'Anonymous (not logged in)',
        'Has Token': accessToken
            ? `YES (${accessToken.substring(0, 20)}...)`
            : 'NO (Anonymous mode)',
        'Connection Status': isConnected ? 'CONNECTED ✅' : 'DISCONNECTED ❌',
        'Conversations Loaded': conversations.length,
        'Active Conversation': activeConversation?.id || 'None',
        'Messages Loaded': messages.length,
        'Online Users': onlineUsers.size,
    };

    if (!showDebug) {
        return (
            <button
                onClick={() => setShowDebug(true)}
                className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 z-50"
                title="Show SignalR Debug Panel"
            >
                🔍 Debug SignalR
            </button>
        );
    }

    return (
        <div className="fixed bottom-0 right-0 w-96 bg-white border-2 border-blue-500 rounded-tl-lg shadow-2xl z-50 max-h-96 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-blue-500 text-white px-4 py-2 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <span className="text-lg font-bold">SignalR Debug</span>
                    <span
                        className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'} animate-pulse`}
                    ></span>
                </div>
                <button
                    onClick={() => setShowDebug(false)}
                    className="text-white hover:text-gray-200 text-xl font-bold"
                >
                    ×
                </button>
            </div>

            {/* Anonymous Mode Warning */}
            {isConnected && !accessToken && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 text-xs">
                    <p className="font-bold text-yellow-800">⚠️ Anonymous Mode</p>
                    <p className="text-yellow-700 mt-1">
                        SignalR connected but you need to login to use chat features.
                    </p>
                </div>
            )}

            {/* Connection Info */}
            <div className="p-4 border-b bg-gray-50 overflow-y-auto max-h-48">
                <h3 className="font-bold mb-2 text-sm">Connection Info:</h3>
                {Object.entries(connectionInfo).map(([key, value]) => (
                    <div key={key} className="text-xs mb-1 flex">
                        <span className="font-semibold w-1/2">{key}:</span>
                        <span className="w-1/2 break-all">{value}</span>
                    </div>
                ))}
            </div>

            {/* Action Buttons */}
            <div className="p-3 border-b bg-gray-50 flex gap-2 flex-wrap">
                <button
                    onClick={() => {
                        console.log('=== SignalR Debug Info ===');
                        console.log('Connection Info:', connectionInfo);
                        console.log('User Profile:', userProfile);
                        console.log('Conversations:', conversations);
                        console.log('Messages:', messages);
                        console.log('Online Users:', Array.from(onlineUsers));
                        addLog('Debug info printed to console');
                    }}
                    className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                >
                    Log to Console
                </button>
                <button
                    onClick={() => {
                        addLog('🔍 Testing connection...');
                        addLog('');

                        // Check environment
                        if (!import.meta.env.VITE_GATEWAY_URL) {
                            addLog('❌ VITE_GATEWAY_URL not set');
                            addLog(
                                '💡 Create .env.local with: VITE_GATEWAY_URL=http://localhost:5000'
                            );
                            return;
                        } else {
                            addLog('✅ Gateway URL configured');
                        }

                        // Check backend status
                        addLog('ℹ️  Backend: ChatHub is [AllowAnonymous] - no auth required');

                        // Check token (optional for anonymous)
                        if (!accessToken) {
                            addLog('⚠️  No access token (Anonymous mode)');
                            addLog('ℹ️  You can connect, but features need login:');
                            addLog('   - JoinConversation requires userId');
                            addLog('   - SendMessage requires userId');
                            addLog('   - GetUserId() will return empty');
                        } else {
                            addLog('✅ Access token present (Authenticated mode)');
                        }

                        addLog('');

                        // Final verdict
                        if (isConnected) {
                            addLog('✅ Connection test PASSED!');
                            addLog('🎉 SignalR is connected and working!');
                            if (!accessToken) {
                                addLog('💡 Login to use chat features');
                            }
                        } else {
                            addLog('❌ Connection test FAILED');
                            addLog('💡 Possible issues:');
                            addLog('   1. Backend not running (check port 5000 & 6005)');
                            addLog('   2. CORS not configured for your frontend URL');
                            addLog('   3. Network/firewall blocking connection');
                        }
                    }}
                    className="px-3 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
                >
                    Test Connection
                </button>
                <button
                    onClick={() => setLogs([])}
                    className="px-3 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600"
                >
                    Clear Logs
                </button>
            </div>

            {/* Logs */}
            <div className="flex-1 overflow-y-auto p-3 bg-black text-green-400 font-mono text-xs">
                {logs.length === 0 ? (
                    <div className="text-gray-500">No logs yet...</div>
                ) : (
                    logs.map((log, index) => (
                        <div key={index} className="mb-1">
                            {log}
                        </div>
                    ))
                )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 bg-gray-100 text-xs text-gray-600 border-t">
                Press F12 to open Developer Console for more details
            </div>
        </div>
    );
};

export default SignalRDebugPanel;
