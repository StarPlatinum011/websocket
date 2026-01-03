import { rooms, socketToRooms } from "../state.js";
import { AuthenticatedWS } from "../types/types.js";


export const handleJoinRoom =(
    roomId: string,
    ws: AuthenticatedWS
)=> {

    if(!rooms.has(roomId)) {
        rooms.set(roomId, new Set())
    }

    rooms.get(roomId)?.add(ws);

    if(!socketToRooms.has(ws)) {
        socketToRooms.set(ws, new Set());
    }

    socketToRooms.get(ws)?.add(roomId)

}

export const handleLeaveRoom = (
    roomId: string,
    ws: AuthenticatedWS
) => {

    //get the Set() of sockets
    const sockets = rooms.get(roomId);
    if(!sockets) return;


    sockets.delete(ws);
}