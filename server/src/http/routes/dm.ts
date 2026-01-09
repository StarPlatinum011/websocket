import { Router } from "express";
import { createOrGetDM, getUserDMs } from "../controllers/dm.controller.js";

const router =  Router();

router.route('/')
    .get(getUserDMs)
    .post(createOrGetDM)
// GET  /api/dms/:dmId    // metadata + members

export default router;