import dotenv from "dotenv";
import express, { Application, Request, Response, Router } from "express";

import authRouter from './routes/authRoute.js'

dotenv.config();
const app:Application = express();
app.use(express.json());

const router = Router();
router.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ server: "http", status: "ok" });
});

app.use("/auth", authRouter);
export { app };
