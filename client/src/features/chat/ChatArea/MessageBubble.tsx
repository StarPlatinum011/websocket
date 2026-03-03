import { useAuthStore } from "@/store/useAuthStore";
import { Message } from "../../../types/chat.types";

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const formatTime = (timestamp:string): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const userId: string | null = useAuthStore((state) => state.userId);
  let isMine:boolean = false;

  if (userId && message.userId === userId)  isMine = true; 

  return (
    <div className={`flex mb-4 ${isMine ? 'justify-end' : 'justify-start'}`}>
      {!isMine && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-sm font-semibold mr-2 flex-shrink-0">
          {message.username[0]}
        </div>
      )}
      <div className={`max-w-xs lg:max-w-md ${isMine ? 'order-1' : 'order-2'}`}>
        {!isMine && (
          <p className="text-xs text-gray-500 mb-1 ml-2">{message.username}</p>
        )}
        <div
          className={`px-4 py-2 rounded-2xl ${
            isMine
              ? 'bg-blue-500 text-white rounded-br-none'
              : 'bg-input text-gray-900 rounded-bl-none'
          }`}
        >
          <p>{message.content}</p>
        </div>
        <p className="text-xs text-gray-500 mt-1 ml-2">{formatTime(message.timestamp)}</p>
      </div>
    </div>
  );
};