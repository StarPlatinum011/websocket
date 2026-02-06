
import { useEffect, useRef } from "react";
import { MessageBubble } from "./MessageBubble";
import { Message } from "../../../types/chat.types";

interface MessagesListProps {
  messages: Message[];
}

export const MessagesList:React.FC<MessagesListProps> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
      {messages.map(msg => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};