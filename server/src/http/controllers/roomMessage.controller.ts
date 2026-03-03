import { Request, Response } from "express";
import { prisma } from "../../db/prisma.js";

interface RoomMessageBody  {
  content: string
}

//GET /api/rooms/:roomId/messages/
export const getRoomMessages = async (req: Request, res: Response) => {
  const  roomId  = req.params.roomId.trim();
  const userId = req.userId?.trim();

  
  // console.log("Room Message, ", userId, " and roomId: ", roomId);
  
  //  Validate membership
  const isMember = await prisma.roomMember.findFirst({
    where: { roomId, userId }
  });


  if (!isMember) {
    return res.status(403).json({ error: "Not a room member" });
  }

  // Fetch messages
  const messages = await prisma.message.findMany({
    where: { roomId },
    include: {sender: true},
    orderBy: { createdAt: "asc" },
    take: 50 
  });

  const formattedMessage = messages.map(msg => ({
    id: msg.id, // message Id
    userId: msg.senderId, // current user
    username: msg.sender.username, //another user
    content: msg.content,
    timestamp: msg.createdAt,

  }));


  res.send(formattedMessage);
};


export const createRoomMessage =  async (
  req: Request<Record<string, never>, unknown, RoomMessageBody>,
  res: Response
) => {
  const {content } = req.body;
  const {roomId }= req.params;
  const userId = req.userId;

  if(!content || typeof content !== "string") {
    return res.status(400).json({error: "Invalid message content"});
  }

  if(!userId) {
    return res.status(401).json({error: "Unauthorized"});
  }

  //verify membership 
  const isMember = await prisma.roomMember.findFirst({
    where: {
      roomId,
      userId
    }
  });

  if(!isMember) {
    return res.status(403).json({error: "Not a room member"});
  }

  const savedMessage = await prisma.message.create({
    data:{
      roomId,
      senderId: userId,
      content
    }
  });

  res.status(201).json(savedMessage)
}