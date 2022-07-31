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
import * as userActions from '../redux/user/actions'
import * as gameActions from '../redux/game/actions'
import UnknownAnswers from '../components/UnknownAnswers'

export default function Game() {
  const dispatch = useDispatch()

  const { roomId } = useParams()
  const { color, status: userStatus } = useUser()
  const { status: gameStatus, round } = useGame()

  useEffect(() => {
    dispatch(gameActions.setRoomIdAction(roomId))
    dispatch(userActions.watchPlayerUpdatesAction())
    dispatch(gameActions.watchRoomUpdatesAction())
    dispatch(gameActions.listenGameAction())
    dispatch(gameActions.prepareIfNamedAdminAction())
  }, [])

  return (
    <div className={`bg-${color}-100 h-screen flex`}>
      <aside className={`bg-${color}-00 w-1/4 px-0 py-16 h-screen`}>
        <Players />
      </aside>

      <main className={`flex justify-center items-center w-3/4 h-screen`}>
        {(() => {
          //
          if (userStatus === 'UNSIGNED') return <PlayerForm />

          /* using switch case for select components */
          switch (gameStatus) {
            case 'WAITING_PLAYERS':
              return <InvitationCard>Esperando jugadores</InvitationCard>

            case 'WAITING_ADMIN':
              if (userStatus === 'ADMIN') return <StartCard />

              return <InvitationCard>Esperando que el administrador empieze la partida</InvitationCard>

            case 'AT_ROUND':
              if (round) return <GameForm />

              return <SpinnerCard message="Iniciando la partida">Por favor, espera un poco</SpinnerCard>

            case 'WAITING_UNKNOWN_WORDS':
              if (userStatus === 'ADMIN') return <UnknownAnswers />

              return <SpinnerCard message="Revisando los resultados">Algunas palabras no están en la base de datos ...por ahora</SpinnerCard>
          }
          //
        })()}
      </main>
    </div>
  )
}
