import { useState } from 'react'

export default function useBoolean(inicialState = false) {
  const [value, setValue] = useState(inicialState)
  return {
    value,
    toggle: () => setValue(!value),
    makeTrue: () => setValue(true),
    makeFalse: () => setValue(false)
  }
}
