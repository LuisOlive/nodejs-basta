import type Socket from './InternalSocket'

import { find, pull, last, remove, orderBy, sortBy } from 'lodash'

import Player, { PlayerParams, IPlayer } from './Player'
import { colors } from '../validators/playerSchema'
import chalk from 'chalk'

type GameStatus = 'CREATED' | 'WAITING#PLAYERS' | 'WAITING_ADMIN' | 'AT_ROUND'

class Round {}

export default class Room {
  static io: Socket

  #id: string
  #rounds: Round[] = []
  #players: Player[] = []
  #availableColors = [...colors]
  #status: GameStatus = 'CREATED'

  /**
   * adds a player to the players list and configures the room to process it
   * @param player the player added
   */
  addPlayer(player: Player) {
    this.#players.push(player)
    // pull(this.#availableColors, player.color)
    player.room = this

    this.verifyAdminExists()
    this.emit()
  }

  /**
   * shortcut to addPlayer(new Player())
   * @param data name, color and future necesary data object
   */
  createPlayer(data: PlayerParams) {
    this.addPlayer(new Player(data))
  }

  /**
   * removes player from the list
   */
  deletePlayer(id: string) {
    const { length } = this.#players

    remove(this.#players, { id })

    if (length === this.#players.length) return

    this.verifyAdminExists()
    this.emit()
  }

  /**
   * emits an event to all room subscribers
   */
  emit(event = 'room:update', payload: object = this.data) {
    Room.io.in(this.#id).emit(event, payload)
  }

  /**
   * searchs a player with the color and name conincidence
   */
  findPlayer(id: string) {
    return find(this.#players, { id })
  }

  /**
   * verifies if this room has and admin, if it hasn't, the first player becomes admin
   */
  verifyAdminExists() {
    if (!this.admin) this.#players[0].makeAdmin()
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
      players: this.#players.map(p => p.data)
    }
  }

  get id() {
    return this.#id
  }

  /**
   * public data to unlogged users UI
   */
  get preview() {
    return {
      availableColors: this.#availableColors,
      id: this.#id,
      players: this.#players.map(p => p.data),
      status: this.#status
    }
  }

  constructor(id: string) {
    this.#id = id
  }
}
