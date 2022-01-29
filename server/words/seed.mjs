import { config as dotenv } from 'dotenv'
import mongoose from 'mongoose'
import { readFile, writeFile } from 'fs/promises'
import CategoryOfLetter from '../models/Category.mjs'

dotenv()
const { MONGODB_USERNAME, MONGODB_PASSWORD, MONGODB_DBNAME } = process.env

const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
// prettier-ignore
const lettersR = [
  /A|Á/, /B/, /C/, /D/, /E|É/, /F/, /G/, /H/, /I|Í/, /J/, /K/, /L/, /M/,
  /N/, /O|Ó/, /P/, /Q/, /R/, /S/, /T/, /U|Ú/, /V/, /W/, /X/, /Y/, /Z/
]

async function main() {
  await fillCategory('apellidos')

  console.log('db filled')
}

async function fillCategory(category) {
  try {
    console.log('category: ' + category)

    const payload = await readFile(`server/words/${category}.txt`, 'utf-8')
    const words = payload.split(',')

    const wordMatrix = lettersR.map(lR => words.filter(w => lR.test(w)))

    await Promise.all(
      letters.map((l, i) => {
        console.log('letter ' + l)
        return CategoryOfLetter(l).create({
          category,
          words: wordMatrix[i],
          lang: 'es'
        })
      })
    )
  } catch (e) {
    console.error(e)
  }
}

mongoose
  .connect(
    `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@cluster0.jdepz.mongodb.net/${MONGODB_DBNAME}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(main)
