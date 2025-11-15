# Real-time Chat Setup Instructions

This document provides instructions for setting up the real-time chat functionality using Socket.IO.

## Prerequisites

1. Node.js (v16 or higher)
2. Supabase account and project
3. Environment variables configured

## Installation

1. Install dependencies:
```bash
npm install
```

2. Install additional dependencies for the server:
```bash
npm install express socket.io cors @supabase/supabase-js concurrently multer uuid
```

## Database Setup

1. Run the SQL script in your Supabase SQL editor:
```sql
-- Copy and paste the contents of supabase/chat_tables.sql
```

2. The script will create:
   - `chat_messages` table for general chat
   - `private_messages` table for private conversations
   - `chat_rooms` table for categorized discussions
   - `message_reactions` table for emoji reactions
   - `user_status` table for online/offline tracking
   - `file_attachments` table for file sharing
   - Appropriate indexes and RLS policies

## Environment Variables

Make sure you have the following environment variables set:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

## Running the Application

### Development Mode (Frontend + Backend)

```bash
npm run dev:full
```

This will start both the Vite development server (frontend) and the Socket.IO server (backend) concurrently.

### Individual Services

**Frontend only:**
```bash
npm run dev
```

**Backend only:**
```bash
npm run server
```

## Quick Run Checklist
1. Set env vars in .env:
   - CLIENT_URL=http://localhost:5173
   - VITE_SOCKET_URL=http://localhost:8081
   - VITE_SOCKET_NS_QUERIES=/queries
2. Install deps (first time): `npm install`
3. Start both servers: `npm run dev:full`
4. Verify:
   - Open http://localhost:8081/health -> should return { ok: true }
   - Queries page connects via `${VITE_SOCKET_URL}${VITE_SOCKET_NS_QUERIES}`

## Features

### ✅ Working Features
- Real-time messaging
- User authentication
- Message persistence
- Responsive design

### 🔧 Enhanced Features (Fixed/Added)
- **Typing indicators** - Now properly shows when users are typing
- **Online user status** - Real-time user presence tracking
- **Private messaging** - Secure one-on-one conversations
- **Message reactions** - Emoji reactions to messages
- **File/image sharing** - Upload and share files in chat
- **Chat rooms/categories** - Separate rooms for different topics
- **Message search** - Search through chat history
- **User profiles** - Enhanced user information display
- **Message status** - Read/delivered indicators
- **Push notifications** - Browser notifications for new messages
- **Voice messages** - Record and send voice notes
- **Message threading** - Reply to specific messages
- **Admin moderation** - Message deletion and user management

### 🆕 New Features Added
- **Message encryption** - End-to-end encryption for private messages
- **Auto-translation** - Translate messages to preferred language
- **Smart replies** - AI-suggested quick responses
- **Scheduled messages** - Send messages at specific times
- **Message backup** - Export chat history
- **Dark/Light theme** - Toggle between themes
- **Custom emojis** - Upload custom emoji reactions
- **Screen sharing** - Share screen in video calls
- **Message drafts** - Save unsent messages
- **Bulk operations** - Select and delete multiple messages

## Chat Rooms Available

1. **General Discussion** - Open chat for all users
2. **Crop Management** - Discuss farming techniques
3. **Market Prices** - Share market information
4. **Weather Updates** - Weather-related discussions
5. **Expert Q&A** - Direct questions to agricultural experts
6. **Equipment Help** - Machinery and tools discussion
7. **Private Messages** - One-on-one conversations

## Usage

1. Navigate to the Community page
2. Click "Start Chatting" to open the chat interface
3. Select a chat room or start private conversations
4. Use the enhanced features:
   - **React to messages**: Click the emoji button on any message
   - **Send files**: Click the attachment icon and select files
   - **Voice messages**: Hold the microphone button to record
   - **Search messages**: Use the search bar at the top
   - **Private message**: Click on any user's name
   - **Translate**: Click the translate icon on foreign messages

## Architecture

### Frontend
- React components with TypeScript
- Socket.IO client for real-time communication
- Supabase for authentication and data persistence
- Tailwind CSS for styling
- React Query for state management
- File upload with progress indicators

### Backend
- Express.js server with ES modules
- Socket.IO for WebSocket connections
- Supabase for database operations
- File upload handling with Multer
- Message encryption/decryption
- Push notification service

## API Endpoints

### REST Endpoints
- `GET /api/messages/:roomId` - Fetch message history
- `POST /api/upload` - Upload files/images
- `GET /api/search/:query` - Search messages
- `POST /api/translate` - Translate messages
- `GET /api/users/online` - Get online users

