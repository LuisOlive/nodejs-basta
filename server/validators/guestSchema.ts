import { z } from 'zod'
import roomIdSchema from './roomIdSchema'
import playerSchema from './playerSchema'

const guestSchema = playerSchema.and(roomIdSchema)

export type Guest = z.infer<typeof guestSchema>
export default guestSchema
