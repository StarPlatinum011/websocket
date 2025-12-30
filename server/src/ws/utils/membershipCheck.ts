import { prisma } from "../../db/prisma.js";

export async function assertRoomMembership(
    userId: string,
    roomId: string
) {
    const member = await prisma.roomMember.findFirst({
        where: {
            userId,
            roomId
        }
    });

    if (!member) throw new Error("User is not a member of this room.")
}