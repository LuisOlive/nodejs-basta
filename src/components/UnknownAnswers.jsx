import {} from 'react'
import { groupBy } from 'lodash'

import { colors } from '../data/colors.json'
import socket from '../socket'

import List from './List'
import { useGame, useUser } from '../redux'

export default function UnknownAnswers({}) {
  const { unknownAnswers, roomId } = useGame()
  const { color } = useUser()

  const evaluate = payload => () => socket.emit('admin:evaluateword', { ...payload, roomId })

  return (
    <div className="w-11/12 lg:w-4/5 lg:h-[75vh] lg:overflow-y-auto">
      <h2 className="text-2xl mb-4">Por favor, ayudanos a revisar estas palabras</h2>

      {Object.entries(groupBy(unknownAnswers, 'category')).map(([category, answers]) =>
        answers ? (
          <div className={`bg-${color}-300 py-4 rounded-xl w-full mb-5`} key={category}>
            <p className="text-lg text-center pl-4">{category}</p>

            <List items={answers}>
              {({ answer }, i) => (
                <div className={`bg-${colors[i % 16]}-400 py-2 px-4 text-white flex flex-col md:flex-row justify-between`}>
                  <p className="font-bold block sm:w-1/2 text-center sm:text-left">{answer}</p>

                  <div className="text-center">
                    <button className="bg-green-500 px-3 rounded-md mr-3" title="aceptar con 100" onClick={evaluate({ category, answer, points: 100 })}>
                      100
                    </button>
                    <button className="bg-lime-500 px-3 rounded-md mr-3" title="aceptar con 50" onClick={evaluate({ category, answer, points: 50 })}>
                      50
                    </button>
                    <button className="bg-red-500 px-3 rounded-md " title="rechazar palabra" onClick={evaluate({ category, answer, points: 0 })}>
                      rechazar
                    </button>
                  </div>
                </div>
              )}
            </List>
          </div>
        ) : (
          ''
        )
      )}
    </div>
  )
}
