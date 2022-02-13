import filter from 'lodash/filter.js'
import colors from '../data/colors.mjs'
import Game from './Game.mjs'
/**
 * @deprecated
 */
export default class Room {
  static rooms = {}
  static io = null

  constructor(roomId) {
    Room.rooms[roomId] = { players: {} }
    this.roomId = roomId
  }

  static gameStart(roomId) {
    Room.io.in(roomId).emit('game.start', new Game())
  }

  static addPlayer(ctx) {
    const { socket } = ctx
    const validCtx = Room.validate(ctx)

    if (!validCtx) {
      return false
    }

    const { roomId, name, color } = validCtx

    Room.createIfNotExists()

    Room.rooms[roomId].players[color] = { name, socket, score: 0, admin: false }

    Room.emitPlayers(roomId)

    // 2 player or more
    if (Room.gameCanStart(roomId)) {
      Room.admin(roomId).socket.emit('players.change', {
        players: Room.playerList(roomId),
        vacantColors: Room.getColors(roomId),
        status: 2
      })
      // only one
    } else {
      Room.rooms[roomId].players[color].admin = true
    }

    return true
  }

  static admin(roomId) {
    return filter(Room.rooms[roomId].players, 'admin')[0]
  }

  static deletePlayer(roomId, color) {
    if (!Room.rooms[roomId] || !Room.rooms[roomId].players[color]) return

    delete Room.rooms[roomId].players[color]
    Room.emitPlayers(roomId)
  }

  static emitPlayers(roomId) {
    Room.createIfNotExists(roomId)

    Room.io.in(roomId).emit('players.change', {
      players: Room.playerList(roomId),
      vacantColors: Room.getColors(roomId),
      status: Room.getStatus(roomId)
    })
  }

  static getColors(roomId) {
    return colors.filter(c => !Room.rooms[roomId].players[c])
  }

  static gameCanStart(roomId) {
    return Object.keys(Room.rooms[roomId].players).length > 1
  }

  static getStatus(roomId) {
    if (Object.keys(Room.rooms[roomId].players).length <= 1) return 0
    return 1
  }

  static validate({ roomId, name, color }) {
    if (
      Room.rooms[roomId] &&
      Room.getColors(roomId).includes(color) &&
      /^[a-zA-Z0-9_ñÑáéíóúÁÉÍÓÚ]+\s?[a-zA-Z0-9_ñÑáéíóúÁÉÍÓÚ]+$/.test(name)
    )
      return { name, color, roomId }

    return null
  }

  static playerList(roomId) {
    return Object.keys(Room.rooms[roomId].players).map(color => {
      const { name, score } = Room.rooms[roomId].players[color]
      return { name, score, color }
    })
  }

  static createIfNotExists(roomId) {
    if (!Room.rooms[roomId])
      Room.rooms[roomId] = {
        players: {}
      }
  }

  static status() {
    console.log(Room.rooms)
  }
}
