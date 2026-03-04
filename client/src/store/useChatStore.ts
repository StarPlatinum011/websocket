import { create } from "zustand";
import { Message, Room, OutgoingWebSocketMessage } from '../types/chat.types';
import { fetchRoomMessages, fetchRoomsFromServer } from "@/features/services/rooms";
import { AuthToken, RoomId } from "@/types/ids";
import { useAuthStore } from "./useAuthStore";


interface ChatState {
    //States
    rooms: Room[];
    messages: Record<string, Message[]>;
    selectedRoomId: string | null;
    wsStatus: 'Online' | 'Offline';
    isJoinRoomModalOpen: boolean;
    wsSend: ((data: OutgoingWebSocketMessage) => void) | null; //storing function as a state
    
    roomsLoading: boolean; //Room Loading states
    roomsError: string | null;

    // Actions
    setRooms: (rooms: Room[]) => void;
    addMessage: (roomId: string, message: Message) => void;
    clearAll: () => void;
    selectRoom: (roomId: string | null) => void;
    setWsStatus: (status: 'Online' | 'Offline') => void;
    updateRoomLastMessage: (roomId: string, content: string) => void;
    clearUnread: (roomId: string) => void;
    setWsSend: (sender: (data: OutgoingWebSocketMessage) => void) => void;
    setJoinRoomModalOpen: (open: boolean) => void;
    addRoom: (room: Room) => void;
    removeRoom: (roomId: string) => void;
    fetchRooms: (token: AuthToken) => Promise<void>;
    fetchRoomMessages: (roomId: RoomId) => Promise<void>;
}

export const useChatStore = create<ChatState>((set) => ({

  //Initial state
  rooms:[
      { id: '1', name: 'Team Chat',type: 'DM',  lastMessage: 'See you tomorrow!', timestamp: '2m ago', unread: 2 },
      { id: '2', name: 'Project Alpha',type: 'DM',  lastMessage: 'Updated the docs', timestamp: '1h ago', unread: 0 },
      { id: '3', name: 'Sarah Wilson',type: 'DM',  lastMessage: 'Thanks for the help!', timestamp: '3h ago', unread: 1 },
  ],
  messages:{
      '1': [
          { id: 'm1', userId: '2', username: 'John Doe', content: 'Hey everyone!', timestamp: new Date(Date.now() - 3600000).toISOString() },
          { id: 'm2', userId: 'me', username: 'You', content: 'Hi John!', timestamp: new Date(Date.now() - 3000000).toISOString() },
          { id: 'm3', userId: '3', username: 'Jane Smith', content: 'See you tomorrow!', timestamp: new Date(Date.now() - 120000).toISOString()},
      ],
      '2': [
          { id: 'm4', userId: '4', username: 'Mike Johnson', content: 'Updated the docs', timestamp: new Date(Date.now() - 3600000).toISOString() },
      ],
      '3': [
          { id: 'm5', userId: '3', username: 'Sarah Wilson', content: 'Can you help me with this?', timestamp: new Date(Date.now() - 7200000).toISOString() },
          { id: 'm6', userId: 'me', username: 'You', content: 'Sure, what do you need?', timestamp: new Date(Date.now() - 7000000).toISOString() },
          { id: 'm7', userId: '3', username: 'Sarah Wilson', content: 'Thanks for the help!', timestamp: new Date(Date.now() - 10800000).toISOString() },
      ],
  },
  selectedRoomId: null,
  wsStatus: 'Offline',
  wsSend: null,
  isJoinRoomModalOpen: false,
  roomsLoading: false,
  roomsError: null,



  // Room Actions 
  setRooms: (rooms) => set({ rooms }),

  selectRoom: (roomId) => set({ selectedRoomId: roomId }),

  addRoom:(room) =>
    set((state) => ({
      rooms: [...state.rooms, room]
    })),

  removeRoom: (roomId) => 
    set((state) => ({
      rooms: state.rooms.filter(r => r.id !== roomId)
    })),

  //fetch from backend 
  fetchRooms: async (token:AuthToken) => {
    set({roomsLoading: true, roomsError: null});
    try {
      const rooms = await fetchRoomsFromServer(token);
      
      set({
        rooms : rooms.dms,
        roomsLoading: false
      });

    } catch (error) {
      console.error('Failed to fetch rooms:', error);
      set({ 
        roomsError: error instanceof Error ? error.message : 'Failed to fetch rooms',
        roomsLoading: false 
      });
    }
  },

  // Message Actions
  //Exec this fn when adding new msg to room 
  addMessage: (roomId, message) => 
    set((state) =>{
      return { 
        messages: {
          ...state.messages,
          [roomId]: [
            ...(state.messages[roomId] || []), //this is how we append the new message in previous one
            message
          ]
        }
      }
    }),

  

  //fetch room message from backend
  fetchRoomMessages: async (roomId: RoomId ) => {
    
    const token = useAuthStore.getState().token; 
    if(!token) throw new Error("No auth token available")

    const messages = await fetchRoomMessages(token, roomId);

    set((state) => ({
      messages: {
        ...state.messages,
        [roomId]: messages  // replace the entire object with backend truth
      }
    }))
  },



  //Extra helper actions
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

  
  
  setWsStatus: (status) => set({ wsStatus: status }),
  
  

  setWsSend: (sender) => set({wsSend: sender}),

  setJoinRoomModalOpen: (open) => set({isJoinRoomModalOpen: open}),
  
  clearAll: () => set({
    messages:{},
    rooms:[]
  }),

}));