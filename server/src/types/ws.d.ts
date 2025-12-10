import "ws";

declare module "ws" {
  interface WebSocket {
    userId?: string;
    isAlive?: boolean;
    connectedAt?: number;
    // add any other custom props you plan to use
  }
}
