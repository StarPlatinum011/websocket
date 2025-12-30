import { RawData } from "ws";
import { WSClientMessage } from "../protocols.js";
import {handleSendMessage} from './sendMessage.js'
import { AuthenticatedWS } from "../types/types.js";

export const handleMessage = async (ws: AuthenticatedWS, data: RawData) => {
    const rawText = normalizeMessage(data)
    const parsed = WSClientMessage.safeParse(JSON.parse(rawText));

    if (!parsed.success) {
        ws.send(JSON.stringify({
        type: "ERROR",
        payload: { message: "Invalid message format" }
        }));
        return;
    }

    switch (parsed.data.type) {
        case "SEND_MESSAGE":
            await handleSendMessage(ws, parsed.data.payload)
            break;
    }
}

// Type enforcing raw data we got from ws 
function normalizeMessage(data: unknown): string {
  if (typeof data === "string") return data;
  if (Buffer.isBuffer(data)) return data.toString("utf8");
  if (data instanceof ArrayBuffer) {
    return Buffer.from(data).toString("utf8");
  }

  throw new Error("Unsupported WS message format");
}
