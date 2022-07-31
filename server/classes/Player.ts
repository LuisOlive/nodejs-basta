import ShortUniqueId from 'short-unique-id'

import type { Player as IPlayer } from '../validators/playerSchema'

import type Socket from './InternalSocketIO'
import type Room from './Room'

const createPublicToken = new ShortUniqueId({ length: 4 })

export default class Player {
  readonly publicToken: string = createPublicToken()
  #color = ''
  #isAdmin = false
  #name = ''
  #score = 0 //+ Math.floor(Math.random() * 100000)
  #socket: Socket
  #room: Room

  die() {
    this.#room.deletePlayer(this.id)
  }

  emit(event: string, payload: object = this.data) {
    this.#socket.emit(event, payload)
  }

  makeAdmin() {
    this.#isAdmin = true
    this.emit('player:becomeadmin', { id: this.publicToken })
  }

  get data() {
    return {
      admin: this.#isAdmin,
      color: this.#color,
      id: this.publicToken,
      name: this.#name,
      score: this.#score
    }
  }

  set room(r: Room) {
    this.#room = r
    this.#socket.join(this.#room.id)
    this.#socket.on('disconnect', () => this.die())
  }

  constructor({ name, color, socket }: PlayerParams) {
    this.#name = name
    this.#color = color
    this.#socket = socket
  }

  get isAdmin() {
    return this.#isAdmin
  }

  get id() {
    return this.#socket.id ?? ''
  }

  get name() {
    return this.#name
  }

  get color() {
    return this.#color
  }

  get room() {
    return this.#room
  }
}

export interface PlayerParams extends IPlayer {
  socket: Socket
}

export { IPlayer }
