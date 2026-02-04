import { useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import { useChatStore } from "../../../store/useChatStore";
import { ChatHeader } from "./ChatHeader";
import { EmptyState } from "./EmptyState";
import { MessageInput } from "./MessageInput";
import { MessagesList } from "./MessageList";
import JoinRoomMOdal from "../sidebar/JoinRoomMOdal";

interface ChatAreaProps {
  onBack?: () => void;
}

export const ChatArea: React.FC<ChatAreaProps> = ({ onBack }) => {

  const { roomId } = useParams<{ roomId: string }>();

  const rooms = useChatStore((state) => state.rooms);
  const messages = useChatStore((state) => state.messages);
  const addMessage = useChatStore((state) => state.addMessage);
  const updateRoomLastMessage = useChatStore((state) => state.updateRoomLastMessage);
  const wsSend = useChatStore((state) => state.wsSend);
  
  //find selected room from rooms array
  const selectedRoom = rooms.find(r => r.id === roomId);

  //get the messages for this room
  const roomMessages = roomId? messages[roomId] || [] : [];

  //Join room when component mounts
  useEffect(()=> {
    if(roomId && wsSend) {
      wsSend({ type: "JOIN_ROOM", roomId});
    }

    return() => {
      if(roomId && wsSend) {
        wsSend({type: "LEVAE_ROOM", roomId})
      }
    }
  }, [roomId, wsSend])


  if (!roomId) {
    return <EmptyState />;
  }


  //If the selected room doesnt exists 
  if(!selectedRoom) {
    return <Navigate to="/404" replace />
  }


  const handleMessageSend = (content: string) => {
    if(!roomId || !wsSend) return;

    const newMessage = {
      id: `m${Date.now()}`,
      userId: 'me',
      userName: 'You',
      content,
      timestamp: new Date().toISOString(),
      isMine: true
    }

    //update UI asap
    addMessage(roomId, newMessage);
    updateRoomLastMessage( roomId, content);

    //send data to server
    wsSend({
      type: 'SEND_MESSAGE', 
      roomId, 
      content
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