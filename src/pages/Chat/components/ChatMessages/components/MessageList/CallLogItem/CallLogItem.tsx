import React from 'react';
import clsx from 'clsx';
import { CallLogResponse, CallStatus, CallType } from '@/types/communication.types';

interface CallLogItemProps {
    callLog: CallLogResponse;
    isOwn: boolean;
    callerName?: string;
    callerAvatar?: string;
}

const CallLogItem: React.FC<CallLogItemProps> = ({ callLog, isOwn, callerName, callerAvatar }) => {
    const formatDuration = (seconds: number | undefined): string => {
        if (seconds === undefined || seconds < 0) return '';
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;

        if (minutes > 0) {
            const secondsPart = remainingSeconds > 0 ? `${remainingSeconds} giây` : '';
            return `${minutes} phút ${secondsPart}`;
        }
        return `${seconds} giây`;
    };

    const getStatusText = (status: CallStatus): string => {
        switch (status) {
            case CallStatus.Accepted:
                return callLog.duration !== undefined && callLog.duration > 0
                    ? formatDuration(callLog.duration)
                    : 'Đã kết nối';
            case CallStatus.Missed:
                return 'Cuộc gọi nhỡ';
            case CallStatus.Rejected:
                return 'Đã từ chối';
            default:
                return 'Trạng thái không xác định';
        }
    };

    const getStatusColorClass = (status: CallStatus): string => {
        switch (status) {
            case CallStatus.Accepted:
                return 'text-success'; // Green for accepted
            case CallStatus.Missed:
                return 'text-danger'; // Red for missed
            case CallStatus.Rejected:
                return 'text-muted'; // Gray for rejected
            default:
                return 'text-muted';
        }
    };

    const getCallTypeIcon = () => {
        return callLog.type === CallType.Video ? 'ti ti-video' : 'ti ti-phone';
    };

    const getCallTypeLabel = () => {
        return callLog.type === CallType.Video ? 'Cuộc gọi video' : 'Cuộc gọi thoại';
    };

    return (
        <div className={clsx('chats', { 'chats-right': isOwn })}>
            {!isOwn && (
                <div className="chat-avatar">
                    <img
                        src={callerAvatar || '/default-avatar.png'}
                        className="dreams_chat"
                        alt="avatar"
                    />
                </div>
            )}
            <div className="chat-content">
                <div className="message-content">
                    <div className="d-flex align-items-start">
                        <i
                            className={clsx(
                                getCallTypeIcon(),
                                'fs-5',
                                getStatusColorClass(callLog.status)
                            )}
                        ></i>
                        <div className="flex-grow-1">
                            <div className="fw-medium small">
                                {getCallTypeLabel()}
                                {!isOwn && callerName && (
                                    <span className="text-muted"> từ {callerName}</span>
                                )}
                            </div>
                            <div className={clsx('small', getStatusColorClass(callLog.status))}>
                                {getStatusText(callLog.status)}
                            </div>
                        </div>
                    </div>
                    <div className="chat-time">
                        <div>
                            <div className="time" style={{ color: 'black' }}>
                                {callLog.startedAt
                                    ? new Date(callLog.startedAt).toLocaleTimeString('vi-VN', {
                                          hour: '2-digit',
                                          minute: '2-digit',
                                      })
                                    : ''}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {isOwn && (
                <div className="chat-avatar">
                    <img
                        src={callerAvatar || '/default-avatar.png'}
                        className="dreams_chat"
                        alt="avatar"
                    />
                </div>
            )}
        </div>
    );
};

export default CallLogItem;
