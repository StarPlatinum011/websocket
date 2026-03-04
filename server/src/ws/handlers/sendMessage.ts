import { prisma } from "../../db/prisma.js";
import { AuthenticatedWS, SendMessagePayload } from "../types/types.js"
import { assertRoomMembership } from "../utils/membershipCheck.js"
import { broadcastToRoom } from "./boradcastToRoom.js";

export const  handleSendMessage = async (
    ws: AuthenticatedWS,
    payload: SendMessagePayload
) => {

    //Authorization : Business rule to check if the user exist in the room
    await assertRoomMembership(ws.userId, payload.roomId);

    //Database 
    const message = await prisma.message.create({
        data: {
            roomId: payload.roomId,
            senderId: ws.userId,
            content: payload.content
        }, 
        include:{ sender: true}
    });

    // Data shape for backend (Data Transfer Object// Data shape for transport layer aka websocket)
    const dto = {
        id: message.id,
        roomId: message.roomId,
        userId: message.senderId,
        username: message.sender.username,
        content: message.content,
        timestamp: message.createdAt,
        tempId: payload.tempId
    }

    // Side effect - Real time
    broadcastToRoom(payload.roomId, {
        type: "NEW_MESSAGE",
        payload: dto,
        
    });

}