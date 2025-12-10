import "ws";

declare module "ws" {
    // @types/ws exports a namespace-like WebSocket shape; augment the nested WebSocket interface
    namespace WebSocket {
        interface WebSocket {
            userId?: string;
            isAlive?: boolean;
            connectedAt?: number;
        }
    }
}
