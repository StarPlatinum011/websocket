import { prisma } from "../../db/prisma.js";

export async function assertRoomMembership(
    userId: string,
    roomId: string
): Promise<boolean>{
    const member = await prisma.roomMember.findFirst({
        where: {
            userId,
            roomId
        }
    });

    return !!member;
}