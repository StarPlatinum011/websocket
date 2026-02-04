import { Router } from "express";
import { getRoomMessages, createRoomMessage } from "../controllers/roomMessage.controller.js";


const router = Router({mergeParams: true});

router.get('/',getRoomMessages)
router.post('/', createRoomMessage)

export default router;