import { useState } from 'react'

export default function useGroup(inicialValues) {
  const values = []
  const setters = []

  inicialValues.forEach(inicialValue => {
    const [value, setValue] = useState(inicialValue)

    values.push(value)
    setters.push(setValue)
  })

  return [values, setters]
}
