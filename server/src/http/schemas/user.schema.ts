import { z } from "zod";

export const registerSchema = z.object({
    email: z.email('Invalid email'),
    username: z.string().min(3, "Username must be at least 3 characters"),
    password: z.string().min(6, "Password must be at least 8 characters")
});

export const loginSchema = z.object({
    email: z.email('Invalid email'),
    password: z.string()
})


export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>