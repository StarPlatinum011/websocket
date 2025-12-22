import "dotenv/config";
import express, { Application } from "express";
import authRouter from './routes/authRoute.js'

export const createHttpApp = () => {
  const app:Application = express();
  
  app.use(express.json());
  app.use("/api/auth", authRouter);

  return app;

}






