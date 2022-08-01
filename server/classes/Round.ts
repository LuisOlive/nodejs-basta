import { sample, findIndex, sampleSize, find, keys, pickBy } from 'lodash'

import Room, { GameStatus } from './Room'
import type { AnswersRequest } from '../validators/answersSchema'

import letterCategory from '../models/Category'
import { connections } from 'mongoose'

const letters = 'abcdefghijklmnopqrstuvwxyz'.split('')

export const categories = ['empleos', 'frutos', 'países', 'animales', 'colores', 'apellidos', 'nombres']

/** answer belongs to db */
interface Answer {
  regex: RegExp
  used: boolean
  category: string
}

interface Result {
  category: string
  answer: string
  points: 0 | 50 | 100 | -1
  authorId?: string
}

interface DbAnswer {
  category: string
  words: string[]
  answers?: string[]
}

export default class Round {
  readonly categories = sampleSize(categories, 5)
  readonly letter = sample(letters) as string
  // full list of answers gotten from db, with 100 or 50 points
  #answers: Answer[] = []
  #timeLeft = 21
  // answers from the users
  #results: Result[]
  #timeleftInterval: NodeJS.Timer
  #pendingPlayers: number

  constructor(readonly room: Room) {
    this.getAnswersFromDb().catch(console.error)

    this.#results = []

    this.#pendingPlayers = room.data.players.length
  }

  count() {
    this.#timeLeft--
    this.room.emit('countdown:count', { timeLeft: this.#timeLeft })

    if (!this.#timeLeft || !this.#pendingPlayers) {
      this.finishTime()
    }
  }

  evaluateKnownAnswers() {
    this.#results.forEach(({ answer }, i) => {
      const j = findIndex(this.#answers, ({ regex }) => regex.test(answer))
      if (j === -1) return

      if (this.#answers[j].used) {
        return (this.#results[i].points = 50)
      }

      this.#results[i].points = 100
      this.#answers[j].used = true
    })
  }

  /**
   * gives score selected from admin to the results object
   * @param evaluation the category and answer accepted by the admin
   */
  evaluateUnknownResult({ category, answer, points }: Result) {
    const indexes: number[] = []

    this.#results.forEach((r, i) => {
      if (r.points === -1 && r.category === category && r.answer === answer) {
        indexes.push(i)
      }
    })

    indexes.forEach(i => {
      this.#results[i].points = points

      if (indexes.length > 1 && points) {
        this.#results[i].points = 50
      }
    })

    this.trySaveScores()
  }

  async getAnswersFromDb() {
    // takes the 5 categories and converts in a test to all collections eg. /names|lastanames|foods|countries|colors/ig
    const category = new RegExp(this.categories.join('|'), 'gi')

    // fill answers with...
    this.fillAnswers(
      // the words collections from mongoose that cateroy matches at regex
      // @ts-ignore
      await letterCategory(this.letter)?.find?.({ category })
    )
  }

  /**
   * saves all words gotten from db in the object
   */
  fillAnswers(dbWords: DbAnswer[]) {
    dbWords.forEach(({ category, answers, words }) => {
      // item words should disappear eventually
      ;(answers ?? words ?? []).forEach(ans => {
        this.#answers.push({
          category,
          regex: new RegExp(`^${ans}( .+)?$`, 'gi'),
          used: false
        })
      })
    })
  }

  finishTime() {
    clearInterval(this.#timeleftInterval)

    this.room.emit('countdown:finish', {})
    this.room.status = GameStatus.waitingUnknownAnswersCheck
    this.sendAdminUnknownAnswers()
  }

  savePlayerResults({ authorId, answers }: AnswersRequest) {
    if (!this.room.findPlayer(authorId) || find(this.#results, { authorId })) return

    this.categories.forEach((category, i) => {
      this.#results.push({
        authorId,
        answer: answers[i],
        points: -1,
        category
      })
    })

    this.#pendingPlayers--
  }

  saveScores() {
    this.#results.forEach(({ authorId, points }, i) => {
      const player = this.room.findPlayer(authorId as string)
      if (!player) return

      /**
       * in case of a tie, the decimals are hidden points
       * to untie, the parameter is the time,
       * and the lowest times are automatic from the array recollection
       * at greatest times, division is lower and decimals are lower
       */
      player.incrementScore(points + 1 / (1e6 + i))
    })

    this.room.emit()
  }

  sendAdminUnknownAnswers() {
    if (this.unknownAnswers) {
      this.room.admin?.emit('game:unknownanswers', this.unknownAnswers)
    }
  }

  tryStartCountDown() {
    if (this.#timeLeft === 21) {
      this.#timeleftInterval = setInterval(() => this.count(), 1000)
    }
  }

  trySaveScores() {
    this.sendAdminUnknownAnswers()

    if (!this.unknownAnswers.length) {
      this.saveScores()
    }
  }

  get data() {
    const { letter, categories } = this
    return { letter, categories }
  }

  get unknownAnswers() {
    return this.#results.filter(({ points }) => points === -1).map(({ answer, category }) => ({ answer, category }))
  }
}
