import { useState } from 'react'

export default function useInput(regex = /./) {
  const [value, setValue] = useState('')

  return [
    value,
    e => {
      if (regex.test(e.target.value)) {
        setValue(e.target.value)
      } else {
        setValue('')
      }
    }
  ]
}
