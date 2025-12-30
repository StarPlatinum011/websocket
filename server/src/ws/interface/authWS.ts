import type WebSocket from "ws";

export interface AuthenticateWS extends WebSocket {
    userId: string;
    sessionId: string;
}