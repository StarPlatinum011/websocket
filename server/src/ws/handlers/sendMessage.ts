import { prisma } from "../../db/prisma.js";
import { AuthenticatedWS, SendMessagePayload } from "../types/types.js"
import { assertRoomMembership } from "../utils/membershipCheck.js"

export const  handleSendMessage = async (
    ws: AuthenticatedWS,
    payload: SendMessagePayload
) => {

    //Authorization : Business rule to check if the action is valid
    await assertRoomMembership(ws.userId, payload.roomId);

    //Database 
    const message = await prisma.message.create({
        data: {
            roomId: payload.roomId,
            senderId: ws.userId,
            content: payload.content
        }
    })

    // Side effect - Real time
    // broadcastToRoom(payload.roomId, {
    //     type: "NEW_MESSAGE",
    //     payload: message
    // })

}