import Room from './classes/Room'
import Game from './classes/Game'
import Player from './classes/Player'
import Round from './classes/Round'
import { SocketSimulator } from './classes/InternalSocketIO'
import guestSchema from './validators/guestSchema'
import { Color } from './validators/playerSchema'
import connect from './connection'
import eva from './validators/evaluationSchema'
import chalk from 'chalk'

async function main() {
  const data = eva.parse({ category: 'países', answer: 'grfger', points: 0, roomId: 'acm1pt' })
  console.log(data)
}

function simulate() {
  const io = new SocketSimulator('cyan', 'Basta')
  const game = new Game(io)
  // create room by definition
  const room1 = game.addRoom(new Room(game, 'bnkxcs'))
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

  room1.play()
  room2.play()

  console.log(room1.round?.data)
  console.log(room2.round?.data)
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
connect()
  .then(main)
  .catch(x => console.error(chalk.red(x)))
