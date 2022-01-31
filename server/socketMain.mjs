import Room from './classes/Room.mjs'

export default function main(socket, io) {
  Room.io = io

  socket.on('room.open', ({ roomId }) => {
    socket.join(roomId)
    Room.createIfNotExists(roomId)
    Room.emitPlayers(roomId)
  })

  socket.on('player.triesEnter', e => {
    if (Room.addPlayer({ socket, ...e }))
      socket.on('disconnect', () => Room.deletePlayer(e.roomId, e.color))
  })

  socket.on('player.wannaPlay', ({ roomId, color }) => {
    if (Room?.rooms?.[roomId]?.players?.[color].admin) {
      Room.gameStart(roomId)
    }
  })
}
