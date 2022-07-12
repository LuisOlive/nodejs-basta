import { z } from 'zod'

const roomIdSchema = z.object({
  roomId: z
    .string()
    .trim()
    .regex(/^[a-z0-9]{6}$/gi)
})

export type RoomId = z.infer<typeof roomIdSchema>
export default roomIdSchema
