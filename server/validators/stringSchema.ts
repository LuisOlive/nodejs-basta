import { z } from 'zod'

const stringSchema = z.string().trim().min(1)

export default stringSchema
