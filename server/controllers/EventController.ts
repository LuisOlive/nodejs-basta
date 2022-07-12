import { Server, Socket } from 'socket.io'

import Logger from '../classes/ColorLogger'
import Game from '../classes/Game'

// data validation
import validate from './decorators/validate'
import emits from './decorators/emits'
import messageSchema, { Message } from '../validators/messageSchema'
import guestSchema, { Guest } from '../validators/guestSchema'
import roomIdSchema, { RoomId } from '../validators/roomIdSchema'

export default class EventController extends Logger {
  game = new Game()

  main(socket: Socket) {
    // socket.onAny(console.log.bind(console))
    // this.logCyan('new user conected :D')

    socket.on('disconnect', e => this.logRed(e))
    socket.on('guest:enter', e => this.sendRoomPreview(e, socket))
    socket.on('message', e => this.receiveMessage(e))
    socket.on('player:enter', e => this.sendRoomData(e, socket))
  }

  @validate(roomIdSchema)
  @emits('room:preview')
  sendRoomPreview({ roomId }: RoomId, _: any) {
    return this.game.findOrCreateRoom(roomId).preview
  }

  /**
   * emits game room data to logget users
   */
  @validate(guestSchema)
  @emits('room:update')
  sendRoomData({ color, name, roomId }: Guest, _: any) {
    const playerData = { color, name }

    const room = this.game.findOrCreateRoom(roomId)

    if (room.findPlayer(playerData))
      throw [
        'validation:error',
        `name & color combination must be different to another players, got "${name}" and "${color}"`
      ]

    room.createPlayer(playerData)

    return room.data
  }

  @validate(messageSchema)
  receiveMessage(msg: Message) {
    // @ts-ignore
    this.logGreen(msg?.message ?? msg)
  }

  constructor(public io: Server) {
    super()
  }
}
