import { Paperclip, Send, Smile } from "lucide-react";
import { useState } from "react";

export const MessageInput = ({ onSendMessage }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="bg-white border-t border-gray-200 p-4">
      <div className="flex items-end gap-2">
        <button
          type="button"
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-full mb-1"
        >
          <Paperclip className="h-5 w-5" />
        </button>
        <button
          type="button"
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-full mb-1"
        >
          <Image className="h-5 w-5" />
        </button>
        <div className="flex-1 bg-gray-100 rounded-3xl px-4 py-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="w-full bg-transparent focus:outline-none"
          />
        </div>
        <button
          type="button"
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-full mb-1"
        >
          <Smile className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!input.trim()}
          className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed mb-1"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};
