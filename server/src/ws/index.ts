import crypto from "crypto";
import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

function heartbeat(this: any) {
  this.isAlive = true;
}

const users = new Map();

wss.on("connection", (ws) => {
  const userId = crypto.randomUUID();
  ws.userId = userId;
  ws.isAlive = true;
  ws.connectedAt = Date.now();

  //store users in memory
  users.set(userId, { socket: ws });

  console.log("User connected: ", userId);

  ws.on("pong", heartbeat);

  ws.on("message", (rawData) => {
    let userData;
    try {
      userData = JSON.parse(rawData.toString());
    } catch (error) {
      console.log("Invalid json: ", rawData.toString());
      return;
    }

    console.log("Received: ", userData);
    const payload = JSON.stringify({
      message: userData.message,
      timestamp: new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        hour12: true,
        minute: "2-digit",
      }),
      username: userData.username || "anon",
    });

    // Broadcast
    for (const client of wss.clients) {
      if (client.readyState === ws.OPEN) {
        client.send(payload);
      }
    }

    ws.on("close", () => {
      users.delete(userId);
      console.log("User disconnected: ", userId);
    });
  });

  //set heartbeat loop for the entire server
  setInterval(() => {
    for (const ws of wss.clients) {
      if (!ws.isAlive) {
        console.log("Terminating inactive users: ", ws.userId);
        ws.terminate;
        users.delete(userId);
        continue;
      }

      ws.isAlive = false;
      ws.ping();
    }
  }, 30000);
});

console.log("WebSocket server running on port: 8080");
