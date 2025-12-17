import bcrypt from 'bcrypt'
import { Request, Response } from "express";

import { prisma } from "../../db/prisma.js"

interface UserBody {
    password: string;
    username: string;
}

export const registerUser =  async (req: Request, res:Response) => {
    try {
        const { password, username } = req.body as UserBody; 

        // const hashed = await hashPassword(password);

        //validate inputs
        if(!username || !password ) {
            return res.status(400).json({
                error: 'Username and password not provided.'
            })
        }

        if(password.length < 8) {
            return res.status(400).json({
                error: 'Passwornd must be at least 8 character'
            })
        }

        // check db
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
        console.error('Register error: ', 500)
        return res.status(500).json({ 
            error: error instanceof Error ? error.message : "Internal server error",
        });
    }
}

export const login = async (req: Request, res:Response) => {
    try {
        const {password, username } = req.body as UserBody;

        if( !password || !username ) {
            return res.status(400).json({error: "Username and password not provided."});
        }

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

        return res.status(200).json({
            message: 'Logged in successfully.',
            userId: user.id
        })
        
        
    } catch (error) {
        console.error('Register error: ', 500)
        return res.status(500).json({ 
            error: error instanceof Error ? error.message : "Internal server error",
        });
    }



}