import Room from './classes/Room.mjs'

export default function main(socket, io) {
  Room.io = io

  socket.on('room.open', ({ roomId }) => {
    socket.join(roomId)
    Room.createIfNotExists(roomId)
    Room.emitPlayers(roomId)
  })

  socket.on('player.triesEnter', ctx => {
    if (Room.addPlayer({ socket, ...ctx }))
      socket.on('disconnect', () => Room.deletePlayer(ctx.roomId, ctx.color))
  })
}
