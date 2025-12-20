import {prisma} from "../db/prisma.js"
import { add } from "date-fns"

//create a new session for a user 
export async function createSession(userId: string, hoursValid = 2) {
    const session = await prisma.session.create({
        data: {
            userId,
            expiresAt: add(new Date(), {hours: hoursValid})
        },
    })
    
    return session;
}

//validate session token
export async function validateSession(sessionId: string) {
    const session = await prisma.session.findUnique(
        {
            where: {id: sessionId}
        }
    )
    
    if(!session || session.expiresAt < new Date()) {
        throw new Error("Invalid or expired session");
    }

    return session
}

//remove expired sessions
export async function cleanupExpiredSessions() {
    await prisma.session.deleteMany({
        where: {expiresAt: {lt: new Date}}
    })
}

export async function deleteSession( sessionId: string ) {
    const session = await prisma.session.delete({where: {id: sessionId}})
    return session;
}

