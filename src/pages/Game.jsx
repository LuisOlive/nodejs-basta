import { useCallback, useState } from 'react'
import { useParams } from 'react-router-dom'
import useSocket from '../hooks/useSocket'
import useInput from '../hooks/useInput'
import { colors as colorList } from '../data/colors.json'
import Players from '../components/Players'
import PlayerForm from '../components/PlayerForm'
import Section from '../components/Section'
import Button from '../components/Button'
import GameForm from '../components/GameForm'

export default function Game() {
  const { roomId } = useParams()
  const [name, setName] = useState('')
  const [color, setColor] = useState('red')
  const [players, fillPlayers] = useState([])
  const [colors, fillColors] = useState(colorList)
  const [status, setStatus] = useState(0)
  const [categories, fillCategories] = useState([])
  const [letter, setLetter] = useState('')

  const socket = useSocket(socket => {
    socket.on('players.change', ({ vacantColors, players, status }) => {
      fillColors(vacantColors)
      fillPlayers(players)
      setStatus(status)
    })

    socket.on('game.start', ({ categories, letter }) => {
      setStatus(3)
      fillCategories(categories)
      setLetter(letter)
    })

    socket.emit('room.open', { roomId })
  })

  const getPlayer = useCallback(
    ({ name, color }) => {
      setName(name)
      setColor(color)
      socket.emit('player.triesEnter', { name, color, roomId })
    },
    [socket]
  )

  const start = useCallback(() => {
    socket.emit('player.wannaPlay', { roomId, color })
  }, [socket, color])

  return (
    <div className={`bg-${color}-100 h-screen flex`}>
      <aside className={`bg-${color}-00 w-1/5 px-0 py-16 h-screen`}>
        <Players players={players} color={color} />
      </aside>
      <main className={`flex justify-center items-center w-4/5 h-screen`}>
        <Section color={color} className="relative">
          {name === '' ? (
            <PlayerForm onChange={getPlayer} colors={colors} />
          ) : status === 1 ? (
            'Esperando a que el administrador inicie la partida...'
          ) : status === 2 ? (
            <Button onClick={start}>Iniciar partida</Button>
          ) : status === 3 ? (
            <GameForm color={color} categories={categories} letter={letter} />
          ) : (
            'Esperando otros jugadores...'
          )}
        </Section>
      </main>
    </div>
  )
}
