import { useState } from 'react'

/** @deprecated use useArray() or simply useState([]) instead */
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
