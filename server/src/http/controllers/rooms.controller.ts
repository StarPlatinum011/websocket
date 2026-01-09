import { Request, Response } from "express";
import { prisma } from "../../db/prisma.js";

interface CreateRoomBody {
  name: string
  isPrivate?: boolean
}
//POST /api/rooms
export const createRoom = async (
  req: Request<Record<string, never>, unknown, CreateRoomBody>,
  res: Response
) => {
  const userId = req.userId;
  const {name, isPrivate} = req.body; 

  if (!name ||!userId ) return res.status(400).json({error: 'Invalid input'});

  try {
    const room = await prisma.room.create({
    data:{
      name,
      type: 'CHANNEL',
      isPrivate: isPrivate ?? false,
      members: {
        create: {
          userId
        }
      }
    },
    include:{
      members:{
        include:{
          user:{
            select:{id: true, username: true}
          }
        }
      }
    }
  })

  res.status(201).send(room);


  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// POST /api/rooms/:roomId
export const joinRoom = async(
  req: Request<{ roomId: string}>,
  res: Response
) => {

  try {
    const userId = req.userId;
    const { roomId }= req.params;
  
    if(!userId || !roomId ) return res.status(400).json({error: "Invalid input"})
    
    await prisma.roomMember.create({
      data:{
        userId,
        roomId: roomId
      }
    });

    res.status(204).send();


  } catch (error) {
    console.log(error)
    return res.status(500).json({error: "Internal server error."})
  }
}

// DELETE /api/rooms/:roomId
export const leaveRoom =async (
  req: Request<{roomId: string}>,
  res: Response
) => {
  const userId = req.userId;
  const {roomId} = req.params;

  if(!userId ) return res.status(400).json({error: "Unauthorized"});

  await prisma.roomMember.deleteMany({
    where:{
      roomId, 
      userId
    }
  })

  res.status(204).send();
}

//GET api/rooms
export const getUserRooms = async (req: Request, res: Response) => {
  const userId = req.userId;

  const rooms = await prisma.room.findMany({
    where: { //filter query
      type: "CHANNEL",
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

//GET api/rooms/:roomId
export const getRoomDetails = async (
  req: Request,
  res: Response
) => {
  const userId = req.userId;
  const { roomId } = req.params;

  const room = await prisma.room.findFirst({
    where:{
      type: 'CHANNEL',
      id: roomId,
      members: {some: {userId}}
    }, 
    include:{
      members:{
        include:{
          user:{
            select:{id:true, username:true}
          }
        }
      }
    }
  });

  if(!room) {
    return res.status(404).json({error: "Room not found or access denied"})
  }

  res.json(room);
}



