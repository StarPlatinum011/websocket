import { useEffect, useRef } from "react";
import { WebSocketMessage } from "../types/chat.types";
import { useChatStore } from "../store/useChatStore";


export const useWebSocket = (url: string, token: string) => {

  const ws = useRef<WebSocket | null>(null);

  const setWsStatus = useChatStore((state) => state.setWsStatus);
  const addMessage = useChatStore((state) => state.addMessage);
  const setRooms = useChatStore((state) => state.setRooms)

  useEffect(() => {

    console.log("Connecting to WebSocket...");

    //Single websocket conn
    ws.current = new WebSocket(`${url}?token=${token}`);

    //Connection open
    ws.current.onopen = () => {
      console.log("WebSocket connected");
      setWsStatus('Online');
    };

    //Connection close
    ws.current.onclose = () => {
      console.log(' WebSocket disconnected');
      setWsStatus('Offline');
    }

    // Receive message from server
    ws.current.onmessage = (e) => {
      const data = JSON.parse(e.data);
      console.log('Data: ', data)

      switch (data.type) {
        case "NEW_MESSAGE":
          addMessage(data.roomId, {
            id: data.messageId,
            userId: data.userId,
            userName: data.userName,
            content: data.content,
            timestamp: data.timestamp,
            isMine:false
          });
          break;

        case "ROOM_LIST":
          setRooms(data.rooms);
          break;

        case "JOIN_ROOM":
          console.log(`${data.userName} joined ${data.roomId}`);
          break;
      }

    }

    //Error hhandle
    ws.current.onerror = (error) => {
      console.log("Websocket error: ", error)
    }

    return () => {
      console.log("Closing websocket connection...");
      if(ws.current) {
        ws.current.close();
      }
    };
  }, [url, token, setWsStatus, addMessage, setRooms]);


  const sendMessage = (data: WebSocketMessage) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(data));
    } else {
      console.warn("websocket not connected, cannot send: ", data)
    }
  };

  return {sendMessage, wsStatus: ws.current?.readyState === WebSocket.OPEN ? 'Online' : 'Offline'};
};