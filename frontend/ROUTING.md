# Routing Guide

## URL Structure

### Root Route - Mail Form
- **URL**: `http://localhost:5174/`
- **Component**: `MailForm`
- **Description**: Shows only the mail sending form when users visit the root URL.

### Chat Room Route
- **URL**: `http://localhost:5174/{roomId}`
- **Component**: `ChatRoom`
- **Description**: Automatically joins the specified room and displays the chat interface.

**Examples:**
- `http://localhost:5174/my-room-123` → Joins room "my-room-123"
- `http://localhost:5174/team-meeting` → Joins room "team-meeting"
- `http://localhost:5174/abc123` → Joins room "abc123"

## How It Works

1. **Auto-Join**: When a user navigates to `/:roomId`, the `ChatRoom` component:
   - Reads the `roomId` from the URL using React Router's `useParams()`
   - Automatically calls `/api/chat/fetchRoom/:roomId` to fetch room data
   - Joins the Socket.IO room
   - Loads existing messages from the backend

2. **Real-time Updates**: Once joined:
   - Messages sent via Socket.IO appear in real-time
   - File uploads are broadcast to all users in the room
   - Connection status is displayed

3. **Navigation**: Users can navigate between routes:
   - Click "Go to Mail" button in chat → navigates to `/`
   - Click "Go to Home" button on error → navigates to `/`
   - Direct URL access works for both routes

## Backend Integration

The frontend integrates seamlessly with your existing backend:

- **GET** `/api/chat/fetchRoom/:roomId` - Fetches room and messages
- **POST** `/api/chat/uploadFile` - Uploads files (uses cookie for roomId)
- **Socket.IO** `joinRoom` event - Joins Socket.IO room
- **Socket.IO** `message` event - Sends/receives messages
- **Socket.IO** `file` event - Receives file upload notifications

## Usage Examples

### Sharing a Room Link
Share `http://localhost:5174/team-meeting` with your team. Anyone who opens this URL will automatically join the "team-meeting" room.

### Creating New Rooms
Simply navigate to any URL with a room ID (e.g., `http://localhost:5174/new-room-name`). The backend automatically creates the room if it doesn't exist.

### Switching Rooms
To switch rooms, users can:
1. Manually change the URL in the browser
2. Or use browser navigation (back/forward)
