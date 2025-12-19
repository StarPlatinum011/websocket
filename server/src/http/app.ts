import "dotenv/config";
import express, { Application } from "express";
import authRouter from './routes/authRoute.js'
// import { sessionMiddleware } from "../config/session.js";


const app:Application = express();

console.log('databases: ', process.env.DATABASE_URL)
app.use(express.json());
//Session middleware- before routes
// app.use(sessionMiddleware)
app.use("/api/auth", authRouter);



const PORT = process.env.PORT ?? 3000;

app.listen(PORT, ()=> {
  console.log("Server running on port: ", PORT);
})

