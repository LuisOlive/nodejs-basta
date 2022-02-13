import Game from './classes/Game.mjs'
import Player from './classes/Player.mjs'
import simulator from './classes/utils/simulator.mjs'

function main() {
  Game.io = simulator('yellow')

  const g = Game.create('bnkxcs')
  const f = Game.create('w1nd0W')

  Game.create('bnkxcs') // nothing must happen

  // console.log(Game.rooms)

  f.addPlayer(new Player({ socket: simulator('blue', 'Luis'), name: 'Luis', color: 'green' }))
  f.addPlayer(new Player({ socket: simulator('cyan', 'Luis'), name: 'Luis', color: 'cyan' }))
  f.addPlayer(new Player({ socket: simulator('red', 'Evil'), name: 'Evil Luis', color: 'green' })) // color error
  f.addPlayer(new Player({ socket: simulator('magenta', 'Mike'), name: 'Mike', color: 'blue' }))

  // g.addPlayer(new Player({ socket: simulator('magenta'), name: 'Pablo', color: 'red' }))
  // g.addPlayer(new Player({ socket: simulator('magenta'), name: 'Axel', color: 'purple' }))
  // g.addPlayer(new Player({ socket: simulator('magenta'), name: ';;', color: 'green' })) // invalid name
  // g.addPlayer(new Player({ socket: simulator('magenta'), name: 'Josa', color: 'orange' }))

  // console.log(f.data())
  // console.log(g.data())

  // console.log(g.players[1])

  f.start()
}

// passed
function returnReference() {
  const g = { a: 5, b: 5 }
  const f = () => g

  console.log(g)

  f().a = 10

  console.log(g)
}

main()
