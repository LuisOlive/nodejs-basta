import { Server, Socket } from 'socket.io'

import Logger from '../classes/ColorLogger'
import Game from '../classes/Game'

// data validation
import validate from './decorators/validate'
import emits from './decorators/emits'
import messageSchema, { Message } from '../validators/messageSchema'
import guestSchema, { Guest } from '../validators/guestSchema'
import roomIdSchema, { RoomId } from '../validators/roomIdSchema'
import answersSchema, { AnswersRequest } from '../validators/answersSchema'
import evaluationSchema, { Evaluation } from '../validators/evaluationSchema'

export default class EventController extends Logger {
  game: Game

  constructor(public io: Server) {
    super()
    this.game = new Game(io)
  }

  main(socket: Socket) {
    socket.on('message', e => this.receiveMessage(e))
    socket.on('guest:enter', e => this.sendRoomPreview(e, socket))
    socket.on('player:enter', e => this.sendRoomData(e, socket))

    socket.on('admin:startgame', e => this.startRoomGame(e, socket))
    socket.on('player:sendanswers', e => this.receiveAnswers(e, socket))
    socket.on('admin:evaluateword', e => this.evaluate(e, socket))
  }

  @validate(evaluationSchema)
  evaluate(ans: Evaluation, _: Socket) {
    const room = this.game.findRoom(ans.roomId)
    room?.round?.evaluateUnknownResult(ans)
  }

  /**
   * emits game room data to unlogged users
   */
  @validate(roomIdSchema)
  sendRoomPreview({ roomId }: RoomId, socket: Socket) {
    const res = this.game.findOrCreateRoom(roomId).preview
    socket.emit('room:preview', res)
  }

  /**
   * emits game room data to logged users
   */
  @validate(guestSchema)
  @emits('room:update')
  sendRoomData({ color, name, roomId }: Guest, socket: Socket) {
    const room = this.game.findOrCreateRoom(roomId)
    const player = room.createPlayer({ color, name, socket })

    socket.emit('guest:becomeplayer', player?.data)

    if (room.isPlaying) {
      socket.emit('game:start', room.round?.data)
    }

    return room.data
  }

  /**
   * starts the game in a room
   */
  @validate(roomIdSchema)
  @emits('game:start')
  startRoomGame({ roomId }: RoomId, socket: Socket) {
    const room = this.game.findRoom(roomId)

    if (room?.admin?.id === socket.id) {
      room?.play()
    }

    return room?.round?.data
  }

  @validate(answersSchema)
  receiveAnswers({ answers, roomId, authorId }: AnswersRequest, {}: Socket) {
    const room = this.game.findRoom(roomId)
    room?.round?.savePlayerResults({ answers, authorId, roomId })
    room?.round?.tryStartCountDown()
  }

  @validate(messageSchema)
  receiveMessage(msg: Message) {
    // @ts-ignore
    this.logGreen(msg?.message ?? msg)
  }
}
