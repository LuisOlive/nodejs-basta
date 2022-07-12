import { z } from 'zod'
import stringSchema from './stringSchema'

const messageSchema = z.object({ message: stringSchema }).or(stringSchema)

export type Message = z.infer<typeof messageSchema>
export default messageSchema
