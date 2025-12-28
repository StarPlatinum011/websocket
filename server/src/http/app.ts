import "dotenv/config";
import express, { Application } from "express";
import auth from './routes/auth.js'
// import users from './routes/users.js'
import rooms from './routes/rooms.js'

export const createHttpApp = () => {
  const app:Application = express();
  
  app.use(express.json());
  app.use("/api/auth", auth);
  // app.use("/api/user", users)
  app.use("/api/rooms", rooms)


  return app;
}






