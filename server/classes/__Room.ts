import type { Server } from 'socket.io'
import type Player from './Player.mjs'

import { find, pull, last, remove, orderBy } from 'lodash'

import colors from '../data/colors.js'

import Round from './Round.mjs'

type GameStatus = 'CREATED' | 'WAITING#PLAYERS' | 'WAITING_ADMIN' | 'AT_ROUND'

export default class Room {
  static rooms = []
  static io: Server

  #id: string
  #rounds: Round[] = []
  #players: Player[] = []
  #availableColors: string[] = colors
  #status: GameStatus = 'CREATED'

  constructor({ id }) {
    this.#id = id
  }

  start() {
    this.#status = 'AT_ROUND'

    this.#rounds.push(new Round(this))

    this.emit('game:start', {
      status: 'AT_ROUND',
      round: { number: this.#rounds.length, ...this.round.data() }
    })
  }

  get round() {
    return last(this.#rounds)
  }

  addPlayer(player: Player) {
    try {
      this.validatePlayer(player)

      this.players.push(player)

      player.roomId = this.#id
      pull(this.#availableColors, player.color)

      player.socket.join(this.#id)

      player.emitEnter()

      player.socket.on('disconnect', () => player.die())
      // keep this at end
      this.verifyAdmin()
      this.verifyStatus()
      this.emitPlayersList()
    } catch (error) {
      // console.error(error)
      player.emit('rejected', { error })
    }
  }

  deletePlayer(color) {
    remove(this.players, { color })
    this.#availableColors.push(color)
    // keep this at end
    this.verifyStatus()
    this.emitPlayersList()
    this.verifyAdmin()
  }

  get admin() {
    return find(this.players, 'isAdmin')
  }

  verifyAdmin() {
    try {
      if (!this.admin) {
        this.players[0].makeAdmin()
        this.emitPlayersList()
      }
    } catch {}
  }

  validatePlayer({ name, color }) {
    if (!/^[a-z0-9ñáéíóú\s_]*$/i.test(name)) {
      throw `name must contain letters, numbers, spaces or undescores only, received "${name}"`
    }

    if (!this.#availableColors.includes(color)) {
      throw `color "${color}" already in use by another player`
    }
  }

  get data() {
    const { players, #id: id, #availableColors: availableColors, #status: status } = this

    return { id, players, availableColors, status }
  }

  get preview() {
    const { players, id, availableColors } = this.data
    return { id, players, availableColors }
  }

  emit(evName: string, event: object = this.data, prefix = 'room') {
    try {
      Room.io.in(this.#id).emit(evName, event)
    } catch {
      console.error(`(${this.#id}): event "${prefix}:${evName}" not sended`)
    }
  }

  get players() {
    return orderBy(
      this.players.map(p => p.data()),
      'score',
      'desc'
    )
  }

  emitPlayersList() {
    this.emit('playerslist:change')
  }

  verifyStatus() {
    switch (this.players.length) {
      case 0:
        this.#status = 'CREATED'
        break
      case 1:
        this.#status = 'WAITING#PLAYERS'
        break
      case 2:
        this.#status = 'WAITING_ADMIN'
        break
    }
  }

  /** @param {Player} supposedAdmin*/
  testAdmin(supposedAdmin) {
    return (
      this.admin.color === supposedAdmin.color &&
      this.admin.adminToken === supposedAdmin.adminToken &&
      this.admin.name === supposedAdmin.name
    )
  }
}
