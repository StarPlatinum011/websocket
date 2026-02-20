import { RawData } from "ws";
import { WSClientMessage } from "../protocols.js";
import {handleSendMessage} from './sendMessage.js'
import { AuthenticatedWS } from "../types/types.js";
import { handleJoinRoom, handleLeaveRoom } from "./roomHandle.js";

export const handleMessage = async (ws: AuthenticatedWS, data: RawData) => {
  let payload: unknown;
  
  try {
      const rawText = normalizeMessage(data)
      payload = JSON.parse(rawText);
      console.log("NORMALIZED:", rawText);


  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    ws.send(JSON.stringify({
      type: "ERROR",
      error: "Invalid JSON"
    }));
    return;
  }

  console.log("RAW:", data);
console.log("PARSED PAYLOAD:", payload);
console.log("TYPEOF PAYLOAD:", typeof payload);
  const parsed = WSClientMessage.safeParse(payload);
  console.log('This is message area: ', parsed)

    if (!parsed.success) {
          // console.error("Zod error:", parsed.treeifyError(error));
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

        case "JOIN_ROOM":
          await handleJoinRoom(parsed.data.payload.roomId, ws);
          break;
        
        case "LEAVE_ROOM":
          handleLeaveRoom(parsed.data.payload.roomId, ws);
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
