import { useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import { useChatStore } from "../../../store/useChatStore";
import { ChatHeader } from "./ChatHeader";
import { EmptyState } from "./EmptyState";
import { MessageInput } from "./MessageInput";
import { MessagesList } from "./MessageList";
import { RoomId } from "@/types/ids";
import { useAuthStore } from "@/store/useAuthStore";

interface ChatAreaProps {
  onBack?: () => void;
}

export const ChatArea: React.FC<ChatAreaProps> = ({ onBack }) => {

  const { roomId } = useParams<{ roomId: RoomId }>();

  const rooms = useChatStore((state) => state.rooms);
  const messages = useChatStore((state) => state.messages);
  const addMessage = useChatStore((state) => state.addMessage);
  const updateRoomLastMessage = useChatStore((state) => state.updateRoomLastMessage);
  const wsSend = useChatStore((state) => state.wsSend);
  const fetchRoomMessages = useChatStore((state) => state.fetchRoomMessages);
  const authState = useAuthStore((state) => state.authStatus);
  const username = useAuthStore((state) => state.username);
  const userId = useAuthStore((state) => state.userId);
  

    // console.log("UserId on refresh: ", userId);

  //Join room when component mounts
  useEffect(()=> {
    if(authState !== "authenticated") return;
    if(!roomId || !wsSend) return;

    wsSend({ 
      type: "JOIN_ROOM",
      payload:{roomId} 
    });

    fetchRoomMessages(roomId)
    

    return() => {
      if(roomId && wsSend) {
        wsSend({type: "LEAVE_ROOM", payload:{roomId}})
      }
    }
  }, [roomId, wsSend, authState])

    //find selected room from rooms array
  const selectedRoom = rooms.find(r => r.id === roomId);

  //get the messages for this room
  const roomMessages = roomId? messages[roomId] || [] : [];

  console.log("This is room message: ", roomMessages);
  

  if (!roomId) {
    return <EmptyState />;
  }


  //If the selected room doesnt exists 
  if(!selectedRoom) {
    return <Navigate to="/404" replace />
  }


  const tempId = `temp-${crypto.randomUUID()}`
  const handleMessageSend = (content: string) => {
    
    if(!roomId || !userId || !username || !wsSend) return;

    const newMessage = {
      id: tempId,
      userId,
      username,
      content,
      timestamp: new Date().toISOString(),
      status: 'sending' as const
    }

    //update UI asap
    addMessage(roomId, newMessage);
    updateRoomLastMessage( roomId, content);

    //send data to WebSocket
    wsSend({
      type: 'SEND_MESSAGE', 
      payload: {
        roomId, 
        content,
        tempId
      }
    });

  }

  return (
    <div className="flex-1 flex flex-col">
      <ChatHeader room={selectedRoom} onBack={onBack}/>
      <MessagesList messages={roomMessages} />
      <MessageInput onSendMessage={handleMessageSend} />
    </div>
  );
};