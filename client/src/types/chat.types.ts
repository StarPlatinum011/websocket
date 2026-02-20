
export interface Room {
  id: string;
  name: string;
  type: 'DM' | 'CHANNEL'
  lastMessage: string;
  timestamp: string;
  unread: number;
  memberHash?: string,
  otherUser?: {
    id: string
    name: string
    email: string
  }
}

export interface Message {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: string;
  isMine: boolean;
}

export interface OutgoingWebSocketMessage {
  type: 'SEND_MESSAGE' | 'JOIN_ROOM' | 'LEVAE_ROOM';
  payload: {
    roomId?: string;
    content?: string;
  }
}

export interface IncomingWebSocketMessage {
  type: 'SEND_MESSAGE' | 'JOIN_ROOM' | 'LEAVE_ROOM' | 'ROOM_LIST' | 'ERROR' | 'NEW_MESSAGE';
  
  // For NEW_MESSAGE
  messageId?: string;
  roomId?: string;
  userId?: string;
  userName?: string;
  content?: string;
  timestamp?: string;
  
  // For USER_JOINED / USER_LEFT
  userJoinedId?: string;
  userJoinedName?: string;
  
  // For ROOM_LIST
  rooms?: Room[];
  
  // For ERROR
  error?: string;
}