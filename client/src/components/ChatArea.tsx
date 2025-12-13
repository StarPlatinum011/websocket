import { Message } from '../types/MsgType'; 

interface ChatAreaProps {
    message: Message[];
    username: string
}

const ChatArea = ({message, username}: ChatAreaProps) => {
    return (
        <div>
            {message.map((msg, index) => {
                const isOwnMessage = msg.username === username;
                return (
                    <div 
                        key={index}
                        className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`max-w-xs lg:max-w-md p-3 mt-1 rounded-xl shadow-md ${
                            isOwnMessage 
                                ? 'bg-blue-500 text-white rounded-br-none' 
                                : 'bg-gray-200 text-gray-800 rounded-tl-none' 
                        }`}>
                            <div className="flex justify-between items-center mb-1">
                                <strong className={`font-semibold ${isOwnMessage ? 'text-blue-100' : 'text-blue-600'}`}>
                                    {isOwnMessage ? 'You' : msg.username}
                                </strong>
                                <span className={`text-xs ml-3 ${isOwnMessage ? 'text-blue-200' : 'text-gray-500'}`}>
                                    {msg.timestamp}
                                </span>
                            </div>
                            <p className="whitespace-pre-wrap">{msg.message}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ChatArea;