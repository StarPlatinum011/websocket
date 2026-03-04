
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
  username: string;
  content: string;
  timestamp: string;
  status?: string
}

export interface OutgoingWebSocketMessage {
  type: 'SEND_MESSAGE' | 'JOIN_ROOM' | 'LEAVE_ROOM';
  payload: {
    roomId?: string;
    content?: string;
    tempId?: string
  }
}


// Data transfer object
export type ChatMessageDTO = {
  id: string
  roomId: string
  userId: string
  username: string
  content: string
  timestamp: string
  tempId?: string
}

export type ServerMessage =
  | { type: 'NEW_MESSAGE'; payload: ChatMessageDTO }
  | { type: 'ROOM_LIST'; payload: Room[] }
  | { type: 'JOIN_ROOM'; roomId: string; userId: string }
  | { type: 'LEAVE_ROOM'; roomId: string }
  | { type: 'ERROR'; payload: { message: string } }