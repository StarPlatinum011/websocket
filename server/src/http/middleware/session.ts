import { NextFunction, Request, Response } from "express";
import { validateSession } from "../../utils/session.js";


export const requireSession = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.toString().replace("Bearer ", "");
    if(!token) return res.status(401).json({ error: 'No session token provided' })

        try {
            const session = await validateSession(token);

            //attach userId to req for downstream handlers
            req.userId = session.userId;
            next()

        } catch (err) {
            return res.status(401).json({error: "Invalid or session expired: ", err})
        }
}