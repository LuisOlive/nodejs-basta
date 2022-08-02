import useBoolean from './useBoolean'

export default function useVisibility() {
  const { value, setValue } = useBoolean(true)

  document.addEventListener('visibilitychange', () => {
    setValue(document.visibilityState === 'visible')
  })

  return value
}
