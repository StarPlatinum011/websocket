import { validateSession } from "../utils/session.js";
import { sessionsMap, usersMap } from "./state.js";
import { Request } from "express";
import { handleMessage } from "./handlers/message.js";
import { AuthenticatedWS } from "./types/types.js";
import { handleDisconnection } from "./utils/disconnection.js";
import { prisma } from "../db/prisma.js";
import { attachSocketToRoom } from "./handlers/roomHandle.js";

export function handleConnection(ws: AuthenticatedWS, req: Request) {
    void(async()=> {
        try {
              console.log("SERVER: connection established");

            if(!req.url) {
                ws.close(4000, "Invalid request.");
                return;
            }

            const params = new URLSearchParams(req.url.split("?")[1]);
            const token = params.get("token");
    
            if(!token) {
                ws.close(4001, "No token provided.")
                return;
            }
            const session = await validateSession(token);

            //Attach identity to socket
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

            // Handle messaging 
            ws.on('message',  (data) => {
                void handleMessage(ws, data)
            })

            ws.on('close', ()=> {
                if(ws.sessionId) {
                    sessionsMap.delete(ws.sessionId)
                }
                if(ws.userId) {
                    usersMap.delete(ws.userId)
                }
                
                handleDisconnection(ws);
            })
        } catch (err) {
            ws.close(4003, (err as Error).message)
        }
    })
   
}