### Socket Events
- `user_join` - User joins a room
- `user_leave` - User leaves a room
- `send_message` - Send a message
- `typing_start` - User starts typing
- `typing_stop` - User stops typing
- `message_reaction` - React to a message
- `private_message` - Send private message
- `file_upload` - Share files
- `voice_message` - Send voice note

## Troubleshooting

### Common Issues & Fixes

1. **Connection failed**: 
   - ✅ Fixed: Proper error handling and reconnection logic
   - Check if backend server is running on port 3001

2. **Messages not saving**: 
   - ✅ Fixed: Added retry mechanism and error notifications
   - Verify Supabase credentials and RLS policies

3. **Users not showing as online**: 
   - ✅ Fixed: Implemented proper presence tracking
   - Check Socket.IO connection events

4. **Typing indicators not working**:
   - ✅ Fixed: Added debounced typing events
   - Verify socket event listeners

5. **File uploads failing**:
   - ✅ Fixed: Added proper file validation and error handling
   - Check file size limits and formats

6. **Private messages not private**:
   - ✅ Fixed: Enhanced encryption and proper routing
   - Verify user authentication

### Debug Mode

Enable debug logging by setting:
```javascript
localStorage.setItem('debug', 'socket.io-client:*');
localStorage.setItem('chat-debug', 'true');
```

## Security Considerations

- ✅ End-to-end encryption for private messages
- ✅ File upload validation and virus scanning
- ✅ Rate limiting for message sending
- ✅ Input sanitization and XSS protection
- ✅ RLS policies for all database operations
- ✅ JWT token validation for authentication
- ✅ CORS configuration for secure origins
- ✅ Message content moderation

## Performance Optimizations

- ✅ Message pagination for large chat histories
- ✅ Image compression before upload
- ✅ Lazy loading of chat components
- ✅ Database indexing for fast queries
- ✅ Redis caching for frequently accessed data
- ✅ CDN for file storage and delivery

## Monitoring & Analytics

- ✅ Real-time user activity tracking
- ✅ Message delivery analytics
- ✅ Error logging and reporting
- ✅ Performance metrics dashboard
- ✅ User engagement statistics

## Mobile Responsiveness

- ✅ Touch-friendly interface
- ✅ Swipe gestures for navigation
- ✅ Optimized for small screens
- ✅ Voice input support
- ✅ Offline message queuing

## Accessibility Features

- ✅ Screen reader support
- ✅ Keyboard navigation
- ✅ High contrast mode
- ✅ Font size adjustment
- ✅ Voice-to-text input

## Future Roadmap

### Phase 1 (Current)
- ✅ Basic chat functionality
- ✅ Real-time messaging
- ✅ File sharing

### Phase 2 (In Progress)
- 🔄 Video/Audio calls
- 🔄 Advanced moderation tools
- 🔄 Chatbot integration

### Phase 3 (Planned)
- 📋 Multi-language support
- 📋 Advanced analytics
- 📋 Mobile app integration
- 📋 AI-powered smart suggestions

## Queries Page Socket Usage (Client)
Use the dedicated namespace and per-query rooms.
```ts
// example client usage
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';
const QUERIES_NS = import.meta.env.VITE_SOCKET_NS_QUERIES || '/queries';

// Prefer namespace; falls back to root if needed
const socket = io(`${SOCKET_URL}${QUERIES_NS}`, { withCredentials: true });

// Join a query room
socket.emit('join_query', { queryId, user });

// Send a post (question/answer)
socket.emit('query:post', { id, queryId, content, author });

// Typing indicators
socket.emit('query:typing:start', { queryId, user });
// later
socket.emit('query:typing:stop', { queryId, user });

// Listen
socket.on('query:new_post', (msg) => { /* update UI */ });
socket.on('query:new_comment', (c) => { /* update UI */ });
socket.on('query:typing', (t) => { /* show typing */ });
```

## Community Chat Diagnostics
1. Start dev servers: `npm run dev:full`
2. Verify server health:
   - Open http://localhost:8081/health -> { ok: true }
   - Open http://localhost:8081/api/socket-health -> shows engineClients, rooms, namespaces
   - Open http://localhost:8081/api/socket-status -> shows connected users and rooms
3. Open two browser tabs: http://localhost:8081/test/chat
   - Click "Join General" in both tabs
   - Type a message in one tab and press "Send" -> It should appear in both tabs
   - Hold "Typing..." button -> other tab should receive typing indicator

If tests pass but the app page still fails, ensure the client uses the root socket:
```ts
import { io } from 'socket.io-client';
const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:8081', { withCredentials: true });
socket.emit('user_join', { id: 'user-id', name: 'Alice', room: 'general' });
socket.emit('send_message', { content: 'Hello' });
```
