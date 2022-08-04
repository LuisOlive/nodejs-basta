import { groupBy, sortBy, find } from 'lodash'

import List from './List'
import StartCard from './StartCard'
import { useGame, useUser } from '../redux'

export default function Results({}) {
  const { results, players } = useGame()
  const { color } = useUser()

  return (
    <div className="w-11/12 lg:w-4/5 my-8 lg:h-[75vh] lg:overflow-y-auto">
      {Object.entries(groupBy(results, 'category')).map(([category, answers]) =>
        answers ? (
          <div className={`bg-${color}-300 py-4 rounded-xl w-full mb-5`} key={category}>
            <p className="text-lg text-center pl-4">{category}</p>

            <List items={sortBy(answers, 'points').reverse()}>
              {({ answer, points, authorId: id }) => {
                const { name, color } = find(players, { id })

                return (
                  <div className={`bg-${color}-500 py-2 px-4 text-white flex justify-between`}>
                    <p className="w-1/4">{name}</p>
                    <p className="font-bold w-1/2">{answer || '---'}</p>
                    <p className={`w-16 bg-${color}-600 rounded-full text-center px-2`}>{points}</p>
                  </div>
                )
              }}
            </List>
          </div>
        ) : (
          ''
        )
      )}

      <StartCard hideMessage>Continuar</StartCard>
    </div>
  )
}
