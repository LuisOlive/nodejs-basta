import Room from './classes/Room'
import Game from './classes/Game'
import Player from './classes/Player'
import guestSchema from './validators/guestSchema'
import { SocketSimulator } from './classes/InternalSocket'
import { Color } from './validators/playerSchema'

function simulate() {
  const io = new SocketSimulator('cyan', 'Basta')
  const game = new Game(io)
  // create room by definition
  const room1 = game.addRoom(new Room('bnkxcs'))
  // create rrom only with id
  game.findOrCreateRoom('w1nd0W')
  // do nothing cause room its created
  const room2 = game.findOrCreateRoom('w1nd0W')

  console.log(game.data)

  console.log(guestSchema.safeParse({ roomId: 'w1nd0W', name: 'Luis', color: 'green' }))

  const luis = new Player(request('Luis', 'green'))
  const mike = new Player(request('Mike', 'red'))
  const marco = new Player(request('Marco', 'green'))

  room1.addPlayer(luis)
  room1.addPlayer(mike)
  room1.createPlayer(request('Hansel', 'purple'))
  room1.createPlayer(request('Fer', 'blue'))
  room1.createPlayer(request('Francis', 'yellow'))

  room2.createPlayer(request('Erni', 'blue'))
  room2.createPlayer(request('Iván', 'purple'))
  room2.createPlayer(request('Edgar', 'blue'))
  room2.createPlayer(request('Yayo', 'lime'))
  room2.addPlayer(marco)

  console.log(room1.findPlayer(luis.id))
  console.log(room1.findPlayer(mike.id))
  console.log(room2.findPlayer('123456'))

  marco.die()
  luis.die()
  room2.findPlayer('123456')?.die()
}

function request(name: string, color: Color) {
  return { name, color, socket: new SocketSimulator('green', name) }
}

// passed
function returnReference() {
  const g = { a: 5, b: 5 }
  const f = () => g
  const h = g

  console.log(g) // got { a: 5, b: 5 }

  f().a = 10
  h.b = 95

  console.log(g) // got { a: 10, b: 95 }
}

// returnReference()
simulate()
