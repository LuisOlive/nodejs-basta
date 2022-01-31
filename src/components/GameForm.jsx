import { useCallback, useEffect, useMemo } from 'react'
import useForm from '../hooks/useForm'
import useInput from '../hooks/useInput'
import Button from './Button'
import Input from './Input'

export default function GameForm({ color, categories, letter }) {
  const [value0, setValue0] = useInput()
  const [value1, setValue1] = useInput()
  const [value2, setValue2] = useInput()
  const [value3, setValue3] = useInput()
  const [value4, setValue4] = useInput()

  const setters = [setValue0, setValue1, setValue2, setValue3, setValue4]
  const values = useMemo(() => {
    // return {
    //   [categories[0]]: value0,
    //   [categories[1]]: value1,
    //   [categories[2]]: value2,
    //   [categories[3]]: value3,
    //   [categories[4]]: value4
    // }
    return [value0, value1, value2, value3, value4]
  }, [value0, value1, value2, value3, value4])

  const span = useCallback(i => ((i + 1) % 3 ? '' : 'col-span-2'))

  return (
    <div className="">
      <div
        className={`
        bg-${color}-500 
        absolute inset-0 -translate-y-1/2
        h-24 w-24 pt-4
        text-white font-bold text-center text-6xl
        rounded-full mx-auto
        `}
      >
        {letter}
      </div>

      <form className="grid grid-cols-2 gap-4 mt-12">
        {categories.map((category, i) => (
          <Input onChange={setters[i]} className={span(i)} color={color} key={i}>
            {category}
          </Input>
        ))}

        <Button color={color} className="col-span-2">
          Enviar
        </Button>
      </form>

      {values}
    </div>
  )
}
