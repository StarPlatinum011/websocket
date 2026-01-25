import { Message, Room } from "../../../types/chat.types";
import { ChatHeader } from "./ChatHeader";
import { EmptyState } from "./EmptyState";
import { MessageInput } from "./MessageInput";
import { MessagesList } from "./MessageList";

interface ChatAreaProps {
  selectedRoom: Room | null;
  messages: Message[];
  onSendMessage: (content: string) => void;
  onBack?: () => void;
}

export const ChatArea: React.FC<ChatAreaProps> = ({ selectedRoom, messages, onSendMessage, onBack }) => {
  if (!selectedRoom) {
    return <EmptyState />;
  }

  return (
    <div className="flex-1 flex flex-col">
      <ChatHeader room={selectedRoom} onBack={onBack}/>
      <MessagesList messages={messages} />
      <MessageInput onSendMessage={onSendMessage} />
    </div>
  );
};