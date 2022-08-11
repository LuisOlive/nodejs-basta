import { useEffect } from 'react'

/**
 * watch document visibility state,
 * on change, it calls calback cb with a param true if document i visible and false else
 *
 * @param {(isVisible: boolean) => void} cb the callback to call every change
 * @param {any[]} deps dependencies to useEffect
 */
export default function useVisibility(cb, deps) {
  useEffect(() => {
    const main = () => cb(document.visibilityState === 'visible')

    document.addEventListener('visibilitychange', main)

    return () => document.removeEventListener('visibilitychange', main)
  }, deps)
}
