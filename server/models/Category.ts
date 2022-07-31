import mongoose from 'mongoose'

export const CategorySchema = new mongoose.Schema(
  {
    category: String,
    words: Array
  },
  { versionKey: false }
)

export default function letterCategory(letter: string) {
  return mongoose.model(`${letter}-word`, CategorySchema)
}
