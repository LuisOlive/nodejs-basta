import Card from './Card'
import Button from './Button'
import InvitationLink from './InvitationLink'

import { useUser } from '../redux'

export default function StartCard({ color }) {
  const trueColor = color ?? useUser().color

  return (
    <Card>
      <p className={`text-center text-${trueColor}-600 text-xl font-semibold mb-4`}>
        ¡Ya hay rivales en espera!
      </p>

      <Button className="mb-4">Iniciar partida</Button>

      <InvitationLink />
    </Card>
  )
}
