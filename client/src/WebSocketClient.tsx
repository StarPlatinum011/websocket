import { useEffect, useState } from "react";

const WebSocketClient = () => {
    const [displayMessages, setDisplayMessages] = useState<{username:string; message:string; timestamp:string}[]>([]);
    const [ws, setWs] = useState<WebSocket|null>(null);
    const [msgInput, setMsgInput] = useState('');
    const [username, setUsername] = useState('');

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8080');
        setWs(socket);

        //handle incoming messages
        socket.onmessage= async (event) => {
           
                setDisplayMessages((prev) => [...prev, JSON.parse(event.data)])
        }

        socket.onopen= () => console.log('connected to websocket');
        socket.onclose= () => console.log('websocket disconnected ');
        socket.onerror= (err) => console.log('ebsocket error', err);

        return ()=> {
            socket.close();
        }
    }, []);

    console.log('launani', displayMessages)


    const sendMessages = () => {
        if(ws && msgInput.trim() && username.trim()) {

            ws.send(JSON.stringify({username, message: msgInput}));
            setMsgInput('');
        }
    }

    
    return (
        <div className="flex flex-col ml-80 items-center space-y-6">
            <div className="flex flex-col space-y-4">
                    <h1 className="text-emerald-600 text-sm">Web Socekt Workshop</h1>
                    <input 
                        type="text" 
                        placeholder="username"
                        onChange={((e)=> setUsername(e.target.value))}
                        value = {username}
                        className="border border-purple-700 p-2 rounded-2xl"
                    />
                    <input 
                        className="border border-purple-700 p-2 rounded-2xl"
                        type="text" 
                        placeholder="message"
                        value={msgInput}
                        onChange={(msg)=> setMsgInput(msg.target.value)}
                    />
                   
                    <button className="text-black border bg-black" onClick={sendMessages}>Send</button>

                
            </div>
            <div>
                <h2 className="font-semibold">List of messages:</h2>
                <div>
                    {displayMessages.map((msg, index) => (
                        <div key={index}>
                            <strong className="text-red-300" >{msg.username}</strong>
                            <span>{msg.timestamp}</span>
                            <p>{msg.message}</p>
                        </div>
                        
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WebSocketClient;