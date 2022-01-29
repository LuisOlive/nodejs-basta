import { useCallback } from 'react'

export default function usePrevent(callback = e => {}, deps = []) {
  return useCallback(e => {
    e.preventDefault()
    callback(e)
  }, deps)
}
