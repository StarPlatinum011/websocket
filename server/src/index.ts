import { WebSocketServer } from "ws";
import crypto from 'crypto'


const wss = new WebSocketServer({ port: 8080 });

function heartbeat(this: any) {
    this.isAlive = true;
}

wss.on('connection', (ws) => {
    const userId = crypto.randomUUID();
    ws.userId = userId;
    ws.isAlive = true;
    ws.connectedAt = Date.now()
     

    ws.on('message', ( data ) => {
        const userData = JSON.stringify(data);

    })

    ws.on('pong', ()=> {

    })
})

setInterval(() => {
    
}, 3000);