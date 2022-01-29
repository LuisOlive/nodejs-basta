import mongoose from 'mongoose'

export const CategorySchema = new mongoose.Schema(
  {
    category: String,
    words: Array
  },
  { versionKey: false }
)

export default function CategoryOfLetter(letter) {
  if (typeof letter !== 'string' || letter.length > 1) return { create() {} }

  return mongoose.model(`${letter}-word`, CategorySchema)
}
