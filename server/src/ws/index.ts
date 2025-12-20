import { WebSocketServer } from "ws";
import { validateSession } from "../utils/session.js";
import { users } from "./state.js";

const wss = new WebSocketServer({ port: 8080 });


wss.on("connection", (ws, req) => {
  void (async () =>  {
    try {
      const params = new URLSearchParams(req.url?.split("?")[1]);
      const token = params.get("token");

      if(!token) {
        ws.close(4001, "No token provided.")
        return;
      }
      const session = await validateSession(token);

      ws.userId = session.userId;
      ws.sessionId = session.id;

      users.set(session.userId, ws)

      ws.send(JSON.stringify({ message: "Authenticated." }));

    } catch (err) {
      
      ws.close(4003, (err as Error).message)
    }
    })();
});

console.log("WebSocket server running on port: 8080");




  //store users in memory
  // users.set(userId, { socket: ws });

  // console.log("User connected: ", userId);

  // ws.on("pong", heartbeat);

  // ws.on("message", (rawData) => {
  //   let userData;
  //   try {
  //     userData = JSON.parse(rawData.toString());
  //   } catch (error) {
  //     console.log("Invalid json: ", rawData.toString());
  //     return;
  //   }

  //   console.log("Received: ", userData);
  //   const payload = JSON.stringify({
  //     message: userData.message,
  //     timestamp: new Date().toLocaleTimeString("en-US", {
  //       hour: "numeric",
  //       hour12: true,
  //       minute: "2-digit",
  //     }),
  //     username: userData.username || "anon",
  //   });

    // Broadcast
    // for (const client of wss.clients) {
    //   if (client.readyState === ws.OPEN) {
    //     client.send(payload);
    //   }
    // }

  //   ws.on("close", () => {
  //     users.delete(userId);
  //     console.log("User disconnected: ", userId);
  //   });
  // });