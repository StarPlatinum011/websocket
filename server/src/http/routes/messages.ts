import { Router } from "express";
import { createOrGetDM } from "../controllers/message.controller.js";

const router =  Router();

router.route('/dm')
    .get()
    .post(createOrGetDM)