import { Request, Response } from "express";
import { prisma } from "../../db/prisma.js";

interface CreateRoomBody {
  targetUserId: string
}

export const createOrGetDM = async (
  req: Request<Record<string, never>, unknown, CreateRoomBody>,
  res: Response
) => {
  const userId = req.userId; //retrieve from session middleware 
  const { targetUserId } = req.body;

  if( !targetUserId || !userId ){
      return res.status(400).json({error: 'Invalid target user'});
  }

  // This is what goes in row memberHash to enable 1-1 DM
  const memberHash = [userId, targetUserId].sort().join(':');

  //search existing room with both users
  const existingRoom = await prisma.room.findUnique({
      where:{ memberHash },
      include: { members: true}
  });

  if( existingRoom ) {
      return res.status(200).json(existingRoom)
  }

  const room = await prisma.room.upsert({
    where: {memberHash},
    update: {},
    create: {
        type: 'DM',
        memberHash,
        members: {
            createMany: {
                data: [
                    {userId},
                    {userId: targetUserId}
                ]
            }
        }
    }
  })

  return res.status(201).json(room);
}