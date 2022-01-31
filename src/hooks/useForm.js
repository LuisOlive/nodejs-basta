import { useEffect, useState, useMemo } from 'react'

export default function useForm(...inputNames) {
  const inputs = inputNames.map(() => useState(''))

  const setters = useMemo(() => {}, inputs)

  return [values, setters]
}
