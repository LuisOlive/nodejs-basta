import { z } from 'zod'
import roomIdSchema from './roomIdSchema'

const answerSchema = z
  .object({
    answers: z.string().array(),
    authorId: z.string().length(4)
  })
  .and(roomIdSchema)

export type AnswersRequest = z.infer<typeof answerSchema>
export default answerSchema
