import WebSocket, {WebSocketServer} from 'ws'; 

const wss = new WebSocketServer({
    port: 8080
});

//handle web socket connection
wss.on('connection', (ws)=> {
    
});

//handle incoming messages 
wss.on('message', (msg) =>{
    
})