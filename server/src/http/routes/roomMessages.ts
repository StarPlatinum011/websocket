import { Router } from "express";
import { getRoomMessages } from "../controllers/message.controller.js";


const router = Router({mergeParams: true});

router.get('/',getRoomMessages)
router.post('/',)

export default router;