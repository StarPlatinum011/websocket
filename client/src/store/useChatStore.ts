import { create } from "zustand";
import { Message, Room } from "../types/chat.types";


interface ChatState {
    //States
    rooms: Room[];
    messages: Record<string, Message[]>;
    selectedRoom: string | null;
    wsStatus: 'Online' | 'Offline';

    // Actions
    setRooms: (rooms: Room[]) => void;
    addMessage: (roomId: string, message: Message) => void;
    setMessage: (roomId: string, messages: Message[]) => void;
    selectRoom: (roomId: string | null) => void;
    setWsStatus: (status: 'Online' | 'Offline') => void;
    updateRoomLastMessage: (roomId: string, content: string) => void;
    clearUnread: (roomId: string) => void
}

export const useChatStore