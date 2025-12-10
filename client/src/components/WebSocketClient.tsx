import { useEffect, useState, useRef } from "react";
import { MessageSquareMore } from "lucide-react";
import ChatArea from "./ChatArea";
import { Message } from "../types/MsgType";


const WebSocketClient = () => {
    const [displayMessages, setDisplayMessages] = useState<Message[]>([]);
    const [msgInput, setMsgInput] = useState('');
    const [username, setUsername] = useState('');
    const [isUsernameSet, setIsUsernameSet] = useState(false);
    const [connectionStatus, setConnectionStatus ] = useState<'connecting'| 'connected' | 'disconnected'>('disconnected');


    const messagesEndRef = useRef<HTMLDivElement>(null);
    const wsRef = useRef<WebSocket | null>(null)
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const isConnectingRef = useRef(false); //prevent duplicate connections 

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [displayMessages]);

    //Web Socket connection
    useEffect(() => {
        //prevent duplicate connection
        // if the ref is true, just return and do nothing
        if(isConnectingRef.current) return;

        const connect = () => { 

            //Check if already connected or connecting
            if( wsRef.current?.readyState === WebSocket.OPEN ||
                wsRef.current?.readyState === WebSocket.CONNECTING){
                  return;  
                } 
                isConnectingRef.current = true;
                setConnectionStatus('connecting');

            const socket = new WebSocket('ws://localhost:8080')
            wsRef.current = socket; //storing the socekt in the ref to prevent re-render
             
            socket.onopen = () => {
                console.log('Connected to WebSocket');
                setConnectionStatus('connected');
                isConnectingRef.current = false;
            } 

            socket.onmessage = (event) => {
                if (typeof event.data !== 'string') {
                    console.warn("Unexpected non-string WS payload: ", event.data);
                    return;
                }
                const receivedMsg = JSON.parse(event.data);
                setDisplayMessages((prev) => [...prev, receivedMsg]);
                console.log('this is a message from be ', receivedMsg);  
            }

            socket.onerror = (err) => {
                console.error('WebSocket error:', err);
                setConnectionStatus('disconnected');
                isConnectingRef.current = false;
            };

            socket.onclose = () => {
                console.log('WebSocket disconnected, Reconnecting ... ');
                setConnectionStatus('disconnected');
                wsRef.current = null;
                isConnectingRef.current = false;

                // Clear any existing reconnect timeout
                if (reconnectTimeoutRef.current) {
                    clearTimeout(reconnectTimeoutRef.current);
                }

                // Attempt to reconnect after 3 seconds
                reconnectTimeoutRef.current = setTimeout(() => {
                    connect();
                }, 3000);
            }
        }

        connect();

        //cleanup function
        return () => {
             if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
            if (wsRef.current) {
                // Remove event listeners to prevent memory leaks
                wsRef.current.onclose = null;
                wsRef.current.onerror = null;
                wsRef.current.onmessage = null;
                wsRef.current.onopen = null;
                
                if (wsRef.current.readyState === WebSocket.OPEN) {
                    wsRef.current.close();
                }
                wsRef.current = null;
            }
            isConnectingRef.current = false;
        }
    }, []); // Empty dependency arry so it only run once
    
    const sendMessages = () => {
        const socket = wsRef.current;

        if (socket && socket.readyState === WebSocket.OPEN && msgInput.trim() && username.trim()) {
            const messageToSend: Message = {
                username,
                message: msgInput,
                timestamp: new Date().toLocaleTimeString('en-US', {
                    month: 'short',
                    hour:'numeric',
                    minute: '2-digit',
                    second:'2-digit',
                    hour12: true
                }),
                type: 'message'
            }

            socket.send(JSON.stringify(messageToSend));
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

    const isConnected = wsRef.current?.readyState === WebSocket.OPEN;

    // --- UI Rendering ---
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col h-[80vh]">
                
                <header className="bg-blue-600 p-4 shadow-md flex justify-between items-center">
                    <h1 className="flex items-center text-xl font-bold text-white space-x-2">
                        Live Chat App <MessageSquareMore className="w-5 h-5"/>
                    </h1>
                    {isUsernameSet ? (
                        <div className="flex items-center space-x-3"> 
                            <span className="text-sm text-blue-200">
                                Logged in as: <span className="font-semibold">{username}</span>
                            </span>
                            <button
                                onClick={handleLogout}
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
                
                {/* Connection Status Indicator */}
                <div className={`px-4 py-2 text-sm text-center ${
                    connectionStatus === 'connected' ? 'bg-green-100 text-green-700' :
                    connectionStatus === 'connecting' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                }`}>
                    {connectionStatus === 'connected' ? '🟢 Connected' :
                     connectionStatus === 'connecting' ? '🟡 Connecting...' :
                     '🔴 Disconnected - Reconnecting...'}
                </div>

                {/* Message Area / Login Screen */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {!isUsernameSet ? (
                        <div className="text-center p-8 bg-blue-50 rounded-lg">
                            <h2 className="text-lg font-semibold text-blue-700 mb-4">Set Your Username</h2>
                            <input
                                type="text"
                                placeholder="Enter your username..."
                                onKeyPress={(e)=> e.key === 'Enter' && handleUsernameSet()}
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
                        <ChatArea message={displayMessages} username={username}/>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Message Input Area */}
                {isUsernameSet && 
                <footer className="p-4 border-t bg-gray-50">
                    <div className="flex space-x-3">
                        <input
                            type="text"
                            placeholder={isUsernameSet ? "Type a message..." : "Please set your username first."}
                            value={msgInput}
                            onChange={(e) => setMsgInput(e.target.value)}
                            onKeyPress={handleKeypress}
                            disabled={!isConnected}
                            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-200 text-gray-900" 
                        />
                        <button
                            onClick={sendMessages}
                            disabled={!isConnected || !msgInput.trim()}
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