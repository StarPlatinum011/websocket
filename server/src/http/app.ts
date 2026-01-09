import "dotenv/config";
import express, { type Express, type Request, type Response } from "express";import auth from './routes/auth.js'
// import cors from "cors";
// import helmet from "helmet";
// import users from './routes/users.js'
import rooms from './routes/rooms.js'
import dms from './routes/dm.js'
import roomMessages from './routes/roomMessages.js'

export const createHttpApp = ():Express => {
  const app:Express = express();
  
  // app.use(helmet()); // Sets various HTTP headers for security
  // app.use(cors());   // Allows your frontend to talk to this API
  app.use(express.json());
  
  app.use("/api/auth", auth);
  // app.use("/api/user", users)
  app.use("/api/rooms", rooms)
  app.use("/api/dms", dms)
  app.use('/api/rooms/:roomId/messages', roomMessages)
  
  interface HttpError extends Error {
    status?: number;
  }

 // Global Error Handler 
  // This catches any error thrown in your controllers
  app.use((err: HttpError, req: Request, res: Response) => {
    console.error("🔥 Server Error:", err.stack);
    res.status(err.status ?? 500).json({
      error: err.message || "Internal Server Error",
    });
  });

  return app;
}






