import { WebSocketServer } from "ws";
import { handleConnection } from "./connections.js";
import type { Server } from "http";

export function initWebSocketServer(server: Server) {
  const wss = new WebSocketServer({ server });
  
  wss.on('connection', handleConnection)
  return wss;
}



