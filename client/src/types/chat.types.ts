
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
  type: 'SEND_MESSAGE' | 'JOIN_ROOM' | 'LEVAE_ROOM';
  roomId?: string;
  content?: string;
}
