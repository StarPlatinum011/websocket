import { Request, Response } from "express";
import { prisma } from "../../db/prisma.js";

interface CreateDMBody {
  targetUserId: string
}

// POST api/dms/
export const createOrGetDM = async (
  req: Request<Record<string, never>, unknown, CreateDMBody>,
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
  const existingDM = await prisma.room.findUnique({
      where:{ memberHash },
      include: { members: true}
  });

  if( existingDM ) {
      return res.status(200).json(existingDM)
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

//Get api/dms/ 
export const getUserDMs = async (req: Request, res: Response) => {
  const userId = req.userId;

  const dm = await prisma.room.findMany({
    where: {
      type: "DM",
      members: {
        some: {userId}
      }
    }, 
    include:{
      members: {
        include: {
          user: {
            select: { id: true, username: true}
          }
        }
      }
    },
    orderBy: {createdAt: 'desc'}
  });

  res.json(dm);
}



