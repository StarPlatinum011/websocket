import "ws";

declare module "ws" {
  interface WebSocket {
    connectedAt?: number;
    isAlive?: boolean;
    userId?: string;
    sessionId?: string
    // add any other custom props you plan to use
  }
}
