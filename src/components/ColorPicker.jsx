import { useDispatch } from 'react-redux'
import { useUser, useGame } from '../redux'
import { setColorAction } from '../redux/user/actions'
import { colors } from '../data/colors.json'

export default function ColorPicker({}) {
  const { availableColors } = useGame()
  const { color } = useUser()
  const dispatch = useDispatch()

  // console.log('componente color picker info recibida availableColors', availableColors)
  // console.log('componente color picker info recibida colors', colors)
  // console.log('componente color picker info recibida mapeable', availableColors ?? colors)

  return (
    <div className="flex justify-center gap-2 m-0">
      <br />
      {(availableColors && availableColors.map ? availableColors : colors).map((c, i) => (
        <label
          key={i}
          className={`bg-${c}-500 ${
            color === c ? 'border-gray-200 border-4' : ''
          } circle h-6 w-6 rounded-full block cursor-pointer`}
        >
          <input
            onChange={() => dispatch(setColorAction(c))}
            value={c}
            className="hidden"
            name="color"
            type="radio"
          />
        </label>
      ))}
    </div>
  )
}
