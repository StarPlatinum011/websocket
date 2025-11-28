import { useEffect, useState, useRef } from "react";

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
    // Use an empty string for the initial username
    const [username, setUsername] = useState('');
    // Check if a username is set to control the UI state
    const [isUsernameSet, setIsUsernameSet] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // --- Effects ---

    // Auto-scroll to the bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [displayMessages]);

    // WebSocket Connection and Handling
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

    // --- Functions ---
    
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
        // Clear all session-related state
        setUsername('');
        setIsUsernameSet(false);
        setDisplayMessages([]); // Optionally clear messages on logout
        // Note: The WebSocket connection itself will remain open until component unmounts
        // or a new logic to close and re-open is implemented. For this example, we just reset the UI state.
        console.log("User logged out and session cleared.");
    }

    // --- UI Rendering ---
    return (
        // Removed the unnecessary 'ml-80' margin and centered the container
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col h-[80vh]">
                
                {/* Header */}
                <header className="bg-blue-600 p-4 shadow-md flex justify-between items-center">
                    <h1 className="text-xl font-bold text-white">
                        Live Chat App 💬
                    </h1>
                    {isUsernameSet ? (
                         <div className="flex items-center space-x-3">
                             <span className="text-sm text-blue-200">
                                 Logged in as: **{username}**
                             </span>
                             <button
                                onClick={handleLogout}
                                className="bg-red-500 hover:bg-red-600 text-white text-xs font-semibold py-1 px-3 rounded-lg transition duration-200"
                            >
                                Logout
                            </button>
                         </div>
                    ) : (
                        <span className="text-sm text-blue-200">
                             Please log in
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
                                // Updated class: text-gray-900 to ensure visibility
                                className="w-full p-3 mb-4 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900" 
                            />
                            <button
                                onClick={handleUsernameSet}
                                disabled={!username.trim()}
                                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50"
                            >
                                Start Chatting
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
                <footer className="p-4 border-t bg-gray-50">
                    <div className="flex space-x-3">
                        <input
                            type="text"
                            placeholder={isUsernameSet ? "Type a message..." : "Please set your username first."}
                            value={msgInput}
                            onChange={(e) => setMsgInput(e.target.value)}
                            onKeyPress={handleKeypress}
                            disabled={!isUsernameSet || !ws || ws.readyState !== WebSocket.OPEN}
                            // Added text-gray-900 to ensure visibility
                            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-200 text-gray-900" 
                        />
                        <button
                            onClick={sendMessages}
                            disabled={!isUsernameSet || !msgInput.trim()}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200 disabled:opacity-50"
                        >
                            Send
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default WebSocketClient;