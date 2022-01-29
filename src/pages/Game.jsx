import { useCallback, useState } from 'react'
import { useParams } from 'react-router-dom'
import useSocket from '../hooks/useSocket'
import useInput from '../hooks/useInput'
import { colors as colorList } from '../data/colors.json'
import Players from '../components/Players'
import PlayerForm from '../components/PlayerForm'

export default function Game() {
  const { roomId } = useParams()
  const [name, setName] = useState('')
  const [color, setColor] = useState('red')
  const [players, fillPlayers] = useState([])
  const [colors, fillColors] = useState(colorList)

  const socket = useSocket(socket => {
    socket.on('players.change', ({ vacantColors, players }) => {
      fillColors(vacantColors)
      fillPlayers(players)
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

  return (
    <div className={`bg-${color}-100 h-screen flex`}>
      <aside className={`bg-${color}-00 w-1/5 px-0 py-16 h-screen`}>
        <Players players={players} color={color} />
      </aside>
      <main className={`bg-$-100 w-4/5 h-screen`}>
        {name === '' ? (
          <PlayerForm onChange={getPlayer} colors={colors} />
        ) : (
          'Esperando otros jugadores...'
        )}
      </main>
    </div>
  )
}
