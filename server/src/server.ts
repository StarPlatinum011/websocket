// // src/server.ts
// import { createServer } from 'http';
// import { app } from './http/app.js';
// import { setupWebSocketServer } from './ws/index.js';

// const PORT = process.env.PORT || 3000;

// // Create the native Node.js HTTP server instance
// const httpServer = createServer(app);

// // Pass the native server to the WebSocket setup function
// setupWebSocketServer(httpServer);

// // Start listening for both HTTP and WebSocket connections
// httpServer.listen(PORT, () => {
//     console.log(`HTTP/WS Server running on http://localhost:${PORT}`);
// });
