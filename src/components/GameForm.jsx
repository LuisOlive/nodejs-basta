import { useCallback, useEffect, useState } from 'react'

import CircleCard from './CircleCard'
import Button from './Button'
import Input from './Input'
import SpinnerCard from './SpinnerCard'

import socket from '../socket'

import { useGame, useUser } from '../redux'
import useGroup from '../hooks/useGroup'
import usePrevent from '../hooks/usePrevent'

export default function GameForm() {
  const [answers, setters] = useGroup(['', '', '', '', ''])
  const [timeLeft, setTimeLeft] = useState(20)
  const [hasAnswered, setHasAnswered] = useState(false)

  const { color } = useUser()
  const {
    round: { letter, categories },
    roomId
  } = useGame()

  const calcSpan = useCallback(i => ((i + 1) % 3 ? '' : 'col-span-2'))

  const sendAnswers = useCallback(() => {
    socket.emit('player:sendanswers', { answers, roomId, color })
  }, [answers])

  useEffect(() => {
    socket.on('countdown:count', ({ timeLeft }) => {
      setTimeLeft(timeLeft)

      if (!hasAnswered && timeLeft === 0) sendAnswers()
    })
  }, [hasAnswered])

  return (
    <CircleCard circleMessage={timeLeft < 20 ? timeLeft : letter}>
      <form onSubmit={usePrevent()} className="grid grid-cols-2 gap-4 mt-12">
        {categories.map((category, i) => (
          <Input setter={setters[i]} className={`py-1 ${calcSpan(i)}`} key={i}>
            {category}
          </Input>
        ))}

        <Button onClick={sendAnswers} className="col-span-2" type="submit">
          Enviar respuestas
        </Button>
      </form>
    </CircleCard>
  )
}
