import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBan, faCrown, faGear } from '@fortawesome/free-solid-svg-icons'

import { useUser, useGame } from '../redux'

import List from './List'

export default function Players({}) {
  const { players } = useGame()
  const { color: ownColor, status } = useUser()
  const amIAdmin = status === 'ADMIN'

  return (
    <List items={players} className={`bg-${ownColor}-300 h-auto py-8 rounded-r-xl`}>
      {({ name, score, color, isAdmin }, i) => (
        <li className={`bg-${color}-500 py-2 px-4 text-white flex justify-between`} key={color}>
          <b className="font-bold block w-1/2">{name}</b>

          <p className="text-right w-2/12">
            {!i && (
              <FontAwesomeIcon
                className="ml-2 text-yellow-400"
                icon={faCrown}
                title={`${name} va ganando`}
              />
            )}

            {isAdmin && (
              <FontAwesomeIcon className="ml-2" icon={faGear} title={`${name} es administrador`} />
            )}

            {amIAdmin && color !== ownColor && (
              <FontAwesomeIcon
                className="ml-2 text-red-800 cursor-pointer"
                icon={faBan}
                title="eliminar de la sala"
              />
            )}
          </p>

          <p className={`w-3/12 bg-${color}-600 rounded-full text-right px-2`}>{score}</p>
        </li>
      )}
    </List>
  )
}
