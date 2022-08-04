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
    <main className="flex flex-col justify-center items-center py-4">
      <div className="w-4/5 h-[75vh] flex flex-col justify-center">
        <h1 className="text-5xl mb-11 md:mb-6">¡basta!</h1>

        <h2 className="text-2xl text-gray-500 mb-8">¡El divertido juego de pensar palabras, traído del papel a la web!</h2>

        {/* buttons */}
        <div className="flex flex-col md:flex-row gap-2 items-center">
          <Link to={'/' + room} className="bg-blue-500 p-3 text-white rounded-full text-center w-5/6 md:w-auto md:px-8">
            Nuevo juego
          </Link>

          <p className="font-medium text-xl mx-2">ó</p>

          <div className="inline-block rounded-full py-0 relative w-5/6 md:w-auto">
            <Input setter={setRoomId} inputClassName="py-0 pr-20 border-2 border-emerald-500">
              entrar en una sala
            </Input>
            <Link
              to={'/' + roomId.split('/').reverse()[0]}
              className="bg-emerald-500 text-white py-2 px-8 rounded-full 
              absolute top-3.5 border-3 border-emerald-500 right-0"
            >
              Unirme
            </Link>
          </div>
        </div>
        {/* end buttons */}
      </div>

      <div className="w-4/5 text-gray-700">
        <h3 className="text-3xl mb-3">Reglas:</h3>

        <ul>
          <li>Seleccionaremos una letra y 5 divertidas categorías</li>
          <li>Cada jugador debe pensar una palabra de cada categoria que empieze con esa letra</li>
          <li>
            Cada jugador que elija una palabra que no hayan elegido los otros gana 100 puntos. Si 2 o más jugadores eligen la misma palabra, ambos ganan 50 puntos. Si la palabra está mal escrita o no
            existe, no ganas puntos
          </li>
        </ul>
      </div>
    </main>
  )
}
