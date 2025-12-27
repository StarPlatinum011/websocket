import { Request, Response } from "express";
import { prisma } from "../../db/prisma.js";

//POST /api/rooms
export const createOrGetRoom = async (req: Request, res: Response) => {
    const userId = req.userId; //retrieve from session middleware 
    const { targetUserId } = req.body;

    if( !targetUserId || targetUserId === userId ){
        return res.status(400).json({error: 'Invalid target user'});
    }

    //search existing room with both users
    const existingRoom = await prisma.room.findFirst({
        where:{
            members: {
                every:{
                    userId: { in: [userId, targetUserId]} //userId == userId OR userId == targetUserId (first userId is column name in RoomMember table)
                }
            }
        },
        include: { members: true}
    });

    if(existingRoom) {
        return res.status(200).json(existingRoom)
    }

    //Create room + members in transaction
    const room = await prisma.$transaction(async (tx) => {
        const newRoom = await tx.room.create({ data: {} });

        await tx.roomMember.createMany({
            data: [
                { roomId: newRoom.id, userId },
                { roomId: newRoom.id, userId: targetUserId }
            ]
        })
        return newRoom;
    });

    return res.status(201).json(room);
}

//GET api/rooms
export const getUserRooms = async (req: Request, res: Response) => {
  const userId = req.userId;

  const rooms = await prisma.room.findMany({
    where: {
      members: {
        some: { userId }
      }
    },
    include: {
      members: {
        include: {
          user: {
            select: { id: true, username: true }
          }
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  res.json(rooms);
};



//GET /api/rooms/:roomId/messages
export const getRoomMessages = async (req: Request, res: Response) => {
  const userId = req.userId;
  const { roomId } = req.params;

  // 1. Validate membership
  const isMember = await prisma.roomMember.findFirst({
    where: { roomId, userId }
  });

  if (!isMember) {
    return res.status(403).json({ error: "Not a room member" });
  }

  // 2. Fetch messages
  const messages = await prisma.message.findMany({
    where: { roomId },
    orderBy: { createdAt: "asc" },
    take: 50 // pagination later
  });

  res.json(messages);
};
