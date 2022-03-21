import find from 'lodash/find.js'
import pull from 'lodash/pull.js'
import last from 'lodash/last.js'
import remove from 'lodash/remove.js'
import orderBy from 'lodash/orderBy.js'

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
  /** @type {GameStatus} */
  status = 'CREATED'

  constructor({ id }) {
    /** @type {string} id */
    this.id = id
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
    this.status = 'AT_ROUND'

    this.rounds.push(new Round(this))

    this.emit('game:start', {
      status: 'AT_ROUND',
      round: { number: this.rounds.length, ...this.round.data() }
    })
  }

  get round() {
    return last(this.rounds)
  }

  /** @param {Player} player */
  addPlayer(player) {
    try {
      this.validatePlayer(player)

      this.players.push(player)

      player.roomId = this.id
      pull(this.availableColors, player.color)

      player.socket.join(this.id)

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
    this.availableColors.push(color)
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

    if (!this.availableColors.includes(color)) {
      throw `color "${color}" already in use by another player`
    }
  }

  data() {
    const { playersList: players, id, availableColors, status } = this
    return { id, players, availableColors, status }
  }

  preview() {
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
        this.status = 'CREATED'
        break
      case 1:
        this.status = 'WAITING_PLAYERS'
        break
      case 2:
        this.status = 'WAITING_ADMIN'
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

/**
 * @typedef { import('./Player.mjs').default } Player
 * @typedef { import('./Round.mjs').default } Round
 * @typedef {'CREATED' | 'WAITING_PLAYERS' | 'WAITING_ADMIN' | 'AT_ROUND'} GameStatus
 */
