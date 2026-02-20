import { WebSocketServer } from "ws";
import { handleConnection } from "./connections.js";
import type { IncomingMessage, Server } from "http";
import { AuthenticatedWS } from "./types/types.js";

export function initWebSocketServer(server: Server) {
    console.log("🔥 initWebSocketServer CALLED");

  const wss = new WebSocketServer({ server });
  
  wss.on('connection', (ws: AuthenticatedWS, req:IncomingMessage ) => {
    console.log("Ws conn established");
    handleConnection(ws, req)
  })
  return wss;
}



