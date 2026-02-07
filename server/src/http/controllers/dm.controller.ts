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

  if (targetUserId === userId) {
    return res.status(400).json({ error: 'Cannot DM yourself' });
  }

  //Check if the target user exists in the table
  const targetUser = await prisma.user.findUnique({
    where : {id: targetUserId},
    select: { id:true, username:true, email:true}
  })
  if(!targetUser) res.status(404).json({ error: 'User not found'})

  // This is what goes in row memberHash to enable 1-1 DM
  const memberHash = [userId, targetUserId].sort().join(':');

  //search existing room with both users
  const existingDM = await prisma.room.findUnique({
      where:{ memberHash },
      include: { 
        members : {
          include: {
            user:{
              select: { id: true, username: true, email: true }
            }
          }
        }
      }
  });

  if( existingDM ) {
      return res.status(200).json({
        room:{
          id: existingDM.id,
          type: existingDM.type,
          name: targetUser?.username,
          memberHash: existingDM.memberHash,
          otherUser: targetUser,
          createdAt: existingDM.createdAt
        },
        isNew: false
      })
  }

  const room = await prisma.room.upsert({
    where: {memberHash},
    update: {}, //No update if exists
    create: {
        type: 'DM',
        memberHash,
        name: null,
        isPrivate: true,
        members: {
            createMany: {
                data: [
                    {userId},
                    {userId: targetUserId}
                ]
            }
        }
    },
    include:{
      members:{
        include:{
          user:{
            select: {id:true, username:true, email:true}
          }
        }
      }
    }
  })

  return res.status(201).json({
    room: {
      id: room.id,
      type: room.type,
      name: targetUser?.username,  // DM name is the other user's name
      memberHash: room.memberHash,
      otherUser: targetUser,
      createdAt: room.createdAt
    },
    isNew: true
  });
}

//Get api/dms
export const getUserDMs = async (req: Request, res: Response) => {
  const userId = req.userId;

  const dms = await prisma.room.findMany({
    where: {
      type: "DM",
      members: {
        some: {userId}
      }
    }, 
    include:{
      members: {
        where: { userId: { not: userId } },
        include: {
          user: {
            select: { id: true, username: true, email:true}
          }
        }
      },
      messages: {
        orderBy: {createdAt: 'desc'},
        take: 1 //Last message only
      }
    },
    orderBy: {
      lastMessageAt: 'desc'
    }
    
  });

  // Format for frontend
  const formatted = dms.map( dm => {
    const otherUser = dm.members[0]?.user;
    const lastMessage = dm.messages[0];

    return {
      id: dm.id,
      type: dm.type,
      name: otherUser.username,
      memeberHash: dm.memberHash,
      otherUser: otherUser,
      lastMessage: lastMessage.content || '',
      timeStamp: lastMessage.createdAt,
      unread: 0
    }
  })

  res.json({dms: formatted});
}

// Implement soft delete
export const deleteDM = async (
  req: Request,
  res: Response
) => {
  const userId = req.userId;
  const {roomId} = req.params;

  if (!userId || !roomId ) {
    return res.status(400).json({error: "Missing Information."})
  }

  await prisma.roomMember.delete({
    where:{
      roomId_userId: {
        roomId,
        userId
      }    
    },
  });

  res.status(201).json({message: "You have left the chat."});
}


export const searchDms = async (
  req: Request,
  res: Response
) => {

  const {q} = req.query;
  const userId = req.userId;

  console.log(userId, " THi s uid")
  try {
    if (!q || typeof q !== 'string' || q.trim().length === 0) {
      return res.status(400).json({ error: 'Search query required' });
    }

    const users = await prisma.user.findMany({
      where: {
        
        id: {not: userId},
      
        OR:[
          {username: {contains: q, mode: 'insensitive'}},
          { email: { contains: q , mode: 'insensitive' } }
        ],
          
        
      },
      select:{
        id: true,
        username: true,
        email: true
      },
      take: 15 //Limit results
    });

    res.json({ users });

  } catch (err) {
        res.status(500).json({ error: 'Failed to search users', err });
  }
}


