import { useState } from "react";
import { useWebSocket } from "../hooks/useWebSockets";
import { Sidebar } from "../features/rooms/sidebar";
import { ChatArea } from "../features/chat/ChatArea";

const MessengerUI = () => {
  const [rooms, setRooms] = useState([
    { id: '1', name: 'Team Chat', lastMessage: 'See you tomorrow!', timestamp: '2m ago', unread: 2 },
    { id: '2', name: 'Project Alpha', lastMessage: 'Updated the docs', timestamp: '1h ago', unread: 0 },
    { id: '3', name: 'Sarah Wilson', lastMessage: 'Thanks for the help!', timestamp: '3h ago', unread: 1 },
  ]);
  
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const { wsStatus, sendMessage } = useWebSocket('ws://localhost:3000', 'your-token');

  // Demo messages data
  const demoMessages = {
    '1': [
      { id: 'm1', userId: '2', userName: 'John Doe', content: 'Hey everyone!', timestamp: new Date(Date.now() - 3600000).toISOString(), isMine: false },
      { id: 'm2', userId: 'me', userName: 'You', content: 'Hi John!', timestamp: new Date(Date.now() - 3000000).toISOString(), isMine: true },
      { id: 'm3', userId: '3', userName: 'Jane Smith', content: 'See you tomorrow!', timestamp: new Date(Date.now() - 120000).toISOString(), isMine: false },
    ],
    '2': [
      { id: 'm4', userId: '4', userName: 'Mike Johnson', content: 'Updated the docs', timestamp: new Date(Date.now() - 3600000).toISOString(), isMine: false },
    ],
    '3': [
      { id: 'm5', userId: '3', userName: 'Sarah Wilson', content: 'Can you help me with this?', timestamp: new Date(Date.now() - 7200000).toISOString(), isMine: false },
      { id: 'm6', userId: 'me', userName: 'You', content: 'Sure, what do you need?', timestamp: new Date(Date.now() - 7000000).toISOString(), isMine: true },
      { id: 'm7', userId: '3', userName: 'Sarah Wilson', content: 'Thanks for the help!', timestamp: new Date(Date.now() - 10800000).toISOString(), isMine: false },
    ],
  };

  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
    setMessages(demoMessages[room.id] || []);
    
    // Send join_room event
    sendMessage({ type: 'join_room', roomId: room.id });
    
    // Clear unread count
    setRooms(prev => prev.map(r => 
      r.id === room.id ? { ...r, unread: 0 } : r
    ));
  };

  const handleSendMessage = (content) => {
    if (!selectedRoom) return;

    const newMessage = {
      id: `m${Date.now()}`,
      userId: 'me',
      userName: 'You',
      content,
      timestamp: new Date().toISOString(),
      isMine: true
    };

    // Send via WebSocket
    sendMessage({ 
      type: 'send_message', 
      roomId: selectedRoom.id, 
      content 
    });

    setMessages(prev => [...prev, newMessage]);

    // Update room's last message
    setRooms(prev => prev.map(r => 
      r.id === selectedRoom.id 
        ? { ...r, lastMessage: content, timestamp: 'Just now' }
        : r
    ));
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        rooms={rooms}
        selectedRoom={selectedRoom}
        onRoomSelect={handleRoomSelect}
        wsStatus={wsStatus}
      />
      <ChatArea
        selectedRoom={selectedRoom}
        messages={messages}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
};

export default MessengerUI;