import type { InternalServer as Server } from './InternalSocketIO'

import { find, last, remove, chain } from 'lodash'

import Player, { PlayerParams } from './Player'
import Round from './Round'
import type Game from './Game'

import { colors } from '../validators/playerSchema'

export const enum GameStatus {
  empty,
  created,
  playing,
  waitingPlayers,
  waitingAdminToStart,
  waitingUnknownAnswersCheck
}

const stringStatusOpts = {
  [GameStatus.created]: 'CREATED',
  [GameStatus.playing]: 'AT_ROUND',
  [GameStatus.waitingAdminToStart]: 'WAITING_ADMIN',
  [GameStatus.waitingPlayers]: 'WAITING_PLAYERS',
  [GameStatus.waitingUnknownAnswersCheck]: 'WAITING_UNKNOWN_WORDS'
}

export default class Room {
  static io: Server

  #id: string
  #rounds: Round[] = []
  #players: Player[] = []
  #availableColors = [...colors]
  #status: number = GameStatus.created

  /**
   * adds a player to the players list and configures the room to process it
   * @param player the player added
   */
  addPlayer(player: Player) {
    if (this.findPlayer(player.id)) return

    this.#players.push(player)
    // pull(this.#availableColors, player.color)
    player.room = this

    this.refresh()
    return player
  }

  close() {
    this.game.deleteRoom(this.#id)
  }

  /**
   * shortcut to addPlayer(new Player())
   * @param data name, color and future necesary data object
   */
  createPlayer(data: PlayerParams) {
    return this.addPlayer(new Player(data))
  }

  /**
   * removes player from the list
   */
  deletePlayer(id: string) {
    const { length } = this.#players

    remove(this.#players, { id })

    if (length !== this.#players.length) {
      this.refresh()
    }
  }

  determineStatus() {
    const { length } = this.#players
    if (length === 0) this.#status = GameStatus.empty
    if (length === 1) this.#status = GameStatus.waitingPlayers

    if ([GameStatus.playing, GameStatus.waitingUnknownAnswersCheck].includes(this.#status)) return

    if (length >= 2) this.#status = GameStatus.waitingAdminToStart
  }

  /**
   * emits an event to all room subscribers
   */
  emit(event = 'room:update', payload: object = this.data) {
    Room.io.in(this.#id).emit(event, payload)
  }

  /**
   * searchs a player with the color and name conincidence
   * @param id socket id or public token
   */
  findPlayer(id: string) {
    return find(this.#players, { id }) ?? find(this.#players, { publicToken: id })
  }

  play() {
    if (this.#status === GameStatus.playing) return

    this.#rounds.push(new Round(this))

    this.status = GameStatus.playing
  }

  /**
   * updates all computed data and emits it to client
   * shortcut to verifyAdminExists(), determineStatus(), emit() and future requirements
   */
  refresh() {
    if (!this.#players.length) {
      this.close()
      return
    }
    this.verifyAdminExists()
    this.determineStatus()
    this.emit()
  }

  set status(s: GameStatus) {
    this.#status = s
    this.emit()
  }

  /**
   * verifies if this room has and admin, if it hasn't, the first player becomes admin
   */
  verifyAdminExists() {
    if (!this.admin) this.#players[0].makeAdmin()
  }

  constructor(public game: Game, id: string) {
    this.#id = id
  }

  /**
   * the admin of the room
   */
  get admin() {
    return find(this.#players, 'isAdmin')
  }

  /**
   * full data to logged users UI
   */
  get data() {
    return {
      ...this.preview,

      status: stringStatusOpts[this.#status] as string,
      round: this.#rounds.length
    }
  }

  get id() {
    return this.#id
  }

  get isPlaying() {
    return this.#rounds.length && this.#status === GameStatus.playing
  }

  /**
   * public data to unlogged users UI
   */
  get preview() {
    return {
      availableColors: this.#availableColors,
      id: this.#id,
      players: chain(this.#players)
        .sortBy('score')
        .map(({ data }) => ({ ...data, score: Math.floor(data.score) }))
        .value()
        .reverse(),
      status: this.#status
    }
  }

  get round() {
    return last(this.#rounds)
  }
}
