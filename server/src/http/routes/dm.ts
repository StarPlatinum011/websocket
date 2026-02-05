import { Router } from "express";
import { createOrGetDM, deleteDM, getUserDMs, searchDms } from "../controllers/dm.controller.js";

const router =  Router();

router.get('/', getUserDMs)
router.get('/search', searchDms)
router.post('/create', createOrGetDM)
router.delete('/:roomId', deleteDM)
// GET  /api/dms/:dmId    // metadata + members

export default router;