import { useState } from 'react'
import { Link } from 'react-router-dom'
import ShortUniqueId from 'short-unique-id'

import Card from '../components/Card'
import Input from '../components/Input'

const uid = new ShortUniqueId({ length: 6 })

export default function App() {
  const room = uid()
  const [roomId, setRoomId] = useState('')

  return (
    <div className="flex justify-center py-4">
      <div className="w-4/5">
        <h1 className="text-5xl mb-2">¡basta!</h1>
        <h2 className="text-2xl">
          ¡El divertido juego de pensar palabras, traído del papel a la web!
        </h2>
        <Card>
          <Link to={'/' + room}>Nuevo juego</Link>
          {' ó '}
          <div className="border-2 border-black inline-block rounded-full">
            <Input setter={setRoomId}>entrar en una sala</Input>
            <Link to={'/' + roomId}>Unirme</Link>
          </div>
        </Card>

        <h3 className="text-xl">Reglas:</h3>

        <ul>
          <li>Seleccionaremos una letra y 5 divertidas categorías</li>
          <li>Cada jugador elige una palabra de cada categoria que empieze con esa letra</li>
          <li>
            Cada jugador que elija una palabra que no hayan elegido los otros gana 100 puntos Si 2 o
            más jugadores eligen la misma palabra, ambos ganan 50 puntos Si la palabra está mal
            escrita o no existe, ganan 0 puntos
          </li>
        </ul>
      </div>
    </div>
  )
}
