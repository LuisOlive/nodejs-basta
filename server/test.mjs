import Game from './classes/Game.mjs'

function main() {
  const g = new Game()

  g.newGame() // nothing happens, no players

  g.addPlayer({ color: 'green', name: 'Luis' }) // create player
  g.newGame() // nothing happens, only one player

  g.addPlayer({ color: 'green', name: 'Ana' }) // color green reserved, player not added
  g.newGame() // nothing happens, only one player

  g.addPlayer({ color: 'Violet', name: 'Ana' }) // player added
  g.newGame() // game starts

  // g.status()
}

main()
