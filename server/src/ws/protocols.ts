import z from "zod";

export const WSClientMessage = z.discriminatedUnion("type", [
    z.object({
        type: z.literal("SEND_MESSAGE"),
        payload: z.object({
            roomId: z.uuid(),
            content: z.string().min(1).max(1000)
        })
    }),

    z.object({
        type: z.literal("JOIN_ROOM"),
        payload: z.object({
            roomId: z.uuid()
        })
    })
])

export const WSServerMessage = z.discriminatedUnion('type', [
    z.object({
        type: z.literal("NEW_MESSAGE"),
        payload: z.object({
            id: z.string(),
            roomId: z.string(),
            senderId: z.string(),
            content: z.string(),
            createdAt: z.string()
        })
    }),

    z.object({
        type: z.literal("ERROR"),
        payload: z.object({
            message: z.string()
        })
    })
])

export type WSClientMessage = z.infer<typeof WSClientMessage>
export type WSServerMessage = z.infer<typeof WSServerMessage>