import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import Players from '../components/Players'
import PlayerForm from '../components/PlayerForm'
// import Section from '../components/Section'
// import Button from '../components/Button'
// import GameForm from '../components/GameForm'

import { useGame, useUser } from '../redux'
import SpinnerCard from '../components/SpinnerCard'
import { fillPlayersAction, setRoomId } from '../redux/gameDuck'

export default function Game() {
  const dispatch = useDispatch()

  const { roomId } = useParams()
  const { color, isIdentified } = useUser()
  const { status: gameStatus, players } = useGame()

  useEffect(() => {
    dispatch(setRoomId(roomId))
    dispatch(fillPlayersAction())
  }, [])

  return (
    <div className={`bg-${color}-100 h-screen flex`}>
      <aside className={`bg-${color}-00 w-1/5 px-0 py-16 h-screen`}>
        <Players players={players} color={color} />
      </aside>

      <main className={`flex justify-center items-center w-4/5 h-screen`}>
        {!isIdentified || true ? (
          <PlayerForm />
        ) : gameStatus === 'WAITING_PLAYERS' ? (
          <SpinnerCard>Esperando otros jugadores...</SpinnerCard>
        ) : (
          ''
        )}

        {/*  {name === '' ? (
            
          ) : status === 1 ? (
            'Esperando a que el administrador inicie la partida...'
          ) : status === 2 ? (
            <Button onClick={start}>Iniciar partida</Button>
          ) : status === 3 ? (
            <GameForm color={color} categories={categories} letter={letter} />
          ) : (
            ''
          )}*/}
      </main>
    </div>
  )
}
