import sample from 'lodash/sample.js'
import { fiveCategories } from '../data/categories.mjs'

const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

export default class Round {
  categories = fiveCategories()
  letter = sample(letters)

  data() {
    const { letter, categories } = this
    return { letter, categories }
  }
}
