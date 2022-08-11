import { sample, sampleSize, find, chain, pick, zipObject } from 'lodash'

import Room, { GameStatus } from './Room'
import type { AnswersRequest } from '../validators/answersSchema'
import letterCategory from '../models/Category'
import categories from '../data/categories'

const letters = 'abcdefghijklmnopqrstuvwxyz'.split('')

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
  /** full list of answers gotten from db, with 100 or 50 points */
  #answers: Answer[] = []
  #timeLeft = 21
  /** answers from the users */
  #results: Result[] = []
  #timeleftInterval: NodeJS.Timer
  #playersWichHasAnswered = 0

  constructor(readonly room: Room) {
    this.getAnswersFromDb().catch(console.error)
  }

  count() {
    this.#timeLeft--
    this.room.emit('countdown:count', { timeLeft: this.#timeLeft })

    if (this.#timeLeft <= 0 || this.pendingPlayers <= 0) {
      this.finishTime()
    }
  }

  evaluateKnownAnswers() {
    this.#results.forEach(({ answer, category, points }) => {
      const test = ({ regex, category: c }) => category === c && regex.test(answer)

      // if the answer is empty, dont waste more time
      if (answer === '') {
        points = 0
      } else if (find(this.#answers, test)) {
        points = 100
      } else {
        points = -1
      }

      this.evaluateUnknownResult({ answer, category, points })
    })
  }

  /**
   * gives score selected from admin to the results object
   * @param evaluation the category and answer accepted by the admin
   */
  evaluateUnknownResult({ category, answer, points }: Result) {
    const indexes: number[] = []

    this.#results.forEach((r, i) => {
      if (r.category === category && r.answer === answer) {
        indexes.push(i)
      }
    })

    indexes.forEach(i => {
      this.#results[i].points = points

      if (indexes.length > 1 && points > 0) {
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
          regex: new RegExp(`^((el|la|los|the|mi|un(a|os)?)\\s)?${ans}(\\s.+)?$`, 'gi'),
          used: false
        })
      })
    })
  }

  finishTime() {
    clearInterval(this.#timeleftInterval)
    this.room.emit('countdown:finish', {})
    this.evaluateKnownAnswers()
    this.room.status = GameStatus.waitingUnknownAnswersCheck
    this.sendAdminUnknownAnswers()
  }

  savePlayerResults({ authorId, answers }: AnswersRequest & { authorId: string }) {
    if (!this.room.findPlayer(authorId) || find(this.#results, { authorId })) return

    answers.forEach(([category, answer]) => {
      this.#results.push({ authorId, answer, points: -1, category })
    })

    this.#playersWichHasAnswered++
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
      player.incrementScore(points + 1 / (1e8 + i))

      /**
       * before send results to all players, we change the id gotten
       * from socket to the public id from each one
       */
      this.#results[i].authorId = player.publicToken
    })

    this.room.status = GameStatus.waitingPlayers
    this.room.emit()
    this.room.emit('game:results', this.results)
  }

  sendAdminUnknownAnswers() {
    if (this.unknownAnswers.length > 0) {
      this.room.admin?.emit('game:unknownanswers', this.unknownAnswers)
    }
  }

  tryStartCountDown() {
    if (this.#timeLeft === 21 && !this.#timeleftInterval) {
      this.count() // to discard second count inmediatly
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

  get results() {
    return this.#results
  }

  get unknownAnswers() {
    return chain(this.#results)
      .filter(['points', -1])
      .map(res => pick(res, ['category', 'answer']))
      .sortBy('category')
      .value()
  }

  get pendingPlayers() {
    return this.room.data.players.length - this.#playersWichHasAnswered
  }
}
