import { Router } from "express";
import { createOrGetRoom, getRoomMessages, getUserRooms } from "../controllers/rooms.controller.js";


const router = Router();

router.route('/')
    .post(createOrGetRoom)
    .get(getUserRooms)

router.get('/:roomId/messages', getRoomMessages)


export default router;