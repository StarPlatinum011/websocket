import { Router } from "express";
import { getRoomMessages } from "../controllers/message.controller.js";


const router = Router();

router.get('/',getRoomMessages)

export default router;