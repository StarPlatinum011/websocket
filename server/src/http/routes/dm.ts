import { Router } from "express";
import { createOrGetDM, deleteDM, getUserDMs } from "../controllers/dm.controller.js";

const router =  Router();

router.route('/')
    .get(getUserDMs)
    .post(createOrGetDM)

router.delete('/:roomId', deleteDM)
// GET  /api/dms/:dmId    // metadata + members

export default router;