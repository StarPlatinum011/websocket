import { Router } from "express";
import { createRoom,  getRoomDetails,  getUserRooms, joinRoom, leaveRoom } from "../controllers/rooms.controller.js";


const router = Router();

router.route('/')
    .post(createRoom)
    .get(getUserRooms)

router.route('/:roomId')
    .get(getRoomDetails)
    .post(joinRoom)
    .delete(leaveRoom)


export default router;