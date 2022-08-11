import { z } from 'zod'
import roomIdSchema from './roomIdSchema'

const answerSchema = z
  .object({
    answers: z.string().array().length(2).array().length(5)
  })
  .and(roomIdSchema)

export type AnswersRequest = z.infer<typeof answerSchema>
export default answerSchema
