import type WebSocket from "ws";
import z from "zod";
import { WSClientMessage } from "../protocols.js";

export interface AuthenticatedWS extends WebSocket {
    userId: string;
    sessionId: string;
}

export type SendMessagePayload = Extract<
    z.infer<typeof WSClientMessage>,
    { type: "SEND_MESSAGE"}
    >["payload"];