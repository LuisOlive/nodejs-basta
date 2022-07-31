import { z } from 'zod'

const stringSchema = z
  .string()
  .trim()
  .regex(/^[a-z0-9ñáéíóú\s_]*$/gi)

export default stringSchema
