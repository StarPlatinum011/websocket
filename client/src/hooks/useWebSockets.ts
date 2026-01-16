import { useEffect, useRef, useState } from "react";
import { WebSocketMessage } from "../types/chat.types";


export const useWebSocket = (url: string, token: string) => {
  const [wsStatus, setWsStatus] = useState<'connected' | 'disconnected'>('disconnected');
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    // In production: ws.current = new WebSocket(`${url}?token=${token}`);
    setWsStatus('connected');

    const currentWs = ws.current;

    return () => {
      if (currentWs) {
        currentWs.close();
      }
    };
  }, [url, token]);

  const sendMessage = (data: WebSocketMessage) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(data));
    }
  };

  return { ws: ws.current, wsStatus, sendMessage };
};