
import WebSocket from "ws";

export const usersMap = new Map<string, WebSocket>();
export const sessionsMap = new Map<string, WebSocket>();