import { rooms, socketToRooms } from "../state.js";
import { AuthenticatedWS } from "../types/types.js";


export const joinRoom =(
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