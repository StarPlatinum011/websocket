import { roomsMap, socketToRooms } from "../state.js";
import { AuthenticatedWS } from "../types/types.js";

export const handleDisconnection = (
    ws: AuthenticatedWS
) => {
    const connectedRooms = socketToRooms.get(ws);

    if( !connectedRooms ) return;

    for (const roomId of connectedRooms ) {
        const roomSocket = roomsMap.get(roomId);
        if(!roomSocket) continue;

        roomSocket.delete(ws);
    }

    socketToRooms.delete(ws);

}