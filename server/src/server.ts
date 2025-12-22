// src/server.ts
import { createServer } from 'http';
import { createHttpApp } from './http/app.js';
import { initWebSocketServer } from './ws/index.js';

const PORT = process.env.PORT;
if (!PORT) throw new Error('No PORT provided')

const app = createHttpApp();
// Create the native Node.js HTTP server instance
const server = createServer(app);

// Pass the native server to the WebSocket setup function
initWebSocketServer(server);

// Start listening for both HTTP and WebSocket connections
server.listen(PORT, () => {
    console.log(`HTTP/WS Server running on http://localhost:${PORT}`);
});
