
export interface Room {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
}

export interface Message {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: string;
  isMine: boolean;
}

export interface WebSocketMessage {
  type: 'send_message' | 'join_room' | 'leave_room';
  roomId?: string;
  content?: string;
}
