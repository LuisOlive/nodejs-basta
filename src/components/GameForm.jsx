import { useCallback, useEffect, useState } from 'react'

import CircleCard from './CircleCard'
import Button from './Button'
import Input from './Input'

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

  const calcSpan = useCallback(i => (i + 1) % 3 || 'col-span-2', [])

  const sendAnswers = useCallback(() => {
    confirmHasAnswered()
    socket.emit('player:sendanswers', { answers, roomId, authorId: id })
  }, [answers, id])

  useEffect(() => socket.on('countdown:count', ({ timeLeft: t }) => setTimeLeft(t)), [])

  useEffect(() => {
    if (!hasAnswered && timeLeft === 1) sendAnswers()
  }, [hasAnswered, timeLeft, sendAnswers])

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
