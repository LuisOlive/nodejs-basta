import { useEffect, useState } from 'react'

/**
 * @returns {'visible' | 'hidden'}
 * @deprecated ultra-deplrecated, never never never use this
 * */
export default function useVisibility() {
  const [value, setValue] = useState('visible')

  useEffect(() => {
    document.addEventListener('visibilitychange', () => {
      setValue(document.visibilityState)
    })
  }, [])

  return value
}
