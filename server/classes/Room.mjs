import colors from '../data/colors.mjs'

export default class Room {
  static rooms = {}
  static io = null

  constructor(roomId) {
    Room.rooms[roomId] = { players: {} }
    this.roomId = roomId
  }

  static addPlayer(ctx) {
    const { socket } = ctx
    const validCtx = Room.validate(ctx)
    if (!validCtx) return false

    const { roomId, name, color } = validCtx

    Room.createIfNotExists()

    Room.rooms[roomId].players[color] = { name, socket, score: 0 }

    Room.emitPlayers(roomId)

    return true
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
      vacantColors: Room.getColors(roomId)
    })
  }

  static getColors(roomId) {
    return colors.filter(c => !Room.rooms[roomId].players[c])
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
