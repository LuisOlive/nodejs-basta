import { z } from 'zod'
import roomIdSchema from './roomIdSchema'
import stringSchema from './stringSchema'

const evaluationSchema = z
  .object({
    answer: stringSchema,
    points: z.number().multipleOf(50).min(0).max(100),
    category: z.string()
  })
  .and(roomIdSchema)

export type Evaluation = z.infer<typeof evaluationSchema> & { points: 0 | 50 | 100 }
export default evaluationSchema
