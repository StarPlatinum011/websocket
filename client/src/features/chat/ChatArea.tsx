import { MessageInput } from "./MessageInput";
import { MessagesList } from "./MessageList";

export const ChatArea = ({ selectedRoom, messages, onSendMessage }) => {
  if (!selectedRoom) {
    return <EmptyState />;
  }

  return (
    <div className="flex-1 flex flex-col">
      <ChatHeader room={selectedRoom} />
      <MessagesList messages={messages} />
      <MessageInput onSendMessage={onSendMessage} />
    </div>
  );
};