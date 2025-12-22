import WebSocket from "ws";
import { validateSession } from "../utils/session.js";
import { users } from "./state.js";
import { Request } from "express";

export function handleConnection(ws: WebSocket, req: Request) {
    void(async()=> {
        try {
            if(!req.url) {
                ws.close(4000, "Invalide request.");
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
            users.set(session.userId, ws)
    
            ws.send(JSON.stringify({ message: "Authenticated." }));

            ws.on('close', ()=> {
                users.delete(session.userId)
            })
        } catch (err) {
            ws.close(4003, (err as Error).message)
        }
    })
   
}