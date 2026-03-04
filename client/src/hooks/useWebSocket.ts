import { useCallback, useEffect, useRef } from "react";
import { OutgoingWebSocketMessage, ServerMessage } from "../types/chat.types";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";


export const useWebSocket = (url: string, token: string) => {

  const wsRef = useRef<WebSocket | null>(null);
  const shouldCloseRef = useRef(false);

  const logout = useAuthStore((state)=> state.logout );
  const setWsStatus = useChatStore((state) => state.setWsStatus);
  const addMessage = useChatStore((state) => state.addMessage);
  const setRooms = useChatStore((state) => state.setRooms)

  useEffect(() => {

    if(!token) {
      console.log("No token, skipping WebSocket connection");
      if(wsRef.current) { //if no token close the socket
        wsRef.current.close();
        wsRef.current = null;
      }
      return;
    }

    if(wsRef.current) return;

    console.log("Connecting to WebSocket...");

    //Single websocket conn
    const socket = new WebSocket(`${url}?token=${token}`);
    wsRef.current = socket;

    //Connection open
    socket.onopen = () => {
      socket.send(JSON.stringify({ type: "PING"}));
      setWsStatus('Online');
    };

    //Connection close
    socket.onclose = (event) => {
      setWsStatus('Offline');

       // If closed due to auth error
      if (event.code === 4001) {
        console.error(' Authentication failed, logging out');
        logout();  // Clear session and redirect to login
      }
    }

    //handle on message
    socket.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      handleIncomingMessasge(msg);
    }
   
    //Error handle
    socket.onerror = (error) => {
      console.log("Websocket error: ", error)
    }

    return () => {
      if(wsRef.current) {
        console.log("Closing websocket connection...");
        socket.close();
        wsRef.current.close()
        wsRef.current = null;
      }
      
    };
  }, [url, token]);


  const handleIncomingMessasge = useCallback(( data: ServerMessage ) => {
// console.log("From backend: ", data.payload);

    switch (data.type) {
        case "NEW_MESSAGE":

          addMessage(data.payload.roomId, data.payload);
          break;

        case "ROOM_LIST":
          setRooms(data.payload)
          break;

        case "JOIN_ROOM":
          console.log(`${data.userId} joined ${data.roomId}`);
          break;
          
        case "LEAVE_ROOM":
          console.log(`User left room: ${data.roomId}`);
          break;

        case "ERROR":
          console.log("Server Error: ", data.payload);
        
          break;

        default:
          console.log("Unknown message type on ws: ", data);
          
      } 
  }, [addMessage, logout])


  const sendMessage = (data: OutgoingWebSocketMessage) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    } else {
      console.warn("websocket not connected, cannot send: ", data)
    }
  };

  // const disconnect = () => {
  //   shouldCloseRef.current = true;
  //   wsRef.current?.close();
  // }

  return {sendMessage};
};