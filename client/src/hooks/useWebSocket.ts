import { useCallback, useEffect, useRef } from "react";
import { IncomingWebSocketMessage, OutgoingWebSocketMessage } from "../types/chat.types";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";


export const useWebSocket = (url: string, token: string) => {

  const ws = useRef<WebSocket | null>(null);
  const logout = useAuthStore((state)=> state.logout );

  const setWsStatus = useChatStore((state) => state.setWsStatus);
  const addMessage = useChatStore((state) => state.addMessage);
  const setRooms = useChatStore((state) => state.setRooms)

  useEffect(() => {

    if(!token) {
      console.log("No token, skipping WebSocket connection");
      return;
    }

    if(ws.current) return;

    console.log("Connecting to WebSocket...");

    //Single websocket conn
    const socket = new WebSocket(`${url}?token=${token}`);
    ws.current = socket;

    //Connection open
    socket.onopen = () => {
      console.log("CLIENT: open");
      setWsStatus('Online');
    };

    //Connection close
    socket.onclose = (event) => {
      console.log("CLIENT: close")
      setWsStatus('Offline');

       // If closed due to auth error
      if (event.code === 4001) {
        console.error(' Authentication failed, logging out');
        logout();  // Clear session and redirect to login
      }
    }

    //handle on message
    socket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      handleIncomingMessasge(data);
    }
   
    //Error handle
    socket.onerror = (error) => {
      console.log("Websocket error: ", error)
    }

    return () => {
      console.log("Closing websocket connection...");
        socket.close();
      
    };
  }, [url, token]);


  const handleIncomingMessasge = useCallback(( data: IncomingWebSocketMessage ) => {
     // Receive message from server
    

      switch (data.type) {
        case "NEW_MESSAGE":
          if(data.roomId && data.messageId && data.content) {

            addMessage(data.roomId, {
              id: data.messageId,
              userId: data.userId || "Unknown",
              userName: data.userName || "Unknown User",
              content: data.content,
              timestamp: data.timestamp || new Date().toISOString(),
              isMine:false
            });
          }
          break;

        case "JOIN_ROOM":
          console.log(`${data.userName} joined ${data.roomId}`);
          break;

        case "LEAVE_ROOM":
          console.log(`User left room: ${data.roomId}`);
          break;

        case "ERROR":
          console.log("Server Error: ", data.error);
          //If error is auth related
          if(data.error?.includes('session') || data.error?.includes('auth')) {
            logout();
          }
          break;

        default:
          console.log("Unknown message type: ", data);
          
      } 
  }, [addMessage, logout])


  const sendMessage = (data: OutgoingWebSocketMessage) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(data));
    } else {
      console.warn("websocket not connected, cannot send: ", data)
    }
  };

  return {sendMessage};
};