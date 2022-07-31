import connect from './connection'
import { readFile } from 'fs/promises'
import CategoryOfLetter from './models/Category'

const letters = 'abcdefghijklmnopqrstuvwxyz'.split('')

// prettier-ignore
const letterRegexes = [
  /^(a|á)/ig, /^b/ig, /^c/ig,     /^d/ig, /^(e|é)/ig, /^f/ig,     /^g/ig, /^h/ig, /^(i|í)/ig, 
  /^j/ig,     /^k/ig, /^l/ig,     /^m/ig, /^n/ig,     /^(o|ó)/ig, /^p/ig, /^q/ig, /^r/ig, 
  /^s/ig,     /^t/ig, /^(u|ú)/ig, /^v/ig, /^w/ig,     /^x/ig,     /^y/ig, /^z/ig
]

async function main() {
  await Promise.all(
    ['empleos', 'frutos', 'países', 'animales', 'colores', 'apellidos', 'nombres'].map(
      fillCategory
    )
  )

  console.log('db filled')
}

async function fillCategory(category: string) {
  console.log('category:', category)

  // read file with all words in folder "words"
  const payload = await readFile(`server/words/${category}.txt`, 'utf-8')

  // split got string in each line with word
  const words = payload.split('\n')

  // array of one array with the words for each letter
  const wordMatrix = letterRegexes.map(lR => words.filter(w => lR.test(w)))

  // send all arrays of words to mongodb
  await Promise.all(
    letters.map(async (letter, i) => {
      await CategoryOfLetter(letter).deleteMany({ words: /.*/gi })

      return CategoryOfLetter(letter).create({
        category,
        words: wordMatrix[i],
        lang: 'es'
      })
    })
  )

  console.log('category', category, 'filled')
}

connect().then(main).catch(console.error.bind(console))
