import { z } from 'zod'

// prettier-ignore
export const colors = <const>[
  'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 
  'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose'
]

const colorSchema = z.enum(colors)
export type Color = z.infer<typeof colorSchema>

const playerSchema = z.object({
  name: z.string().regex(/^[a-z0-9ñáéíóú\s_]*$/gi),
  color: z.enum(colors)
})

export type Player = z.infer<typeof playerSchema>
export default playerSchema
