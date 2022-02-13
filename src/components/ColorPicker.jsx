import { useDispatch } from 'react-redux'
import { colors } from '../data/colors.json'
import { useUser } from '../redux'
import { setColorAction } from '../redux/userDuck'

export default function ColorPicker({}) {
  const { color } = useUser()
  const dispatch = useDispatch()

  return (
    <div className="flex justify-center gap-2 m-0">
      {colors.map((c, i) => (
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
