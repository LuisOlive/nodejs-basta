import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCrown, faGear } from '@fortawesome/free-solid-svg-icons'

import { useUser, useGame } from '../redux'

import List from './List'

export default function Players({}) {
  const { players } = useGame()
  const { color, status } = useUser()
  const amAdmin = status === 'ADMIN'

  return (
    <List items={players} className={`bg-${color}-300 h-auto py-8 rounded-r-xl`}>
      {({ name, score, color, isAdmin }) => (
        <li className={`bg-${color}-500 py-2 px-4 text-white flex justify-between`} key={color}>
          <b className="font-bold">{name}</b>

          <p>
            {isAdmin ? <FontAwesomeIcon icon={faGear} /> : ''}
            <span>{score}</span>
          </p>
        </li>
      )}
    </List>
  )
}
