import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBan, faCrown, faGear } from '@fortawesome/free-solid-svg-icons'

import { useUser, useGame } from '../redux'

import List from './List'

export default function Players({}) {
  const { players } = useGame()
  const { color: myColor, status, id: myId } = useUser()

  return (
    <List items={players} className={`bg-${myColor}-300 h-auto py-8 rounded-r-xl`}>
      {({ name, score, color, admin, id }, i) => (
        <div className={`bg-${color}-500 py-2 px-4 text-white flex justify-between`}>
          <b className="font-bold block w-1/2">{name}</b>

          <p className="text-right w-2/12">
            {!i && (
              <FontAwesomeIcon
                className="ml-2 text-yellow-400"
                icon={faCrown}
                title={`${name} va ganando`}
              />
            )}

            {admin && (
              <FontAwesomeIcon
                className="ml-2 text-grey-100"
                icon={faGear}
                title={`${name} es administrador`}
              />
            )}

            {status === 'ADMIN' && myId !== id && (
              <FontAwesomeIcon
                className="ml-2 text-red-800 cursor-pointer"
                icon={faBan}
                title={`eliminar a ${name} de la sala`}
              />
            )}
          </p>

          <p className={`w-3/12 bg-${color}-600 rounded-full text-right px-2`}>{score}</p>
        </div>
      )}
    </List>
  )
}
