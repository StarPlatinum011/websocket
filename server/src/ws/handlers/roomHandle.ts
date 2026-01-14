import { roomsMap, socketToRooms } from "../state.js";
import { AuthenticatedWS } from "../types/types.js";
import { assertRoomMembership } from "../utils/membershipCheck.js";


export const handleJoinRoom = async(
    roomId: string,
    ws: AuthenticatedWS
) => {
    try {
    await assertRoomMembership(ws.userId, roomId);
    attachSocketToRoom(roomId, ws);
  } catch {
    ws.send(JSON.stringify({
      type: "ERROR",
      code: "NOT_A_MEMBER",
      roomId
    }));
  }
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