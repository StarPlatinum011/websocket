import  {WebSocket, WebSocketServer} from 'ws'; 
import crypto from 'crypto'


const wss = new WebSocketServer({
    port: 8080
});

const users = new Map();

const HEARTBEAT_TIMEOUT = 30000;

//handle web socket connection
wss.on('connection', (ws)=> {
    const userId = crypto.randomUUID();

    //store users info in the memory
    users.set(userId, {
        socket: ws,
        connectedAt: Date.now(),
        lastSeen: Date.now()
    })

    console.log(`User connected: ${userId}`);

    
    //Listen incoming messages 
    ws.on('message', (msg) =>{
        let data;
        try {
            //parse the string into object so it can be easily accessed in chatData below
             data  = JSON.parse(msg.toString());
        } catch (error) {
            console.log('invalid JSON received ', msg);
            return;
            
        }

        console.log(data, 'i got it from client')
        //check for heartbeat and return without broadcast
        if(data.type === "heartbeat") {
            users.get(userId).lastSeen = Date.now();
            return;
        }

        const chatData = JSON.stringify({
            username: data.username || 'annon',
            message: data.message,
            timestamp: new Date().toISOString()
        });

        for (const client of wss.clients) {
          if(client.readyState === WebSocket.OPEN) {
            client.send(chatData)
          }
        }
        console.log('broadcast: ', chatData)


    });


    // console.log('total users: ', getActiveUsers())
    //close connection 
    ws.on('close', ()=> {
        users.delete(userId)
        console.log('user disconnected: ', userId);
        
    })
    
    ws.on('pong', ()=> {
        users.get(userId).lastSeen = Date.now();
    })
});

 // check to see if client is active 
setInterval(() => {
    const cutoffTime = Date.now() - HEARTBEAT_TIMEOUT;

    users.forEach((userData, userId) => {
        if( cutoffTime > userData.lastSeen ) {
            console.log('removing dead connection: ', userId);
            userData.socket.terminate();
            users.delete(userId)
        } else {
            userData.socket.ping();
        }
    })
}, HEARTBEAT_TIMEOUT/2)

function getActiveUsers() {
    const cutoffTime = Date.now() - HEARTBEAT_TIMEOUT;
    return [...users.entries()]
        .filter(([_, data]) => data.lastSeen > cutoffTime)
        .map(([id]) => id)

}

console.log('Websocket server running on ws://localhost:8080')
