

type WSMessage <T = unknown> ={
    type: string;
    payload: T;
}

const room = new Map<string, Set<WebSocket>>();

export const broadcastToRoom = (
    roomId: string,
    message: WSMessage 
) => {


}