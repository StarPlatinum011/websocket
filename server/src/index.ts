import  {WebSocketServer} from 'ws'; 

const wss = new WebSocketServer({
    port: 8080
});

//handle web socket connection
wss.on('connection', (ws)=> {
    console.log('client connected');
    
    ws.send('this is a connection message ')

    //handle incoming messages 
    ws.on('message', (msg) =>{
        //deserialization of data
        // let data = JSON.parse(msg)
        console.log(`received: ${msg}`);
        ws.send('yaro domo! message wa kitta.')

    });

    //close connection 
    ws.on('close', ()=> {
        console.log('client disconnected');

    })

});

console.log('Websocket server running on ws://localhost:8080')

