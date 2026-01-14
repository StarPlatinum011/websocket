export const MessageBubble = ({ message }) => {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex mb-4 ${message.isMine ? 'justify-end' : 'justify-start'}`}>
      {!message.isMine && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-sm font-semibold mr-2 flex-shrink-0">
          {message.userName[0]}
        </div>
      )}
      <div className={`max-w-xs lg:max-w-md ${message.isMine ? 'order-1' : 'order-2'}`}>
        {!message.isMine && (
          <p className="text-xs text-gray-500 mb-1 ml-2">{message.userName}</p>
        )}
        <div
          className={`px-4 py-2 rounded-2xl ${
            message.isMine
              ? 'bg-blue-500 text-white rounded-br-none'
              : 'bg-white text-gray-900 rounded-bl-none'
          }`}
        >
          <p>{message.content}</p>
        </div>
        <p className="text-xs text-gray-500 mt-1 ml-2">{formatTime(message.timestamp)}</p>
      </div>
    </div>
  );
};