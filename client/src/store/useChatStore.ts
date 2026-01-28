import { create } from "zustand";
import { Message, Room, OutgoingWebSocketMessage } from '../types/chat.types';


interface ChatState {
    //States
    rooms: Room[];
    messages: Record<string, Message[]>;
    selectedRoomId: string | null;
    wsStatus: 'Online' | 'Offline';
    wsSend: ((data: OutgoingWebSocketMessage) => void) | null; //storing function as a state

    // Actions
    setRooms: (rooms: Room[]) => void;
    addMessage: (roomId: string, message: Message) => void;
    setMessages: (roomId: string, messages: Message[]) => void;
    selectRoom: (roomId: string | null) => void;
    setWsStatus: (status: 'Online' | 'Offline') => void;
    updateRoomLastMessage: (roomId: string, content: string) => void;
    clearUnread: (roomId: string) => void;
    setWsSend: (sender: (data: OutgoingWebSocketMessage) => void) => void;

}

export const useChatStore = create<ChatState>((set) => ({

  //Initial state
  rooms:[
      { id: '1', name: 'Team Chat', lastMessage: 'See you tomorrow!', timestamp: '2m ago', unread: 2 },
      { id: '2', name: 'Project Alpha', lastMessage: 'Updated the docs', timestamp: '1h ago', unread: 0 },
      { id: '3', name: 'Sarah Wilson', lastMessage: 'Thanks for the help!', timestamp: '3h ago', unread: 1 },
  ],
  messages:{
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
  },
  selectedRoomId: null,
  wsStatus: 'Offline',
  wsSend: null,

  // Actions
  setRooms: (rooms) => set({ rooms }),
  
  //Exec this fn when adding new msg to room 
  addMessage: (roomId, message) => 
    set((state) =>{
      return { 
        messages: {
          ...state.messages,
          [roomId]: [
            ...(state.messages[roomId] || []),
            message
          ]
        }
      }
    }),

  //Exec this fn when loading initial room msg
  setMessages: (roomId, messages) => 
    set((state) => ({
      messages: {
        ...state.messages,
        [roomId]: messages
      }
    })),
  
  selectRoom: (roomId) => set({ selectedRoomId: roomId }),
  
  setWsStatus: (status) => set({ wsStatus: status }),
  
  updateRoomLastMessage: (roomId, content) => 
    set((state) => {
      const updateUnreadRooms = state.rooms.map(stateRoom => {
        if( stateRoom.id === roomId) {
          return { ...stateRoom, lastMessage: content, timestamp: 'Just now'}
        }

        return stateRoom;
      });

      return { rooms: updateUnreadRooms };
    }),

  
  clearUnread: (roomId) => 
    set((state) => {
      const updatedRooms = state.rooms.map(r => {
        if( r.id === roomId) {
          return { ...r, unread: 0 }
        }
        return r;
      });

      return { rooms: updatedRooms }
    }),

    setWsSend: (sender) => set({wsSend: sender})
}));