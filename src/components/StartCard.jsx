import { useCallback } from 'react'

import Card from './Card'
import Button from './Button'
import InvitationLink from './InvitationLink'

import { useGame, useUser } from '../redux'
import socket from '../socket'

export default function StartCard({ color, hideMessage, className, children }) {
  const user = useUser()
  const { roomId } = useGame()
  const trueColor = user.color ?? color

  const askToStart = useCallback(() => socket.emit('admin:startgame', { roomId }), [])

  return (
    <Card className={className}>
      {hideMessage || <p className={`text-center text-${trueColor}-600 text-xl font-semibold mb-4`}>¡Ya hay rivales en espera!</p>}

      {user.status === 'ADMIN' && (
        <Button className="mb-4" onClick={askToStart}>
          {children ?? 'Iniciar partida'}
        </Button>
      )}

      <InvitationLink />
    </Card>
  )
}
