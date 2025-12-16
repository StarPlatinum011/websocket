import express, { Application, Router, Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();
const app:Application = express();
app.use(express.json());

const router = Router();
router.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ server: "http", status: "ok" });
});

app.use("/", router);
export { app };
