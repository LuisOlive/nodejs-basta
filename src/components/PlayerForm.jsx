import { useEffect } from 'react'
import useInput from '../hooks/useInput'
import usePrevent from '../hooks/usePrevent'

const alphaNumericRegex = /^[a-zA-Z0-9_ñÑáéíóúÁÉÍÓÚ]+\s?[a-zA-Z0-9_ñÑáéíóúÁÉÍÓÚ]+$/

export default function PlayerForm({ onChange, colors }) {
  const [name, setName] = useInput(alphaNumericRegex)
  const [color, setColor] = useInput()

  const emitChange = usePrevent(() => onChange({ name, color }), [color, name])

  useEffect(() => setColor({ target: { value: colors[0] } }), [colors])

  return (
    <form onSubmit={emitChange} className={`bg-${color}-300 w-3/5 rounded-3xl mx-auto p-8`}>
      {/* 
      player name 
      */}
      <input
        onChange={setName}
        placeholder="¡ingresa tu nombre!"
        type="text"
        className={`bg-${color}-50 w-full rounded-full px-4 py-2 mb-4`}
      />
      {/* 
      Color picker 
      */}
      <div className="flex justify-center gap-2">
        {colors.map((c, i) => (
          <label
            key={i}
            className={`bg-${c}-500 ${
              color === c ? 'border-gray-200 border-4' : ''
            } circle h-6 w-6 rounded-full block cursor-pointer`}
          >
            <input onChange={setColor} className="hidden" value={c} name="color" type="radio" />
          </label>
        ))}
      </div>
      {/* 
      button submit
      */}
      <button
        className={`bg-${color}-500 text-white fontbold mt-4 rounded-3xl w-2/5 py-2 mx-auto block`}
        type="submit"
      >
        Unirse
      </button>
    </form>
  )
}
