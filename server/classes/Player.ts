import ShortUniqueId from 'short-unique-id'

import type { Player as IPlayer } from '../validators/playerSchema'

import type Socket from './InternalSocket'
import type Room from './Room'

const createAdminToken = new ShortUniqueId({ length: 25 })

export default class Player {
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
    // this.#adminToken = createAdminToken()
    this.emit('player:becomeadmin', {})
  }

  get data() {
    return {
      admin: this.#isAdmin,
      color: this.#color,
      name: this.#name,
      score: this.#score
    }
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
    return this.#socket.id
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

  set room(r: Room) {
    this.#room = r
  }
}

export interface PlayerParams extends IPlayer {
  socket: Socket
}

export { IPlayer }
