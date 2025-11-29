import { useEffect, useState, useRef } from "react";
import { MessageSquareMore } from "lucide-react";

// Define the structure for a message
interface Message {
    username: string;
    message: string;
    timestamp: string;
}

const WebSocketClient = () => {
    const [displayMessages, setDisplayMessages] = useState<Message[]>([]);
    const [ws, setWs] = useState<WebSocket | null>(null);
    const [msgInput, setMsgInput] = useState('');
    const [username, setUsername] = useState('');
    const [isUsernameSet, setIsUsernameSet] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // --- Effects and Functions (Unchanged) ---
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [displayMessages]);

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8080');
        setWs(socket);

        socket.onmessage = async (event) => {
            try {
                const receivedMsg = JSON.parse(event.data) as Message;
                setDisplayMessages((prev) => [...prev, receivedMsg]);
            } catch (error) {
                console.error("Error parsing received message: ", error);
            }
        }

        socket.onopen = () => console.log('Connected to WebSocket');
        socket.onclose = () => console.log('WebSocket disconnected');
        socket.onerror = (err) => console.error('WebSocket error', err);

        return () => {
            socket.close();
        }
    }, []);
    
    const sendMessages = () => {
        if (ws && ws.readyState === WebSocket.OPEN && msgInput.trim() && username.trim()) {
            const messageToSend: Message = {
                username,
                message: msgInput,
                timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
            }

            ws.send(JSON.stringify(messageToSend));
            setMsgInput('');
        }
    }

    const handleKeypress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            sendMessages();
        }
    }

    const handleUsernameSet = () => {
        if (username.trim()) {
            setIsUsernameSet(true);
        }
    }

    const handleLogout = () => {
        setUsername('');
        setIsUsernameSet(false);
        setDisplayMessages([]);
        console.log("User logged out and session cleared.");
    }

    // --- UI Rendering ---
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col h-[80vh]">
                
                {/* Header: FIX APPLIED HERE */}
                <header className="bg-blue-600 p-4 shadow-md flex justify-between items-center">
                    <h1 className="flex items-center text-xl font-bold text-white space-x-2">
                        Live Chat App <MessageSquareMore className="w-5 h-5"/>
                    </h1>
                    {isUsernameSet ? (
                        // *** FIX: Removed flex-col and space-x-3 / gap-2 is now correct for a row ***
                        <div className="flex items-center space-x-3"> 
                            <span className="text-sm text-blue-200">
                                Logged in as: <span className="font-semibold">{username}</span>
                            </span>
                            <button
                                onClick={handleLogout}
                                // ** Tailwind classes are now correctly applied on this button. **
                                className="bg-red-500 cursor-pointer hover:bg-red-600 text-white text-xs font-semibold py-1.5 px-3 rounded-lg transition duration-200 whitespace-nowrap"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <span className="text-sm text-blue-200 ">
                            Please Login to start
                        </span>
                    )}
                </header>

                {/* Message Area / Login Screen */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {!isUsernameSet ? (
                        <div className="text-center p-8 bg-blue-50 rounded-lg">
                            <h2 className="text-lg font-semibold text-blue-700 mb-4">Set Your Username</h2>
                            <input
                                type="text"
                                placeholder="Enter your username..."
                                onChange={(e) => setUsername(e.target.value)}
                                value={username}
                                className="w-full p-3 mb-4 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900" 
                            />
                            <button
                                onClick={handleUsernameSet}
                                disabled={!username.trim()}
                                className="w-full bg-blue-500 cursor-pointer hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 disabled:bg-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Login
                            </button>
                        </div>
                    ) : (
                        displayMessages.map((msg, index) => {
                            const isOwnMessage = msg.username === username;
                            return (
                                <div 
                                    key={index}
                                    className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-xs lg:max-w-md p-3 rounded-xl shadow-md ${
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
                        })
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Message Input Area */}
                {isUsernameSet && <footer className="p-4 border-t bg-gray-50">
                    <div className="flex space-x-3">
                        <input
                            type="text"
                            placeholder={isUsernameSet ? "Type a message..." : "Please set your username first."}
                            value={msgInput}
                            onChange={(e) => setMsgInput(e.target.value)}
                            onKeyPress={handleKeypress}
                            disabled={!isUsernameSet || !ws || ws.readyState !== WebSocket.OPEN}
                            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-200 text-gray-900" 
                        />
                        <button
                            onClick={sendMessages}
                            disabled={!isUsernameSet || !msgInput.trim()}
                            className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer font-bold py-3 px-6 rounded-lg transition duration-200 disabled:opacity-50"
                        >
                            Send
                        </button>
                    </div>
                </footer>}
            </div>
        </div>
    );
};

export default WebSocketClient;