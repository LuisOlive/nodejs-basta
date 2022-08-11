import { useEffect, useState, useRef, useCallback } from 'react'
import _ from 'lodash'
import socket from '../socket'

// components
import CircleCard from './CircleCard'
import SpinnerCard from './SpinnerCard'
import Input from './Input'

// hooks
import { useGame, useUser } from '../redux'
import useForm from '../hooks/useForm'
import useArray from '../hooks/useArray'
import useVisibility from '../hooks/useVisibility'

const calcSpan = i => (i + 1) % 3 || 'md:col-span-2'

export default function GameForm() {
  // prettier-ignore
  const { roomId, round: { letter, categories } } = useGame()
  const [timeLeft, setTimeLeft] = useState(21)
  const [hasAnswered, setHasAnswered] = useState(false)
  const { color } = useUser()
  const { items: answers, setItem } = useArray(...categories.map(c => [c, ''])) // server requires strcitly string matrixes 5x2

  // save the input name ans answer and use a hof to invoke it directly at template
  const setAnswer = i => e => setItem(i, [e.target.name, e.target.value])
  const submit = () => setHasAnswered(true)

  if (timeLeft === 1 || hasAnswered) {
    socket.emit('player:sendanswers', { answers, roomId })
  }

  useVisibility(isVisible => isVisible || submit(), [submit])

  useEffect(() => {
    socket.on('countdown:count', ({ timeLeft: t }) => setTimeLeft(t))

    return () => socket.off('countdown:count') // react performance warning
  }, [])

  /**
   * IMPORTANT need modify css and not the dom beacuse the auto-killing button explodes react
   */

  return (
    <div className="w-full">
      <SpinnerCard className={hasAnswered || 'hidden'} message="Esperando las respuestas de los demás">
        Respuestas en {timeLeft} segundos.
      </SpinnerCard>

      <CircleCard className={hasAnswered && 'hidden'} circleMessage={timeLeft <= 20 ? timeLeft : letter}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12 lg:text-lg">
          {categories.map((category, i) => (
            <input onBlur={setAnswer(i)} name={category} placeholder={category} className={`rounded-full px-4 py-1 inline-block ${calcSpan(i)}`} key={i} type="text" />
          ))}

          <button onClick={submit} className={`bg-${color}-500 text-white mt-4 rounded-3xl w-full lg:w-3/5 py-2 mx-auto block md:col-span-2`}>
            Enviar respuestas
          </button>
        </div>
      </CircleCard>
    </div>
  )
}
