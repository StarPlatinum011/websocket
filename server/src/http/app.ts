import "dotenv/config";
import cors from 'cors';
import express, { type Express, type Request, type Response } from "express";import auth from './routes/auth.js'
import dms from './routes/dm.js'
import roomMessages from './routes/roomMessages.js'
import { requireSession } from "./middleware/session.js";
import { prisma } from "../db/prisma.js";

export const createHttpApp = ():Express => {
  const app:Express = express();
  
  // app.use(helmet()); // Sets various HTTP headers for security
 // Allows your frontend to talk to this API
  app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false // true only if using cookies
}));
  app.use(express.json());
  
  app.use("/api/auth", auth);
  // app.use("/api/rooms", rooms)
  app.use("/api/dms",requireSession, dms)
  app.use('/api/rooms/:roomId/messages',requireSession, roomMessages);
  
  app.get("/api/me", requireSession, async (req: Request, res) => {
    const userId = req.userId; 
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if(!user) return res.status(401).json("Unauthorized");

    res.json({
      id: user.id,
      name: user.username,
      email: user.email
    })
})
  
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






