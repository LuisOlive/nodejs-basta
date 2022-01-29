import { Link } from 'react-router-dom'
import ShortUniqueId from 'short-unique-id'
import useInput from './hooks/useInput'

const uid = new ShortUniqueId({ length: 6 })

export default function App() {
  const room = uid()
  const [roomId, setRoomId] = useInput(/^[a-zA-Z0-9]{6}$/)

  return (
    <div className="">
      <h1>¡basta!</h1>
      <p>Este juego se llama basta, ¡aquí van las reglas!</p>
      <ul>
        <li>Seleccionaremos una letra y 5 divertidas categorías</li>
        <li>Cada jugador elige una palabra de cada categoria que empieze con esa letra</li>
        <li>
          Cada jugador que elija una palabra que no hayan elegido los otros gana 100 puntos Si 2 o
          más jugadores eligen la misma palabra, ambos ganan 50 puntos Si la palabra está mal
          escrita o no existe, ganan 0 puntos
        </li>
      </ul>
      <Link to={'/' + room}>Nuevo juego</Link>
      {' ó '}
      <input onChange={setRoomId} placeholder="entrar en una sala" type="text" />
      <Link to={'/' + roomId}>Unirme</Link>
    </div>
  )
}
