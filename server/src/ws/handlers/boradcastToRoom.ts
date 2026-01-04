import { roomsMap } from "../state.js";


interface WSMessage <T = unknown> {
    type: string;
    payload: T;
}

export const broadcastToRoom = (
    roomId: string,
    message: WSMessage 
) => {

    //check if user is in the memory
    const room = roomsMap.get(roomId)
    if(!room) throw new Error("User is not allowed in the room.");

    const data = JSON.stringify(message);

    for (const ws of room) {
        if(ws.readyState === WebSocket.OPEN) {
            ws.send(data);
        }
    }
}