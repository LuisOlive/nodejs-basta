import type { Socket, Server } from 'socket.io'
import type Game from '../classes/Game'

interface args {
  socket: Socket
  io: Server
  game: Game
}

export default function main({ socket, io, game }: args) {
  console.log('new user conected')

  // @ts-ignore
  game.addRoom('Luis room')
  console.log(game.data)

  socket.on('message', console.log)
}
