import { validateSession } from "../utils/session.js";
import { sessionsMap, usersMap } from "./state.js";
import { handleMessage } from "./handlers/message.js";
import { AuthenticatedWS } from "./types/types.js";
import { handleDisconnection } from "./utils/disconnection.js";
import { prisma } from "../db/prisma.js";
import { attachSocketToRoom } from "./handlers/roomHandle.js";
import { IncomingMessage } from "http";

export function handleConnection(ws: AuthenticatedWS, req: IncomingMessage) {
    
    try {
        
        console.log("SERVER: connection established");

        if(!req.url) {
            ws.close(4000, "Invalid request.");
            return;
        }

        let isAuthenticated = false;

        // Handle messaging 
        ws.on('message',  (data) => {
            if(!isAuthenticated) {
                ws.send(JSON.stringify({
                type: "ERROR",
                error: "Not authenticated"
            }));
                return
            }
            void handleMessage(ws, data)
        })

        ws.on('close', ()=> {
            if(!isAuthenticated) return;

            if(ws.sessionId) {
                sessionsMap.delete(ws.sessionId)
            }
            if(ws.userId) {
                usersMap.delete(ws.userId)
            }
            
            handleDisconnection(ws);
        });

        ws.on("error", (err) => {
            console.error("Server: socket error", err);
        });

        authenticate(ws, req)
            .then(()=> {
                isAuthenticated = true;
                console.log("Server: Socket authenticated");
            })
            .catch((err: unknown) => {
                console.error("Auth failed: ", err);
                ws.close(4001, "Auth failed");
            })


    } catch (err) {
        ws.close(4003, (err as Error).message)
    }
    
   
}


const authenticate = async (
    ws: AuthenticatedWS,
    req: IncomingMessage
) => {

    const params = new URLSearchParams(req.url?.split('?')[1]);
    const token = params.get('token');

    if(!token) {
        ws.close(4001, "No token provided.")
        return;
    }

    const session = await validateSession(token);

    ws.userId = session.userId;
    ws.sessionId = session.id;

    //Register connection
    usersMap.set(session.userId, ws)
    sessionsMap.set(session.userId, ws)

    ws.send(JSON.stringify({ message: "Authenticated." }));

    // Reconnect the rooms on refresh
    const rooms = await prisma.room.findMany({
        where:{
            members:{ some: {userId: ws.userId}}
        }
    });
    
    for( const room of rooms) {
        attachSocketToRoom(room.id, ws);
    }
}
