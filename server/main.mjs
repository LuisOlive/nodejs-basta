import Game from './classes/Game.mjs'
import Player from './classes/Player.mjs'
import room from './classes/utils/room.mjs'

// import chalk from 'chalk'

export default function main(socket) {
  socket.on('user:askforpreview', ({ roomId }) => {
    try {
      // console.log(chalk.blue(`event="user:askforpreview" roomId="${roomId}"`))
      socket.emit('playerslist:change', room(roomId).data())
    } catch (e) {
      console.error(e)
    }
  })

  socket.on('user:asktojoin', ({ roomId, name, color }) => {
    // console.log(
    //   chalk.red(`event="user:asktojoin" roomId="${roomId}" name="${name}" color="${color}"`)
    // )

    const room = Game.create(roomId)
    const player = new Player({ name, color, socket })

    room.addPlayer(player)
  })

  socket.on('admin:asktostart', ({ supposedAdmin, roomId }) => {
    const r = room(roomId)

    if (r.testAdmin(supposedAdmin) && r.players.length > 1) {
      r.start()
    }
  })

  socket.on('player:sendanswers', ({ answers, roomId, color }) => {
    const r = room(roomId)
    r.round.saveResults({ color, answers })
  })
}
