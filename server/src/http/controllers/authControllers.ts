import bcrypt from 'bcrypt'
import { Request, Response } from "express";
import { prisma } from "../../db/prisma.js"
import { loginSchema, registerSchema } from '../schemas/user.schema.js';
import { createSession } from '../../utils/session.js';


export const registerUser =  async (req: Request, res:Response) => {
    try {
        //zod validation 
        const parsed = registerSchema.safeParse(req.body);
        if(!parsed.success) {
            return res.status(400).json({errors: parsed.error})
        }
        const { password, username } = parsed.data; 


        // check db if username is taken
        const existingUser = await prisma.user.findUnique({
            where: { username }
        });
        if(existingUser) return res.status(409).json({error: "Username already taken"})

        //Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        //Create User
        const user = await prisma.user.create({
            data: {
                password: hashedPassword,
                username,
            },
            select: {
                createdAt: true,
                id: true,
                username: true,
            }
        })


        return res.status(201).json({
            message: "User Registered successfully.",
            user
        })
    } catch (error) {
        console.error('Register error: ', error)
        return res.status(500).json({ 
            error: error instanceof Error ? error.message : "Internal server error",
        });
    }
}

export const loginUser = async (req: Request, res:Response) => {
    try {

        const parsed = loginSchema.safeParse(req.body)
        if(!parsed.success) {
            return res.status(400).json({errors: parsed.error})
        }

        const {password, username } = parsed.data;

        const user = await prisma.user.findUnique({
            where: {username}
        })

        if (!user) {
            return res.status(401).json({error: 'User not found.'});
        }


        const passwordMatch = await bcrypt.compare(password, user.password);

        if(!passwordMatch) {
            return res.status(401).json({ error: 'Wrong password.'})
        }

        //Create a session 
        const session = await createSession(user.id)

        return res.status(200).json({
            message: 'Logged in successfully.',
            sessionId: session.id
        })
        
        
    } catch (error) {
        console.error('Register error: ', error)
        return res.status(500).json({ 
            error: error instanceof Error ? error.message : "Internal server error",
        });
    }



}