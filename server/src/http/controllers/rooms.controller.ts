import { Request, Response } from "express";
import { prisma } from "../../db/prisma.js";


//POST /api/rooms


//GET api/rooms
export const getUserRooms = async (req: Request, res: Response) => {
  const userId = req.userId;

  const rooms = await prisma.room.findMany({
    where: { //filter query
      members: {
        some: { userId }
      }
    },
    include: {// selection query
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
