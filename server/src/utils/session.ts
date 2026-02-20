import crypto from 'crypto';
import {prisma} from "../db/prisma.js"
import { addHours } from "date-fns"
import { sessionsMap } from "../ws/state.js";

const SESSION_TTL_HOURS = 24 * 7;

//create a new session for a user 
export async function createSession(userId: string) {
    const expiresAt = addHours(new Date, SESSION_TTL_HOURS);
    
    //Create a complicated token
    const token = crypto.randomBytes(32).toString('base64url');

    const session = await prisma.session.create({
        data: {
            userId,
            token,
            expiresAt
        },
    })
    
    return session;
}

//validate session token
export async function validateSession(token: string) {

    const session = await prisma.session.findUnique({
        where: {token},
        include: {user: true}
    });

    if(!session) throw new Error("Invalid session");
    
    if( session.expiresAt < new Date()) {
        await deleteSession(session.id)
        throw new Error("Session Expired!")
    }

    return session;
}

//remove expired sessions
export async function cleanupExpiredSessions() {
    await prisma.session.deleteMany({
        where: {expiresAt: {lt: new Date}}
    })
}

//delete session on logout
export async function deleteSession( sessionId: string ) {
    await prisma.session.delete({where: {id: sessionId}})
    
    const ws = sessionsMap.get(sessionId); //because map has id and ws
    if(ws) {
        ws.close(4004, "Session invalidated.");
        sessionsMap.delete(sessionId);
    }
}

