import connect from './connection'
import { readFile, writeFile } from 'fs/promises'
import { load } from 'js-yaml'
import chalk from 'chalk'
import CategoryOfLetter from './models/Category'
import { resolve as resolvePath } from 'path'

const p = console.log

const letters = 'abcdefghijklmnopqrstuvwxyz'.split('')

// prettier-ignore
const letterRegexes = [
  /^(a|á)/ig, /^b/ig, /^c/ig,     /^d/ig, /^(e|é)/ig, /^f/ig,     /^g/ig, /^h/ig, /^(i|í)/ig, 
  /^j/ig,     /^k/ig, /^l/ig,     /^m/ig, /^n/ig,     /^(o|ó)/ig, /^p/ig, /^q/ig, /^r/ig, 
  /^s/ig,     /^t/ig, /^(u|ú)/ig, /^v/ig, /^w/ig,     /^x/ig,     /^y/ig, /^z/ig
]

const txt = open('txt', 'words/es')
const yml = open('yml', 'words/es', load)

async function main() {
  const { categories } = await yml('main')
  const categoriesNames = categories?.map(x => x.plural)

  writeTSFile(
    'categories',
    `
  const categories = ${JSON.stringify(categoriesNames)}
  export default categories
  `
  )

  await Promise.all(categoriesNames.map(fillCategory))

  p(chalk.greenBright('db filled'))
}

async function fillCategory(category: string) {
  p(chalk.magenta(`category: ${category}`))

  // read file with all words in folder "words"
  const payload = await txt(category)

  // split got string in each line with word
  const words = payload.split(',')

  // array of one array with the words for each letter
  const wordMatrix = letterRegexes.map(lR => words.filter(w => lR.test(w)))

  // send all arrays of words to mongodb
  await Promise.all(
    // for every letter
    letters.map(async (letter, i) => {
      // delete previous items
      await CategoryOfLetter(letter).deleteMany({ words: /./gi })

      // insert new objects
      return CategoryOfLetter(letter).create({
        category,
        words: wordMatrix[i],
        lang: 'es'
      })
    })
  )

  console.log('category', category, 'filled')
}

function resolve(ext: string, folder = '.') {
  return function (fileNameNoExt: string) {
    return resolvePath(`server/${folder}/${fileNameNoExt}.${ext}`)
  }
}

function open(ext: string, folder = '.', map = t => t) {
  const get = resolve(ext, folder)

  return function (fileNameNoExt: string) {
    return readFile(get(fileNameNoExt), 'utf-8').then(map)
  }
}

async function writeTSFile(fileName: string, data: any) {
  const ts = resolve('ts', 'data')

  writeFile(ts(fileName), data, 'utf-8')
}

connect()
  .then(main)
  .catch(x => console.error(chalk.red(x)))
