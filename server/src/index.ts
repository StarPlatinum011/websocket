import  {WebSocket, WebSocketServer} from 'ws'; 

const wss = new WebSocketServer({
    port: 8080
});

//handle web socket connection
wss.on('connection', (ws)=> {
    console.log('new client connected');
    
    //handle incoming messages 
    ws.on('message', (msg) =>{
        
         let data;
        try {
            //parse the string into object so it can be easily accessed in chatData below
             data  = JSON.parse(msg.toString());
        } catch (error) {
            console.log('invalid JSON received ', msg);
            
        }

        const timestamp = new Date().toLocaleTimeString();

        const chatData = JSON.stringify({
            username: data.username || 'annon',
            message: data.message,
            timestamp
        });

        wss.clients.forEach((client)=> {
            if(client.readyState === WebSocket.OPEN) {
                client.send(chatData)
                console.log(`received: ${chatData}`);

            }
        })

    });

    //close connection 
    ws.on('close', ()=> {
        console.log('client disconnected');

    })

});

console.log('Websocket server running on ws://localhost:8080')

