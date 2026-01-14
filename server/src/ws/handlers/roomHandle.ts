import { roomsMap, socketToRooms } from "../state.js";
import { AuthenticatedWS } from "../types/types.js";


export const handleJoinRoom =(
    roomId: string,
    ws: AuthenticatedWS
)=> {



}

export const handleLeaveRoom = (
    roomId: string,
    ws: AuthenticatedWS
) => {

    //get the Set() of sockets
    const sockets = roomsMap.get(roomId);
    if(!sockets) return;


    sockets.delete(ws);
}

// Logic to reconnect sockets on reconnections
export const attachSocketToRoom = (
    roomId: string,
    ws: AuthenticatedWS
) => {
    const rooms = socketToRooms.get(ws);
    if(rooms?.has(roomId)) return;

    if (!roomsMap.has(roomId)) {
        roomsMap.set(roomId, new Set());
    }
    roomsMap.get(roomId)?.add(ws);

    if (!socketToRooms.has(ws)) {
        socketToRooms.set(ws, new Set());
    }
    socketToRooms.get(ws)?.add(roomId);

}