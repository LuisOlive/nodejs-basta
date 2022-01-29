import { useState } from 'react'

export default function useCounter(inicialValue = 0, step = 1) {
  const [value, setValue] = useState(inicialValue)

  return {
    value,
    increment: () => setValue(value + step),
    decrement: () => setValue(value - step),
    reset: () => setValue(inicialValue)
  }
}
