import find from 'lodash/find.js'
import pull from 'lodash/pull.js'
import last from 'lodash/last.js'

import room from './utils/room.mjs'
import colors from '../data/colors.mjs'

import Round from './Round.mjs'

export default class Game {
  static rooms = []
  static io

  /** @type {Round[]} */
  rounds = []
  /** @type {Player[]} */
  players = []
  availableColors = colors

  /** @param {string} id */
  constructor({ id }) {
    this.id = id
    // this.emit('room:created')
  }

  /**
   * @param {string} id
   * @returns {Game}
   * */
  static create(id) {
    try {
      return room(id)
      //
    } catch {
      const g = new Game({ id })
      Game.rooms.push(g)
      return g
    }
  }

  start() {
    this.rounds.push(new Round())
    this.emit('game:start', {
      round: this.rounds.length,
      ...this.round.data()
    })
  }

  get round() {
    return last(this.rounds)
  }

  /** @param {Player} player */
  addPlayer(player) {
    try {
      this.validatePlayer(player) // or die

      this.players.push(player)

      player.roomId = this.id
      pull(this.availableColors, player.color)

      player.socket.join(this.id)

      player.emit(
        'enter',
        {
          roomId: player.roomId,
          admin: player.admin
        },
        'self'
      )
      this.emitPlayersList()
      this.verifyAdmin()
      //
    } catch (error) {
      console.error(error)
      player.emit('rejected', { error })
    }
  }

  get admin() {
    return find(this.players, 'admin')
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

    if (!this.availableColors.includes(color)) {
      throw `color "${color}" already in use by another player`
    }

    if (find(this.players, { name })) {
      throw `name "${name}" already in use by another player`
    }
  }

  data() {
    const { playersList: players, id, availableColors } = this
    return { id, players, availableColors }
  }

  /**
   * @param {string} evName
   * @param {*} event
   */
  emit(evName, event = this.data()) {
    try {
      Game.io.in(this.id).emit(evName, event)
    } catch {
      console.error(`(${this.id}): event "${prefix}:${evName}" not sended`)
    }
  }

  get playersList() {
    return this.players.map(p => p.data())
  }

  emitPlayersList() {
    this.emit('playerslist:change')
  }
}

/**
 * @typedef { import('./Player.mjs').default } Player
 * @typedef { import('./Round.mjs').default } Round
 */
