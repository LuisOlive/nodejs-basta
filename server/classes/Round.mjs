import sample from 'lodash/sample.js'
import zipObject from 'lodash/zipObject.js'
import find from 'lodash/find.js'

import { fiveCategories } from '../data/categories.mjs'
import CategoryOfLetter from '../models/Category.mjs'

const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

export default class Round {
  categories = fiveCategories()
  letter = sample(letters)
  answers = []
  timeLeft = 21
  thoseWhoAnswered = []

  constructor(room) {
    /** @type {Game} */
    this.room = room

    CategoryOfLetter(this.letter)
      .find({
        category: new RegExp(`(${this.categories.join('|')})`, 'i')
      })
      .then(answers => this.fillAnswers(answers))
      .catch(console.error.bind(console))

    this.results = this.categories.map(category => ({ category, answers: [] }))
  }

  saveResults({ color, answers }) {
    // preventing answers out of time & people that answer many times
    if (this.timeLeft <= 0 || this.thoseWhoAnswered.includes(color)) return

    this.categories.forEach((category, i) => {
      find(this.results, { category }).answers.push({
        category,
        color,
        answer: answers[i],
        score: this.evaluateWord(category, answers[i])
      })

      // preventing of people that answer many times
      this.thoseWhoAnswered.push(color)
    })

    this.tryStartCountDown()
  }

  startCountDown() {
    if (this.timeLeft === 21) {
      const interval = setInterval(() => {
        const { timeLeft, results } = this

        this.room.emit('countdown:count', { timeLeft })

        if (!this.timeLeft--) {
          clearInterval(interval)
          this.room.status = 'WAITING_UNKNOWN_WORDS'
          this.room.emit('countdown:finished', {
            results,
            status: 'WAITING_UNKNOWN_WORDS'
          })
        }
      }, 1000)
    }
  }

  onTimeFinished() {}

  evaluateWord(category, word) {
    let result = 0

    try {
      this.answers[category].forEach(({ regex, points }, i) => {
        if (!result && regex.test(word)) {
          if (points === 100) this.answers[category][i].points = 50

          result = points
        }
      })
      //
      return result
    } catch {
      console.error(`${category} does not exist, check if is it correct`)
      return 0
    }
  }

  fillAnswers(answers) {
    answers.forEach(({ category, words }) => {
      this.answers[category] = words.map(w => ({
        regex: new RegExp(`^${w}$`, 'i'),
        points: 100
      }))
    })
  }

  data() {
    const { letter, categories } = this
    return { letter, categories }
  }
}
/**
 * @typedef { import('./Player.mjs').default } Player
 * @typedef { import('./Game.js').default } Game
 * @typedef {'CREATED' | 'WAITING_PLAYERS' | 'WAITING_ADMIN' | 'AT_ROUND'} GameStatus
 */
