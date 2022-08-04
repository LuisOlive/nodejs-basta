import { useCallback, useEffect, useState } from 'react'

import CircleCard from './CircleCard'
import Button from './Button'
import Input from './Input'
import SpinnerCard from './SpinnerCard'

import socket from '../socket'

import { useGame, useUser } from '../redux'
import useGroup from '../hooks/useGroup'
import usePrevent from '../hooks/usePrevent'
import useBoolean from '../hooks/useBoolean'

export default function GameForm() {
  const [answers, setters] = useGroup(['', '', '', '', ''])
  const [timeLeft, setTimeLeft] = useState(20)
  const { value: hasAnswered, makeTrue: confirmHasAnswered } = useBoolean()

  const { id } = useUser()
  const {
    roomId,
    round: { letter, categories }
  } = useGame()

  const calcSpan = useCallback(i => (i + 1) % 3 || 'md:col-span-2', [])

  const sendAnswers = useCallback(() => {
    socket.emit('player:sendanswers', { answers, roomId, authorId: id })
    confirmHasAnswered()
  }, [answers])

  useEffect(() => {
    socket.on('countdown:count', ({ timeLeft: t }) => setTimeLeft(t))
  }, [])

  useEffect(() => {
    if (timeLeft === 1) {
      sendAnswers()
    }
  }, [sendAnswers, timeLeft])

  /**
   * IMPORTANT need modify css and not the dom beacuse the auto-killing button explodes react
   */

  return (
    <div className="w-full">
      <SpinnerCard className={hasAnswered || 'hidden'} message="Esperando las respuestas de los demás">
        Respuestas en {timeLeft} segundos.
      </SpinnerCard>

      <CircleCard className={hasAnswered && 'hidden'} circleMessage={timeLeft < 20 ? timeLeft : letter}>
        <form onSubmit={usePrevent()} className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12">
          {categories.map((category, i) => (
            <Input setter={setters[i]} className={`py-1 ${calcSpan(i)}`} key={i}>
              {category}
            </Input>
          ))}

          <Button onClick={sendAnswers} className="md:col-span-2" type="submit">
            Enviar respuestas
          </Button>
        </form>
      </CircleCard>
    </div>
  )
}
