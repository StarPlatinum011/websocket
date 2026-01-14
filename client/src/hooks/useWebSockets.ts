import { useEffect, useRef, useState } from "react";


export const useWebSocket = (url: string, token: string) => {
  const [wsStatus, setWsStatus] = useState('disconnected');
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    // In production: ws.current = new WebSocket(`${url}?token=${token}`);
    setWsStatus('connected');

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [url, token]);

  const sendMessage = (data) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(data));
    }
  };

  return { ws: ws.current, wsStatus, sendMessage };
};