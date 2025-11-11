# Chat Module - Integration Guide

## 📋 Tổng quan

Chat module đã được tích hợp với **Communication Service** backend thông qua:

- ✅ **SignalR ChatHub** - Real-time messaging
- ✅ **REST API** - CRUD operations cho conversations và messages
- ✅ **File Upload** - AWS S3 + CloudFront integration

## 🏗️ Kiến trúc

```
Chat.tsx (Root)
  └── ChatProvider (Context - SignalR + State Management)
       ├── ChatSidebar
       │    └── ChatList (Hiển thị conversations từ backend)
       └── ChatMessages
            ├── ChatHeader (Hiển thị participant info + online status)
            ├── MessageList (Hiển thị messages + typing indicators)
            └── ChatFooter (Gửi messages qua SignalR/REST + file upload)
```

## 🔧 Components

### 1. **ChatProvider** (`src/providers/ChatProvider.tsx`)

Context Provider quản lý toàn bộ chat state và SignalR connection.

**Features:**

- SignalR ChatHub connection với auto-reconnect
- Load conversations từ backend
- Send/receive messages real-time
- Typing indicators
- Online/offline status tracking
- File upload support

**Hooks:**

```typescript
const {
    conversations, // Danh sách hội thoại
    activeConversation, // Hội thoại đang active
    messages, // Tin nhắn của hội thoại active
    onlineUsers, // Set các user đang online
    typingUsers, // Map user đang typing
    isLoading, // Loading conversations
    isLoadingMessages, // Loading messages
    selectConversation, // Chọn hội thoại
    sendMessage, // Gửi tin nhắn (SignalR hoặc REST)
    startTyping, // Bắt đầu typing indicator
    stopTyping, // Dừng typing indicator
    isConnected, // SignalR connection status
} = useChat();
```

### 2. **ChatSidebar** (`src/pages/Chat/components/ChatSidebar`)

Hiển thị danh sách conversations từ backend.

**Features:**

- Load conversations với participant details
- Search conversations
- Show unread count
- Show online status
- Select conversation

### 3. **ChatMessages** (`src/pages/Chat/components/ChatMessages`)

Hiển thị messages và chat interface.

#### 3.1 **ChatHeader**

- Hiển thị thông tin participant
- Online/offline status
- Call buttons (voice/video)
- Conversation actions

#### 3.2 **MessageList**

- Hiển thị messages từ backend
- Auto scroll to bottom
- Show typing indicators
- Support multiple message types (text, image, video, audio, file)

#### 3.3 **ChatFooter**

- Input tin nhắn
- Send messages qua SignalR (text) hoặc REST API (files)
- File upload (images, documents, audio)
- Typing indicators
- Emoji picker

## 🔌 API Integration

### SignalR ChatHub URL

```
http://localhost:5000/api/communication/chatHub
```

_(Qua API Gateway)_

### REST APIs

```typescript
// Conversations
GET /api/v1.0/communications/users/{userId}/conversations
GET /api/v1.0/communications/conversations/{id}
POST /api/v1.0/communications/conversations

// Messages
GET /api/v1.0/communications/conversations/{id}/messages
POST /api/v1.0/communications/messages
POST /api/v1.0/communications/messages/with-files

// File Upload
POST /api/v1.0/fileupload/upload
POST /api/v1.0/fileupload/upload-multiple
```

## 📡 SignalR Events

### Hub Methods (Client → Server)

```typescript
// Join/Leave conversation
await chatHub.joinConversation(conversationId);
await chatHub.leaveConversation(conversationId);

// Send message
await chatHub.sendMessage({
    conversationId,
    content,
    receiverId,
});

// Mark as read
await chatHub.markMessageAsRead(messageId);
await chatHub.markAllMessagesAsRead(conversationId);

// Typing indicators
await chatHub.startTyping(conversationId);
await chatHub.stopTyping(conversationId);

// Get online users
await chatHub.getOnlineUsers();
```

### Server Events (Server → Client)

```typescript
// Message received
connection.on('ReceiveMessage', (message) => {});

// Message read
connection.on('MessageRead', (data) => {});

// All messages read
connection.on('AllMessagesRead', (data) => {});

// Typing events
connection.on('UserStartedTyping', (data) => {});
connection.on('UserStoppedTyping', (data) => {});

// Online status
connection.on('UserOnline', (userId) => {});
connection.on('UserOffline', (userId) => {});

// Connection events
connection.on('JoinedConversation', (conversationId) => {});
connection.on('LeftConversation', (conversationId) => {});
connection.on('ErrorMessage', (error) => {});
```

## 🚀 Usage Example

```typescript
import { useChat } from '@/providers/ChatProvider';

function ChatComponent() {
    const {
        conversations,
        selectConversation,
        sendMessage,
        messages,
        isConnected
    } = useChat();

    // Chọn conversation
    const handleSelectConv = async (convId: string) => {
        await selectConversation(convId);
    };

    // Gửi tin nhắn text
    const handleSendMessage = async (text: string) => {
        await sendMessage(text, MessageType.TEXT);
    };

    // Gửi tin nhắn với file
    const handleSendFile = async (files: File[]) => {
        await sendMessage('', MessageType.IMAGE, files);
    };

    return (
        <div>
            <div>SignalR: {isConnected ? '✅ Connected' : '❌ Disconnected'}</div>
            {/* Rest of component */}
        </div>
    );
}
```

## 📦 Types

All types are defined in `src/types/communication.types.ts`:

- `ConversationResponse`
- `MessageResponse`
- `MessageType`
- `MessageStatus`
- `AccountDetail`
- `MessageAttachment`
- And more...

## 🔐 Authentication

SignalR và REST API đều sử dụng JWT token từ Redux store:

```typescript
const accessToken = useSelector((state: RootState) => state.auth.accessToken);
```

## ⚡ Performance Features

1. **Cursor-based Pagination** - Efficient loading cho large datasets
2. **Participant Enrichment** - Load user info qua gRPC + Redis cache
3. **Auto-reconnect** - SignalR tự động kết nối lại khi mất kết nối
4. **Lazy Loading** - Chỉ load messages khi select conversation
5. **Smart Routing** - Text messages qua SignalR, files qua REST API

## 🐛 Debug

Enable SignalR logging:

```typescript
.configureLogging(signalR.LogLevel.Debug) // In useChatHub.tsx
```

Check console for:

- `[ChatHub]` - SignalR events
- `[ChatProvider]` - State changes
- `[ChatService]` - API calls

## 📝 Notes

- Messages được cache trong ChatProvider state
- Typing indicators tự động dừng sau 3 giây không hoạt động
- File upload support: images, documents, audio
- Max file size: 200MB (documents), 100MB (videos), 50MB (audio)
- SignalR fallback to ServerSentEvents nếu WebSockets không khả dụng

## 🎯 Next Steps

1. ✅ **Hoàn thành** - SignalR integration
2. ✅ **Hoàn thành** - File upload support
3. ✅ **Hoàn thành** - Typing indicators
4. ✅ **Hoàn thành** - Online status tracking
5. 🔜 Video call integration
6. 🔜 Message search
7. 🔜 Message reactions
8. 🔜 Voice messages recording
