import sample from 'lodash/sample.js'
import { fiveCategories } from '../data/categories.mjs'

const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

export default class Game {
  constructor() {
    this.categories = fiveCategories()
    this.letter = sample(letters)
  }
}
