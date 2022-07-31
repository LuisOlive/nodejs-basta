import { sample, findIndex, sampleSize, find } from 'lodash'

import Room, { GameStatus } from './Room'
import type { AnswersRequest } from '../validators/answersSchema'

import letterCategory from '../models/Category'

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
  points: 0 | 50 | 100
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
    this.room.emit('countdown:count', { timeLeft: this.#timeLeft })

    if (!this.#timeLeft-- || !this.#pendingPlayers) this.finishTime()
  }

  evaluateKnownAnswers() {
    this.#results.forEach(({ answer }, i) => {
      const j = findIndex(this.#answers, ({ regex }) => regex.test(answer))
      if (j === -1) return

      if (this.#answers[j].used) {
        this.#results[i].points = 50
        return
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
    const i = findIndex(this.#results, { category, answer })
    if (i === -1) return

    this.#results[i].points = points
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
    this.sendUnknownAnswers()
  }

  savePlayerResults({ authorId, answers }: AnswersRequest) {
    if (!this.room.findPlayer(authorId) || find(this.#results, { authorId })) return

    this.categories.forEach((category, i) => {
      this.#results.push({
        authorId,
        answer: answers[i],
        points: 0,
        category
      })
    })

    this.#pendingPlayers--
  }

  sendUnknownAnswers() {
    this.room.admin?.emit('game:unknownanswers', this.unknownAnswers)
  }

  tryStartCountDown() {
    if (this.#timeLeft === 21) {
      this.#timeleftInterval = setInterval(() => this.count(), 1000)
    }
  }

  get data() {
    const { letter, categories } = this
    return { letter, categories }
  }

  get unknownAnswers() {
    return this.#results.filter(({ points, answer }) => !points && answer[0] === this.letter).map(r => ({ ...r, authorId: null }))
  }
}
