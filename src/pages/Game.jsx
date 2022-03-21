import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import Players from '../components/Players'
import PlayerForm from '../components/PlayerForm'
import InvitationCard from '../components/InvitationCard'
import StartCard from '../components/StartCard'
import SpinnerCard from '../components/SpinnerCard'
import GameForm from '../components/GameForm'

import { useGame, useUser } from '../redux'
import { fillPlayersAction, setRoomIdAction, listenGameAction } from '../redux/game/actions'
import { giveServerStateControlAction as userServerAction } from '../redux/user/actions'

export default function Game() {
  const dispatch = useDispatch()

  const { roomId } = useParams()
  const { color, status: userStatus } = useUser()
  const { status: gameStatus } = useGame()

  useEffect(() => {
    dispatch(setRoomIdAction(roomId))
    dispatch(fillPlayersAction())
    dispatch(userServerAction())
    dispatch(listenGameAction())
  }, [])

  return (
    <div className={`bg-${color}-100 h-screen flex`}>
      <aside className={`bg-${color}-00 w-1/4 px-0 py-16 h-screen`}>
        <Players />
      </aside>

      <main className={`flex justify-center items-center w-3/4 h-screen`}>
        {userStatus === 'UNSIGNED' ? (
          <PlayerForm />
        ) : gameStatus === 'WAITING_PLAYERS' ? (
          <InvitationCard>Esperando jugadores</InvitationCard>
        ) : userStatus === 'ADMIN' && gameStatus === 'WAITING_ADMIN' ? (
          <StartCard />
        ) : gameStatus === 'WAITING_ADMIN' ? (
          <InvitationCard>Esperando que el administrador empieze la partida</InvitationCard>
        ) : gameStatus === 'AT_ROUND' ? (
          <GameForm />
        ) : gameStatus === 'WAITING_UNKNOWN_WORDS' ? (
          <SpinnerCard message="Revisando tus resultados">
            Algunas palabran no están en la base de datos ...por ahora
          </SpinnerCard>
        ) : (
          ''
        )}
      </main>
    </div>
  )
}
