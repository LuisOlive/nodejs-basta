import Game from './classes/Game.mjs'
import Player from './classes/Player.mjs'

export default function main(socket) {
  socket.on('user:tryenter', ({ roomId, name, color }) => {
    const room = Game.create(roomId)
    const player = new Player({ name, color, socket })

    room.addPlayer(player)
  })
}
